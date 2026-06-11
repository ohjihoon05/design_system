@echo off
rem Creates desktop shortcuts for WONIK DS launchers (double-click once per PC)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-desktop.ps1"
pause
