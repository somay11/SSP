@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo    Starting Smart Study Planner
echo ==========================================

:: Check if node_modules exist
if not exist "frontend\node_modules\" (
    echo [ERROR] Frontend dependencies missing.
    echo Please run 'run_server.bat' first to install them.
    pause
    exit /b
)

if not exist "backend\node_modules\" (
    echo [ERROR] Backend dependencies missing.
    echo Please run 'run_server.bat' first to install them.
    pause
    exit /b
)

:: Cleanup existing processes on ports 5173 and 5000 to prevent conflicts
echo Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

:: Start Backend
echo [1/3] Starting backend server...
start "Smart Study Planner - Backend" cmd /k "npm run backend"


:: Start Frontend
echo [2/3] Starting frontend server...
start "Smart Study Planner - Frontend" cmd /k "npm run frontend"

:: Wait for servers to initialize
echo [3/3] Waiting for servers to start (5s)...
timeout /t 5 /nobreak > NUL

:: Open browser
echo Launching application in browser...
start http://localhost:5173

echo.
echo Servers are running in separate windows.
echo If the browser didn't open, visit http://localhost:5173
echo.
pause
