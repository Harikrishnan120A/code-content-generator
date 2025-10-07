# Test backend locally before Docker
Write-Host "Testing Backend Configuration..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

# Check if HF_TOKEN is set
$envContent = Get-Content .env -Raw
if ($envContent -match "your_huggingface_token_here") {
    Write-Host "ERROR: Please update HF_TOKEN in .env file!" -ForegroundColor Red
    Write-Host "Get token from: https://huggingface.co/settings/tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "Success: .env file configured" -ForegroundColor Green

# Check Docker
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "Success: Docker is installed - $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Docker not found!" -ForegroundColor Red
    exit 1
}

# Check if Docker daemon is running
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success: Docker daemon is running" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Docker daemon is not running!" -ForegroundColor Red
        Write-Host "Please start Docker Desktop" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "ERROR: Cannot connect to Docker!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All checks passed! Ready to run." -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  CPU Mode: docker-compose -f docker-compose.cpu.yml up --build" -ForegroundColor White
Write-Host "  GPU Mode: docker-compose up --build" -ForegroundColor White
