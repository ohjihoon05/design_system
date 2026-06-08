@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===========================================
echo  2. 창고(Verdaccio) 띄우기
echo ===========================================
echo  이 창은 닫지 마세요. 창고가 여기서 돌아갑니다.
echo  주소: http://127.0.0.1:14873/  (브라우저로 열어볼 수 있음)
echo.
echo  창고가 뜨면, 새 창에서 3-빌드_올리기.bat 를 더블클릭하세요.
echo  (그냥 14873 아니라 0.0.0.0:14873 로 띄움 - IPv6-only 함정 회피)
echo ===========================================
echo.
npx --yes verdaccio@6 --config "%~dp0verdaccio-config.yaml" --listen 0.0.0.0:14873
echo.
echo (창고가 종료되었습니다. 다시 띄우려면 이 .bat 재실행.)
pause
