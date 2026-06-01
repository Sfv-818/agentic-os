@echo off
REM Launches Agentic OS production server on http://localhost:3000
REM Guard: if something is already listening on 3000, don't start a duplicate
REM (Next would otherwise grab :3001 and confuse things).
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"
if %errorlevel%==1 (
  echo Agentic OS is already running on http://localhost:3000
  exit /b 0
)
cd /d D:\AgenticOS
call npm run start
