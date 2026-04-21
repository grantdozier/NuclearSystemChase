# install.ps1
# One-shot installer for Chase Group CRM.
# Run this from the NuclearSystemChase project folder (right-click -> Run with PowerShell).
# Requires publish.bat to have been run first (or pass -Build to do it automatically).

param(
    [string]$InstallPath = "C:\ChaseGroupCRM",
    [string]$AppName    = "Chase Group CRM",
    [int]   $Port       = 5000,
    [switch]$Build               # pass -Build to run publish.bat first
)

$ErrorActionPreference = "Stop"
$ExeName = "NuclearSystemChase.Api.exe"
$AppUrl  = "http://localhost:$Port"
$Root    = $PSScriptRoot
$Dist    = Join-Path $Root "dist"
$ExeDist = Join-Path $Dist $ExeName

# ─── 1. Build ──────────────────────────────────────────────────────────
if ($Build -or -not (Test-Path $ExeDist)) {
    Write-Host "Building application (this takes ~60 seconds)..." -ForegroundColor Cyan
    Push-Location $Root
    cmd /c publish.bat
    Pop-Location
    if (-not (Test-Path $ExeDist)) { Write-Error "Build failed — $ExeName not found in dist\"; exit 1 }
    Write-Host "Build complete." -ForegroundColor Green
}

# ─── 2. Copy to install path ───────────────────────────────────────────
Write-Host "Installing to $InstallPath..." -ForegroundColor Cyan
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath | Out-Null
}
Copy-Item "$Dist\*" $InstallPath -Recurse -Force

# Copy .env so secrets travel with the install
$EnvSrc = Join-Path $Root "backend\.env"
$EnvDst = Join-Path $InstallPath ".env"
if ((Test-Path $EnvSrc) -and -not (Test-Path $EnvDst)) {
    Copy-Item $EnvSrc $EnvDst
}

$ExePath = Join-Path $InstallPath $ExeName

# ─── 3. Desktop shortcut ───────────────────────────────────────────────
$ChromePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$Chrome = $ChromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

$Shell     = New-Object -ComObject WScript.Shell
$Shortcut  = $Shell.CreateShortcut("$env:USERPROFILE\Desktop\$AppName.lnk")

if ($Chrome) {
    $Shortcut.TargetPath  = $Chrome
    $Shortcut.Arguments   = "--app=$AppUrl --window-size=1440,900"
    $Shortcut.Description = "Open $AppName"
} else {
    # No Chrome — just open URL in default browser via launcher
    $LaunchVbs = Join-Path $InstallPath "open.vbs"
    "CreateObject(`"Shell.Application`").Open(`"$AppUrl`")" | Out-File $LaunchVbs -Encoding ascii
    $Shortcut.TargetPath  = "wscript.exe"
    $Shortcut.Arguments   = "`"$LaunchVbs`""
    $Shortcut.Description = "Open $AppName"
}

$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Save()
Write-Host "Desktop shortcut created." -ForegroundColor Green

# ─── 4. Task Scheduler — auto-start on login ──────────────────────────
$Action   = New-ScheduledTaskAction -Execute $ExePath `
                -Argument "--no-browser" `
                -WorkingDirectory $InstallPath

$Trigger  = New-ScheduledTaskTrigger -AtLogon

$Settings = New-ScheduledTaskSettingsSet `
                -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
                -RestartCount 3 `
                -RestartInterval (New-TimeSpan -Minutes 2) `
                -StartWhenAvailable $true

# Remove old task if it exists, then register fresh
Unregister-ScheduledTask -TaskName $AppName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask `
    -TaskName $AppName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -RunLevel Limited `
    -Force | Out-Null

Write-Host "Task Scheduler entry created — app starts automatically on login." -ForegroundColor Green

# ─── 5. Start it now ───────────────────────────────────────────────────
Write-Host "Starting $AppName now..." -ForegroundColor Cyan
Start-ScheduledTask -TaskName $AppName
Start-Sleep -Seconds 4

if ($Chrome) {
    Start-Process $Chrome "--app=$AppUrl --window-size=1440,900"
} else {
    Start-Process $AppUrl
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host " Installation complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host " App installed to : $InstallPath"
Write-Host " Desktop shortcut : $AppName"
Write-Host " Auto-start       : On every login"
Write-Host " To uninstall     : Unregister-ScheduledTask '$AppName' -Confirm:`$false"
Write-Host ""
