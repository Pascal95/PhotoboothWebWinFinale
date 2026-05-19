@echo off
title Installation Photobooth Windows

echo ========================================
echo  Installation des dependances
echo ========================================
echo.

:: Backend Python
echo [1/2] Installation des dependances Python...
cd /d %~dp0backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo.

:: Frontend Node
echo [2/2] Installation des dependances Node.js...
cd /d %~dp0frontend
call npm install
echo.

echo ========================================
echo  Installation terminee !
echo  Lancez start.bat pour demarrer.
echo ========================================
pause
