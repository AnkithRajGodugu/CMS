# API Documentation

## Overview

This document provides comprehensive documentation for the Sector Architecture Framework API endpoints. The API follows RESTful principles and uses JSON for request/response payloads.

**Base URL**: `http://localhost:8080/api`

**Authentication**: Most endpoints require JWT authentication via Bearer token in the Authorization header.

**Content-Type**: `application/json`

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Sector Management Endpoints](#sector-management-endpoints)
3. [Organization Management Endpoints](#organization-management-endpoints)
4. [Banking Sector Endpoints](#banking-sector-endpoints)
5. [Healthcare Sector Endpoints](#healthcare-sector-endpoints)
6. [Public Endpoints](#public-endpoints)
7. [Error Responses](#error-responses)
8. [Rate Limiting](#rate-limiting)

---

## Authentication Endpoints

### POST /api/auth/login

Authenticate a user and receive a JWT token with sector information.

**Request Body:**
```json
{
  "username": "string (3-50 chars, required)",
  "password": "string (min 6 chars, required)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john.doe",
    "role": "USER"
  },
  "sector": {
    "id": 1,
    "code": "BANKING",
    "name": "Banking & Finance",
    "routePath": "/banking"
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

- **428 Precondition Required** - User has no sector assigned
```json
{
  "success": false,
  "requiresSectorSelection": true,
  "message": "User has no sector assigned"
}
```

- **429 Too Many Requests** - Rate limit exceeded
```json
{
  "success": false,
  "message": "Too many failed attempts. Please try again later."
}
```

**Rate Limiting**: 5 failed attempts allowed within 15 minutes

---

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-50 chars, required)",
  "password": "string (min 8 chars, required)",
  "role": "string (required, e.g., 'USER', 'ADMIN')",
  "sectorId": "number (optional)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john.doe",
    "role": "USER"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

### GET /api/auth/sector

Get the current authenticated user's sector information.

**Authentication**: Required (JWT Bearer token)

**Success Response (200 OK):**
```json
{
  "success": true,
  "sector": {
    "id": 1,
    "code": "BANKING",
    "name": "Banking & Finance",
    "routePath": "/banking"
  }
}
```

**Cache-Control**: `max-age=300` (5 minutes)

**Error Responses:**

- **401 Unauthorized** - User not authenticated
- **404 Not Found** - User not found
- **428 Precondition Required** - User has no sector assigned

---

### POST /api/auth/select-sector

Select a sector for users without an assigned sector.

**Authentication**: Required (JWT Bearer token)

**Request Body:**
```json
{
  "sectorId": 1
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Sector assigned successfully",
  "sector": {
    "id": 1,
    "code": "BANKING",
    "name": "Banking & Finance",
    "routePath": "/banking"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid sector ID
- **401 Unauthorized** - User not authenticated
- **404 Not Found** - User not found

**Side Effects**: Publishes a `SECTOR_ASSIGNED` event to Kafka

---

## Sector Management Endpoints

### GET /api/sectors

Get all sectors in the system.

**Authentication**: Required

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "code": "BANKING",
    "name": "Banking & Finance",
    "description": "Financial services and banking operations",
    "icon": "bank-icon.svg",
    "routePath": "/banking",
    "enabled": true,
    "displayOrder": 1
  },
  {
    "id": 2,
    "code": "HEALTHCARE",
    "name": "Healthcare",
    "description": "Patient management and medical records",
    "icon": "health-icon.svg",
    "routePath": "/healthcare",
    "enabled": true,
    "displayOrder": 2
  }
]
```

---

### GET /api/sectors/{id}

Get a specific sector by ID.

**Authentication**: Required

**Path Parameters:**
- `id` (number, required) - Sector ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "code": "BANKING",
  "name": "Banking & Finance",
  "description": "Financial services and banking operations",
  "icon": "bank-icon.svg",
  "routePath": "/banking",
  "enabled": true,
  "displayOrder": 1
}
```

**Error Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "Sector not found"
}
```

---

### POST /api/sectors

Create a new sector (Admin only).

**Authentication**: Required (ADMIN role)

**Request Body:**
```json
{
  "code": "EDUCATION",
  "name": "Education",
  "description": "Educational institution management",
  "icon": "education-icon.svg",
  "routePath": "/education",
  "enabled": true,
  "displayOrder": 3
}
```

**Success Response (200 OK):**
Returns the created sector object.

---

## Organization Management Endpoints

### GET /api/organizations

Get all organizations (Admin only).

**Authentication**: Required (ADMIN role)

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Acme Bank",
    "domain": "acmebank.com",
    "sectorId": 1,
    "sectorName": "Banking & Finance",
    "active": true,
    "settings": {
      "theme": "blue",
      "features": ["loans", "deposits"]
    }
  }
]
```

---

### GET /api/organizations/{id}

Get organization by ID.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `id` (number, required) - Organization ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Bank",
  "domain": "acmebank.com",
  "sectorId": 1,
  "sectorName": "Banking & Finance",
  "active": true,
  "settings": {
    "theme": "blue",
    "features": ["loans", "deposits"]
  }
}
```

---

### GET /api/organizations/sector/{sectorId}

Get organizations by sector.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `sectorId` (number, required) - Sector ID

**Success Response (200 OK):**
Returns array of organization objects for the specified sector.

---

### GET /api/organizations/active

Get all active organizations.

**Authentication**: Required (ADMIN or MANAGER role)

**Success Response (200 OK):**
Returns array of active organization objects.

---

### POST /api/organizations

Create a new organization (Admin only).

**Authentication**: Required (ADMIN role)

**Request Body:**
```json
{
  "name": "New Organization",
  "domain": "neworg.com",
  "sectorId": 1,
  "settings": {
    "theme": "default"
  }
}
```

**Success Response (201 Created):**
Returns the created organization object.

---

### PUT /api/organizations/{id}

Update an existing organization (Admin only).

**Authentication**: Required (ADMIN role)

**Path Parameters:**
- `id` (number, required) - Organization ID

**Request Body:**
```json
{
  "name": "Updated Organization Name",
  "domain": "updated.com",
  "sectorId": 1,
  "active": true
}
```

**Success Response (200 OK):**
Returns the updated organization object.

---

### DELETE /api/organizations/{id}

Delete an organization (Admin only).

**Authentication**: Required (ADMIN role)

**Path Parameters:**
- `id` (number, required) - Organization ID

**Success Response (204 No Content)**

---

### PUT /api/organizations/{id}/settings

Update organization settings.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `id` (number, required) - Organization ID

**Request Body:**
```json
{
  "theme": "dark",
  "features": ["feature1", "feature2"],
  "customConfig": {
    "key": "value"
  }
}
```

**Success Response (200 OK):**
Returns the updated organization object with new settings.

---

### GET /api/organizations/{id}/settings

Get organization settings.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `id` (number, required) - Organization ID

**Success Response (200 OK):**
```json
{
  "theme": "dark",
  "features": ["feature1", "feature2"],
  "customConfig": {
    "key": "value"
  }
}
```

---

### POST /api/organizations/{organizationId}/users/{userId}

Add a user to an organization.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `organizationId` (number, required) - Organization ID
- `userId` (number, required) - User ID

**Success Response (200 OK)**

---

### DELETE /api/organizations/users/{userId}

Remove a user from their organization.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `userId` (number, required) - User ID

**Success Response (200 OK)**

---

### GET /api/organizations/{organizationId}/users

Get all users in an organization.

**Authentication**: Required (ADMIN or MANAGER role)

**Path Parameters:**
- `organizationId` (number, required) - Organization ID

**Success Response (200 OK):**
Returns array of user objects.

---

## Banking Sector Endpoints

All banking endpoints require authentication and either ADMIN role or 'banking' sector access.

**Base Path**: `/api/banking`

### GET /api/banking/accounts

Get all bank accounts.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "accountNumber": "ACC001",
    "customerName": "John Doe",
    "balance": 5000.00,
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

---

### GET /api/banking/accounts/{id}

Get a specific bank account by ID.

**Path Parameters:**
- `id` (number, required) - Account ID

**Success Response (200 OK):**
Returns a single bank account object.

**Error Response (404 Not Found)**

---

### POST /api/banking/accounts

Create a new bank account.

**Request Body:**
```json
{
  "accountNumber": "ACC002",
  "customerName": "Jane Smith",
  "balance": 1000.00,
  "status": "ACTIVE"
}
```

**Success Response (200 OK):**
Returns the created account object.

---

### PUT /api/banking/accounts/{id}

Update a bank account.

**Path Parameters:**
- `id` (number, required) - Account ID

**Request Body:**
```json
{
  "customerName": "Jane Smith Updated",
  "balance": 1500.00,
  "status": "ACTIVE"
}
```

**Success Response (200 OK):**
Returns the updated account object.

---

### GET /api/banking/transactions

Get all transactions.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "accountNumber": "ACC001",
    "type": "DEPOSIT",
    "amount": 500.00,
    "status": "COMPLETED",
    "timestamp": "2024-01-15T14:30:00"
  }
]
```

---

### GET /api/banking/transactions/{id}

Get a specific transaction by ID.

**Path Parameters:**
- `id` (number, required) - Transaction ID

**Success Response (200 OK):**
Returns a single transaction object.

---

### POST /api/banking/transactions

Create a new transaction.

**Request Body:**
```json
{
  "accountNumber": "ACC001",
  "type": "DEPOSIT",
  "amount": 500.00,
  "description": "Salary deposit"
}
```

**Success Response (200 OK):**
Returns the created transaction object.

---

### GET /api/banking/transactions/account/{accountNumber}

Get all transactions for a specific account.

**Path Parameters:**
- `accountNumber` (string, required) - Account number

**Success Response (200 OK):**
Returns array of transaction objects for the account.

---

### GET /api/banking/dashboard/stats

Get banking dashboard statistics.

**Success Response (200 OK):**
```json
{
  "activeAccounts": 156,
  "totalDeposits": 1250000.00,
  "pendingTransactions": 23,
  "failedTransactions": 2,
  "todayVolume": 45000.00
}
```

---

### GET /api/banking/risk-assessment

Get risk assessment data.

**Success Response (200 OK):**
```json
{
  "lowRisk": 156,
  "mediumRisk": 47,
  "highRisk": 12
}
```

---

### GET /api/banking/compliance/metrics

Get compliance metrics.

**Success Response (200 OK):**
```json
{
  "amlCompliance": 98,
  "kycVerification": 95,
  "riskAssessment": 87,
  "regulatoryReporting": 92
}
```

---

## Healthcare Sector Endpoints

All healthcare endpoints require authentication and either ADMIN role or 'healthcare' sector access.

**Base Path**: `/api/healthcare`

### GET /api/healthcare/patients

Get all patients.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "age": 45,
    "condition": "Hypertension",
    "status": "ACTIVE",
    "contactNumber": "+1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St"
  }
]
```

---

### GET /api/healthcare/patients/{id}

Get a specific patient by ID.

**Path Parameters:**
- `id` (number, required) - Patient ID

**Success Response (200 OK):**
Returns a single patient object.

---

### POST /api/healthcare/patients

Create a new patient record.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "age": 32,
  "condition": "Diabetes",
  "status": "ACTIVE",
  "contactNumber": "+1234567891",
  "email": "jane.smith@example.com",
  "address": "456 Oak Ave"
}
```

**Success Response (200 OK):**
Returns the created patient object.

---

### PUT /api/healthcare/patients/{id}

Update a patient record.

**Path Parameters:**
- `id` (number, required) - Patient ID

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "age": 33,
  "condition": "Diabetes Type 2",
  "status": "ACTIVE",
  "contactNumber": "+1234567891",
  "email": "jane.smith@example.com",
  "address": "456 Oak Ave"
}
```

**Success Response (200 OK):**
Returns the updated patient object.

---

### GET /api/healthcare/patients/search

Search for patients by name.

**Query Parameters:**
- `query` (string, required) - Search query (searches first name and last name)

**Success Response (200 OK):**
Returns array of matching patient objects.

---

### GET /api/healthcare/appointments

Get all appointments.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "appointmentTime": "2024-01-20T10:00:00",
    "type": "CHECKUP",
    "status": "CONFIRMED",
    "notes": "Regular checkup"
  }
]
```

---

### GET /api/healthcare/appointments/{id}

Get a specific appointment by ID.

**Path Parameters:**
- `id` (number, required) - Appointment ID

**Success Response (200 OK):**
Returns a single appointment object.

---

### POST /api/healthcare/appointments

Create a new appointment.

**Request Body:**
```json
{
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "appointmentTime": "2024-01-20T10:00:00",
  "type": "CHECKUP",
  "status": "PENDING",
  "notes": "Regular checkup"
}
```

**Success Response (200 OK):**
Returns the created appointment object.

---

### PUT /api/healthcare/appointments/{id}

Update an appointment.

**Path Parameters:**
- `id` (number, required) - Appointment ID

**Request Body:**
```json
{
  "patientName": "John Doe",
  "doctorName": "Dr. Jones",
  "appointmentTime": "2024-01-20T11:00:00",
  "type": "CHECKUP",
  "status": "CONFIRMED",
  "notes": "Rescheduled"
}
```

**Success Response (200 OK):**
Returns the updated appointment object.

---

### GET /api/healthcare/dashboard/stats

Get healthcare dashboard statistics.

**Success Response (200 OK):**
```json
{
  "totalPatients": 450,
  "activeCases": 123,
  "criticalPatients": 8,
  "todaysVisits": 45,
  "todaysAppointments": 32,
  "confirmedAppointments": 28,
  "pendingAppointments": 4,
  "urgentAppointments": 2
}
```

---

### GET /api/healthcare/insurance/claims

Get insurance claims data.

**Success Response (200 OK):**
```json
{
  "approvedClaims": 45230.00,
  "pendingClaims": 12850.00,
  "deniedClaims": 3450.00,
  "successRate": 87.5
}
```

---

### GET /api/healthcare/patients/{patientId}/history

Get medical history for a patient.

**Path Parameters:**
- `patientId` (string, required) - Patient ID

**Success Response (200 OK):**
```json
{
  "totalVisits": 4,
  "activeMedications": 3,
  "knownAllergies": 2,
  "labResults": 4
}
```

---

## Public Endpoints

These endpoints do not require authentication.

### GET /api/public/sectors

Get all enabled sectors for public display.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "code": "BANKING",
    "name": "Banking & Finance",
    "description": "Financial services and banking operations",
    "icon": "bank-icon.svg",
    "routePath": "/banking",
    "enabled": true,
    "displayOrder": 1
  }
]
```

**Cache-Control**: `max-age=3600, public` (1 hour)

---

### GET /api/public/sectors/{code}

Get a specific enabled sector by code.

**Path Parameters:**
- `code` (string, required) - Sector code (e.g., "BANKING", "HEALTHCARE")

**Success Response (200 OK):**
Returns a single sector object.

**Error Response (404 Not Found):**
If sector is not found or not enabled.

**Cache-Control**: `max-age=3600, public` (1 hour)

---

## Error Responses

All error responses follow a consistent format:

### Standard Error Response

```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Validation Error Response

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ],
  "timestamp": "2024-01-15T10:30:00"
}
```

### Common HTTP Status Codes

- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully
- **204 No Content** - Request succeeded with no response body
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or failed
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **428 Precondition Required** - Additional action required (e.g., sector selection)
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

---

## Rate Limiting

### Login Endpoint Rate Limiting

- **Limit**: 5 failed login attempts per IP address
- **Window**: 15 minutes
- **Lockout Duration**: 15 minutes after exceeding limit
- **Response**: 429 Too Many Requests

### General Rate Limiting

Future implementation will include:
- Per-user rate limits
- Per-endpoint rate limits
- Redis-based distributed rate limiting

---

## Authentication

### JWT Token Format

JWT tokens are issued upon successful login and must be included in the Authorization header for protected endpoints.

**Header Format:**
```
Authorization: Bearer <token>
```

**Token Expiration**: 15 minutes (configurable)

**Refresh Token**: Future implementation

### Token Claims

```json
{
  "sub": "username",
  "userId": 1,
  "sectorId": 1,
  "roles": ["USER"],
  "iat": 1705315800,
  "exp": 1705316700
}
```

---

## Pagination

Future implementation will support pagination for list endpoints:

**Query Parameters:**
- `page` (number, default: 0) - Page number
- `size` (number, default: 20) - Page size
- `sort` (string, optional) - Sort field and direction (e.g., "name,asc")

**Response Format:**
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins**: `*` (development), specific domains (production)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type
- **Max Age**: 3600 seconds

---

## API Versioning

Current version: **v1** (implicit in base path)

Future versions will use URL versioning:
- `/api/v1/...`
- `/api/v2/...`

---

## Additional Resources

- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Database Schema Documentation](./DATABASE_SCHEMA.md)
- [Kafka Event Schemas](./KAFKA_EVENTS.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
