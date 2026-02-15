# 🏗️ CMS Platform - System Architecture

## Overview

Multi-sector Customer Management System supporting Banking, Healthcare, Logistics, and Content Creation industries.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Security**: JWT + BCrypt
- **Messaging**: Apache Kafka (optional)
- **ORM**: JPA/Hibernate

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **UI Libraries**: 
  - DaisyUI (Tailwind CSS)
  - Radix UI (shadcn components)
- **State Management**: Redux Toolkit + Context API
- **Routing**: React Router v7

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes ready
- **CI/CD**: GitLab CI

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  CLIENT BROWSER                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────┐
│              REACT FRONTEND (Port 8080)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Landing Pages  │  Sector Dashboards            │   │
│  │  - Banking      │  - Account Management         │   │
│  │  - Healthcare   │  - Patient Records            │   │
│  │  - Logistics    │  - Shipment Tracking          │   │
│  │  - Content      │  - Project Management         │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JSON + JWT)
┌────────────────────▼────────────────────────────────────┐
│           SPRING BOOT BACKEND (Port 8080)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Controllers Layer                              │   │
│  │  - AuthController    - BankingController        │   │
│  │  - CustomerController - HealthcareController    │   │
│  │  - UserController    - SectorController         │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Service Layer                                  │   │
│  │  - AuthService       - CustomerService          │   │
│  │  - UserService       - SectorService            │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Security Layer                                 │   │
│  │  - JWT Authentication                           │   │
│  │  - Role-based Authorization                     │   │
│  │  - BCrypt Password Encoding                     │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC
┌────────────────────▼────────────────────────────────────┐
│          POSTGRESQL DATABASE (Port 5432)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Core Tables                                    │   │
│  │  - users         - sectors      - customers     │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Banking Tables                                 │   │
│  │  - bank_accounts - transactions                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Healthcare Tables                              │   │
│  │  - patients      - appointments                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         APACHE KAFKA (Port 9092) - Optional              │
│  Topics: customer-events, notifications                  │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Entities

**users**
- id (PK)
- username (unique)
- password (BCrypt hashed)
- role (ADMIN, banking, healthcare, logistics, content)
- sector_id (FK → sectors)

**sectors**
- id (PK)
- name (unique)
- description

**customers**
- id (PK)
- first_name, last_name
- email, phone
- sector_id (FK → sectors)
- created_at

### Banking Entities

**bank_accounts**
- id (PK)
- account_number (unique)
- account_type (CHECKING, SAVINGS, BUSINESS, CREDIT)
- customer_name
- balance
- status (ACTIVE, INACTIVE, SUSPENDED, CLOSED)
- created_at, updated_at

**transactions**
- id (PK)
- transaction_id (unique)
- type (DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT)
- amount
- account_number
- status (PENDING, COMPLETED, FAILED, CANCELLED)
- description
- created_at, processed_at

### Healthcare Entities

**patients**
- id (PK)
- patient_id (unique)
- first_name, last_name
- date_of_birth, age
- condition
- status (STABLE, MONITORING, CRITICAL, DISCHARGED)
- contact_number, email, address
- last_visit, created_at

**appointments**
- id (PK)
- appointment_id (unique)
- patient_name, doctor_name
- appointment_time
- type (CONSULTATION, FOLLOW_UP, CHECK_UP, EMERGENCY)
- status (PENDING, CONFIRMED, COMPLETED, CANCELLED, URGENT)
- notes, created_at

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Customer Management
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Banking APIs
- `GET /api/banking/accounts` - List accounts
- `POST /api/banking/accounts` - Create account
- `GET /api/banking/transactions` - List transactions
- `POST /api/banking/transactions` - Create transaction
- `GET /api/banking/dashboard/stats` - Dashboard statistics

### Healthcare APIs
- `GET /api/healthcare/patients` - List patients
- `POST /api/healthcare/patients` - Create patient
- `GET /api/healthcare/appointments` - List appointments
- `POST /api/healthcare/appointments` - Create appointment
- `GET /api/healthcare/dashboard/stats` - Dashboard statistics

### Admin APIs
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/sectors` - List sectors

## Security Model

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials with BCrypt
3. JWT token generated with user info + role
4. Token returned to frontend
5. Frontend stores token in localStorage
6. All subsequent requests include JWT in Authorization header

### Authorization
- **Public**: Landing pages, login, signup
- **Authenticated**: All dashboard pages
- **Role-based**: 
  - ADMIN: Full access to all features
  - banking: Banking sector features only
  - healthcare: Healthcare sector features only
  - logistics: Logistics sector features only
  - content: Content sector features only

## Deployment

### Docker Compose (Development)
```bash
docker-compose up --build
```

### Kubernetes (Production)
```bash
kubectl apply -f k8s/
```

### Environment Variables
- `SPRING_DATASOURCE_URL` - Database connection
- `SPRING_DATASOURCE_USERNAME` - DB username
- `SPRING_DATASOURCE_PASSWORD` - DB password
- `JWT_SECRET` - JWT signing key
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka brokers

## Performance Considerations

- **Connection Pooling**: HikariCP (default)
- **Lazy Loading**: JPA entities use LAZY fetch
- **Caching**: Ready for Redis integration
- **Code Splitting**: Frontend uses lazy loading
- **Pagination**: Implemented on list endpoints

## Scalability

- **Horizontal Scaling**: Stateless backend (JWT)
- **Database**: PostgreSQL with read replicas
- **Caching**: Redis for session management
- **Load Balancing**: Kubernetes ingress
- **Message Queue**: Kafka for async processing
