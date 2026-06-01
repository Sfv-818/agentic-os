@echo off
REM Rebuilds Agentic OS for production after code changes, then restarts it.
echo Stopping Agentic OS...
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if ($c) { $c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force } }"
timeout /t 2 >nul
cd /d D:\AgenticOS
echo Building (this takes ~30s)...
call npm run build
echo Starting Agentic OS...
wscript "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AgenticOS.vbs"
echo Done. Open http://localhost:3000 in a few seconds.
timeout /t 3 >nul
