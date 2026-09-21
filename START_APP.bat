@echo off
title SkillProof Full-Stack App
cd /d "%~dp0"

echo ==========================================================
echo       SkillProof - Full-Stack Application Launcher
echo ==========================================================
echo.
echo Checking ports and starting services...
echo.

:: Clean up stale instances if any
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

echo [1/3] Backend API server (Port 3001)
echo [2/3] Frontend Vite server (Port 5173)
echo [3/3] Cloudflare Tunnel Supervisor (Port 5173)
echo.
echo Opening local browser at http://localhost:5173 ...
start http://localhost:5173

npm run dev:tunnel
pause
