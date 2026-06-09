@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
echo ===========================================
echo  Stage 3-3. publish AFTER login (this should SUCCEED)
echo ===========================================
echo  NOTE: run stage3-2b-login first (OK = token saved to ~/.npmrc).
echo.
echo Writing .npmrc (scope only - token comes from ~/.npmrc) ...
>  .npmrc echo auto-install-peers=true
>> .npmrc echo strict-peer-dependencies=false
>> .npmrc echo @wonik:registry=http://127.0.0.1:14873/
echo.
set WONIK_REGISTRY_OK=1
echo Build + publish ...
call pnpm -F @wonik/tokens build || goto :fail
call pnpm -F @wonik/web build || goto :fail
call pnpm -F @wonik/tokens publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
call pnpm -F @wonik/web publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
echo.
echo ===========================================
echo  SUCCESS! published only because logged in.
echo  anon blocked (3-2) + login publish (3-3) = Stage 3.1 auth PASS.
echo  open http://127.0.0.1:14873/ to see tokens + web 1.0.0
echo ===========================================
pause
exit /b 0

:fail
echo.
echo *** FAILED. check: ***
echo  - did stage3-2b-login show OK first?
echo  - is the 3-1 auth registry window still running?
echo  - if ENEEDAUTH / E401: re-run stage3-2b-login (refresh token), then retry
echo.
pause
exit /b 1
