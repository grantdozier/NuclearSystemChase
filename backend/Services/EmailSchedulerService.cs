using System.Text.Json;
using NuclearSystemChase.Api.Models;

namespace NuclearSystemChase.Api.Services;

/// <summary>
/// BackgroundService that runs the email pipeline daily at 6 AM Central and
/// exposes in-memory state for the API. Supports manual trigger via TriggerAsync().
/// </summary>
public class EmailSchedulerService : BackgroundService
{
    private readonly EmailService _emailService;
    private readonly IConfiguration _config;
    private readonly ILogger<EmailSchedulerService> _logger;

    private readonly List<EmailRunResult> _history = new();
    private readonly List<EmailItem> _lastEmails = new();
    private readonly SemaphoreSlim _runLock = new(1, 1);
    private bool _running;

    private static readonly string StateFile = Path.Combine(
        AppContext.BaseDirectory, "email_run_history.json");

    public bool IsRunning => _running;
    public IReadOnlyList<EmailRunResult> History => _history.AsReadOnly();
    public IReadOnlyList<EmailItem> LastEmails => _lastEmails.AsReadOnly();
    public EmailRunResult? LastRun => _history.Count > 0 ? _history[0] : null;

    public EmailSchedulerService(
        EmailService emailService,
        IConfiguration config,
        ILogger<EmailSchedulerService> logger)
    {
        _emailService = emailService;
        _config = config;
        _logger = logger;
        LoadHistory();
    }

    public async Task<EmailRunResult> TriggerAsync(bool dryRun = false)
    {
        await _runLock.WaitAsync();
        try
        {
            return await RunPipelineAsync(DateTime.UtcNow.AddDays(-1), dryRun);
        }
        finally
        {
            _runLock.Release();
        }
    }

    public List<EmailProjectSummary> GetProjectSummaries()
    {
        var cfg = _config.GetSection("Email").Get<EmailConfig>() ?? new EmailConfig();
        var summaries = new List<EmailProjectSummary>();
        foreach (var proj in cfg.Projects)
        {
            var emails = _lastEmails.Where(e => e.ProjectSlug == proj.Slug).ToList();
            summaries.Add(new EmailProjectSummary
            {
                Slug = proj.Slug,
                Name = proj.Name,
                TotalEmails = emails.Count,
                PriorityCount = emails.Count(e => e.IsPriority),
                BudgetCount = emails.Count(e => e.IsBudget),
                ScheduleCount = emails.Count(e => e.IsSchedule),
                RecentEmails = emails.Take(10).ToList(),
            });
        }
        return summaries;
    }

    public DateTime? NextRunUtc()
    {
        var cfg = _config.GetSection("Email").Get<EmailConfig>() ?? new EmailConfig();
        var now = DateTime.UtcNow;
        // Convert 6 AM Central to UTC (approx UTC-5/6, use -6 for safety)
        var nextRun = new DateTime(now.Year, now.Month, now.Day, cfg.DailyRunHour + 6, 0, 0, DateTimeKind.Utc);
        if (nextRun <= now) nextRun = nextRun.AddDays(1);
        return nextRun;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _running = true;
        _logger.LogInformation("Email scheduler started — daily run at {Hour}:00 Central",
            (_config.GetSection("Email").Get<EmailConfig>() ?? new EmailConfig()).DailyRunHour);

        while (!stoppingToken.IsCancellationRequested)
        {
            var next = NextRunUtc();
            var delay = next.HasValue ? next.Value - DateTime.UtcNow : TimeSpan.FromHours(1);
            if (delay < TimeSpan.Zero) delay = TimeSpan.FromMinutes(1);

            _logger.LogDebug("Email scheduler sleeping {Minutes:F0} min until next run", delay.TotalMinutes);
            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }

            if (!stoppingToken.IsCancellationRequested)
            {
                await _runLock.WaitAsync(stoppingToken);
                try
                {
                    await RunPipelineAsync(DateTime.UtcNow.AddDays(-1));
                }
                finally
                {
                    _runLock.Release();
                }
            }
        }

        _running = false;
    }

    private async Task<EmailRunResult> RunPipelineAsync(DateTime since, bool dryRun = false)
    {
        var result = new EmailRunResult { StartedAt = DateTime.UtcNow };
        _logger.LogInformation("Email pipeline starting (dryRun={DryRun})", dryRun);
        try
        {
            var items = await _emailService.FetchAndProcessAsync(since, dryRun);
            result.Fetched = items.Count;
            result.Classified = items.Count(e => e.ProjectSlug != null);
            result.Unmatched = items.Count(e => e.ProjectSlug == null);

            if (!dryRun)
            {
                _lastEmails.Clear();
                _lastEmails.AddRange(items);
            }

            _logger.LogInformation("Email pipeline done — fetched={F} classified={C} unmatched={U}",
                result.Fetched, result.Classified, result.Unmatched);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email pipeline failed");
            result.Error = ex.Message;
        }
        result.FinishedAt = DateTime.UtcNow;

        _history.Insert(0, result);
        if (_history.Count > 100) _history.RemoveAt(_history.Count - 1);
        SaveHistory();

        return result;
    }

    private void LoadHistory()
    {
        try
        {
            if (File.Exists(StateFile))
            {
                var json = File.ReadAllText(StateFile);
                var loaded = JsonSerializer.Deserialize<List<EmailRunResult>>(json);
                if (loaded != null) { _history.Clear(); _history.AddRange(loaded); }
            }
        }
        catch { /* ignore corrupt state */ }
    }

    private void SaveHistory()
    {
        try
        {
            File.WriteAllText(StateFile, JsonSerializer.Serialize(_history.Take(100)));
        }
        catch { /* non-critical */ }
    }
}
