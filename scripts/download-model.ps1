# Download HuggingFace model to cache
# PowerShell script for Windows

Write-Host "🔥 Code Content Generator - Model Download Script" -ForegroundColor Red
Write-Host "==================================================" -ForegroundColor Red
Write-Host ""

# Check if HF_TOKEN is set
if (-not $env:HF_TOKEN) {
    Write-Host "⚠️  Warning: HF_TOKEN not set. You may need authentication for some models." -ForegroundColor Yellow
    Write-Host "   Set it with: `$env:HF_TOKEN='your_token_here'" -ForegroundColor Yellow
    Write-Host ""
}

# Model to download
$MODEL = if ($env:HF_MODEL) { $env:HF_MODEL } else { "deepseek-ai/deepseek-coder-6.7b-instruct-awq" }

Write-Host "📦 Downloading model: $MODEL" -ForegroundColor Cyan
Write-Host "   This may take several minutes (~3-4GB)..." -ForegroundColor Cyan
Write-Host ""

# Download using Python
$pythonScript = @"
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

model_name = os.environ.get('HF_MODEL', 'deepseek-ai/deepseek-coder-6.7b-instruct-awq')
token = os.environ.get('HF_TOKEN')

print(f'Downloading tokenizer for {model_name}...')
tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    token=token,
    trust_remote_code=True
)

print(f'Downloading model {model_name}...')
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    token=token,
    trust_remote_code=True,
    low_cpu_mem_usage=True
)

print('✅ Model downloaded successfully!')
print(f'   Cached at: ~/.cache/huggingface/')
"@

try {
    python -c $pythonScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Model download complete!" -ForegroundColor Green
        Write-Host "   You can now run: docker-compose up" -ForegroundColor Green
    } else {
        throw "Python script failed"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Model download failed!" -ForegroundColor Red
    Write-Host "   Please check your internet connection and HF_TOKEN" -ForegroundColor Red
    exit 1
}
