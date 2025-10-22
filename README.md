# 🎉 CMS (Customer Management System)

[![Status](https://img.shields.io/badge/status-operational-success)](http://localhost:8080)
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203.3-green)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)](frontend/)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2015-blue)](https://www.postgresql.org/)

A full-stack, multi-sector Customer Management System supporting **Banking**, **Healthcare**, **Logistics**, and **Content Creation** industries.

---

## 🚀 Quick Start

### Access the Application

```
URL: http://localhost:8080
Username: admin
Password: admin123
```

### Run with Docker (Recommended)

```bash
docker-compose up -d
```

### Run Locally

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend (separate terminal)
cd frontend && npm run dev
```

---

## ✨ Features

### 🏦 Banking & Finance

- Account Management (Checking, Savings, Business, Credit)
- Transaction Tracking (Deposits, Withdrawals, Transfers)
- Risk Assessment & Compliance Tools

### 🏥 Healthcare

- Patient Records Management
- Appointment Scheduling
- Medical History Tracking
- Insurance Management

### 🚛 Logistics & Supply Chain

- Shipment Tracking
- Inventory Management
- Route Optimization
- Warehouse & Fleet Management

### 🎨 Content Creation

- Project Management
- Client Portal
- Content Calendar
- Asset Management & Time Tracking

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (Port 8080)            │
│   - DaisyUI + Tailwind CSS              │
│   - Protected Routes                    │
│   - JWT Authentication                  │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│   Spring Boot Backend (Port 8080)       │
│   - JWT Security                        │
│   - Role-based Access Control           │
│   - RESTful APIs                        │
└──────────────┬──────────────────────────┘
               │ JDBC
┌──────────────▼──────────────────────────┐
│   PostgreSQL Database (Port 5432)       │
│   - 7 Tables                            │
│   - Sample Data                         │
└─────────────────────────────────────────┘
```

---

## 📊 Tech Stack

### Backend

- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Security**: JWT + BCrypt
- **ORM**: JPA/Hibernate

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 7
- **UI**: DaisyUI + Tailwind CSS + Radix UI
- **State**: Redux Toolkit + Context API
- **Routing**: React Router v7

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes ready
- **CI/CD**: GitLab CI configured

---

## 📁 Project Structure

```
cms/
├── backend/              # Spring Boot backend
│   ├── src/main/java/   # Java source code
│   │   ├── config/      # Configuration classes
│   │   ├── controller/  # REST controllers
│   │   ├── entity/      # JPA entities
│   │   ├── repository/  # Data repositories
│   │   ├── security/    # JWT security
│   │   └── service/     # Business logic
│   └── pom.xml          # Maven configuration
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── context/     # React context
│   └── package.json     # npm configuration
├── .docs/              # 📚 Documentation (19 files)
├── k8s/                # Kubernetes manifests
├── docker-compose.yml  # Docker orchestration
├── Dockerfile          # Multi-stage build
└── README.md           # This file
```

---

## 🔑 Test Credentials

| Username       | Password     | Role       | Access              |
| -------------- | ------------ | ---------- | ------------------- |
| admin          | admin123     | ADMIN      | Full system access  |
| bank_user      | bank123      | BANKING    | Banking features    |
| health_user    | health123    | HEALTHCARE | Healthcare features |
| logistics_user | logistics123 | LOGISTICS  | Logistics features  |
| content_user   | content123   | CONTENT    | Content features    |

---

## 🧪 Testing

### Automated Test

```powershell
.\test-system.ps1
```

### Manual API Test

```powershell
# Login
$body = @{username='admin';password='admin123'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'

# Get bank accounts
$token = $response.token
Invoke-RestMethod -Uri 'http://localhost:8080/api/banking/accounts' -Method Get -Headers @{Authorization="Bearer $token"}
```

---

## 📖 Documentation

Comprehensive documentation is available in the `.docs/` folder:

### Getting Started

- **[FINAL_SUMMARY.md](.docs/FINAL_SUMMARY.md)** - Complete overview (start here!)
- **[QUICK_START_GUIDE.md](.docs/QUICK_START_GUIDE.md)** - Quick start guide
- **[LOGIN_CREDENTIALS.md](.docs/LOGIN_CREDENTIALS.md)** - All test credentials

### Technical Documentation

- **[SYSTEM_ARCHITECTURE.md](.docs/SYSTEM_ARCHITECTURE.md)** - Architecture details
- **[BACKEND_IMPLEMENTATION_STATUS.md](.docs/BACKEND_IMPLEMENTATION_STATUS.md)** - Backend status
- **[FRONTEND_BACKEND_INTEGRATION.md](.docs/FRONTEND_BACKEND_INTEGRATION.md)** - Integration guide

### Testing & Troubleshooting

- **[API_TESTING_GUIDE.md](.docs/API_TESTING_GUIDE.md)** - API testing examples
- **[TESTING_GUIDE.md](.docs/TESTING_GUIDE.md)** - Comprehensive testing
- **[TROUBLESHOOTING.md](.docs/TROUBLESHOOTING.md)** - Common issues & solutions

### Features

- **[FEATURES_OVERVIEW.md](.docs/FEATURES_OVERVIEW.md)** - Complete feature list
- **[SECTOR_PAGES_SUMMARY.md](.docs/SECTOR_PAGES_SUMMARY.md)** - Sector pages overview

---

## 🌐 Service URLs

| Service      | URL                              | Description      |
| ------------ | -------------------------------- | ---------------- |
| Frontend     | http://localhost:8080            | Main application |
| Backend API  | http://localhost:8080/api        | REST API         |
| Health Check | http://localhost:8080/api/health | System health    |
| Kafka UI     | http://localhost:8081            | Kafka monitoring |
| pgAdmin      | http://localhost:5050            | Database admin   |

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Rebuild and start
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend
```

---

## 🔧 Development

### Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (if running locally)

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Create database
createdb -U postgres cms_db

# Or use Docker
docker-compose up postgres -d
```

---

## 📊 Database Schema

### Core Tables

- **users** - User authentication and roles
- **sectors** - Banking, Healthcare, Logistics, Content
- **customers** - Universal customer records

### Banking Tables

- **bank_accounts** - Account management
- **transactions** - Transaction tracking

### Healthcare Tables

- **patients** - Patient records
- **appointments** - Appointment scheduling

---

## 🚀 Deployment

### Docker Compose (Development)

```bash
docker-compose up --build -d
```

### Kubernetes (Production)

```bash
kubectl apply -f k8s/
```

### Environment Variables

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/cms_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=Hello@123!
JWT_SECRET=your-secret-key
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

---

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Banking

- `GET /api/banking/accounts` - List accounts
- `POST /api/banking/accounts` - Create account
- `GET /api/banking/transactions` - List transactions

### Healthcare

- `GET /api/healthcare/patients` - List patients
- `POST /api/healthcare/patients` - Create patient
- `GET /api/healthcare/appointments` - List appointments

### Customer Management

- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### If You Need Help:

1. Check **[TROUBLESHOOTING.md](.docs/TROUBLESHOOTING.md)**
2. Run `.\test-system.ps1` for diagnostics
3. Check logs: `docker logs cms-backend`
4. Review documentation in `.docs/` folder

---

## ✨ Status

- ✅ Backend: Operational (Port 8080)
- ✅ Frontend: Accessible
- ✅ Database: Connected (7 tables)
- ✅ Authentication: Working (JWT)
- ✅ Sample Data: Loaded
- ✅ Documentation: Complete (19 files)

**System is ready to use!** 🚀

---

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  
**Status**: ✅ Operational
