# Pull GitHub main into this working copy so local index.html sees the overnight board.
# Usage:
#   powershell -ExecutionPolicy Bypass -File tools/pull_latest.ps1
#   powershell -ExecutionPolicy Bypass -File tools/pull_latest.ps1 -Once
#   powershell -ExecutionPolicy Bypass -File tools/pull_latest.ps1 -PollMinutes 40
param(
  [int]$PollMinutes = -1,
  [switch]$Once
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$LogPath = Join-Path $PSScriptRoot "pull_latest.log"
$Upstream = "origin/main"

function Write-Log {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  $utf8 = New-Object System.Text.UTF8Encoding $false
  $bytes = $utf8.GetBytes($line + [Environment]::NewLine)
  for ($i = 0; $i -lt 8; $i++) {
    try {
      $fs = [System.IO.File]::Open(
        $LogPath,
        [System.IO.FileMode]::Append,
        [System.IO.FileAccess]::Write,
        [System.IO.FileShare]::ReadWrite
      )
      try { $fs.Write($bytes, 0, $bytes.Length) } finally { $fs.Dispose() }
      break
    } catch {
      Start-Sleep -Milliseconds 250
    }
  }
  Write-Host $line
}

function Resolve-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $candidates = @(
    (Join-Path $env:ProgramFiles "Git\cmd\git.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Git\cmd\git.exe"),
    (Join-Path $env:LOCALAPPDATA "Programs\Git\cmd\git.exe")
  )
  foreach ($path in $candidates) {
    if ($path -and (Test-Path -LiteralPath $path)) { return $path }
  }
  return $null
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)][string[]]$GitArgs,
    [switch]$AllowFail
  )
  $output = & $script:Git -C $RepoRoot @GitArgs 2>&1
  $code = $LASTEXITCODE
  $text = @($output | ForEach-Object { "$_" } | Where-Object { $_.Trim() })
  $quiet = $GitArgs[0] -eq "fetch"
  if ($text -and (-not $quiet -or $code -ne 0)) {
    foreach ($line in $text) {
      Write-Log ("git {0}: {1}" -f ($GitArgs -join " "), $line)
    }
  }
  if (-not $AllowFail -and $code -ne 0) {
    throw "git $($GitArgs -join ' ') 失败，退出码 $code"
  }
  return $code
}

function Get-RepoDirty {
  $status = & $script:Git -C $RepoRoot status --porcelain
  return -not [string]::IsNullOrWhiteSpace($status)
}

function Get-Sha {
  param([string]$Rev)
  $sha = & $script:Git -C $RepoRoot rev-parse $Rev
  if ($LASTEXITCODE -ne 0) {
    throw "无法解析 $Rev"
  }
  return $sha.Trim()
}

function Resolve-PollMinutes {
  if ($Once) { return 0 }
  if ($PollMinutes -ge 0) { return $PollMinutes }
  $now = Get-Date
  $weekday = $now.DayOfWeek -ge [DayOfWeek]::Monday -and $now.DayOfWeek -le [DayOfWeek]::Friday
  $inWindow = $now.TimeOfDay -ge [TimeSpan]::Parse("06:55") -and $now.TimeOfDay -lt [TimeSpan]::Parse("07:45")
  if ($weekday -and $inWindow) { return 40 }
  return 0
}

$Git = Resolve-Git
if (-not $Git) {
  Write-Log "找不到 git.exe，退出"
  exit 1
}

$mutex = New-Object System.Threading.Mutex($false, "Local\ashare-us-screener-pull-latest")
$owned = $false
$stashed = $false
try {
  $owned = $mutex.WaitOne(0)
  if (-not $owned) {
    Write-Log "已有实例在跑，退出"
    exit 0
  }

  $poll = Resolve-PollMinutes
  $deadline = (Get-Date).AddMinutes($poll)
  $sleepSeconds = 60
  $stashed = $false
  $pulled = $false

  Write-Log ("开始拉取 repo={0} git={1} pollMinutes={2}" -f $RepoRoot, $Git, $poll)

  while ($true) {
    $fetchCode = Invoke-Git -GitArgs @("fetch", "origin") -AllowFail
    if ($fetchCode -ne 0) {
      if ($poll -eq 0 -or (Get-Date) -ge $deadline) {
        throw "git fetch origin 失败"
      }
      Write-Log ("fetch 失败，{0} 秒后重试" -f $sleepSeconds)
      Start-Sleep -Seconds $sleepSeconds
      continue
    }

    $local = Get-Sha "HEAD"
    $remote = Get-Sha $Upstream
    if ($local -eq $remote) {
      if ($poll -eq 0 -or (Get-Date) -ge $deadline) {
        Write-Log ("已是最新 {0}" -f $local.Substring(0, 7))
        break
      }
      Write-Log ("远端尚无新提交，{0} 秒后重试" -f $sleepSeconds)
      Start-Sleep -Seconds $sleepSeconds
      continue
    }

    Write-Log ("发现更新 {0} -> {1}" -f $local.Substring(0, 7), $remote.Substring(0, 7))

    if (-not $stashed -and (Get-RepoDirty)) {
      Invoke-Git -GitArgs @("stash", "push", "-u", "-m", ("pull_latest auto {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm")))
      $stashed = $true
      Write-Log "已暂存本机未提交改动"
    }

    Invoke-Git -GitArgs @("merge", "--ff-only", $Upstream)
    $pulled = $true
    Write-Log ("快进成功，当前 {0}" -f (Get-Sha "HEAD").Substring(0, 7))
    break
  }

  if ($stashed) {
    $popCode = Invoke-Git -GitArgs @("stash", "pop") -AllowFail
    if ($popCode -ne 0) {
      Write-Log "stash pop 冲突：远程数据已留下，本机改动仍在 stash 里，请手工处理"
      exit 2
    }
    Write-Log "已恢复本机未提交改动"
  }

  if ($pulled) {
    Write-Log "完成：已拉到最新，重新打开 index.html 即可"
  } else {
    Write-Log "完成：无需更新"
  }
  exit 0
} catch {
  Write-Log ("失败：{0}" -f $_.Exception.Message)
  if ($stashed) {
    $popCode = Invoke-Git -GitArgs @("stash", "pop") -AllowFail
    if ($popCode -ne 0) {
      Write-Log "失败后 stash pop 也未成功，本机改动仍在 stash 里"
    } else {
      Write-Log "已恢复本机未提交改动"
    }
  }
  exit 1
} finally {
  if ($owned) { $mutex.ReleaseMutex() | Out-Null }
  $mutex.Dispose()
}
