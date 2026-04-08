using System.Text.Json.Serialization;

namespace NuclearSystemChase.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectStatus
{
    Lead,
    Estimating,
    Active,
    PunchList,
    Complete,
    OnHold,
    Unknown
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LifecyclePhase
{
    BusinessDevelopment,
    Estimating,
    Project,
    Closeout
}

public class ProjectInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Number { get; set; }
    public string? DisplayName { get; set; }
    public string Path { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public LifecyclePhase Phase { get; set; }
    public ProjectStatus Status { get; set; }
    public DateTime LastModified { get; set; }
    public DateTime Created { get; set; }
    public int FileCount { get; set; }
    public int SubfolderCount { get; set; }
    public long TotalSizeBytes { get; set; }
    public string? SiteLabel { get; set; }
    public string? DriveId { get; set; }
    public string? WebUrl { get; set; }

    /// <summary>
    /// Tracks which standard subfolders have content.
    /// Key = folder name (e.g., "Permits"), Value = item count inside.
    /// </summary>
    public Dictionary<string, SubfolderInfo> Subfolders { get; set; } = new();

    /// <summary>
    /// Recently modified files inside this project (top 20).
    /// </summary>
    public List<RecentFile> RecentFiles { get; set; } = new();
}

public class SubfolderInfo
{
    public string Name { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public long SizeBytes { get; set; }
    public DateTime LastModified { get; set; }
    public Dictionary<string, SubfolderInfo>? Children { get; set; }
}

public class RecentFile
{
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public DateTime LastModified { get; set; }
}
