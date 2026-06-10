@echo off
rem WONIK DS sandbox launcher - for non-developer testers (double-click to start)
cd /d "%~dp0"
start "" cmd /c "timeout /t 5 >nul & start http://localhost:5173/"
pnpm dev
