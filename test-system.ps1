#!/usr/bin/env pwsh
# CMS Platform - System Test Script

Write-Host "🧪 CMS Platform - System Test" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Backend Health
Write-Host "Test 1: Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
    if ($health.status -eq "UP") {
        Write-Host "✅ PASS: Backend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Backend status is $($health.status)" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "❌ FAIL: Cannot connect to backend" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 2: Database Connection
Write-Host "Test 2: Database Connection..." -ForegroundColor Yellow
try {
    $tableCount = docker exec cms-postgres psql -U postgres -d cms_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>$null
    if ([int]$tableCount.Trim() -ge 7) {
        Write-Host "✅ PASS: Database has $($tableCount.Trim()) tables" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: Expected 7+ tables, found $($tableCount.Trim())" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: Cannot connect to database" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 3: Test Users Exist
Write-Host "Test 3: Test Users Initialization..." -ForegroundColor Yellow
try {
    $userCount = docker exec cms-postgres psql -U postgres -d cms_db -t -c "SELECT COUNT(*) FROM users;" 2>$null
    if ([int]$userCount.Trim() -ge 5) {
        Write-Host "✅ PASS: Found $($userCount.Trim()) test users" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Expected 5+ users, found $($userCount.Trim())" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "❌ FAIL: Cannot query users table" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 4: Login Test
Write-Host "Test 4: Authentication Test..." -ForegroundColor Yellow
try {
    $body = @{username='admin';password='admin123'} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
    if ($response.success -and $response.token) {
        Write-Host "✅ PASS: Login successful, JWT token received" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Login failed" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "❌ FAIL: Login request failed - $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "✨ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "   System is ready to use" -ForegroundColor Green
} else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "   Check the errors above" -ForegroundColor Yellow
}
Write-Host ""
