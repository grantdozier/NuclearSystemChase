# Register a Windows Task Scheduler job to run the Email Agent at 6:00 AM daily.
# Run once as Administrator: powershell -ExecutionPolicy Bypass -File register_windows_task.ps1

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$venvPython = Join-Path $repoRoot "email_agent\.venv\Scripts\python.exe"
$taskName = "ChaseGroupCC_EmailAgent"

$action = New-ScheduledTaskAction `
    -Execute $venvPython `
    -Argument "-m email_agent.run once" `
    -WorkingDirectory $repoRoot

$trigger = New-ScheduledTaskTrigger -Daily -At "06:00"

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -RestartCount 2 `
    -RestartInterval (New-TimeSpan -Minutes 5) `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Chase Group CC Email Agent — daily 6 AM run" `
    -Force

Write-Host "Task '$taskName' registered. It will run at 6:00 AM daily." -ForegroundColor Green
Write-Host "To run immediately: Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Cyan
