@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  WONIK 디자인 시스템 - 컴포넌트 샌드박스
echo  ----------------------------------------
echo  잠시 후 브라우저가 자동으로 열립니다.
echo  오른쪽 위 달/해 버튼으로 light/dark 테마를 전환할 수 있습니다.
echo  종료하려면 이 검은 창을 닫으세요.
echo.
call pnpm -F web-sandbox dev -- --open
pause
