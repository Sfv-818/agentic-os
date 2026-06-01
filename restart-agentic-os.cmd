@echo off
REM Restarts the Agentic OS production server (hidden, in the background)
echo Stopping Agentic OS...
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($c) { $c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force } }"
timeout /t 2 >nul
echo Starting Agentic OS...
wscript "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AgenticOS.vbs"
echo Done. Open http://localhost:3000 in a few seconds.
timeout /t 3 >nul
