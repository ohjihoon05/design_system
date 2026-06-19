@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo  WONIK 단일-HTML 납품 스파이크 — 빌드 + 게이트 검증
echo  (R2/ADR-043 · 더블클릭 러너)
echo ============================================================
echo.

rem 1) Playwright Chromium 캐시 확인 (없으면 cryptic crash 대신 1줄 hint — Round 2 결정 A)
set "PW_CACHE=%LOCALAPPDATA%\ms-playwright"
dir /ad /b "%PW_CACHE%\chromium-*" >nul 2>&1
if errorlevel 1 (
  echo [건너뜀] Playwright Chromium 이 설치되어 있지 않습니다.
  echo          게이트는 headless Chromium 으로 file:// HTML 을 검증합니다.
  echo.
  echo   먼저 다음 한 줄을 실행하세요:
  echo       npx playwright install chromium
  echo.
  echo   ^(회사 PC 는 SSL inspection 으로 다운로드가 막힐 수 있음 — 집/빌드 PC 권장^)
  echo.
  pause
  exit /b 2
)

rem 2) 스파이크 빌드 (대표 atom → 자가포함 HTML 1개)
echo [1/2] 스파이크 빌드 ^(pnpm -F singlefile-spike build^)...
call pnpm -F singlefile-spike build
if errorlevel 1 (
  echo.
  echo [실패] 빌드 실패. 위 로그를 확인하세요.
  pause
  exit /b 1
)

rem 3) 게이트 실행 (file:// 색-붕괴 silent 실패 검출)
echo.
echo [2/2] singlefile-gate 검증...
node tools\singlefile-gate\gate.mjs apps\singlefile-spike\dist\index.html
set "GATE_EXIT=%errorlevel%"

echo.
if "%GATE_EXIT%"=="0" (
  echo ============================================================
  echo  PASS — 단일-HTML 이 file:// 에서 색·focus·dnd·modal 정상.
  echo  산출물: apps\singlefile-spike\dist\index.html
  echo          ^(이 파일 하나를 그대로 전달하면 더블클릭으로 열림^)
  echo ============================================================
) else (
  echo ============================================================
  echo  FAIL — 게이트가 결함을 잡았습니다. 위 PASS/FAIL 목록 확인.
  echo ============================================================
)
echo.
pause
exit /b %GATE_EXIT%
