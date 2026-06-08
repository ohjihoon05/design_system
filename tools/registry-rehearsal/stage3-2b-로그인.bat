@echo off
chcp 65001 >nul
echo ===========================================
echo  Stage 3 로그인 - 창고에 계정 만들고 토큰 저장
echo  (3-1 인증 창고가 켜져 있어야 함)
echo ===========================================
echo.
echo deployer 계정 생성 + 출입증(token)을 ~/.npmrc 에 저장 중...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stage3-login.ps1"
echo.
echo ===========================================
echo  위에 OK 면  -> stage3-3-로그인후-올리기.bat 더블클릭
echo  FAIL 이면   -> 3-1 인증 창고 창 켜졌는지 확인 후 이 .bat 재실행
echo ===========================================
echo.
pause
