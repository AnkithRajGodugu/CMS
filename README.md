# 🎉 CMS Platform - Multi-Sector Customer Management System

[![Status](https://img.shields.io/badge/status-operational-success)](http://localhost:8080)
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203.3-green)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)](frontend/)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2015-blue)](https://www.postgresql.org/)
[![Kafka](https://img.shields.io/badge/messaging-Kafka-black)](https://kafka.apache.org/)

A modern, enterprise-grade Customer Management System with **sector-based architecture** supporting **Banking & Finance**, **Healthcare**, **Logistics & Supply Chain**, and **Content Creation** industries.

---

## 🚀 Quick Start

### Access the Application

```
URL: http://localhost:8080
```

### Test Credentials (Sector-Specific)

**Banking Sector:**

- Username: `banking_admin`
- Password: `password123`

**Healthcare Sector:**

- Username: `healthcare_admin`
- Password: `password123`

**Logistics Sector:**

- Username: `logistics_admin`
- Password: `password123`

**Content Creation Sector:**

- Username: `content_admin`
- Password: `password123`

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

## ✨ Key Features

### � Sector-Ba sed Architecture

- **Automatic Sector Detection**: Users are automatically redirected to their sector dashboard upon login
- **Sector-Specific Theming**: Each sector has its own color scheme and branding
- **Multi-Tenant Support**: Organization-level data isolation with Row-Level Security (RLS)
- **Sector Authorization**: API-level access control based on user's assigned sector

### 🏦 Banking & Finance

- **Account Management**: Checking, Savings, Business, Credit accounts
- **Transaction Tracking**: Deposits, Withdrawals, Transfers with real-time updates
- **Risk Assessment**: Automated risk scoring and monitoring
- **Compliance Tools**: Regulatory compliance tracking and reporting

### 🏥 Healthcare

- **Patient Records**: Comprehensive patient data management with HIPAA compliance
- **Appointment Scheduling**: Calendar-based scheduling with reminders
- **Medical History**: Complete medical history tracking
- **Insurance Management**: Insurance claims and coverage tracking

### 🚛 Logistics & Supply Chain

- **Shipment Tracking**: Real-time shipment status and location tracking
- **Inventory Management**: Stock levels, reorder points, and warehouse management
- **Route Optimization**: AI-powered route planning for efficient delivery
- **Fleet Management**: Vehicle tracking, maintenance scheduling
- **Warehouse Management**: Multi-warehouse inventory control
- **Vendor Relations**: Supplier management and procurement

### 🎨 Content Creation

- **Project Management**: Task tracking, milestones, and deadlines
- **Client Portal**: Client collaboration and feedback system
- **Content Calendar**: Editorial calendar with publishing schedule
- **Asset Management**: Digital asset library with version control
- **Time Tracking**: Project time tracking and billing
- **Collaboration Tools**: Team communication and file sharing

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│   React Frontend (Vite + React Router)                  │
│   - Sector-Specific Dashboards                          │
│   - Dynamic Theming (Banking/Healthcare/Logistics/...)  │
│   - Protected Routes with Sector Authorization          │
│   - Professional Landing Page                           │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JWT)
┌──────────────────────▼──────────────────────────────────┐
│   Spring Boot Backend (Port 8080)                       │
│   - Sector Detection Service                            │
│   - Sector Authorization Filter                         │
│   - JWT + Role-Based Access Control                     │
│   - Multi-Tenant Security (RLS)                         │
│   - Audit Logging                                       │
└──────────┬────────────────────┬─────────────────────────┘
           │                    │
           │ JDBC               │ Kafka Events
           ▼                    ▼
┌──────────────────────┐  ┌─────────────────────────┐
│  PostgreSQL (5432)   │  │  Apache Kafka (9092)    │
│  - Row-Level Security│  │  - Sector Events        │
│  - Encrypted Fields  │  │  - Audit Events         │
│  - 10+ Tables        │  │  - Event Sourcing       │
└──────────────────────┘  └─────────────────────────┘
```

### Monitoring Stack

```
┌─────────────────────┐  ┌─────────────────────┐
│  Prometheus (9090)  │  │  Grafana (3000)     │
│  - Metrics          │→ │  - Dashboards       │
│  - Alerts           │  │  - Visualization    │
└─────────────────────┘  └─────────────────────┘
```

---

## 📊 Tech Stack

### Backend

- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: PostgreSQL 15 with Row-Level Security (RLS)
- **Security**: JWT + BCrypt + Field-Level Encryption (AES-256)
- **ORM**: JPA/Hibernate with Liquibase migrations
- **Messaging**: Apache Kafka 7.4.0 for event-driven architecture
- **Caching**: Caffeine for sector detection caching
- **Monitoring**: Micrometer + Prometheus

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 7
- **UI**: DaisyUI + Tailwind CSS + React Icons
- **State**: React Context API
- **Routing**: React Router v7 with sector-based routing
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes ready (manifests in `k8s/`)
- **CI/CD**: GitLab CI with automated testing and deployment
- **Monitoring**: Prometheus + Grafana
- **Database Admin**: pgAdmin 4
- **Message Monitoring**: Kafka UI

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

### Banking Sector

| Username        | Password    | Role    | Access              |
| --------------- | ----------- | ------- | ------------------- |
| banking_admin   | password123 | ADMIN   | Full banking access |
| banking_manager | password123 | MANAGER | Banking management  |
| banking_user    | password123 | USER    | Banking user access |

### Healthcare Sector

| Username           | Password    | Role    | Access                 |
| ------------------ | ----------- | ------- | ---------------------- |
| healthcare_admin   | password123 | ADMIN   | Full healthcare access |
| healthcare_manager | password123 | MANAGER | Healthcare management  |
| healthcare_user    | password123 | USER    | Healthcare user access |

### Logistics Sector

| Username          | Password    | Role    | Access                |
| ----------------- | ----------- | ------- | --------------------- |
| logistics_admin   | password123 | ADMIN   | Full logistics access |
| logistics_manager | password123 | MANAGER | Logistics management  |
| logistics_user    | password123 | USER    | Logistics user access |

### Content Creation Sector

| Username        | Password    | Role    | Access              |
| --------------- | ----------- | ------- | ------------------- |
| content_admin   | password123 | ADMIN   | Full content access |
| content_manager | password123 | MANAGER | Content management  |
| content_user    | password123 | USER    | Content user access |

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

| Service      | URL                              | Description          | Credentials           |
| ------------ | -------------------------------- | -------------------- | --------------------- |
| Frontend     | http://localhost:8080            | Main application     | See test credentials  |
| Backend API  | http://localhost:8080/api        | REST API             | JWT token required    |
| Health Check | http://localhost:8080/api/health | System health status | Public                |
| Kafka UI     | http://localhost:8081            | Kafka monitoring     | No auth               |
| pgAdmin      | http://localhost:5050            | Database admin       | admin@cms.com / admin |
| Prometheus   | http://localhost:9090            | Metrics collection   | No auth               |

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

- **users** - User authentication, roles, and sector assignment
- **sectors** - Sector definitions with routing and configuration
- **organizations** - Multi-tenant organization management
- **customers** - Universal customer records across sectors
- **audit_log** - Comprehensive audit trail for compliance

### Banking Tables

- **bank_accounts** - Account management with types and balances
- **transactions** - Transaction tracking with audit trail

### Healthcare Tables

- **patients** - Patient records with medical information
- **appointments** - Appointment scheduling and management

### Security Features

- **Row-Level Security (RLS)**: Database-level multi-tenancy
- **Field-Level Encryption**: AES-256 encryption for sensitive data
- **Audit Logging**: All actions logged with user context

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

- `POST /api/auth/login` - User login with sector detection
- `POST /api/auth/register` - User registration
- `GET /api/auth/sector` - Get current user's sector information
- `POST /api/auth/select-sector` - Assign sector to user

### Public Endpoints

- `GET /api/public/sectors` - List all available sectors
- `GET /api/health` - System health check

### Banking Sector

- `GET /api/banking/accounts` - List bank accounts
- `POST /api/banking/accounts` - Create account
- `GET /api/banking/transactions` - List transactions
- `GET /api/banking/risk-assessment` - Risk assessment data
- `GET /api/banking/compliance` - Compliance reports

### Healthcare Sector

- `GET /api/healthcare/patients` - List patients
- `POST /api/healthcare/patients` - Create patient record
- `GET /api/healthcare/appointments` - List appointments
- `POST /api/healthcare/appointments` - Schedule appointment
- `GET /api/healthcare/medical-history/{id}` - Patient medical history

### Logistics Sector

- `GET /api/logistics/shipments` - List shipments
- `POST /api/logistics/shipments` - Create shipment
- `GET /api/logistics/inventory` - Inventory levels
- `GET /api/logistics/fleet` - Fleet management
- `GET /api/logistics/routes` - Route optimization

### Content Creation Sector

- `GET /api/content/projects` - List projects
- `POST /api/content/projects` - Create project
- `GET /api/content/clients` - List clients
- `GET /api/content/calendar` - Content calendar
- `GET /api/content/assets` - Digital assets

### Organization Management

- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/{id}` - Update organization
- `PATCH /api/organizations/{id}/settings` - Update settings

### Monitoring

- `GET /api/metrics/health` - Detailed health check
- `GET /api/metrics/performance` - Performance metrics
- `GET /actuator/prometheus` - Prometheus metrics

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

## ✨ System Status

### Services

- ✅ **Backend API**: Operational (Port 8080)
- ✅ **Frontend**: Accessible and responsive
- ✅ **Database**: Connected (PostgreSQL with 10+ tables)
- ✅ **Kafka**: Running (Event streaming)
- ✅ **Prometheus**: Collecting metrics
- ✅ **pgAdmin**: Database management UI

### Features

- ✅ **Authentication**: JWT-based with sector detection
- ✅ **Sector Routing**: Automatic redirect to sector dashboards
- ✅ **Multi-Tenancy**: Row-level security enabled
- ✅ **Audit Logging**: All actions tracked
- ✅ **Monitoring**: Prometheus + Grafana ready
- ✅ **Sample Data**: 4 sectors with test users loaded

### Security

- ✅ **Encryption**: AES-256 field-level encryption
- ✅ **Row-Level Security**: Database-level isolation
- ✅ **JWT Tokens**: Secure authentication
- ✅ **CORS**: Configured for production
- ✅ **Audit Trail**: Comprehensive logging

**System is production-ready!** 🚀

---

## 🎨 Screenshots

### Landing Page

Professional enterprise landing page with sector showcase

### Sector Dashboards

- **Banking Dashboard**: Account overview, transactions, risk metrics
- **Healthcare Dashboard**: Patient stats, appointments, medical records
- **Logistics Dashboard**: Shipment tracking, inventory, fleet status
- **Content Dashboard**: Project overview, client portal, content calendar

---

## 📚 Additional Documentation

For detailed documentation, see:

- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - Recent fixes and improvements
- **[FINAL_STATUS.md](FINAL_STATUS.md)** - Complete system status
- **[FEATURE_STATUS.md](FEATURE_STATUS.md)** - Feature implementation status

---

**Last Updated**: October 23, 2025  
**Version**: 2.0.0  
**Status**: ✅ Operational with Sector Architecture
