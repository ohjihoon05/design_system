@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  ATLAS - 단일-HTML 빌드 + 열기 (컨시어지 c 납품물)
echo ============================================================
echo.

echo [1/2] ATLAS 빌드 ^(pnpm -F atlas build^)...
call pnpm -F atlas build
if errorlevel 1 (
  echo.
  echo [실패] 빌드 실패. 위 로그를 확인하세요.
  pause
  exit /b 1
)

echo.
echo [2/2] 산출물 열기...
start "" "apps\atlas\dist\index.html"

echo.
echo ============================================================
echo  완료 — apps\atlas\dist\index.html 를 브라우저로 열었습니다.
echo  이 파일 하나를 그대로 전달하면 동료 PC에서 더블클릭으로 열립니다
echo  (서버·설치·IT 불요. 오프라인 동작).
echo ============================================================
echo.
pause
