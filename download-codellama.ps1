# Run this to download CodeLlama-7b model (15 minutes)
Write-Host "`n🚀 Starting CodeLlama-7b Download..." -ForegroundColor Cyan
Write-Host "This will take approximately 15 minutes." -ForegroundColor Yellow
Write-Host "Please be patient and don't close this window!`n" -ForegroundColor Yellow

docker exec -it code-gen-backend python -c "from services.hf_pipeline import get_pipeline; print('⏳ Downloading CodeLlama-7b (13GB)...'); print(''); p = get_pipeline(); print(''); print('✅ SUCCESS! Model is ready!'); print(''); print('🎯 Now open http://localhost:3000 and try generating!'); print('')"

Write-Host "`n✅ Download complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000" -ForegroundColor White
Write-Host "2. Click 'Paste Text' button" -ForegroundColor White
Write-Host "3. Paste a coding problem" -ForegroundColor White
Write-Host "4. Click 'Generate Explanation'" -ForegroundColor White
Write-Host "5. Wait ~60 seconds for AI analysis!`n" -ForegroundColor White
