# update.ps1
# Push a new build to an already-installed Chase Group CRM.
# Run from the NuclearSystemChase repo root after publish.bat.

param(
    [string]$InstallPath = "C:\ChaseGroupCRM",
    [string]$AppName    = "Chase Group CRM"
)

$ErrorActionPreference = "Stop"
$ExeName = "NuclearSystemChase.Api.exe"
$Dist    = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path (Join-Path $Dist $ExeName))) {
    Write-Error "dist\$ExeName not found. Run publish.bat first."; exit 1
}

Write-Host "Stopping $AppName..." -ForegroundColor Cyan
Stop-ScheduledTask -TaskName $AppName -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Copying new build to $InstallPath..." -ForegroundColor Cyan
Copy-Item "$Dist\*" $InstallPath -Recurse -Force

Write-Host "Restarting $AppName..." -ForegroundColor Cyan
Start-ScheduledTask -TaskName $AppName

Write-Host "Done — $AppName updated and restarted." -ForegroundColor Green
