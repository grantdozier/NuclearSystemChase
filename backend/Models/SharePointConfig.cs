namespace NuclearSystemChase.Api.Models;

public class AzureAdConfig
{
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
}

public class SharePointConfig
{
    public List<SharePointSiteConfig> Sites { get; set; } = new();
    public int PollIntervalSeconds { get; set; } = 60;
    public int MaxDepth { get; set; } = 5;
}

public class SharePointSiteConfig
{
    public string Label { get; set; } = string.Empty;
    public string SiteId { get; set; } = string.Empty;
    public string DriveId { get; set; } = string.Empty;
    public bool Primary { get; set; }
}
