# Test Backend API
Write-Host "Testing Backend API on port 8081..." -ForegroundColor Green

# Test 1: Check if backend is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"bank_user","password":"bank123"}' -ErrorAction Stop
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check if we can reach any endpoint
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Health endpoint accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Health endpoint not available (normal for this setup)" -ForegroundColor Yellow
}

Write-Host "`nIf you see errors above, the backend needs to be restarted." -ForegroundColor Cyan