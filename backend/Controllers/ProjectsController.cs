using Microsoft.AspNetCore.Mvc;
using NuclearSystemChase.Api.Models;
using NuclearSystemChase.Api.Services;

namespace NuclearSystemChase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly SharePointService _sp;

    public ProjectsController(SharePointService sp)
    {
        _sp = sp;
    }

    [HttpGet]
    public IActionResult GetAll(
        [FromQuery] ProjectStatus? status = null,
        [FromQuery] LifecyclePhase? phase = null)
    {
        var projects = _sp.GetProjects();

        if (status.HasValue)
            projects = projects.Where(p => p.Status == status.Value).ToList();
        if (phase.HasValue)
            projects = projects.Where(p => p.Phase == phase.Value).ToList();

        return Ok(projects);
    }

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        var projects = _sp.GetProjects();

        return Ok(new
        {
            total = projects.Count,
            byStatus = projects.GroupBy(p => p.Status)
                .ToDictionary(g => g.Key.ToString(), g => g.Count()),
            byPhase = projects.GroupBy(p => p.Phase)
                .ToDictionary(g => g.Key.ToString(), g => g.Count()),
            lastScan = _sp.LastScanTime,
            totalFiles = projects.Sum(p => p.FileCount),
            totalSize = projects.Sum(p => p.TotalSizeBytes)
        });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var project = _sp.GetProjects().FirstOrDefault(p =>
            p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        return project == null ? NotFound() : Ok(project);
    }

    [HttpGet("activity")]
    public IActionResult GetRecentActivity([FromQuery] int limit = 50)
    {
        var projects = _sp.GetProjects();
        var activity = projects
            .SelectMany(p => p.RecentFiles.Select(f => new
            {
                projectId = p.Id,
                projectName = p.DisplayName ?? p.Name,
                projectNumber = p.Number,
                fileName = f.Name,
                filePath = f.Path,
                size = f.SizeBytes,
                lastModified = f.LastModified
            }))
            .OrderByDescending(a => a.lastModified)
            .Take(limit);

        return Ok(activity);
    }
}
