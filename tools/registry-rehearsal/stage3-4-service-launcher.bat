@echo off
rem Stage 3-4 launcher: what Task Scheduler runs in the background (no window, no pause).
rem cwd = this folder so storage (verdaccio-storage) matches the manual 3-1/3-3 runs.
cd /d "%~dp0"
npx verdaccio@6 --config verdaccio-config-auth.yaml --listen 0.0.0.0:14873 >> verdaccio-service.log 2>&1
