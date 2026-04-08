using Microsoft.AspNetCore.Mvc;
using NuclearSystemChase.Api.Models;
using NuclearSystemChase.Api.Services;

namespace NuclearSystemChase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DirectoryController : ControllerBase
{
    private readonly SharePointService _sp;

    public DirectoryController(SharePointService sp)
    {
        _sp = sp;
    }

    [HttpGet("tree")]
    public IActionResult GetTree([FromQuery] string? site = null)
    {
        var tree = _sp.GetTree(site);
        if (tree == null)
            return Ok(new { message = "Initial scan not complete yet. Please wait..." });
        return Ok(tree);
    }

    [HttpGet("tree/{**relativePath}")]
    public IActionResult GetSubTree(string relativePath)
    {
        var tree = _sp.GetTree();
        if (tree == null) return NotFound();
        var node = FindNode(tree, relativePath);
        return node == null ? NotFound() : Ok(node);
    }

    [HttpPost("rescan")]
    public async Task<IActionResult> Rescan()
    {
        await _sp.ForceScanAsync();
        return Ok(new { message = "Rescan complete", lastScan = _sp.LastScanTime });
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            isConfigured = _sp.IsConfigured,
            isScanning = _sp.IsScanning,
            lastScan = _sp.LastScanTime,
            source = "SharePoint Graph API"
        });
    }

    private static DirectoryNode? FindNode(DirectoryNode node, string relativePath)
    {
        if (node.RelativePath.Equals(relativePath, StringComparison.OrdinalIgnoreCase) ||
            (node.RelativePath == "." && string.IsNullOrEmpty(relativePath)))
            return node;

        foreach (var child in node.Children)
        {
            var found = FindNode(child, relativePath);
            if (found != null) return found;
        }
        return null;
    }
}
