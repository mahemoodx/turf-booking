# Starts TurfBook with the embedded, persistent local SQL database.
# Run from PowerShell: .\backend\start-local.ps1
$alreadyRunning = $false
try {
  $health = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:9090/api/sports' -TimeoutSec 2
  $alreadyRunning = $health.StatusCode -eq 200
} catch { }
if ($alreadyRunning) {
  Write-Host "TurfBook backend is already running on http://localhost:9090"
  exit 0
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$maven = Join-Path $projectRoot '.tools\apache-maven-3.9.9\bin\mvn.cmd'
$settings = Join-Path $projectRoot '.tools\maven-settings.xml'
$environmentFile = Join-Path $PSScriptRoot '.env'

if (-not (Test-Path $maven)) { throw 'The bundled Maven folder is missing. Re-open the complete project folder.' }
if (Test-Path 'C:\Program Files\Java\jdk-22') { $env:JAVA_HOME = 'C:\Program Files\Java\jdk-22' }
if (Test-Path $environmentFile) {
  Get-Content $environmentFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#') -or -not $line.Contains('=')) { return }
    $name, $value = $line.Split('=', 2)
    [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), 'Process')
  }
}
$env:SPRING_PROFILES_ACTIVE = 'local'
& $maven -s $settings spring-boot:run
