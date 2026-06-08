@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
echo ===========================================
echo  3. 빌드 + 창고에 올리기 (publish)
echo  (2번 창고 창이 켜져 있어야 함!)
echo ===========================================
echo.

echo [1/4] 루트 .npmrc 작성 (창고 주소 지정)...
>  .npmrc echo auto-install-peers=true
>> .npmrc echo strict-peer-dependencies=false
>> .npmrc echo @wonik:registry=http://127.0.0.1:14873/
>> .npmrc echo //127.0.0.1:14873/:_authToken=rehearsal-token
echo      완료.
echo.

echo [2/4] 의존성 설치 (pnpm install) - 몇 분 걸릴 수 있음...
call pnpm install || goto :fail
echo.

echo [3/4] 빌드 (tokens + web)...
call pnpm -F @wonik/tokens build || goto :fail
call pnpm -F @wonik/web build || goto :fail
echo.

echo [4/4] 창고에 올리기...
set WONIK_REGISTRY_OK=1
call pnpm -F @wonik/tokens publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
call pnpm -F @wonik/web publish --no-git-checks --registry http://127.0.0.1:14873/ || goto :fail
echo.
echo ===========================================
echo  성공! tokens@1.0.0 + web@1.0.0 창고에 올라감.
echo  브라우저에서 http://127.0.0.1:14873/ 확인 가능.
echo  다음: 4-소비자테스트.bat 더블클릭
echo ===========================================
echo.
pause
exit /b 0

:fail
echo.
echo *** 실패. 위 로그의 에러 메시지를 확인하세요. ***
echo  - ENEEDAUTH / 인증 에러면: 명령창에서
echo       npm adduser --registry http://127.0.0.1:14873/
echo     아무 id/pw/email 입력 후 이 .bat 다시 실행.
echo  - ECONNREFUSED 면: 2-창고띄우기.bat 창이 켜져 있는지 확인.
echo.
pause
exit /b 1
