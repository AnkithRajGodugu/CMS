# 🧪 CMS Application Testing Guide

## 📊 **Current System Status**

### ✅ **Backend Status (Port 8082)**
- **Server**: 🔄 Starting (with circular reference issue)
- **Database**: ✅ PostgreSQL connected (cms_db)
- **Security**: ✅ JWT authentication configured
- **JPA/Hibernate**: ⚠️ Entity circular reference issue
- **CORS**: ✅ Configured for frontend integration

### ⚠️ **Current Issues**
- **StackOverflowError**: Circular reference in entity relationships
- **Kafka**: ⚠️ Not running (optional for basic functionality)
- **Frontend**: 🔄 Needs testing after backend fix

---

## 🔗 **API Endpoints for Testing**

### **Authentication Endpoints**
```
POST http://localhost:8081/api/auth/login
POST http://localhost:8081/api/auth/register
```

### **Customer Management (Protected)**
```
GET    http://localhost:8081/api/customers
POST   http://localhost:8081/api/customers
PUT    http://localhost:8081/api/customers/{id}
DELETE http://localhost:8081/api/customers/{id}
```

### **User Management (Admin Only)**
```
GET    http://localhost:8081/api/users
POST   http://localhost:8081/api/users
PUT    http://localhost:8081/api/users/{id}
DELETE http://localhost:8081/api/users/{id}
```

### **Sector Management**
```
GET    http://localhost:8081/api/sectors
POST   http://localhost:8081/api/sectors
```

---

## 🧪 **Postman Testing Steps**

### **Step 1: Test User Registration**
```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "role": "USER",
  "sector": "BANKING"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully"
}
```

### **Step 2: Test User Login**
```http
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "username": "testuser",
  "role": "USER",
  "sector": "BANKING"
}
```

### **Step 3: Test Protected Endpoint**
```http
GET http://localhost:8081/api/customers
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### **Step 4: Test Customer Creation**
```http
POST http://localhost:8081/api/customers
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "sectorId": 1
}
```

---

## 🗄️ **Database Verification**

### **Check if users are created in database:**
```sql
-- Connect to PostgreSQL
psql -h localhost -p 5432 -U postgres -d cms_db

-- Check users table
SELECT * FROM users;

-- Check customers table
SELECT * FROM customers;

-- Check sectors table
SELECT * FROM sectors;
```

---

## 🌐 **Frontend Testing**

### **Start Frontend (Port 5173)**
```bash
cd frontend
npm install
npm run dev
```

### **Test Frontend Features:**
1. **Landing Page**: http://localhost:5173/
2. **Login Page**: http://localhost:5173/login
3. **Test Credentials**: http://localhost:5173/test-credentials
4. **Protected Routes**: Should redirect to login if not authenticated

---

## 🔧 **Pre-configured Test Users**

The application should have these users pre-loaded:

### **Admin User**
- **Username**: `admin`
- **Password**: `password123`
- **Role**: `ADMIN`
- **Sector**: `BANKING`

### **Manager Users**
- **Username**: `banking_manager`
- **Password**: `password123`
- **Role**: `MANAGER`
- **Sector**: `BANKING`

### **Regular Users**
- **Username**: `banking_user`
- **Password**: `password123`
- **Role**: `USER`
- **Sector**: `BANKING`

---

## 🚨 **Troubleshooting**

### **If Backend Won't Start:**
1. Check if PostgreSQL is running
2. Verify database `cms_db` exists
3. Check port 8081 is available

### **If Database Connection Fails:**
```bash
# Check PostgreSQL status
pg_ctl status

# Create database if missing
createdb -U postgres cms_db
```

### **If Frontend Can't Connect:**
1. Verify backend is running on port 8081
2. Check CORS configuration
3. Verify API base URL in frontend

### **If Authentication Fails:**
1. Check JWT secret configuration
2. Verify user exists in database
3. Check password hashing

---

## 📝 **Expected Test Results**

### ✅ **Successful Tests Should Show:**
1. **User Registration**: New user appears in database
2. **User Login**: JWT token returned
3. **Protected Routes**: Accessible with valid token
4. **CRUD Operations**: Data persisted in database
5. **Role-based Access**: Admin-only routes restricted
6. **Frontend Integration**: Login redirects to dashboard

### ❌ **Common Issues:**
1. **401 Unauthorized**: Invalid/expired JWT token
2. **403 Forbidden**: Insufficient role permissions
3. **404 Not Found**: Endpoint doesn't exist
4. **500 Internal Error**: Database/server issue

---

## 🎯 **Next Steps After Testing**

1. **Fix Kafka Integration** (optional)
2. **Add More Test Data**
3. **Implement Additional Features**
4. **Deploy to Production Environment**
5. **Add Monitoring and Logging**