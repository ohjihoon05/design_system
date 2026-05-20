@echo off
cd /d "%~dp0"
echo Starting Storybook... a browser tab will open automatically.
echo Close this window or press Ctrl+C to stop the server.
echo.
call pnpm -F storybook-app dev
pause
