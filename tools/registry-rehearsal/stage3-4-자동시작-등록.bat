@echo off
chcp 65001 >nul
echo ===========================================
echo  Stage 3-4. Register Verdaccio auto-start
echo  (runs WHETHER LOGGED ON OR NOT -> survives reboot + logout)
echo ===========================================
echo.
echo  STEP 1: if a manual 3-1 registry window is open, close it (Ctrl+C),
echo          so the scheduled task can own port 14873.
echo  STEP 2: a secure Windows password dialog pops up next - type THIS
echo          account's login password (needed to run while logged off).
echo.
pause
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stage3-4-register.ps1"
echo.
echo ===========================================
echo  If above says 'OK - registered. LogonType = Password':
echo   CHECK 1 (now):  open http://localhost:14873/  -> registry + tokens/web 1.0.0
echo   CHECK 2 (REAL): reboot, open NOTHING, then from the WORK PC open
echo                   http://10.249.34.85:14873/  -> answers = 3.4 PASS
echo  Undo anytime: stage3-4-자동시작-해제.bat
echo ===========================================
pause
