using Microsoft.AspNetCore.Mvc;
using NuclearSystemChase.Api.Services;
using NuclearSystemChase.Api.Models;

namespace NuclearSystemChase.Api.Controllers;

[ApiController]
[Route("api/email")]
public class EmailController : ControllerBase
{
    private readonly EmailSchedulerService _scheduler;

    public EmailController(EmailSchedulerService scheduler)
    {
        _scheduler = scheduler;
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new EmailStatusResponse
        {
            SchedulerRunning = _scheduler.IsRunning,
            LastRun = _scheduler.LastRun,
            NextRunUtc = _scheduler.NextRunUtc(),
            Projects = _scheduler.GetProjectSummaries(),
        });
    }

    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        return Ok(_scheduler.History);
    }

    [HttpGet("emails")]
    public IActionResult GetEmails([FromQuery] string? project, [FromQuery] string? tag)
    {
        var emails = _scheduler.LastEmails.AsEnumerable();
        if (!string.IsNullOrEmpty(project))
            emails = emails.Where(e => e.ProjectSlug == project);
        if (!string.IsNullOrEmpty(tag))
            emails = emails.Where(e => e.Tags.Contains(tag));
        return Ok(emails.Take(100).ToList());
    }

    [HttpPost("run")]
    public async Task<IActionResult> RunNow([FromQuery] bool dryRun = false)
    {
        var result = await _scheduler.TriggerAsync(dryRun);
        return Ok(result);
    }
}
