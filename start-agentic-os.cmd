@echo off
REM Launches Agentic OS production server on http://localhost:3939
REM (Port 3939 so it never collides with Hermes workspace on :3000.)
REM Guard: if something is already listening on 3939, don't start a duplicate.
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3939 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"
if %errorlevel%==1 (
  echo Agentic OS is already running on http://localhost:3939
  exit /b 0
)
cd /d D:\AgenticOS
call npm run start
