# Register a Windows scheduled task that runs tools/pull_latest.ps1
# weekday 07:00 (polls until the cloud commit lands) and again at user logon.
# Usage:
#   powershell -ExecutionPolicy Bypass -File tools/install_pull_task.ps1
param(
  [switch]$Uninstall
)

$ErrorActionPreference = "Stop"
$TaskName = "AshareUsScreenerPullLatest"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$PullScript = Join-Path $PSScriptRoot "pull_latest.ps1"

function Get-PowerShellExe {
  $pwsh = Get-Command pwsh -ErrorAction SilentlyContinue
  if ($pwsh) { return $pwsh.Source }
  $ps = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
  if (Test-Path -LiteralPath $ps) { return $ps }
  throw "找不到 PowerShell"
}

if ($Uninstall) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
  Write-Host "已删除计划任务 $TaskName"
  exit 0
}

if (-not (Test-Path -LiteralPath $PullScript)) {
  throw "找不到 $PullScript"
}

Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue |
  Unregister-ScheduledTask -Confirm:$false

$psExe = Get-PowerShellExe
$arg = "-NoProfile -ExecutionPolicy Bypass -File `"$PullScript`""
$action = New-ScheduledTaskAction -Execute $psExe -Argument $arg -WorkingDirectory $RepoRoot
$userId = "$env:USERDOMAIN\$env:USERNAME"
$morning = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday, Tuesday, Wednesday, Thursday, Friday -At "07:00"
$logon = New-ScheduledTaskTrigger -AtLogOn -User $userId
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Hours 1)
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$task = New-ScheduledTask `
  -Action $action `
  -Trigger @($morning, $logon) `
  -Settings $settings `
  -Principal $principal `
  -Description "把 GitHub 上的日榜和隔夜简报拉回本机文件夹。工作日 7:00 轮询；登录时再拉一次。"

Register-ScheduledTask -TaskName $TaskName -InputObject $task | Out-Null
Write-Host "已注册计划任务 $TaskName"
Write-Host "  脚本: $PullScript"
Write-Host "  触发: 工作日 07:00；用户 $userId 登录时"
Write-Host "  电脑关机或休眠时 7:00 不会跑，登录后再拉。"
Write-Host 'Uninstall: powershell -ExecutionPolicy Bypass -File tools/install_pull_task.ps1 -Uninstall'
