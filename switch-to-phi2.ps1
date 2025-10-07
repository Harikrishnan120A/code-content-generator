# Run this to switch to Phi-2 and download (3 minutes)
Write-Host "`n🚀 Switching to Phi-2 (Faster Model)..." -ForegroundColor Cyan
Write-Host "This will take approximately 3 minutes.`n" -ForegroundColor Yellow

# Stop containers
Write-Host "1. Stopping containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.cpu.yml down

# Update .env
Write-Host "2. Updating .env file..." -ForegroundColor Yellow
(Get-Content .env) -replace 'HF_MODEL=codellama/CodeLlama-7b-Instruct-hf', 'HF_MODEL=microsoft/phi-2' | Set-Content .env

# Start containers
Write-Host "3. Starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.cpu.yml up -d

# Wait for startup
Write-Host "4. Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Download model
Write-Host "5. Downloading Phi-2 model..." -ForegroundColor Yellow
docker exec -it code-gen-backend python -c "from services.hf_pipeline import get_pipeline; print('⏳ Downloading Phi-2 (2.7GB)...'); print(''); p = get_pipeline(); print(''); print('✅ SUCCESS! Phi-2 is ready!'); print(''); print('🎯 Now open http://localhost:3000 and try generating!'); print('')"

Write-Host "`n✅ Phi-2 setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000" -ForegroundColor White
Write-Host "2. Click 'Paste Text' button" -ForegroundColor White
Write-Host "3. Paste a coding problem" -ForegroundColor White
Write-Host "4. Click 'Generate Explanation'" -ForegroundColor White
Write-Host "5. Wait ~15 seconds for AI analysis!`n" -ForegroundColor White
