# Creates a per-user startup launcher that starts TurfBook silently at each Windows sign-in.
$backendScript = Join-Path $PSScriptRoot 'start-local.ps1'
if (-not (Test-Path $backendScript)) { throw 'TurfBook startup file is missing.' }

$startupFolder = [Environment]::GetFolderPath('Startup')
$launcherPath = Join-Path $startupFolder 'TurfBook Backend.vbs'
$escapedPath = $backendScript.Replace('"', '""')
$launcher = @"
Set shell = CreateObject("WScript.Shell")
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ""$escapedPath""", 0, False
"@
Set-Content -LiteralPath $launcherPath -Value $launcher -Encoding ASCII
Write-Host 'TurfBook Backend will start automatically at every Windows sign-in.'
