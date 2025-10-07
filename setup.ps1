# Setup script for Windows - Validates prerequisites and sets up environment

Write-Host "🔥 Code Content Generator - Setup Script" -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red
Write-Host ""

$allChecksPassed = $true

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    Write-Host "   Download: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    $allChecksPassed = $false
}

Write-Host ""

# Check Docker Compose
Write-Host "Checking Docker Compose..." -ForegroundColor Cyan
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose not found. Install Docker Desktop includes Compose." -ForegroundColor Red
    $allChecksPassed = $false
}

Write-Host ""

# Check NVIDIA GPU
Write-Host "Checking NVIDIA GPU..." -ForegroundColor Cyan
try {
    $nvidiaSmi = nvidia-smi
    Write-Host "✅ NVIDIA GPU detected" -ForegroundColor Green
    
    # Show GPU info
    $gpuInfo = nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
    Write-Host "   GPU: $gpuInfo" -ForegroundColor Gray
} catch {
    Write-Host "❌ NVIDIA GPU not detected or drivers not installed." -ForegroundColor Red
    Write-Host "   Install NVIDIA drivers: https://www.nvidia.com/Download/index.aspx" -ForegroundColor Yellow
    $allChecksPassed = $false
}

Write-Host ""

# Check NVIDIA Docker support
Write-Host "Checking NVIDIA Container Toolkit..." -ForegroundColor Cyan
try {
    $result = docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ NVIDIA Container Toolkit working" -ForegroundColor Green
    } else {
        throw "GPU not accessible in Docker"
    }
} catch {
    Write-Host "❌ NVIDIA Container Toolkit not configured." -ForegroundColor Red
    Write-Host "   Install: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html" -ForegroundColor Yellow
    $allChecksPassed = $false
}

Write-Host ""

# Check .env file
Write-Host "Checking environment configuration..." -ForegroundColor Cyan
if (Test-Path .env) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check if HF_TOKEN is set
    $envContent = Get-Content .env -Raw
    if ($envContent -match 'HF_TOKEN=hf_\w+') {
        Write-Host "✅ HuggingFace token configured" -ForegroundColor Green
    } elseif ($envContent -match 'HF_TOKEN=your_huggingface_token_here') {
        Write-Host "⚠️  Please update HF_TOKEN in .env file" -ForegroundColor Yellow
        Write-Host "   Get token from: https://huggingface.co/settings/tokens" -ForegroundColor Yellow
        $allChecksPassed = $false
    } else {
        Write-Host "⚠️  HF_TOKEN not found in .env file" -ForegroundColor Yellow
        $allChecksPassed = $false
    }
} else {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env and add your HuggingFace token" -ForegroundColor Yellow
        $allChecksPassed = $false
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        $allChecksPassed = $false
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Red

if ($allChecksPassed) {
    Write-Host ""
    Write-Host "✅ All checks passed! Ready to launch." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: docker-compose up --build" -ForegroundColor White
    Write-Host "  2. Wait for containers to start (~5-10 minutes first time)" -ForegroundColor White
    Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    
    # Offer to start automatically
    $response = Read-Host "Start the application now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host ""
        Write-Host "🚀 Starting application..." -ForegroundColor Green
        docker-compose up --build
    }
} else {
    Write-Host ""
    Write-Host "❌ Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Cyan
    Write-Host "  - Install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor White
    Write-Host "  - Install NVIDIA Drivers: https://www.nvidia.com/Download/index.aspx" -ForegroundColor White
    Write-Host "  - Install NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/" -ForegroundColor White
    Write-Host "  - Get HuggingFace token: https://huggingface.co/settings/tokens" -ForegroundColor White
    Write-Host ""
    exit 1
}
