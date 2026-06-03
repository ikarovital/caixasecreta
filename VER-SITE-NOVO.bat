@echo off
chcp 65001 >nul
cd /d "%~dp0frontend"
if not exist node_modules call npm install
echo Abrindo http://localhost:5173/
start "" "http://localhost:5173/"
npm run dev -- --host
pause
