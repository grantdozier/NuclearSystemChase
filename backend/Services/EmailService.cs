using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using NuclearSystemChase.Api.Models;

namespace NuclearSystemChase.Api.Services;

/// <summary>
/// Fetches, classifies, and summarizes emails from Microsoft Graph.
/// Integrates directly with the existing GraphAuthService — no separate Python process.
/// </summary>
public class EmailService
{
    private readonly GraphAuthService _auth;
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpFactory;
    private readonly ILogger<EmailService> _logger;

    private EmailConfig? _emailConfig;

    public EmailService(
        GraphAuthService auth,
        IConfiguration config,
        IHttpClientFactory httpFactory,
        ILogger<EmailService> logger)
    {
        _auth = auth;
        _config = config;
        _httpFactory = httpFactory;
        _logger = logger;
    }

    private EmailConfig GetEmailConfig()
    {
        if (_emailConfig != null) return _emailConfig;
        _emailConfig = _config.GetSection("Email").Get<EmailConfig>() ?? new EmailConfig();
        return _emailConfig;
    }

    // ── Fetch ─────────────────────────────────────────────────────────────────

    public async Task<List<EmailItem>> FetchAndProcessAsync(DateTime since, bool dryRun = false)
    {
        var cfg = GetEmailConfig();
        if (string.IsNullOrEmpty(cfg.Mailbox))
        {
            _logger.LogWarning("Email mailbox not configured — skipping fetch");
            return new();
        }

        var messages = await FetchMessagesAsync(cfg.Mailbox, since, "inbox");
        var sent = await FetchMessagesAsync(cfg.Mailbox, since, "sentitems");
        messages.AddRange(sent);

        _logger.LogInformation("Fetched {Count} messages for {Mailbox}", messages.Count, cfg.Mailbox);

        if (dryRun) return new();

        var items = messages.Select(m => Classify(m, cfg)).ToList();
        await SummarizeAsync(items);
        return items;
    }

    private async Task<List<JsonElement>> FetchMessagesAsync(string mailbox, DateTime since, string folder)
    {
        var client = await _auth.GetAuthenticatedClientAsync();
        var sinceStr = since.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ");
        var url = $"users/{mailbox}/mailFolders/{folder}/messages" +
                  $"?$filter=receivedDateTime ge {sinceStr}" +
                  $"&$top=50" +
                  $"&$select=id,subject,from,receivedDateTime,bodyPreview,hasAttachments,importance" +
                  $"&$orderby=receivedDateTime desc";

        var all = new List<JsonElement>();
        while (!string.IsNullOrEmpty(url))
        {
            try
            {
                var resp = await client.GetAsync(url);
                if (!resp.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Graph {Folder} fetch returned {Status}", folder, resp.StatusCode);
                    break;
                }
                var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
                var root = doc.RootElement;
                if (root.TryGetProperty("value", out var values))
                    foreach (var v in values.EnumerateArray())
                        all.Add(v.Clone());

                url = root.TryGetProperty("@odata.nextLink", out var next)
                    ? next.GetString()!
                    : null!;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching {Folder} messages", folder);
                break;
            }
        }
        return all;
    }

    // ── Classify ──────────────────────────────────────────────────────────────

    private static EmailItem Classify(JsonElement msg, EmailConfig cfg)
    {
        string Get(string prop) => msg.TryGetProperty(prop, out var v) ? v.GetString() ?? "" : "";

        var id = Get("id");
        var subject = Get("subject").Trim();
        if (string.IsNullOrEmpty(subject)) subject = "(no subject)";
        var sender = msg.TryGetProperty("from", out var fromEl)
            && fromEl.TryGetProperty("emailAddress", out var ea)
            && ea.TryGetProperty("address", out var addr)
            ? addr.GetString() ?? "" : "";
        var received = Get("receivedDateTime");
        var preview = Get("bodyPreview");
        var hasAttach = msg.TryGetProperty("hasAttachments", out var ha) && ha.GetBoolean();

        var blob = $"{subject} {preview} {sender}".ToLowerInvariant();

        EmailProjectConfig? matched = null;
        foreach (var proj in cfg.Projects)
        {
            if (proj.Aliases.Any(a => blob.Contains(a.ToLowerInvariant())))
            {
                matched = proj;
                break;
            }
            if (proj.Keywords.Any(k => blob.Contains(k.ToLowerInvariant())))
            {
                matched = proj;
                break;
            }
        }

        var isPriority = cfg.PrioritySignals.Any(s => blob.Contains(s));
        var isBudget = cfg.BudgetSignals.Any(s => blob.Contains(s));
        var isSchedule = cfg.ScheduleSignals.Any(s => blob.Contains(s));

        var tags = new List<string>();
        if (isPriority) tags.Add("priority");
        if (isBudget) tags.Add("budget");
        if (isSchedule) tags.Add("schedule");
        if (matched == null) tags.Add("unmatched");

        return new EmailItem
        {
            Id = id,
            Subject = subject,
            Sender = sender,
            Received = received,
            BodyPreview = preview,
            ProjectSlug = matched?.Slug,
            ProjectName = matched?.Name,
            HasAttachments = hasAttach,
            IsPriority = isPriority,
            IsBudget = isBudget,
            IsSchedule = isSchedule,
            Tags = tags,
        };
    }

    // ── Summarize ─────────────────────────────────────────────────────────────

    private async Task SummarizeAsync(List<EmailItem> items)
    {
        var apiKey = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY");
        if (string.IsNullOrEmpty(apiKey))
        {
            foreach (var item in items)
                item.Summary = RuleBasedSummary(item);
            return;
        }

        var http = _httpFactory.CreateClient();
        http.DefaultRequestHeaders.Add("x-api-key", apiKey);
        http.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

        foreach (var item in items)
        {
            try
            {
                var prompt = $"""
                    You are a construction project manager's assistant. Summarize this email in 1-2 sentences, focusing on action items, deadlines, or budget impacts.

                    Subject: {item.Subject}
                    From: {item.Sender}
                    Preview: {item.BodyPreview}

                    Reply with only the summary — no preamble.
                    """;

                var body = new
                {
                    model = "claude-haiku-4-5-20251001",
                    max_tokens = 150,
                    messages = new[] { new { role = "user", content = prompt } }
                };

                var resp = await http.PostAsJsonAsync("https://api.anthropic.com/v1/messages", body);
                if (resp.IsSuccessStatusCode)
                {
                    var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
                    item.Summary = doc.RootElement
                        .GetProperty("content")[0]
                        .GetProperty("text")
                        .GetString() ?? RuleBasedSummary(item);
                }
                else
                {
                    item.Summary = RuleBasedSummary(item);
                }
            }
            catch
            {
                item.Summary = RuleBasedSummary(item);
            }
        }
    }

    private static string RuleBasedSummary(EmailItem item)
    {
        var parts = new List<string>();
        if (item.IsPriority) parts.Add("Urgent — requires immediate attention.");
        if (item.IsBudget) parts.Add("Budget/change-order topic.");
        if (item.IsSchedule) parts.Add("Schedule or milestone topic.");
        var preview = item.BodyPreview.Length > 200 ? item.BodyPreview[..200] + "…" : item.BodyPreview;
        if (!string.IsNullOrEmpty(preview)) parts.Add(preview);
        return string.Join(" ", parts) is { Length: > 0 } s ? s : item.BodyPreview[..Math.Min(150, item.BodyPreview.Length)];
    }
}
