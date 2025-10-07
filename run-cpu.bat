@echo off
echo ========================================
echo   Code Content Generator - CPU Mode
echo ========================================
echo.

echo Checking .env file...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file from .env.example
    echo and add your HuggingFace token.
    pause
    exit /b 1
)

findstr /C:"your_huggingface_token_here" .env >nul
if %errorlevel%==0 (
    echo ERROR: Please update .env file with your HuggingFace token!
    echo.
    echo 1. Go to: https://huggingface.co/settings/tokens
    echo 2. Create a token with READ access
    echo 3. Open .env file and replace 'your_huggingface_token_here'
    echo.
    pause
    exit /b 1
)

echo Starting application in CPU mode...
echo This may take 5-10 minutes on first run (model download)
echo.
echo Once started, open: http://localhost:3000
echo.

docker-compose -f docker-compose.cpu.yml up --build

pause
