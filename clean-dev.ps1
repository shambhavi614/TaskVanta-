# Clean Development Environment Script
# Run this when you encounter 404 errors or build issues

Write-Host "🧹 Cleaning development environment..." -ForegroundColor Cyan

# Stop all Node.js processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Remove .next directory
if (Test-Path .next) {
    Write-Host "Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# Remove TypeScript build info
if (Test-Path tsconfig.tsbuildinfo) {
    Write-Host "Removing tsconfig.tsbuildinfo..." -ForegroundColor Yellow
    Remove-Item -Force tsconfig.tsbuildinfo
}

Write-Host "✅ Clean complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run one of these commands:" -ForegroundColor Cyan
Write-Host "  npm run dev   - Start development server" -ForegroundColor White
Write-Host "  npm run build - Build for production" -ForegroundColor White
