@echo off
rem WONIK DS sandbox launcher - for non-developer testers (double-click to start)
cd /d "%~dp0"
if not exist "..\..\node_modules\" (
  echo First run: downloading packages, please wait a few minutes...
  pushd ..\..
  call pnpm install
  popd
)
if not exist "..\..\packages\web\dist\index.mjs" (
  echo First run: building design system packages, please wait 1-2 minutes...
  pushd ..\..
  call pnpm build
  popd
)
start "" cmd /c "timeout /t 5 >nul & start http://localhost:5174/"
pnpm dev
