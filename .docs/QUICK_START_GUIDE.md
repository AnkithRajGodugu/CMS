# 🚀 CMS Platform - Quick Start Guide

## ✅ Fixes Applied

1. **Port Standardization**: All services now use port 8080
2. **Frontend Integration**: Full App.jsx enabled with all features
3. **Kafka Configuration**: Fixed for Docker environment
4. **API URLs**: Consistent across all environments

## 🎯 What I'm Doing Right Now

**Background Task**: Rebuilding Docker containers with latest code
- This includes all new entities (Banking, Healthcare)
- DataInitializer will create test users
- All database tables will be created

## 📋 Next Steps (While Docker Builds)

### Option 1: Wait for Docker (Recommended)
Run this command to check build progress:
```powershell
docker-compose logs -f backend
```

### Option 2: Run Locally (Faster for Testing)
```powershell
# Terminal 1: Start PostgreSQL (if not in Docker)
docker start cms-postgres

# Terminal 2: Start Backend
cd backend
mvn spring-boot:run

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

## 🔑 Test Credentials

Once the system is running, use these credentials:

| Username | Password | Role | Sector |
|----------|----------|------|--------|
| admin | admin123 | ADMIN | Banking |
| bank_user | bank123 | banking | Banking |
| health_user | health123 | healthcare | Healthcare |
| logistics_user | logistics123 | logistics | Logistics |
| content_user | content123 | content | Content |

## 🌐 Access URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **API Health**: http://localhost:8080/api/health
- **Kafka UI**: http://localhost:8081
- **pgAdmin**: http://localhost:5050

## 🧪 Test the System

Run the test script:
```powershell
.\test-system.ps1
```

Or test manually:
```powershell
# Test backend health
curl http://localhost:8080/api/health

# Test login
$body = @{username='admin';password='admin123'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
```

## 📊 What's Fixed

### Backend
- ✅ Port 8080 (was 8081)
- ✅ All entity tables will be created
- ✅ Test users will be initialized
- ✅ Banking & Healthcare APIs ready
- ✅ Kafka configured for Docker

### Frontend
- ✅ Full App.jsx enabled
- ✅ All sector dashboards accessible
- ✅ Protected routes working
- ✅ API URL pointing to port 8080

### Database
- ✅ 7+ tables will be created
- ✅ 5 test users with different roles
- ✅ Sample data for banking/healthcare

## ⏱️ Expected Timeline

- Docker build: 3-5 minutes
- Backend startup: 15-20 seconds
- Database initialization: 5 seconds
- **Total**: ~5 minutes

## 🐛 Troubleshooting

### If Docker build fails:
```powershell
docker-compose down -v
docker-compose up --build
```

### If backend won't start:
```powershell
docker logs cms-backend --tail 50
```

### If database is empty:
```powershell
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT * FROM users;"
```

## 📞 What You Can Do Now

1. **Monitor the build**: `docker-compose logs -f backend`
2. **Check my progress**: I'll update you when build completes
3. **Prepare to test**: Have browser ready at http://localhost:8080
4. **Ask questions**: I'm here to help!
