namespace NuclearSystemChase.Api.Models;

public class DirectoryNode
{
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public NodeType Type { get; set; }
    public long? SizeBytes { get; set; }
    public int? ChildCount { get; set; }
    public DateTime LastModified { get; set; }
    public DateTime Created { get; set; }
    public string? DriveId { get; set; }
    public string? ItemId { get; set; }
    public string? WebUrl { get; set; }
    public string? SiteLabel { get; set; }
    public List<DirectoryNode> Children { get; set; } = new();
}

public enum NodeType
{
    Directory,
    File
}
