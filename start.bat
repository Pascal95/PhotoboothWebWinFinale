@echo off
title Photobooth Windows

echo ========================================
echo  Demarrage du Photobooth Windows
echo ========================================
echo.

:: Backend
echo [1/2] Demarrage de l'API backend...
start "Photobooth API" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Attendre que le backend soit pret
timeout /t 3 /nobreak >nul

:: Frontend
echo [2/2] Demarrage de l'interface frontend...
start "Photobooth Front" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  Backend  : http://localhost:8000
echo  Frontend : http://localhost:5173
echo  Docs API : http://localhost:8000/docs
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul
start http://localhost:5173
