using Microsoft.AspNetCore.Mvc;
using NuclearSystemChase.Api.Services;

namespace NuclearSystemChase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    [HttpPost("rescan")]
    public async Task<IActionResult> Rescan([FromServices] SharePointService sp)
    {
        await sp.ForceScanAsync();
        return Ok(new { message = "Rescan complete", lastScan = sp.LastScanTime, projects = sp.GetProjects().Count });
    }

    [HttpPost("restart")]
    public IActionResult Restart([FromServices] IHostApplicationLifetime lifetime)
    {
        var exePath = Environment.ProcessPath;
        var isPublishedExe = exePath != null
            && !exePath.Contains("dotnet", StringComparison.OrdinalIgnoreCase)
            && exePath.EndsWith(".exe", StringComparison.OrdinalIgnoreCase);

        Task.Delay(600).ContinueWith(_ =>
        {
            if (isPublishedExe)
                System.Diagnostics.Process.Start(
                    new System.Diagnostics.ProcessStartInfo(exePath!, "--no-browser")
                    { UseShellExecute = true });
            lifetime.StopApplication();
        });

        return Ok(new
        {
            message = isPublishedExe
                ? "Restarting server — refresh the page in a few seconds."
                : "Stopping dev server. Run 'dotnet run' again to restart."
        });
    }
}
