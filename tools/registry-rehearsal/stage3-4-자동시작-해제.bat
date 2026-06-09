@echo off
chcp 65001 >nul
echo ===========================================
echo  Stage 3-4 undo: remove the WonikVerdaccio auto-start task
echo ===========================================
echo.
schtasks /end /tn "WonikVerdaccio" 2>nul
schtasks /delete /tn "WonikVerdaccio" /f
echo.
echo  Done. Auto-start removed. The manual stage3-1 .bat still works as before.
echo  (verdaccio-storage and ~/.npmrc token are untouched.)
echo ===========================================
pause
