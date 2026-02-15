# 🧪 API Testing Guide

## Quick Test Commands

### 1. Health Check
```powershell
curl http://localhost:8080/api/health
```

Expected Response:
```json
{
  "service": "CMS Backend",
  "status": "UP",
  "kafka": "DOWN - Send failed"
}
```

### 2. Login Test
```powershell
$body = @{username='admin';password='admin123'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
```

Expected Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "sector": {
      "id": 1,
      "name": "Banking"
    }
  }
}
```

### 3. Get Customers (Protected)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-RestMethod -Uri 'http://localhost:8080/api/customers' -Method Get -Headers @{Authorization="Bearer $token"}
```

### 4. Banking API Test
```powershell
# Get bank accounts
Invoke-RestMethod -Uri 'http://localhost:8080/api/banking/accounts' -Method Get -Headers @{Authorization="Bearer $token"}

# Get transactions
Invoke-RestMethod -Uri 'http://localhost:8080/api/banking/transactions' -Method Get -Headers @{Authorization="Bearer $token"}
```

### 5. Healthcare API Test
```powershell
# Get patients
Invoke-RestMethod -Uri 'http://localhost:8080/api/healthcare/patients' -Method Get -Headers @{Authorization="Bearer $token"}

# Get appointments
Invoke-RestMethod -Uri 'http://localhost:8080/api/healthcare/appointments' -Method Get -Headers @{Authorization="Bearer $token"}
```

## Complete Test Flow

```powershell
# Step 1: Login
$loginBody = @{username='admin';password='admin123'} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginResponse.token

Write-Host "✅ Logged in as: $($loginResponse.user.username)"
Write-Host "   Role: $($loginResponse.user.role)"
Write-Host "   Token: $($token.Substring(0,20))..."

# Step 2: Get Customers
$headers = @{Authorization="Bearer $token"}
$customers = Invoke-RestMethod -Uri 'http://localhost:8080/api/customers' -Method Get -Headers $headers
Write-Host "✅ Found $($customers.Count) customers"

# Step 3: Get Bank Accounts
$accounts = Invoke-RestMethod -Uri 'http://localhost:8080/api/banking/accounts' -Method Get -Headers $headers
Write-Host "✅ Found $($accounts.Count) bank accounts"

# Step 4: Get Patients
$patients = Invoke-RestMethod -Uri 'http://localhost:8080/api/healthcare/patients' -Method Get -Headers $headers
Write-Host "✅ Found $($patients.Count) patients"
```

## Database Queries

```powershell
# Check users
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT username, role FROM users;"

# Check sectors
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT * FROM sectors;"

# Check bank accounts
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT account_number, customer_name, balance FROM bank_accounts;"

# Check patients
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT patient_id, first_name, last_name, condition FROM patients;"
```

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "CMS Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"admin123\"}"
            },
            "url": "http://localhost:8080/api/auth/login"
          }
        }
      ]
    },
    {
      "name": "Banking",
      "item": [
        {
          "name": "Get Accounts",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "http://localhost:8080/api/banking/accounts"
          }
        }
      ]
    }
  ]
}
```
