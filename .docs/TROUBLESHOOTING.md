# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: Backend Won't Start

**Symptoms:**
- Container exits immediately
- "Connection refused" errors
- Port already in use

**Solutions:**

```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process using port 8080
taskkill /PID <PID> /F

# Check backend logs
docker logs cms-backend --tail 50

# Restart containers
docker-compose restart backend
```

### Issue 2: Database Connection Failed

**Symptoms:**
- "Connection to localhost:5432 refused"
- "database cms_db does not exist"

**Solutions:**

```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Check database exists
docker exec cms-postgres psql -U postgres -l

# Create database if missing
docker exec cms-postgres psql -U postgres -c "CREATE DATABASE cms_db;"

# Restart PostgreSQL
docker-compose restart postgres
```

### Issue 3: Login Returns "Invalid Credentials"

**Symptoms:**
- Login fails with correct credentials
- Users table is empty

**Solutions:**

```powershell
# Check if users exist
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT * FROM users;"

# If empty, restart backend to trigger DataInitializer
docker-compose restart backend

# Wait 15 seconds, then check again
Start-Sleep -Seconds 15
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT username, role FROM users;"
```

### Issue 4: Frontend Shows Blank Page

**Symptoms:**
- White screen
- Console errors about modules
- 404 errors

**Solutions:**

```powershell
# Check if backend is serving frontend
curl http://localhost:8080

# Rebuild containers
docker-compose down
docker-compose up --build -d

# Or run frontend separately
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### Issue 5: Kafka Warnings Flooding Logs

**Symptoms:**
- Continuous "Connection to node 1 could not be established" warnings
- Logs filled with Kafka errors

**Solutions:**

This is **non-critical** - Kafka is optional. To disable:

```properties
# backend/src/main/resources/application.properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration
```

Or start Kafka:
```powershell
docker-compose up kafka zookeeper -d
```

### Issue 6: Docker Build Fails

**Symptoms:**
- "npm install failed"
- "mvn package failed"
- Out of disk space

**Solutions:**

```powershell
# Clean Docker system
docker system prune -a --volumes

# Remove old images
docker rmi $(docker images -q cms*)

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Issue 7: JWT Token Expired

**Symptoms:**
- 401 Unauthorized after some time
- "Token expired" message

**Solutions:**

```powershell
# Login again to get new token
$body = @{username='admin';password='admin123'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
$token = $response.token
```

Token expires after 24 hours by default.

### Issue 8: CORS Errors in Browser

**Symptoms:**
- "Access-Control-Allow-Origin" errors
- API calls blocked by browser

**Solutions:**

Backend CORS is already configured for `localhost:*`. If still having issues:

1. Check backend logs for CORS errors
2. Verify frontend is using correct API URL
3. Clear browser cache
4. Try different browser

### Issue 9: Database Tables Not Created

**Symptoms:**
- "relation does not exist" errors
- Empty database

**Solutions:**

```powershell
# Check Hibernate DDL setting
docker exec cms-backend cat /app/application.properties | findstr ddl-auto

# Should be: spring.jpa.hibernate.ddl-auto=update

# Force table creation
docker-compose down -v
docker-compose up -d
```

### Issue 10: Performance Issues

**Symptoms:**
- Slow API responses
- High CPU usage
- Memory errors

**Solutions:**

```powershell
# Check container resources
docker stats

# Increase Docker memory limit (Docker Desktop)
# Settings → Resources → Memory → 4GB+

# Check database connections
docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT count(*) FROM pg_stat_activity;"

# Restart containers
docker-compose restart
```

## Diagnostic Commands

```powershell
# Full system check
docker ps
docker-compose logs --tail=50
docker exec cms-postgres psql -U postgres -d cms_db -c "\dt"
curl http://localhost:8080/api/health

# Check all ports
netstat -ano | findstr "8080 5432 9092"

# Check disk space
docker system df

# Check container health
docker inspect cms-backend | findstr Health
```

## Getting Help

If issues persist:

1. Run: `.\test-system.ps1`
2. Collect logs: `docker-compose logs > logs.txt`
3. Check database: `docker exec cms-postgres psql -U postgres -d cms_db -c "SELECT * FROM users;"`
4. Share error messages and logs
