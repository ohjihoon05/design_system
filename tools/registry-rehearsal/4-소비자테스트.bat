@echo off
chcp 65001 >nul
set "DEST=%USERPROFILE%\wonik-smoke-test"
echo ===========================================
echo  4. 소비자 테스트 (동료처럼 창고에서 받아쓰기)
echo  (2번 창고 창이 켜져 있어야 함!)
echo ===========================================
echo.
echo 테스트 폴더: %DEST%
echo (repo 밖으로 복사 - workspace 링크 없이 진짜 창고에서 받기 위해)
echo.

if exist "%DEST%" rmdir /s /q "%DEST%"
mkdir "%DEST%"
xcopy /e /i /y "%~dp0consumer-smoke\*" "%DEST%\" >nul
>  "%DEST%\.npmrc" echo @wonik:registry=http://127.0.0.1:14873/

cd /d "%DEST%"
echo [1/2] 창고에서 @wonik/web + @wonik/tokens 받기 (pnpm install)...
call pnpm install || goto :fail
echo.
echo [2/2] 진짜 로드/렌더되나 확인 (smoke test)...
call node smoke.mjs || goto :fail
echo.
echo ===========================================
echo  통과! 깨끗한 소비자 환경에서 @wonik/web 설치+로드 성공.
echo  = 사내 진짜 publish 준비 끝.
echo ===========================================
echo.
pause
exit /b 0

:fail
echo.
echo *** 실패. 위 에러 확인. ***
echo  - NO_MATCHING_VERSION / 404 면: 3번(올리기)이 성공했는지 확인.
echo  - @dnd-kit 관련 에러면: 인터넷 연결 확인 (공용 npm에서 받아야 함).
echo  - ECONNREFUSED 면: 2번 창고 창이 켜져 있는지 확인.
echo.
pause
exit /b 1
