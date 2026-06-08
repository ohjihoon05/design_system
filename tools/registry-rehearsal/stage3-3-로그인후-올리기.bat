@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
echo ===========================================
echo  Stage 3-3. 로그인 후 올리기 (이번엔 *성공*해야 정상)
echo ===========================================
echo  ※ 먼저 stage3-2b-로그인.bat 을 돌려 OK 가 떴어야 함 (토큰 ~/.npmrc 저장).
echo.
echo .npmrc (scope만 — 토큰은 npm adduser가 ~/.npmrc에 넣어둔 걸 사용)...
>  .npmrc echo auto-install-peers=true
>> .npmrc echo strict-peer-dependencies=false
>> .npmrc echo @wonik:registry=http://127.0.0.1:14873/
echo.
set WONIK_REGISTRY_OK=1
echo 빌드 + publish...
call pnpm -F @wonik/tokens build || goto :fail
call pnpm -F @wonik/web build || goto :fail
call pnpm -F @wonik/tokens publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
call pnpm -F @wonik/web publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
echo.
echo ===========================================
echo  성공! 로그인한 상태에서만 올라감.
echo  => 익명 차단(3-2) + 로그인 publish(3-3) 둘 다 확인 = 3.1 인증 통과.
echo  브라우저 http://127.0.0.1:14873/ 에서 tokens·web 1.0.0 확인.
echo ===========================================
pause
exit /b 0

:fail
echo.
echo *** 실패. 점검: ***
echo  - stage3-2b-로그인.bat 을 먼저 돌려 OK 떴는지
echo  - 3-1 인증 창고 창이 켜져 있는지
echo  - 'ENEEDAUTH' 면: stage3-2b 재실행 (토큰 재발급)
echo.
pause
exit /b 1
