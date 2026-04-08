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
builder.Services.AddSingleton<GraphAuthService>();
builder.Services.AddSingleton<SharePointService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<SharePointService>());

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.MapControllers();
app.MapFallbackToFile("index.html");

if (!app.Environment.IsDevelopment())
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var url = "http://localhost:5000";
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
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
    {
        manager["AzureAd:ClientSecret"] = clientSecret;
    }
}
