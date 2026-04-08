using System.ComponentModel;
using System.Text.Json;
using ModelContextProtocol.Server;
using NuclearSystemChase.Api.Models;
using NuclearSystemChase.Api.Services;

namespace NuclearSystemChase.Api.Mcp;

[McpServerToolType]
public class ProjectTools
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        WriteIndented = true,
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
    };

    [McpServerTool(Name = "list_projects"),
     Description("List all construction projects with their status, phase, and key metrics. " +
                 "Returns project name, number, status (Lead/Estimating/Active/PunchList/Complete/OnHold), " +
                 "phase, last modified date, file count, and SharePoint link.")]
    public static string ListProjects(SharePointService sharePoint)
    {
        var projects = sharePoint.GetProjects();
        if (projects.Count == 0)
            return "No projects found. The SharePoint scan may still be in progress — try again in a moment.";

        var summary = projects.Select(p => new
        {
            p.Id,
            p.Name,
            p.Number,
            p.DisplayName,
            Status = p.Status.ToString(),
            Phase = p.Phase.ToString(),
            p.LastModified,
            p.FileCount,
            p.SubfolderCount,
            p.WebUrl
        });

        return JsonSerializer.Serialize(summary, JsonOpts);
    }

    [McpServerTool(Name = "get_project"),
     Description("Get detailed information about a specific project by name or ID. " +
                 "Returns subfolders, recent files, size, and SharePoint link.")]
    public static string GetProject(
        SharePointService sharePoint,
        [Description("Project name, display name, number (e.g. '24-088'), or ID to search for")]
        string query)
    {
        var projects = sharePoint.GetProjects();
        var project = FindProject(projects, query);

        if (project == null)
            return $"No project found matching '{query}'. Use list_projects to see available projects.";

        return JsonSerializer.Serialize(project, JsonOpts);
    }

    [McpServerTool(Name = "search_projects"),
     Description("Search projects by name, number, or keyword. Supports partial/fuzzy matching.")]
    public static string SearchProjects(
        SharePointService sharePoint,
        [Description("Search term — matches against project name, number, and display name")]
        string query)
    {
        var projects = sharePoint.GetProjects();
        var q = query.ToLowerInvariant();

        var matches = projects.Where(p =>
            (p.Name?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false) ||
            (p.DisplayName?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false) ||
            (p.Number?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false) ||
            (p.Id?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false))
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Number,
                p.DisplayName,
                Status = p.Status.ToString(),
                Phase = p.Phase.ToString(),
                p.LastModified,
                p.WebUrl
            })
            .ToList();

        if (matches.Count == 0)
            return $"No projects matching '{query}'.";

        return JsonSerializer.Serialize(matches, JsonOpts);
    }

    [McpServerTool(Name = "get_projects_by_status"),
     Description("Get all projects with a specific status. " +
                 "Valid statuses: Lead, Estimating, Active, PunchList, Complete, OnHold, Unknown")]
    public static string GetProjectsByStatus(
        SharePointService sharePoint,
        [Description("Status to filter by: Lead, Estimating, Active, PunchList, Complete, OnHold, Unknown")]
        string status)
    {
        if (!Enum.TryParse<ProjectStatus>(status, ignoreCase: true, out var parsed))
            return $"Invalid status '{status}'. Valid values: Lead, Estimating, Active, PunchList, Complete, OnHold, Unknown";

        var projects = sharePoint.GetProjects()
            .Where(p => p.Status == parsed)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Number,
                p.DisplayName,
                Status = p.Status.ToString(),
                Phase = p.Phase.ToString(),
                p.LastModified,
                p.FileCount,
                p.WebUrl
            })
            .ToList();

        return $"{projects.Count} project(s) with status '{status}':\n" +
               JsonSerializer.Serialize(projects, JsonOpts);
    }

    [McpServerTool(Name = "get_stale_projects"),
     Description("Find projects that haven't been modified recently. " +
                 "Useful for identifying projects that may need follow-up or status updates.")]
    public static string GetStaleProjects(
        SharePointService sharePoint,
        [Description("Number of days since last modification to consider 'stale' (default: 30)")]
        int days = 30)
    {
        var cutoff = DateTime.UtcNow.AddDays(-days);
        var stale = sharePoint.GetProjects()
            .Where(p => p.LastModified < cutoff && p.Status != ProjectStatus.Complete && p.Status != ProjectStatus.OnHold)
            .OrderBy(p => p.LastModified)
            .Select(p => new
            {
                p.Name,
                p.Number,
                p.DisplayName,
                Status = p.Status.ToString(),
                Phase = p.Phase.ToString(),
                p.LastModified,
                DaysSinceActivity = (int)(DateTime.UtcNow - p.LastModified).TotalDays,
                p.WebUrl
            })
            .ToList();

        if (stale.Count == 0)
            return $"No stale projects (all active projects modified within the last {days} days).";

        return $"{stale.Count} project(s) with no activity in {days}+ days:\n" +
               JsonSerializer.Serialize(stale, JsonOpts);
    }

    [McpServerTool(Name = "get_project_summary"),
     Description("Get a high-level summary of all projects — counts by status and phase, " +
                 "recent activity, and overall health metrics.")]
    public static string GetProjectSummary(SharePointService sharePoint)
    {
        var projects = sharePoint.GetProjects();
        if (projects.Count == 0)
            return "No projects loaded yet. The SharePoint scan may still be in progress.";

        var byStatus = projects.GroupBy(p => p.Status)
            .ToDictionary(g => g.Key.ToString(), g => g.Count());
        var byPhase = projects.GroupBy(p => p.Phase)
            .ToDictionary(g => g.Key.ToString(), g => g.Count());

        var recentlyActive = projects
            .Where(p => p.LastModified > DateTime.UtcNow.AddDays(-7))
            .Count();

        var summary = new
        {
            TotalProjects = projects.Count,
            ByStatus = byStatus,
            ByPhase = byPhase,
            ActiveInLast7Days = recentlyActive,
            LastScanTime = sharePoint.LastScanTime,
            MostRecentlyModified = projects
                .OrderByDescending(p => p.LastModified)
                .Take(5)
                .Select(p => new { p.Name, p.Number, p.LastModified, Status = p.Status.ToString() })
        };

        return JsonSerializer.Serialize(summary, JsonOpts);
    }

    [McpServerTool(Name = "browse_directory"),
     Description("Browse the SharePoint directory tree. Optionally specify a site label to see a specific site's files.")]
    public static string BrowseDirectory(
        SharePointService sharePoint,
        [Description("Site label to browse (e.g. 'Chase Group Construction'). Leave empty for all sites.")]
        string? siteLabel = null)
    {
        var tree = sharePoint.GetTree(siteLabel);
        if (tree == null)
            return "No directory data available. The SharePoint scan may still be in progress.";

        // Return a summarized view (just names and types, not full detail) to keep response size manageable
        var summary = SummarizeTree(tree, maxDepth: 3);
        return JsonSerializer.Serialize(summary, JsonOpts);
    }

    // ─── Helpers ────────────────────────────────────────────────────

    private static ProjectInfo? FindProject(List<ProjectInfo> projects, string query)
    {
        var q = query.ToLowerInvariant().Trim();

        // Exact match on ID
        var match = projects.FirstOrDefault(p => p.Id.Equals(q, StringComparison.OrdinalIgnoreCase));
        if (match != null) return match;

        // Exact match on number
        match = projects.FirstOrDefault(p => p.Number?.Equals(q, StringComparison.OrdinalIgnoreCase) == true);
        if (match != null) return match;

        // Contains match on name/display name
        match = projects.FirstOrDefault(p =>
            (p.Name?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false) ||
            (p.DisplayName?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false));
        return match;
    }

    private static object SummarizeTree(DirectoryNode node, int maxDepth, int depth = 0)
    {
        if (depth >= maxDepth && node.Type == NodeType.Directory)
        {
            return new
            {
                node.Name,
                Type = node.Type.ToString(),
                ChildCount = node.Children.Count,
                Truncated = true
            };
        }

        return new
        {
            node.Name,
            Type = node.Type.ToString(),
            Children = node.Type == NodeType.Directory
                ? node.Children.Select(c => SummarizeTree(c, maxDepth, depth + 1)).ToList()
                : null
        };
    }
}
