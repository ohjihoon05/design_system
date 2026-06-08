@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===========================================
echo  Stage 3-1. 인증(auth) 켠 창고 시작
echo ===========================================
echo  - 이전 창고(2-창고띄우기) 창이 켜져 있으면 그 창에서 Ctrl+C로 먼저 끄세요.
echo  - 깨끗한 검증을 위해 storage를 비웁니다 (이전 1.0.0 삭제).
echo.
pause
if exist "%~dp0verdaccio-storage" rmdir /s /q "%~dp0verdaccio-storage"
if exist "%~dp0htpasswd" del /q "%~dp0htpasswd"
echo storage / htpasswd 초기화 완료. 인증 창고 시작...
echo 주소: http://127.0.0.1:14873/   (이 창 닫지 마세요)
echo.
echo 다음: 새 창에서 stage3-2-로그인없이-올리기.bat 더블클릭
echo ===========================================
echo.
npx --yes verdaccio@6 --config "%~dp0verdaccio-config-auth.yaml" --listen 0.0.0.0:14873
echo.
echo (창고 종료됨. 다시 띄우려면 이 .bat 재실행.)
pause
