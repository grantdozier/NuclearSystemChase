namespace NuclearSystemChase.Api.Models;

public class EmailProjectConfig
{
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public List<string> Aliases { get; set; } = new();
    public List<string> Keywords { get; set; } = new();
}

public class EmailConfig
{
    public string Mailbox { get; set; } = "";
    public int DailyRunHour { get; set; } = 6;
    public List<EmailProjectConfig> Projects { get; set; } = new();
    public List<string> PrioritySignals { get; set; } = new()
    {
        "urgent", "asap", "immediately", "critical", "emergency", "stop work", "lien", "lawsuit"
    };
    public List<string> BudgetSignals { get; set; } = new()
    {
        "change order", "co #", "invoice", "pay app", "budget", "overage", "cost"
    };
    public List<string> ScheduleSignals { get; set; } = new()
    {
        "delay", "behind schedule", "completion date", "milestone", "inspection", "punch list"
    };
}

public class EmailItem
{
    public string Id { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Sender { get; set; } = "";
    public string Received { get; set; } = "";
    public string BodyPreview { get; set; } = "";
    public string? ProjectSlug { get; set; }
    public string? ProjectName { get; set; }
    public bool IsPriority { get; set; }
    public bool IsBudget { get; set; }
    public bool IsSchedule { get; set; }
    public bool HasAttachments { get; set; }
    public List<string> Tags { get; set; } = new();
    public string Summary { get; set; } = "";
}

public class EmailRunResult
{
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? FinishedAt { get; set; }
    public int Fetched { get; set; }
    public int Classified { get; set; }
    public int Unmatched { get; set; }
    public string? Error { get; set; }
    public double? DurationSeconds => FinishedAt.HasValue
        ? (FinishedAt.Value - StartedAt).TotalSeconds
        : null;
}

public class EmailProjectSummary
{
    public string Slug { get; set; } = "";
    public string Name { get; set; } = "";
    public int TotalEmails { get; set; }
    public int PriorityCount { get; set; }
    public int BudgetCount { get; set; }
    public int ScheduleCount { get; set; }
    public List<EmailItem> RecentEmails { get; set; } = new();
}

public class EmailStatusResponse
{
    public bool SchedulerRunning { get; set; }
    public EmailRunResult? LastRun { get; set; }
    public DateTime? NextRunUtc { get; set; }
    public List<EmailProjectSummary> Projects { get; set; } = new();
}
