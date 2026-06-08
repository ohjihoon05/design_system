@echo off
chcp 65001 >nul
echo ===========================================
echo  1. 환경 점검  (Node / git / pnpm 확인)
echo ===========================================
echo.
echo --- Node.js (18 이상 필요) ---
node -v 2>nul || echo   [X] Node 없음 -^> https://nodejs.org 에서 LTS 설치
echo.
echo --- git ---
git --version 2>nul || echo   [X] git 없음 -^> https://git-scm.com 에서 설치
echo.
echo --- pnpm (10.x 필요) ---
pnpm -v 2>nul || echo   [X] pnpm 없음 -^> 명령창에 corepack enable 한 번 실행
echo.
echo -------------------------------------------
echo  위 셋 다 버전 숫자가 보이면 통과.
echo  다음: 2-창고띄우기.bat 더블클릭
echo -------------------------------------------
echo.
pause
