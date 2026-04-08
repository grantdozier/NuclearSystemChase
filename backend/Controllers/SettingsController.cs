using Microsoft.AspNetCore.Mvc;
using NuclearSystemChase.Api.Services;

namespace NuclearSystemChase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly SharePointService _sp;

    public SettingsController(IConfiguration config, SharePointService sp)
    {
        _config = config;
        _sp = sp;
    }

    [HttpGet]
    public IActionResult GetSettings()
    {
        return Ok(new
        {
            tenantId = _config["AzureAd:TenantId"],
            clientId = _config["AzureAd:ClientId"],
            hasSecret = !string.IsNullOrEmpty(_config["AzureAd:ClientSecret"]),
            sites = _config.GetSection("SharePoint:Sites").GetChildren().Select(s => new
            {
                label = s["Label"],
                primary = s["Primary"],
                driveId = s["DriveId"]
            }),
            pollInterval = _config.GetValue<int>("SharePoint:PollIntervalSeconds"),
            isConfigured = _sp.IsConfigured,
            lastScan = _sp.LastScanTime
        });
    }
}
