@echo off
echo ========================================
echo   Code Content Generator - GPU Mode
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

echo Checking GPU support...
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: GPU not available!
    echo.
    echo Either:
    echo 1. Set up NVIDIA GPU support (see QUICKSTART.md)
    echo 2. Use CPU mode instead: run-cpu.bat
    echo.
    pause
    exit /b 1
)

echo Starting application in GPU mode...
echo This may take 2-3 minutes on first run (model download)
echo.
echo Once started, open: http://localhost:3000
echo.

docker-compose up --build

pause
