@echo off
rem WONIK DS catalog launcher - Storybook component catalog (double-click to start)
cd /d "%~dp0"
if not exist "..\..\packages\web\dist\index.mjs" (
  echo First run: building design system packages, please wait 1-2 minutes...
  pushd ..\..
  call pnpm build
  popd
)
pnpm dev
