# CMS Platform - Login Credentials

## 🚀 Application URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **Test Credentials Page**: http://localhost:8080/test-credentials
- **Kafka UI**: http://localhost:8081
- **pgAdmin**: http://localhost:5050

## 👥 Test User Accounts

All users have the password: `password123`

### 🏦 Banking & Finance Sector
- **Admin**: `banking_admin` / `password123`
- **Manager**: `banking_manager` / `password123`
- **User**: `banking_user` / `password123`

### 🏥 Healthcare Sector
- **Admin**: `healthcare_admin` / `password123`
- **Manager**: `healthcare_manager` / `password123`
- **User**: `healthcare_user` / `password123`

### 🚛 Logistics & Supply Chain Sector
- **Admin**: `logistics_admin` / `password123`
- **Manager**: `logistics_manager` / `password123`
- **User**: `logistics_user` / `password123`

### 🎨 Content Creation Sector
- **Admin**: `content_admin` / `password123`
- **Manager**: `content_manager` / `password123`
- **User**: `content_user` / `password123`

## 🗄️ Database Access (pgAdmin)

- **URL**: http://localhost:5050
- **Email**: admin@cms.com
- **Password**: admin

**Database Connection:**
- **Host**: postgres (or cms-postgres)
- **Port**: 5432
- **Database**: cms_db
- **Username**: postgres
- **Password**: Hello@123!

## 📊 Kafka Monitoring

- **Kafka UI**: http://localhost:8081
- **Topics**: customer-events, notifications, health-check

## 🧪 How to Test

1. **Visit**: http://localhost:8080/test-credentials
2. **Choose any credentials** from the list above
3. **Go to Login**: http://localhost:8080/login
4. **Enter credentials** and login
5. **Automatic redirect** to the appropriate sector dashboard

## 📋 Sample Data

The database is pre-populated with:
- 4 sectors (Banking, Healthcare, Logistics, Content Creation)
- 12 users (3 per sector with different roles)
- 20 sample customers (5 per sector)

## 🔧 Technical Details

- **Backend**: Spring Boot with PostgreSQL
- **Frontend**: React with DaisyUI
- **Authentication**: BCrypt password encoding
- **Messaging**: Kafka with Zookeeper
- **Containerization**: Docker Compose

## 🚨 Important Notes

- All passwords are `password123` for testing
- Users are automatically redirected to their sector dashboard after login
- Each sector has its own specialized dashboard and features
- The application includes Kafka event publishing for customer operations