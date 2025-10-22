#!/usr/bin/env pwsh
# CMS Platform - Rebuild and Start Script

Write-Host "🚀 CMS Platform - Rebuild and Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop existing containers
Write-Host "📦 Step 1: Stopping existing containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "✅ Containers stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Rebuild containers with latest code
Write-Host "🔨 Step 2: Building containers with latest code..." -ForegroundColor Yellow
Write-Host "   This may take 3-5 minutes..." -ForegroundColor Gray
docker-compose up --build -d
Write-Host "✅ Containers built and started" -ForegroundColor Green
Write-Host ""

# Step 3: Wait for backend to be ready
Write-Host "⏳ Step 3: Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 4: Check backend health
Write-Host "🏥 Step 4: Checking backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
    Write-Host "✅ Backend is UP: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend health check failed, but it may still be starting..." -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Check database
Write-Host "🗄️  Step 5: Checking database tables..." -ForegroundColor Yellow
$tables = docker exec cms-postgres psql -U postgres -d cms_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
Write-Host "   Found $($tables.Trim()) tables in database" -ForegroundColor Gray

$userCount = docker exec cms-postgres psql -U postgres -d cms_db -t -c "SELECT COUNT(*) FROM users;"
Write-Host "   Found $($userCount.Trim()) users in database" -ForegroundColor Gray
Write-Host ""

# Step 6: Display test credentials
Write-Host "🔑 Step 6: Test Credentials" -ForegroundColor Yellow
Write-Host "   Admin User:      admin / admin123" -ForegroundColor Cyan
Write-Host "   Banking User:    bank_user / bank123" -ForegroundColor Cyan
Write-Host "   Healthcare User: health_user / health123" -ForegroundColor Cyan
Write-Host "   Logistics User:  logistics_user / logistics123" -ForegroundColor Cyan
Write-Host "   Content User:    content_user / content123" -ForegroundColor Cyan
Write-Host ""

# Step 7: Display URLs
Write-Host "🌐 Step 7: Application URLs" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "   Kafka UI:  http://localhost:8081" -ForegroundColor Cyan
Write-Host "   pgAdmin:   http://localhost:5050" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ Setup Complete! Open http://localhost:8080 in your browser" -ForegroundColor Green
Write-Host ""
