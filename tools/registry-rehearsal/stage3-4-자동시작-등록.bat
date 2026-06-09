@echo off
chcp 65001 >nul
echo ===========================================
echo  Stage 3-4. Register Verdaccio auto-start (Task Scheduler)
echo  Goal: registry survives reboot + logout, no terminal window needed.
echo ===========================================
echo.
echo  STEP 1: close the 3-1 registry window first (Ctrl+C inside it),
echo          so port 14873 is free for the scheduled task.
echo          Then press a key here.
pause
echo.
echo  STEP 2: a Windows password prompt appears next.
echo          Type THIS account's login password (input is hidden).
echo          (the task needs it to run while you are logged off.)
echo.
schtasks /create /tn "WonikVerdaccio" /tr "\"%~dp0stage3-4-service-launcher.bat\"" /sc onstart /ru "%USERDOMAIN%\%USERNAME%" /f
if errorlevel 1 goto :fail
echo.
echo  Registered OK. Starting it now (so you can test without rebooting yet)...
schtasks /run /tn "WonikVerdaccio"
echo.
echo ===========================================
echo  CHECK 1 (now):  wait ~10s, open http://localhost:14873/  -> registry shows?
echo  CHECK 2 (REAL): reboot this PC. Do NOT open any window/terminal.
echo                  Best proof: from the WORK PC open
echo                  http://10.249.34.85:14873/  while this PC sits even at
echo                  the login screen -> if it answers = PASS (no human needed).
echo  If a check fails: see verdaccio-service.log in this folder.
echo ===========================================
pause
exit /b 0

:fail
echo.
echo *** FAILED to register the task. common causes: ***
echo  - this account has no password (run-whether-logged-on needs one)
echo  - wrong password typed
echo  - blocked by company policy -> then the IT official registry path wins
echo.
pause
exit /b 1
