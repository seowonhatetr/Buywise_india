@echo off
setlocal
cd /d "%~dp0"
echo Starting BuyWise India...
node --version >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install Node.js 18 or newer, then run this file again.
  pause
  exit /b 1
)
start "BuyWise India" cmd /k "cd /d "%~dp0" && npm start"
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
