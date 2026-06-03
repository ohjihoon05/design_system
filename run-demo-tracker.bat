@echo off
chcp 65001 >nul
title WONIK demo-tracker — dogfood (trial 14)
cd /d "%~dp0"
echo.
echo  ┌───────────────────────────────────────────────┐
echo  │  WONIK 이슈 트래커 — @wonik/web dogfood (trial 14)  │
echo  │  dev 서버 시작 → 브라우저가 자동으로 열립니다       │
echo  │  종료: 이 창에서 Ctrl+C                            │
echo  └───────────────────────────────────────────────┘
echo.
start "" http://localhost:5175/
call pnpm -F demo-tracker dev
