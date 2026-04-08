using System.Text.Json;
using NuclearSystemChase.Api.Models;

namespace NuclearSystemChase.Api.Services;

/// <summary>
/// Polls SharePoint via Microsoft Graph API, builds in-memory directory trees,
/// extracts projects, and determines their status based on folder structure.
/// Replaces the local filesystem DirectoryWatcherService.
/// </summary>
public class SharePointService : BackgroundService
{
    private readonly GraphAuthService _auth;
    private readonly SharePointConfig _spConfig;
    private readonly ILogger<SharePointService> _logger;
    private readonly Lock _lock = new();

    private readonly Dictionary<string, DirectoryNode> _trees = new();
    private List<ProjectInfo> _projects = new();
    private DateTime _lastScan = DateTime.MinValue;
    private bool _scanning;

    public SharePointService(
        GraphAuthService auth,
        IConfiguration config,
        ILogger<SharePointService> logger)
    {
        _auth = auth;
        _spConfig = config.GetSection("SharePoint").Get<SharePointConfig>() ?? new SharePointConfig();
        _logger = logger;
    }

    public bool IsConfigured => _auth.IsConfigured && _spConfig.Sites.Count > 0;
    public DateTime LastScanTime { get { lock (_lock) return _lastScan; } }
    public bool IsScanning { get { lock (_lock) return _scanning; } }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait a moment for the app to fully start
        await Task.Delay(2000, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            if (IsConfigured)
            {
                await ScanAllSitesAsync(stoppingToken);
            }
            else
            {
                _logger.LogWarning("SharePoint not configured. Set AzureAd and SharePoint config in appsettings.json");
            }

            await Task.Delay(TimeSpan.FromSeconds(_spConfig.PollIntervalSeconds), stoppingToken);
        }
    }

    public async Task ForceScanAsync()
    {
        await ScanAllSitesAsync(CancellationToken.None);
    }

    public DirectoryNode? GetTree(string? siteLabel = null)
    {
        lock (_lock)
        {
            if (siteLabel != null && _trees.TryGetValue(siteLabel, out var tree))
                return tree;

            // Return combined tree if no specific site requested
            if (_trees.Count == 0) return null;

            var root = new DirectoryNode
            {
                Name = "Chase Group",
                Path = "/",
                RelativePath = ".",
                Type = NodeType.Directory,
                LastModified = _lastScan,
                Children = _trees.Values.ToList()
            };
            return root;
        }
    }

    public List<ProjectInfo> GetProjects()
    {
        lock (_lock) return _projects.ToList();
    }

    // ─── Core Scan Logic ────────────────────────────────────────────

    private async Task ScanAllSitesAsync(CancellationToken ct)
    {
        lock (_lock) _scanning = true;

        try
        {
            _logger.LogInformation("Starting SharePoint scan...");
            using var client = await _auth.GetAuthenticatedClientAsync();

            var trees = new Dictionary<string, DirectoryNode>();
            var allProjects = new List<ProjectInfo>();

            foreach (var site in _spConfig.Sites)
            {
                if (ct.IsCancellationRequested) break;

                try
                {
                    _logger.LogInformation("Scanning site: {Label}", site.Label);
                    var tree = await ScanDriveAsync(client, site.DriveId, site.Label, ct);
                    trees[site.Label] = tree;

                    if (site.Primary)
                    {
                        var projects = ExtractProjects(tree, site);
                        allProjects.AddRange(projects);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error scanning site {Label}", site.Label);
                }
            }

            // Cross-reference Operations Team photos with projects
            if (trees.TryGetValue("CGC Operations Team", out var opsTree))
            {
                CrossReferenceOperationsPhotos(allProjects, opsTree);
            }

            lock (_lock)
            {
                _trees.Clear();
                foreach (var kv in trees) _trees[kv.Key] = kv.Value;
                _projects = allProjects;
                _lastScan = DateTime.UtcNow;
            }

            _logger.LogInformation("SharePoint scan complete. {Count} projects found.", allProjects.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SharePoint scan failed");
        }
        finally
        {
            lock (_lock) _scanning = false;
        }
    }

    private async Task<DirectoryNode> ScanDriveAsync(
        HttpClient client, string driveId, string siteLabel, CancellationToken ct, string? parentPath = null, int depth = 0)
    {
        var url = parentPath == null
            ? $"drives/{driveId}/root/children?$select=id,name,folder,file,size,lastModifiedDateTime,createdDateTime,webUrl&$top=200"
            : $"drives/{driveId}/root:/{Uri.EscapeDataString(parentPath)}:/children?$select=id,name,folder,file,size,lastModifiedDateTime,createdDateTime,webUrl&$top=200";

        var items = await FetchGraphListAsync(client, url, ct);

        var rootNode = new DirectoryNode
        {
            Name = parentPath?.Split('/').LastOrDefault() ?? siteLabel,
            Path = parentPath ?? "/",
            RelativePath = parentPath ?? ".",
            Type = NodeType.Directory,
            SiteLabel = siteLabel,
            DriveId = driveId,
            LastModified = DateTime.MinValue
        };

        foreach (var item in items)
        {
            var name = item.GetProperty("name").GetString() ?? "";
            if (name.StartsWith('.') || name.StartsWith('~')) continue;

            var isFolder = item.TryGetProperty("folder", out var folderProp);
            var lastMod = item.TryGetProperty("lastModifiedDateTime", out var lm)
                ? lm.GetDateTime() : DateTime.MinValue;
            var created = item.TryGetProperty("createdDateTime", out var cr)
                ? cr.GetDateTime() : DateTime.MinValue;
            var size = item.TryGetProperty("size", out var sz)
                ? sz.GetInt64() : 0;
            var webUrl = item.TryGetProperty("webUrl", out var wu)
                ? wu.GetString() : null;
            var itemId = item.TryGetProperty("id", out var iid)
                ? iid.GetString() : null;

            if (lastMod > rootNode.LastModified)
                rootNode.LastModified = lastMod;

            var childPath = parentPath == null ? name : $"{parentPath}/{name}";

            if (isFolder)
            {
                var childCount = folderProp.TryGetProperty("childCount", out var cc) ? cc.GetInt32() : 0;

                var node = new DirectoryNode
                {
                    Name = name,
                    Path = childPath,
                    RelativePath = childPath,
                    Type = NodeType.Directory,
                    SizeBytes = size,
                    ChildCount = childCount,
                    LastModified = lastMod,
                    Created = created,
                    DriveId = driveId,
                    ItemId = itemId,
                    WebUrl = webUrl,
                    SiteLabel = siteLabel
                };

                // Recurse if within depth limit and has children
                if (depth < _spConfig.MaxDepth && childCount > 0)
                {
                    try
                    {
                        var childNode = await ScanDriveAsync(client, driveId, siteLabel, ct, childPath, depth + 1);
                        node.Children = childNode.Children;
                        // Update last modified from children
                        if (childNode.LastModified > node.LastModified)
                            node.LastModified = childNode.LastModified;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Error scanning subfolder {Path}", childPath);
                    }
                }

                rootNode.Children.Add(node);
            }
            else
            {
                rootNode.Children.Add(new DirectoryNode
                {
                    Name = name,
                    Path = childPath,
                    RelativePath = childPath,
                    Type = NodeType.File,
                    SizeBytes = size,
                    LastModified = lastMod,
                    Created = created,
                    DriveId = driveId,
                    ItemId = itemId,
                    WebUrl = webUrl,
                    SiteLabel = siteLabel
                });
            }
        }

        return rootNode;
    }

    private async Task<List<JsonElement>> FetchGraphListAsync(HttpClient client, string url, CancellationToken ct)
    {
        var allItems = new List<JsonElement>();
        var currentUrl = url;

        while (!string.IsNullOrEmpty(currentUrl))
        {
            var response = await client.GetAsync(currentUrl, ct);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Graph API error {Status}: {Body}", response.StatusCode, body.Length > 200 ? body[..200] : body);
                break;
            }

            var json = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty("value", out var valueArray))
            {
                foreach (var item in valueArray.EnumerateArray())
                {
                    allItems.Add(item.Clone());
                }
            }

            // Handle pagination
            currentUrl = doc.RootElement.TryGetProperty("@odata.nextLink", out var nextLink)
                ? nextLink.GetString() : null;
        }

        return allItems;
    }

    // ─── Project Extraction ─────────────────────────────────────────

    private List<ProjectInfo> ExtractProjects(DirectoryNode siteTree, SharePointSiteConfig site)
    {
        var projects = new List<ProjectInfo>();

        // Find "Chase Group Files" root
        var cgFiles = siteTree.Children.FirstOrDefault(c =>
            c.Name.Equals("Chase Group Files", StringComparison.OrdinalIgnoreCase));
        if (cgFiles == null) return projects;

        // 1. PRECONSTRUCTION / 1. BUSINESS DEVELOPMENT → Leads
        var precon = cgFiles.Children.FirstOrDefault(c => c.Name.Contains("PRECONSTRUCTION"));
        if (precon != null)
        {
            var bizDev = precon.Children.FirstOrDefault(c => c.Name.Contains("BUSINESS DEVELOPMENT"));
            if (bizDev != null)
            {
                foreach (var folder in bizDev.Children.Where(c => c.Type == NodeType.Directory))
                {
                    var project = BuildProjectFromFolder(folder, LifecyclePhase.BusinessDevelopment, site);
                    project.Status = DetermineLeadStatus(folder);
                    projects.Add(project);
                }
            }

            // 2. ESTIMATING → Estimating projects
            var estimating = precon.Children.FirstOrDefault(c => c.Name.Contains("ESTIMATING"));
            if (estimating != null)
            {
                foreach (var folder in estimating.Children.Where(c =>
                    c.Type == NodeType.Directory &&
                    !c.Name.Contains("TEMPLATE", StringComparison.OrdinalIgnoreCase) &&
                    !c.Name.Equals("Bid Management Sheet", StringComparison.OrdinalIgnoreCase) &&
                    !c.Name.Equals("Subs & Vendors", StringComparison.OrdinalIgnoreCase)))
                {
                    var project = BuildProjectFromFolder(folder, LifecyclePhase.Estimating, site);
                    project.Status = ProjectStatus.Estimating;
                    projects.Add(project);
                }
            }
        }

        // 2. PROJECTS → Active/Complete projects
        var projectsFolder = cgFiles.Children.FirstOrDefault(c => c.Name.Contains("PROJECTS"));
        if (projectsFolder != null)
        {
            foreach (var folder in projectsFolder.Children.Where(c =>
                c.Type == NodeType.Directory &&
                !c.Name.Contains("TEMPLATE", StringComparison.OrdinalIgnoreCase)))
            {
                var project = BuildProjectFromFolder(folder, LifecyclePhase.Project, site);
                project.Status = DetermineProjectStatus(folder);
                projects.Add(project);
            }
        }

        return projects;
    }

    private ProjectInfo BuildProjectFromFolder(DirectoryNode folder, LifecyclePhase phase, SharePointSiteConfig site)
    {
        var (number, displayName) = ParseProjectNumber(folder.Name);

        var project = new ProjectInfo
        {
            Id = GenerateId(folder.Name),
            Name = folder.Name,
            Number = number,
            DisplayName = displayName,
            Path = folder.Path,
            RelativePath = folder.RelativePath,
            Phase = phase,
            LastModified = folder.LastModified,
            Created = folder.Created,
            SiteLabel = site.Label,
            DriveId = site.DriveId,
            WebUrl = folder.WebUrl
        };

        // Count files and folders recursively
        CountContents(folder, out var fileCount, out var folderCount, out var totalSize);
        project.FileCount = fileCount;
        project.SubfolderCount = folderCount;
        project.TotalSizeBytes = totalSize;

        // Map subfolders
        foreach (var child in folder.Children.Where(c => c.Type == NodeType.Directory))
        {
            CountContents(child, out var subFiles, out var subFolders, out var subSize);
            var info = new SubfolderInfo
            {
                Name = child.Name,
                ItemCount = subFiles + subFolders,
                SizeBytes = subSize,
                LastModified = child.LastModified
            };

            // For Subcontractors, map CSI divisions
            if (child.Name.Contains("Subcontractor", StringComparison.OrdinalIgnoreCase))
            {
                info.Children = new Dictionary<string, SubfolderInfo>();
                foreach (var div in child.Children.Where(c => c.Type == NodeType.Directory))
                {
                    CountContents(div, out var divFiles, out _, out var divSize);
                    info.Children[div.Name] = new SubfolderInfo
                    {
                        Name = div.Name,
                        ItemCount = divFiles,
                        SizeBytes = divSize,
                        LastModified = div.LastModified
                    };
                }
            }

            project.Subfolders[child.Name] = info;
        }

        // Collect recent files
        var recentFiles = new List<RecentFile>();
        CollectRecentFiles(folder, recentFiles);
        project.RecentFiles = recentFiles
            .OrderByDescending(f => f.LastModified)
            .Take(20)
            .ToList();

        return project;
    }

    // ─── Status Logic ───────────────────────────────────────────────

    private ProjectStatus DetermineProjectStatus(DirectoryNode folder)
    {
        var subs = folder.Children.ToDictionary(
            c => c.Name.ToLowerInvariant(),
            c => c,
            StringComparer.OrdinalIgnoreCase);

        bool HasContent(string partialName) =>
            subs.Any(kv => kv.Key.Contains(partialName, StringComparison.OrdinalIgnoreCase) &&
                kv.Value.Children.Count > 0);

        bool HasFiles(string partialName) =>
            subs.Any(kv => kv.Key.Contains(partialName, StringComparison.OrdinalIgnoreCase) &&
                kv.Value.Children.Any(c => c.Type == NodeType.File));

        // Check for warranty folder → Complete
        if (subs.Keys.Any(k => k.Contains("warranty")))
            return ProjectStatus.Complete;

        // Check for punch list files
        var hasPunchList = false;
        CollectAllFileNames(folder, name =>
        {
            if (name.Contains("punch", StringComparison.OrdinalIgnoreCase))
                hasPunchList = true;
        });
        if (hasPunchList)
            return ProjectStatus.PunchList;

        // Active: has job cost reports AND progress reports AND recent schedule
        var hasJobCosts = HasContent("job cost");
        var hasProgressReports = HasContent("progress report") || HasContent("progress reports");
        var hasSchedules = HasContent("schedule");
        var hasPermits = HasContent("permit");

        if (hasJobCosts && hasProgressReports && hasSchedules)
            return ProjectStatus.Active;

        // Pre-construction: has permits but not much else
        if (hasPermits && !hasJobCosts && !hasProgressReports)
            return ProjectStatus.Active; // Still "Active" but early-stage

        // Check recency
        var daysSinceModified = (DateTime.UtcNow - folder.LastModified).TotalDays;

        if (daysSinceModified > 90 && hasJobCosts)
            return ProjectStatus.Complete;

        if (daysSinceModified > 90)
            return ProjectStatus.OnHold;

        // Default for projects with some activity
        if (folder.Children.Any(c => c.Children.Count > 0))
            return ProjectStatus.Active;

        return ProjectStatus.Unknown;
    }

    private ProjectStatus DetermineLeadStatus(DirectoryNode folder)
    {
        var name = folder.Name;

        if (name.Contains("Cancel", StringComparison.OrdinalIgnoreCase))
            return ProjectStatus.OnHold;

        if (folder.Children.Count == 0 ||
            (folder.ChildCount.HasValue && folder.ChildCount.Value == 0))
            return ProjectStatus.Unknown;

        return ProjectStatus.Lead;
    }

    private static (string? number, string displayName) ParseProjectNumber(string folderName)
    {
        // Match pattern like "24-088 FPK Johnston" or "25-XXX Shamsie Remodel"
        var match = System.Text.RegularExpressions.Regex.Match(folderName, @"^(\d{2}-\d{3}|\d{2}-[A-Z]{3})\s+(.+)$");
        if (match.Success)
            return (match.Groups[1].Value, match.Groups[2].Value);

        return (null, folderName);
    }

    private static string GenerateId(string name)
    {
        // Create a stable, URL-safe ID from the folder name
        return name
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("(", "")
            .Replace(")", "")
            .Replace(".", "")
            .Replace(",", "")
            .Replace("&", "and")
            .Replace("/", "-");
    }

    private void CrossReferenceOperationsPhotos(List<ProjectInfo> projects, DirectoryNode opsTree)
    {
        foreach (var opsFolder in opsTree.Children.Where(c => c.Type == NodeType.Directory))
        {
            // Fuzzy match operations folder name to project names
            var opsName = opsFolder.Name.ToLowerInvariant();
            var match = projects.FirstOrDefault(p =>
            {
                var pName = (p.DisplayName ?? p.Name).ToLowerInvariant();
                return pName.Contains(opsName) || opsName.Contains(pName) ||
                       LevenshteinClose(opsName, pName);
            });

            if (match != null)
            {
                CountContents(opsFolder, out var photoCount, out _, out var photoSize);
                match.Subfolders["Operations Photos"] = new SubfolderInfo
                {
                    Name = "Operations Photos",
                    ItemCount = photoCount,
                    SizeBytes = photoSize,
                    LastModified = opsFolder.LastModified
                };
            }
        }
    }

    // ─── Helpers ────────────────────────────────────────────────────

    private static void CountContents(DirectoryNode node, out int files, out int folders, out long size)
    {
        files = 0; folders = 0; size = 0;
        CountContentsRecursive(node, ref files, ref folders, ref size);
    }

    private static void CountContentsRecursive(DirectoryNode node, ref int files, ref int folders, ref long size)
    {
        foreach (var child in node.Children)
        {
            if (child.Type == NodeType.File)
            {
                files++;
                size += child.SizeBytes ?? 0;
            }
            else
            {
                folders++;
                CountContentsRecursive(child, ref files, ref folders, ref size);
            }
        }
    }

    private static void CollectRecentFiles(DirectoryNode node, List<RecentFile> files)
    {
        foreach (var child in node.Children)
        {
            if (child.Type == NodeType.File)
            {
                files.Add(new RecentFile
                {
                    Name = child.Name,
                    Path = child.Path,
                    SizeBytes = child.SizeBytes ?? 0,
                    LastModified = child.LastModified
                });
            }
            else
            {
                CollectRecentFiles(child, files);
            }
        }
    }

    private static void CollectAllFileNames(DirectoryNode node, Action<string> callback)
    {
        foreach (var child in node.Children)
        {
            if (child.Type == NodeType.File)
                callback(child.Name);
            else
                CollectAllFileNames(child, callback);
        }
    }

    private static bool LevenshteinClose(string a, string b)
    {
        // Simple substring containment check for fuzzy matching
        var words = a.Split(' ', '-', '_');
        var matchCount = words.Count(w => w.Length > 3 && b.Contains(w));
        return matchCount >= 1 && words.Length > 0;
    }
}
