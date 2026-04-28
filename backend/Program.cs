using System.Diagnostics;
using System.Text.Json.Serialization;
using ModelContextProtocol;
using NuclearSystemChase.Api.Services;

// ─── MCP Server Mode ───────────────────────────────────────────
// Run with: dotnet run -- --mcp
// Claude Desktop connects via stdio and gets access to project tools.
if (args.Contains("--mcp"))
{
    var mcpBuilder = Host.CreateApplicationBuilder(args);

    // Load .env for secrets
    LoadEnvFile(mcpBuilder.Configuration, mcpBuilder.Environment.ContentRootPath);

    mcpBuilder.Services.AddHttpClient();
    mcpBuilder.Services.AddHttpClient("GraphAuth")
        .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { CheckCertificateRevocationList = false });
    mcpBuilder.Services.AddHttpClient("GraphApi")
        .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { CheckCertificateRevocationList = false });
    mcpBuilder.Services.AddSingleton<GraphAuthService>();
    mcpBuilder.Services.AddSingleton<SharePointService>();
    mcpBuilder.Services.AddHostedService(sp => sp.GetRequiredService<SharePointService>());

    mcpBuilder.Services
        .AddMcpServer()
        .WithStdioServerTransport()
        .WithToolsFromAssembly();

    // Suppress noisy logs on stdio (they'd corrupt the MCP protocol)
    mcpBuilder.Logging.SetMinimumLevel(LogLevel.Warning);
    mcpBuilder.Logging.AddFilter("Microsoft", LogLevel.Error);

    var mcpHost = mcpBuilder.Build();
    await mcpHost.RunAsync();
    return;
}

// ─── Gmail Takeout Import Mode ─────────────────────────────────
// Run with: dotnet run -- --import-gmail <path-to-takeout.zip OR .mbox>
// One-shot: parses mbox, runs signal extractor, appends to SignalStore, exits.
if (args.Contains("--import-gmail"))
{
    var idx = Array.IndexOf(args, "--import-gmail");
    if (idx < 0 || idx + 1 >= args.Length)
    {
        Console.Error.WriteLine("Usage: dotnet run -- --import-gmail <path-to-takeout.zip OR .mbox>");
        return;
    }
    var importPath = args[idx + 1];

    var importBuilder = Host.CreateApplicationBuilder(args);
    LoadEnvFile(importBuilder.Configuration, importBuilder.Environment.ContentRootPath);
    importBuilder.Services.AddSingleton<SignalStore>();
    importBuilder.Services.AddSingleton<SignalExtractorService>();
    importBuilder.Services.AddSingleton<GmailImportService>();
    importBuilder.Logging.SetMinimumLevel(LogLevel.Information);

    var importHost = importBuilder.Build();
    var importer = importHost.Services.GetRequiredService<GmailImportService>();
    var importResult = await importer.ImportAsync(importPath);
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(importResult,
        new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));
    return;
}

// ─── Web Server Mode (default) ─────────────────────────────────
var builder = WebApplication.CreateBuilder(args);

LoadEnvFile(builder.Configuration, builder.Environment.ContentRootPath);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddHttpClient();
builder.Services.AddHttpClient("GraphAuth")
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { CheckCertificateRevocationList = false });
builder.Services.AddHttpClient("GraphApi")
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { CheckCertificateRevocationList = false });
builder.Services.AddSingleton<GraphAuthService>();
builder.Services.AddSingleton<SharePointService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<SharePointService>());
builder.Services.AddSingleton<SignalStore>();
builder.Services.AddSingleton<SignalExtractorService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<EmailSchedulerService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<EmailSchedulerService>());

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.MapControllers();
app.MapFallbackToFile("index.html");

if (!app.Environment.IsDevelopment() && !args.Contains("--no-browser"))
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        const string url = "http://localhost:5050";
        string[] chromePaths = [
            @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                @"Google\Chrome\Application\chrome.exe"),
        ];
        var chrome = chromePaths.FirstOrDefault(File.Exists);
        try
        {
            if (chrome != null)
                Process.Start(new ProcessStartInfo(chrome, $"--app={url} --window-size=1440,900")
                    { UseShellExecute = false });
            else
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
        }
        catch { }
    });
}

app.Run();

// ─── Shared Helpers ────────────────────────────────────────────
static void LoadEnvFile(IConfigurationBuilder config, string contentRoot)
{
    // Cast to ConfigurationManager so we can index into it
    if (config is not ConfigurationManager manager) return;

    var envPath = Path.Combine(contentRoot, ".env");
    if (!File.Exists(envPath)) return;

    foreach (var line in File.ReadAllLines(envPath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#')) continue;
        var eq = line.IndexOf('=');
        if (eq <= 0) continue;
        var key = line[..eq].Trim();
        var val = line[(eq + 1)..].Trim();
        Environment.SetEnvironmentVariable(key, val);
    }

    var clientSecret = Environment.GetEnvironmentVariable("AZURE_CLIENT_SECRET");
    if (!string.IsNullOrEmpty(clientSecret))
        manager["AzureAd:ClientSecret"] = clientSecret;
    // ANTHROPIC_API_KEY is read directly from Environment by EmailService
}
