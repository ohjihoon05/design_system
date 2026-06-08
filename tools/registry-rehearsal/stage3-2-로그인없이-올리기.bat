@echo off
chcp 65001 >nul
cd /d "%~dp0..\.."
echo ===========================================
echo  Stage 3-2. 로그인 없이 올리기 (이게 *막혀야* 정상)
echo  (3-1 인증 창고가 켜져 있어야 함)
echo ===========================================
echo.
echo 로그인 정보 없는 .npmrc 작성 (토큰 X = 익명)...
>  .npmrc echo auto-install-peers=true
>> .npmrc echo strict-peer-dependencies=false
>> .npmrc echo @wonik:registry=http://127.0.0.1:14873/
echo.
echo 빌드(pack용 dist 확보)...
call pnpm -F @wonik/tokens build
echo.
echo 익명으로 publish 시도...
call pnpm -F @wonik/tokens publish --no-git-checks --ignore-scripts --registry http://127.0.0.1:14873/
echo.
echo ===========================================
echo  판정:
echo   위에서 'ENEEDAUTH' / 'authorization required' / 401 / 403 으로
echo   *실패*했으면  =>  인증 정상! 익명 차단 OK (3-2 통과)
echo   *성공*해서 올라갔으면  =>  인증 안 걸림 (config 확인 필요)
echo.
echo  다음: 명령창에서
echo    npm adduser --registry http://127.0.0.1:14873/ --auth-type=legacy
echo    (아무 id / pw / email 입력 = 로그인 토큰 발급)
echo  그 후 stage3-3-로그인후-올리기.bat 더블클릭
echo ===========================================
pause
