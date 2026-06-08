@echo off
chcp 65001 >nul
echo ===========================================
echo  Stage 3 login - create user + save token
echo  run only when the 3-1 auth registry is up
echo ===========================================
echo.
echo Creating a fresh user + saving token to ~/.npmrc ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stage3-login.ps1"
echo.
echo ===========================================
echo  If OK above  -^> double-click stage3-3-로그인후-올리기.bat
echo  If FAIL      -^> check the 3-1 registry window, then re-run this
echo ===========================================
echo.
pause
