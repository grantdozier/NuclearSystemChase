using System.Net.Http.Headers;
using System.Text.Json;
using NuclearSystemChase.Api.Models;

namespace NuclearSystemChase.Api.Services;

/// <summary>
/// Handles OAuth2 client-credentials token acquisition for Microsoft Graph.
/// Caches the token and refreshes before expiry.
/// </summary>
public class GraphAuthService
{
    private readonly AzureAdConfig _config;
    private readonly HttpClient _http;
    private readonly IHttpClientFactory _httpFactory;
    private readonly ILogger<GraphAuthService> _logger;
    private string? _cachedToken;
    private DateTime _tokenExpiry = DateTime.MinValue;
    private readonly SemaphoreSlim _tokenLock = new(1, 1);

    public GraphAuthService(IConfiguration config, IHttpClientFactory httpFactory, ILogger<GraphAuthService> logger)
    {
        _config = config.GetSection("AzureAd").Get<AzureAdConfig>() ?? new AzureAdConfig();
        _http = httpFactory.CreateClient("GraphAuth");
        _httpFactory = httpFactory;
        _logger = logger;
    }

    public bool IsConfigured =>
        !string.IsNullOrEmpty(_config.TenantId) &&
        !string.IsNullOrEmpty(_config.ClientId) &&
        !string.IsNullOrEmpty(_config.ClientSecret);

    public async Task<string> GetAccessTokenAsync()
    {
        await _tokenLock.WaitAsync();
        try
        {
            if (_cachedToken != null && DateTime.UtcNow < _tokenExpiry.AddMinutes(-5))
                return _cachedToken;

            var url = $"https://login.microsoftonline.com/{_config.TenantId}/oauth2/v2.0/token";
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = _config.ClientId,
                ["scope"] = "https://graph.microsoft.com/.default",
                ["client_secret"] = _config.ClientSecret,
                ["grant_type"] = "client_credentials"
            });

            var response = await _http.PostAsync(url, content);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Token acquisition failed: {Status} {Body}", response.StatusCode, json);
                throw new InvalidOperationException($"Token acquisition failed: {response.StatusCode}");
            }

            using var doc = JsonDocument.Parse(json);
            _cachedToken = doc.RootElement.GetProperty("access_token").GetString()!;
            var expiresIn = doc.RootElement.GetProperty("expires_in").GetInt32();
            _tokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn);

            _logger.LogDebug("Graph token acquired, expires in {Seconds}s", expiresIn);
            return _cachedToken;
        }
        finally
        {
            _tokenLock.Release();
        }
    }

    /// <summary>
    /// Returns an HttpClient with the Bearer token already set.
    /// </summary>
    public async Task<HttpClient> GetAuthenticatedClientAsync()
    {
        var token = await GetAccessTokenAsync();
        var client = _httpFactory.CreateClient("GraphApi");
        client.BaseAddress = new Uri("https://graph.microsoft.com/v1.0/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}
