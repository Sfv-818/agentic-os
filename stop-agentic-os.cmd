@echo off
REM Stops the Agentic OS server running on http://localhost:3000
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($c) { $c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }; Write-Host 'Agentic OS stopped.' } else { Write-Host 'Agentic OS was not running.' }"
timeout /t 2 >nul
