$ErrorActionPreference = 'SilentlyContinue'
$log = Join-Path (Get-Location) '.temp\admin-monitor.log'
$consecutiveHighCpu = 0
$deadline = (Get-Date).AddMinutes(5)
while ((Get-Date) -lt $deadline) {
  $conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $conn) {
    Add-Content $log "$(Get-Date -Format o) server-not-listening"
    break
  }

  $cpu = 0
  try {
    $cpu = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
  } catch {
    $cpu = 0
  }
  $os = Get-CimInstance Win32_OperatingSystem
  $freeMb = [math]::Round($os.FreePhysicalMemory / 1024, 0)
  $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
  $serverMb = if ($proc) { [math]::Round($proc.WorkingSet64 / 1MB, 0) } else { 0 }
  Add-Content $log "$(Get-Date -Format o) cpu=$([math]::Round($cpu,1)) freeMb=$freeMb serverPid=$($conn.OwningProcess) serverMb=$serverMb"

  if ($cpu -ge 90) { $consecutiveHighCpu++ } else { $consecutiveHighCpu = 0 }
  if ($consecutiveHighCpu -ge 2 -or $freeMb -lt 1024) {
    Add-Content $log "$(Get-Date -Format o) stopping-server reason=load cpu=$cpu freeMb=$freeMb pid=$($conn.OwningProcess)"
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    break
  }

  Start-Sleep -Seconds 5
}
