# Developer Guide: Sector Architecture Framework

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Adding a New Sector](#adding-a-new-sector)
4. [Database Schema Reference](#database-schema-reference)
5. [Kafka Event Schemas](#kafka-event-schemas)
6. [API Development Guidelines](#api-development-guidelines)
7. [Frontend Development Guidelines](#frontend-development-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide provides comprehensive documentation for developers working on the multi-sector CMS architecture. It covers everything from adding new sectors to understanding the database schema and event-driven architecture.

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Kafka 7.4.0+
- Docker & Docker Compose
- Basic understanding of Spring Boot and React

### Key Concepts

- **Sector**: An industry-specific module (e.g., Banking, Healthcare, Education)
- **Multi-tenancy**: Data isolation between organizations and sectors
- **Event-driven architecture**: Kafka-based messaging for real-time updates
- **Row-level security**: Database-level access control
- **Sector detection**: Automatic routing based on user's assigned sector

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React + Redux + Tailwind CSS + Radix UI                    │
│  - Hero Page                                                 │
│  - Sector Router                                             │
│  - Shared UI Components                                      │
│  - Sector-specific Modules                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│  Spring Boot + Spring Security                              │
│  - Authentication Filter                                     │
│  - Sector Authorization Filter                               │
│  - JWT Token Validation                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
│  - AuthService                                               │
│  - SectorDetectionService                                    │
│  - OrganizationService                                       │
│  - Sector-specific Services (Banking, Healthcare, etc.)      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│     Data Layer           │  │     Event Layer          │
│  PostgreSQL              │  │  Kafka + Zookeeper       │
│  - Core Schema           │  │  - Sector Topics         │
│  - Sector Schemas        │  │  - Audit Topics          │
│  - Row-level Security    │  │  - Event Consumers       │
└──────────────────────────┘  └──────────────────────────┘
```

### Technology Stack

**Backend:**
- Spring Boot 3.3.0
- Spring Security with JWT
- Spring Data JPA
- Spring Kafka
- PostgreSQL 15
- Lombok

**Frontend:**
- React 19
- Redux Toolkit
- React Router
- Tailwind CSS
- Radix UI
- Axios
- Chart.js

---

## Adding a New Sector

This section provides a step-by-step guide to adding a new sector to the system.

### Step 1: Database Setup

#### 1.1 Create Sector Schema

Create a new database migration file in `backend/src/main/resources/db/migration/`:

```sql
-- V1.X__create_newsector_schema.sql

-- Create schema for the new sector
CREATE SCHEMA IF NOT EXISTS newsector;

-- Create sector-specific tables
CREATE TABLE newsector.entities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    organization_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES core.users(id),
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id)
);

-- Enable row-level security
ALTER TABLE newsector.entities ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY newsector_entity_access ON newsector.entities
    USING (
        user_id = current_setting('app.current_user_id')::BIGINT
        OR organization_id = current_setting('app.current_org_id')::BIGINT
        OR current_setting('app.current_user_role') = 'ADMIN'
    );

-- Create indexes for performance
CREATE INDEX idx_newsector_entities_user_id ON newsector.entities(user_id);
CREATE INDEX idx_newsector_entities_org_id ON newsector.entities(organization_id);
CREATE INDEX idx_newsector_entities_status ON newsector.entities(status);
```

#### 1.2 Register the Sector

Insert the sector into the `core.sectors` table:

```sql
INSERT INTO core.sectors (code, name, description, icon, route_path, configuration, enabled, display_order)
VALUES (
    'NEWSECTOR',
    'New Sector Name',
    'Description of the new sector and its purpose',
    'icon-name',
    '/newsector',
    '{"features": {"feature1": true, "feature2": false}, "settings": {}}',
    true,
    100
);
```


### Step 2: Backend Implementation

#### 2.1 Create Entity Models

Create JPA entities in `backend/src/main/java/com/example/cms/newsector/model/`:

```java
package com.example.cms.newsector.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "entities", schema = "newsector")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewSectorEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "organization_id")
    private Long organizationId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String status = "ACTIVE";
    
    @Column(columnDefinition = "jsonb")
    private String metadata;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```


#### 2.2 Create Repository

Create repository in `backend/src/main/java/com/example/cms/newsector/repository/`:

```java
package com.example.cms.newsector.repository;

import com.example.cms.newsector.model.NewSectorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewSectorEntityRepository extends JpaRepository<NewSectorEntity, Long> {
    
    List<NewSectorEntity> findByUserId(Long userId);
    
    List<NewSectorEntity> findByOrganizationId(Long organizationId);
    
    List<NewSectorEntity> findByStatus(String status);
    
    @Query("SELECT e FROM NewSectorEntity e WHERE e.userId = :userId AND e.status = :status")
    List<NewSectorEntity> findByUserIdAndStatus(@Param("userId") Long userId, 
                                                 @Param("status") String status);
}
```

#### 2.3 Create Service Layer

Create service in `backend/src/main/java/com/example/cms/newsector/service/`:

```java
package com.example.cms.newsector.service;

import com.example.cms.newsector.model.NewSectorEntity;
import com.example.cms.newsector.repository.NewSectorEntityRepository;
import com.example.cms.kafka.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewSectorService {
    
    private final NewSectorEntityRepository repository;
    private final KafkaProducerService kafkaProducerService;
    
    @Transactional(readOnly = true)
    public List<NewSectorEntity> getAllEntities(Long userId) {
        return repository.findByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public NewSectorEntity getEntityById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entity not found"));
    }
    
    @Transactional
    public NewSectorEntity createEntity(NewSectorEntity entity, Long userId) {
        entity.setUserId(userId);
        NewSectorEntity saved = repository.save(entity);
        
        // Publish event to Kafka
        Map<String, Object> payload = Map.of(
            "entityId", saved.getId(),
            "name", saved.getName(),
            "status", saved.getStatus()
        );
        kafkaProducerService.publishSectorEvent("NEWSECTOR", "ENTITY_CREATED", userId, payload);
        
        log.info("Created new sector entity: {}", saved.getId());
        return saved;
    }
    
    @Transactional
    public NewSectorEntity updateEntity(Long id, NewSectorEntity entity) {
        NewSectorEntity existing = getEntityById(id);
        existing.setName(entity.getName());
        existing.setDescription(entity.getDescription());
        existing.setStatus(entity.getStatus());
        existing.setMetadata(entity.getMetadata());
        
        NewSectorEntity updated = repository.save(existing);
        
        // Publish event
        Map<String, Object> payload = Map.of(
            "entityId", updated.getId(),
            "name", updated.getName()
        );
        kafkaProducerService.publishSectorEvent("NEWSECTOR", "ENTITY_UPDATED", 
                                               existing.getUserId(), payload);
        
        return updated;
    }
    
    @Transactional
    public void deleteEntity(Long id) {
        NewSectorEntity entity = getEntityById(id);
        repository.delete(entity);
        
        // Publish event
        Map<String, Object> payload = Map.of("entityId", id);
        kafkaProducerService.publishSectorEvent("NEWSECTOR", "ENTITY_DELETED", 
                                               entity.getUserId(), payload);
    }
}
```


#### 2.4 Create REST Controller

Create controller in `backend/src/main/java/com/example/cms/newsector/controller/`:

```java
package com.example.cms.newsector.controller;

import com.example.cms.newsector.model.NewSectorEntity;
import com.example.cms.newsector.service.NewSectorService;
import com.example.cms.security.SectorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/sectors/newsector/entities")
@RequiredArgsConstructor
public class NewSectorController {
    
    private final NewSectorService service;
    
    @GetMapping
    public ResponseEntity<List<NewSectorEntity>> getAllEntities(
            HttpServletRequest request,
            Authentication authentication) {
        SectorContext context = (SectorContext) request.getAttribute("sectorContext");
        List<NewSectorEntity> entities = service.getAllEntities(context.getUserId());
        return ResponseEntity.ok(entities);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<NewSectorEntity> getEntity(@PathVariable Long id) {
        NewSectorEntity entity = service.getEntityById(id);
        return ResponseEntity.ok(entity);
    }
    
    @PostMapping
    public ResponseEntity<NewSectorEntity> createEntity(
            @RequestBody NewSectorEntity entity,
            HttpServletRequest request) {
        SectorContext context = (SectorContext) request.getAttribute("sectorContext");
        NewSectorEntity created = service.createEntity(entity, context.getUserId());
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<NewSectorEntity> updateEntity(
            @PathVariable Long id,
            @RequestBody NewSectorEntity entity) {
        NewSectorEntity updated = service.updateEntity(id, entity);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntity(@PathVariable Long id) {
        service.deleteEntity(id);
        return ResponseEntity.noContent().build();
    }
}
```


#### 2.5 Configure Kafka Topics

Update `backend/src/main/java/com/example/cms/config/KafkaConfig.java`:

```java
@Bean
public NewTopic newSectorTopic() {
    return TopicBuilder.name("sector-events-newsector")
            .partitions(3)
            .replicas(1)
            .build();
}
```

Add consumer in `backend/src/main/java/com/example/cms/kafka/KafkaConsumerService.java`:

```java
@KafkaListener(topics = "sector-events-newsector", groupId = "newsector-consumer-group")
public void consumeNewSectorEvents(SectorEvent event) {
    log.info("Received newsector event: {}", event.getEventType());
    
    switch (event.getEventType()) {
        case "ENTITY_CREATED":
            handleEntityCreated(event);
            break;
        case "ENTITY_UPDATED":
            handleEntityUpdated(event);
            break;
        case "ENTITY_DELETED":
            handleEntityDeleted(event);
            break;
        default:
            log.warn("Unknown event type: {}", event.getEventType());
    }
}

private void handleEntityCreated(SectorEvent event) {
    // Handle entity creation event
    log.info("Entity created: {}", event.getPayload().get("entityId"));
}

private void handleEntityUpdated(SectorEvent event) {
    // Handle entity update event
    log.info("Entity updated: {}", event.getPayload().get("entityId"));
}

private void handleEntityDeleted(SectorEvent event) {
    // Handle entity deletion event
    log.info("Entity deleted: {}", event.getPayload().get("entityId"));
}
```

### Step 3: Frontend Implementation

#### 3.1 Create Sector Module Structure

Create the following directory structure:

```
frontend/src/
├── features/
│   └── newsector/
│       ├── components/
│       │   ├── NewSectorDashboard.jsx
│       │   ├── EntityList.jsx
│       │   ├── EntityForm.jsx
│       │   └── EntityDetails.jsx
│       ├── services/
│       │   └── newsectorApi.js
│       ├── store/
│       │   └── newsectorSlice.js
│       └── NewSectorModule.jsx
```


#### 3.2 Create API Service

Create `frontend/src/features/newsector/services/newsectorApi.js`:

```javascript
import api from '../../../services/api';

const BASE_URL = '/api/sectors/newsector';

export const newsectorApi = {
    getAllEntities: async () => {
        const response = await api.get(`${BASE_URL}/entities`);
        return response.data;
    },
    
    getEntityById: async (id) => {
        const response = await api.get(`${BASE_URL}/entities/${id}`);
        return response.data;
    },
    
    createEntity: async (entity) => {
        const response = await api.post(`${BASE_URL}/entities`, entity);
        return response.data;
    },
    
    updateEntity: async (id, entity) => {
        const response = await api.put(`${BASE_URL}/entities/${id}`, entity);
        return response.data;
    },
    
    deleteEntity: async (id) => {
        await api.delete(`${BASE_URL}/entities/${id}`);
    }
};
```

#### 3.3 Create Redux Slice

Create `frontend/src/features/newsector/store/newsectorSlice.js`:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsectorApi } from '../services/newsectorApi';

export const fetchEntities = createAsyncThunk(
    'newsector/fetchEntities',
    async () => {
        return await newsectorApi.getAllEntities();
    }
);

export const createEntity = createAsyncThunk(
    'newsector/createEntity',
    async (entity) => {
        return await newsectorApi.createEntity(entity);
    }
);

export const updateEntity = createAsyncThunk(
    'newsector/updateEntity',
    async ({ id, entity }) => {
        return await newsectorApi.updateEntity(id, entity);
    }
);

export const deleteEntity = createAsyncThunk(
    'newsector/deleteEntity',
    async (id) => {
        await newsectorApi.deleteEntity(id);
        return id;
    }
);


const newsectorSlice = createSlice({
    name: 'newsector',
    initialState: {
        entities: [],
        selectedEntity: null,
        loading: false,
        error: null
    },
    reducers: {
        setSelectedEntity: (state, action) => {
            state.selectedEntity = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEntities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEntities.fulfilled, (state, action) => {
                state.loading = false;
                state.entities = action.payload;
            })
            .addCase(fetchEntities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createEntity.fulfilled, (state, action) => {
                state.entities.push(action.payload);
            })
            .addCase(updateEntity.fulfilled, (state, action) => {
                const index = state.entities.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.entities[index] = action.payload;
                }
            })
            .addCase(deleteEntity.fulfilled, (state, action) => {
                state.entities = state.entities.filter(e => e.id !== action.payload);
            });
    }
});

export const { setSelectedEntity, clearError } = newsectorSlice.actions;
export default newsectorSlice.reducer;
```

#### 3.4 Create Main Module Component

Create `frontend/src/features/newsector/NewSectorModule.jsx`:

```javascript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SectorLayout } from '../../components/shared/SectorLayout';
import NewSectorDashboard from './components/NewSectorDashboard';
import EntityList from './components/EntityList';
import EntityDetails from './components/EntityDetails';

const NewSectorModule = () => {
    const sector = {
        code: 'NEWSECTOR',
        name: 'New Sector',
        routePath: '/newsector'
    };
    
    return (
        <SectorLayout sector={sector}>
            <Routes>
                <Route path="/" element={<NewSectorDashboard />} />
                <Route path="/entities" element={<EntityList />} />
                <Route path="/entities/:id" element={<EntityDetails />} />
            </Routes>
        </SectorLayout>
    );
};

export default NewSectorModule;
```

#### 3.5 Register Module in Router

Update `frontend/src/components/SectorRouter.jsx`:

```javascript
import NewSectorModule from '../features/newsector/NewSectorModule';

// Add to Routes
<Route path="/newsector/*" element={<NewSectorModule />} />
```

#### 3.6 Register Redux Slice

Update `frontend/src/store/index.js`:

```javascript
import newsectorReducer from '../features/newsector/store/newsectorSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // ... other reducers
        newsector: newsectorReducer
    }
});
```

### Step 4: Testing

#### 4.1 Backend Tests

Create test file `backend/src/test/java/com/example/cms/newsector/NewSectorServiceTest.java`:

```java
@SpringBootTest
@Testcontainers
class NewSectorServiceTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
    
    @Autowired
    private NewSectorService service;
    
    @Test
    void shouldCreateEntity() {
        NewSectorEntity entity = NewSectorEntity.builder()
            .name("Test Entity")
            .description("Test Description")
            .build();
        
        NewSectorEntity created = service.createEntity(entity, 1L);
        
        assertNotNull(created.getId());
        assertEquals("Test Entity", created.getName());
    }
}
```


#### 4.2 Frontend Tests

Create test file `frontend/src/features/newsector/__tests__/NewSectorModule.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import NewSectorModule from '../NewSectorModule';
import { store } from '../../../store';

describe('NewSectorModule', () => {
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <NewSectorModule />
                </BrowserRouter>
            </Provider>
        );
        
        expect(screen.getByText(/New Sector/i)).toBeInTheDocument();
    });
});
```

### Step 5: Documentation

Update the following files:

1. Add sector to `README.md` supported sectors list
2. Update API documentation with new endpoints
3. Add sector-specific user guide

---

## Database Schema Reference

### Core Schema

The core schema contains shared tables used across all sectors.

#### Table: `core.users`

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique user identifier |
| username | VARCHAR(255) | UNIQUE, NOT NULL | User's login username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| user_type | VARCHAR(50) | NOT NULL | INDIVIDUAL or ORGANIZATION |
| organization_id | BIGINT | FOREIGN KEY | Reference to organization |
| sector_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to assigned sector |
| enabled | BOOLEAN | DEFAULT true | Account active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| last_login | TIMESTAMP | NULL | Last successful login |

**Indexes:**
- `idx_users_username` on `username`
- `idx_users_email` on `email`
- `idx_users_sector_id` on `sector_id`
- `idx_users_organization_id` on `organization_id`

**Row-Level Security:**
```sql
CREATE POLICY user_isolation_policy ON core.users
    USING (
        id = current_setting('app.current_user_id')::BIGINT
        OR current_setting('app.current_user_role') = 'ADMIN'
    );
```


#### Table: `core.organizations`

Stores organization information for multi-user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique organization identifier |
| name | VARCHAR(255) | NOT NULL | Organization name |
| domain | VARCHAR(255) | NULL | Organization domain (e.g., company.com) |
| sector_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to sector |
| settings | JSONB | NULL | Organization-specific settings |
| active | BOOLEAN | DEFAULT true | Organization active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_organizations_sector_id` on `sector_id`
- `idx_organizations_domain` on `domain`

**Example settings JSON:**
```json
{
    "branding": {
        "logo": "https://example.com/logo.png",
        "primaryColor": "#1e40af"
    },
    "features": {
        "advancedReporting": true,
        "apiAccess": true
    },
    "limits": {
        "maxUsers": 100,
        "storageGB": 500
    }
}
```

#### Table: `core.sectors`

Defines available sectors in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique sector identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Sector code (e.g., BANKING) |
| name | VARCHAR(255) | NOT NULL | Display name |
| description | TEXT | NULL | Sector description |
| icon | VARCHAR(255) | NULL | Icon identifier |
| route_path | VARCHAR(255) | NOT NULL | Frontend route (e.g., /banking) |
| configuration | JSONB | NULL | Sector-specific configuration |
| enabled | BOOLEAN | DEFAULT true | Sector availability |
| display_order | INT | DEFAULT 0 | Display order on hero page |

**Indexes:**
- `idx_sectors_code` on `code`
- `idx_sectors_enabled` on `enabled`

**Example configuration JSON:**
```json
{
    "features": {
        "transactions": true,
        "loans": true,
        "investments": false
    },
    "settings": {
        "currency": "USD",
        "timezone": "America/New_York"
    },
    "integrations": {
        "paymentGateway": "stripe",
        "kycProvider": "jumio"
    }
}
```


#### Table: `core.user_roles`

Junction table for user role assignments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | BIGINT | FOREIGN KEY | Reference to user |
| roles | VARCHAR(255) | NOT NULL | Role name (e.g., ADMIN, USER) |

**Common Roles:**
- `ADMIN` - System administrator
- `ORG_ADMIN` - Organization administrator
- `USER` - Standard user
- `VIEWER` - Read-only access

#### Table: `core.audit_log`

Comprehensive audit trail for all system actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique log entry identifier |
| user_id | BIGINT | NOT NULL | User who performed action |
| sector_id | BIGINT | NOT NULL | Sector context |
| organization_id | BIGINT | NULL | Organization context |
| action | VARCHAR(255) | NOT NULL | Action performed |
| resource_type | VARCHAR(255) | NULL | Type of resource affected |
| resource_id | VARCHAR(255) | NULL | ID of resource affected |
| details | JSONB | NULL | Additional action details |
| ip_address | VARCHAR(45) | NULL | User's IP address |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When action occurred |

**Indexes:**
- `idx_audit_log_user_id` on `user_id`
- `idx_audit_log_sector_id` on `sector_id`
- `idx_audit_log_timestamp` on `timestamp`
- `idx_audit_log_action` on `action`

**Example details JSON:**
```json
{
    "method": "POST",
    "endpoint": "/api/sectors/banking/accounts",
    "requestBody": {
        "accountType": "CHECKING",
        "initialDeposit": 1000.00
    },
    "responseStatus": 201,
    "duration": 245
}
```

### Sector-Specific Schemas

Each sector has its own schema with isolated tables.

#### Banking Schema (`banking`)

**Table: `banking.accounts`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Account identifier |
| account_number | VARCHAR(50) | UNIQUE, NOT NULL | Account number |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | Account owner |
| organization_id | BIGINT | NULL, FOREIGN KEY | Organization (if applicable) |
| account_type | VARCHAR(50) | NOT NULL | CHECKING, SAVINGS, etc. |
| balance | DECIMAL(15,2) | DEFAULT 0.00 | Current balance |
| currency | VARCHAR(3) | DEFAULT 'USD' | Currency code |
| status | VARCHAR(50) | DEFAULT 'ACTIVE' | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |


**Table: `banking.transactions`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Transaction identifier |
| account_id | BIGINT | NOT NULL, FOREIGN KEY | Related account |
| transaction_type | VARCHAR(50) | NOT NULL | DEPOSIT, WITHDRAWAL, TRANSFER |
| amount | DECIMAL(15,2) | NOT NULL | Transaction amount |
| currency | VARCHAR(3) | DEFAULT 'USD' | Currency code |
| description | TEXT | NULL | Transaction description |
| reference_number | VARCHAR(100) | UNIQUE | Unique reference |
| status | VARCHAR(50) | DEFAULT 'PENDING' | Transaction status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| processed_at | TIMESTAMP | NULL | Processing time |

#### Healthcare Schema (`healthcare`)

**Table: `healthcare.patients`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Patient identifier |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | Associated user |
| organization_id | BIGINT | NULL, FOREIGN KEY | Healthcare provider |
| medical_record_number | VARCHAR(50) | UNIQUE, NOT NULL | MRN |
| date_of_birth | DATE | NOT NULL | Patient DOB |
| blood_type | VARCHAR(10) | NULL | Blood type |
| allergies | JSONB | NULL | Known allergies |
| medical_history | JSONB | NULL | Medical history |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |

**Table: `healthcare.appointments`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Appointment identifier |
| patient_id | BIGINT | NOT NULL, FOREIGN KEY | Patient |
| provider_id | BIGINT | NOT NULL | Healthcare provider |
| appointment_type | VARCHAR(50) | NOT NULL | Type of appointment |
| scheduled_time | TIMESTAMP | NOT NULL | Scheduled date/time |
| duration_minutes | INT | DEFAULT 30 | Appointment duration |
| status | VARCHAR(50) | DEFAULT 'SCHEDULED' | Appointment status |
| notes | TEXT | NULL | Appointment notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

#### Education Schema (`education`)

**Table: `education.students`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Student identifier |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | Associated user |
| organization_id | BIGINT | NOT NULL, FOREIGN KEY | Educational institution |
| student_id | VARCHAR(50) | UNIQUE, NOT NULL | Student ID number |
| enrollment_date | DATE | NOT NULL | Enrollment date |
| grade_level | VARCHAR(50) | NULL | Current grade/year |
| status | VARCHAR(50) | DEFAULT 'ACTIVE' | Enrollment status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |


**Table: `education.courses`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Course identifier |
| organization_id | BIGINT | NOT NULL, FOREIGN KEY | Institution |
| course_code | VARCHAR(50) | NOT NULL | Course code |
| course_name | VARCHAR(255) | NOT NULL | Course name |
| instructor_id | BIGINT | NULL | Instructor user ID |
| credits | INT | DEFAULT 0 | Credit hours |
| semester | VARCHAR(50) | NULL | Semester/term |
| status | VARCHAR(50) | DEFAULT 'ACTIVE' | Course status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

---

## Kafka Event Schemas

### Event Structure

All Kafka events follow a standardized structure:

```java
{
    "eventId": "uuid-string",
    "eventType": "EVENT_TYPE_NAME",
    "sectorCode": "SECTOR_CODE",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T10:30:00",
    "payload": {
        // Event-specific data
    },
    "metadata": {
        "source": "service-name",
        "version": "1.0",
        "correlationId": "uuid-string"
    }
}
```

### Topic Naming Convention

Topics follow the pattern: `sector-events-{sectorcode}`

Examples:
- `sector-events-banking`
- `sector-events-healthcare`
- `sector-events-education`
- `sector-events-retail`
- `sector-events-manufacturing`

Special topics:
- `audit-events` - Audit log events
- `notification-events` - User notifications

### Banking Sector Events

#### ACCOUNT_CREATED

Published when a new bank account is created.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "eventType": "ACCOUNT_CREATED",
    "sectorCode": "BANKING",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T10:30:00",
    "payload": {
        "accountId": 789,
        "accountNumber": "1234567890",
        "accountType": "CHECKING",
        "initialBalance": 1000.00,
        "currency": "USD"
    },
    "metadata": {
        "source": "banking-service",
        "version": "1.0"
    }
}
```


#### TRANSACTION_PROCESSED

Published when a transaction is completed.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440001",
    "eventType": "TRANSACTION_PROCESSED",
    "sectorCode": "BANKING",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T11:45:00",
    "payload": {
        "transactionId": 456,
        "accountId": 789,
        "transactionType": "WITHDRAWAL",
        "amount": 50.00,
        "currency": "USD",
        "referenceNumber": "TXN-2024-001",
        "newBalance": 950.00
    },
    "metadata": {
        "source": "banking-service",
        "version": "1.0"
    }
}
```

#### BALANCE_UPDATED

Published when account balance changes.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440002",
    "eventType": "BALANCE_UPDATED",
    "sectorCode": "BANKING",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T11:45:01",
    "payload": {
        "accountId": 789,
        "previousBalance": 1000.00,
        "newBalance": 950.00,
        "changeAmount": -50.00,
        "reason": "TRANSACTION"
    },
    "metadata": {
        "source": "banking-service",
        "version": "1.0"
    }
}
```

### Healthcare Sector Events

#### APPOINTMENT_SCHEDULED

Published when a new appointment is scheduled.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440003",
    "eventType": "APPOINTMENT_SCHEDULED",
    "sectorCode": "HEALTHCARE",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T09:00:00",
    "payload": {
        "appointmentId": 789,
        "patientId": 123,
        "providerId": 456,
        "appointmentType": "CONSULTATION",
        "scheduledTime": "2024-10-25T14:00:00",
        "durationMinutes": 30
    },
    "metadata": {
        "source": "healthcare-service",
        "version": "1.0"
    }
}
```


#### PATIENT_REGISTERED

Published when a new patient is registered.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440004",
    "eventType": "PATIENT_REGISTERED",
    "sectorCode": "HEALTHCARE",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T08:30:00",
    "payload": {
        "patientId": 789,
        "medicalRecordNumber": "MRN-2024-001",
        "dateOfBirth": "1990-05-15",
        "bloodType": "O+"
    },
    "metadata": {
        "source": "healthcare-service",
        "version": "1.0"
    }
}
```

### Education Sector Events

#### STUDENT_ENROLLED

Published when a student enrolls in a course.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440005",
    "eventType": "STUDENT_ENROLLED",
    "sectorCode": "EDUCATION",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T10:00:00",
    "payload": {
        "enrollmentId": 789,
        "studentId": 123,
        "courseId": 456,
        "courseCode": "CS101",
        "semester": "Fall 2024"
    },
    "metadata": {
        "source": "education-service",
        "version": "1.0"
    }
}
```

#### GRADE_SUBMITTED

Published when a grade is submitted for a student.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440006",
    "eventType": "GRADE_SUBMITTED",
    "sectorCode": "EDUCATION",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T16:00:00",
    "payload": {
        "gradeId": 789,
        "studentId": 123,
        "courseId": 456,
        "grade": "A",
        "points": 95.5,
        "submittedBy": 789
    },
    "metadata": {
        "source": "education-service",
        "version": "1.0"
    }
}
```


### Retail Sector Events

#### ORDER_PLACED

Published when a customer places an order.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440007",
    "eventType": "ORDER_PLACED",
    "sectorCode": "RETAIL",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T12:30:00",
    "payload": {
        "orderId": 789,
        "orderNumber": "ORD-2024-001",
        "totalAmount": 299.99,
        "currency": "USD",
        "itemCount": 3,
        "shippingAddress": {
            "street": "123 Main St",
            "city": "New York",
            "state": "NY",
            "zip": "10001"
        }
    },
    "metadata": {
        "source": "retail-service",
        "version": "1.0"
    }
}
```

#### PAYMENT_PROCESSED

Published when payment is successfully processed.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440008",
    "eventType": "PAYMENT_PROCESSED",
    "sectorCode": "RETAIL",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T12:31:00",
    "payload": {
        "paymentId": 456,
        "orderId": 789,
        "amount": 299.99,
        "currency": "USD",
        "paymentMethod": "CREDIT_CARD",
        "transactionId": "TXN-STRIPE-123456"
    },
    "metadata": {
        "source": "retail-service",
        "version": "1.0"
    }
}
```

### Manufacturing Sector Events

#### PRODUCTION_STARTED

Published when production begins for a batch.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440009",
    "eventType": "PRODUCTION_STARTED",
    "sectorCode": "MANUFACTURING",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T08:00:00",
    "payload": {
        "batchId": 789,
        "productId": 456,
        "quantity": 1000,
        "expectedCompletionDate": "2024-10-25",
        "productionLine": "LINE-A"
    },
    "metadata": {
        "source": "manufacturing-service",
        "version": "1.0"
    }
}
```


#### QUALITY_CHECK_COMPLETED

Published when quality inspection is completed.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440010",
    "eventType": "QUALITY_CHECK_COMPLETED",
    "sectorCode": "MANUFACTURING",
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T14:00:00",
    "payload": {
        "qualityCheckId": 789,
        "batchId": 456,
        "result": "PASSED",
        "defectCount": 5,
        "inspectedBy": 123,
        "notes": "Minor defects within acceptable range"
    },
    "metadata": {
        "source": "manufacturing-service",
        "version": "1.0"
    }
}
```

### Audit Events

#### USER_LOGIN

Published when a user successfully logs in.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440011",
    "eventType": "USER_LOGIN",
    "sectorCode": null,
    "userId": 123,
    "organizationId": 456,
    "timestamp": "2024-10-23T09:00:00",
    "payload": {
        "username": "john.doe",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "loginMethod": "PASSWORD"
    },
    "metadata": {
        "source": "auth-service",
        "version": "1.0"
    }
}
```

#### AUTHORIZATION_FAILURE

Published when authorization fails.

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440012",
    "eventType": "AUTHORIZATION_FAILURE",
    "sectorCode": "BANKING",
    "userId": 123,
    "organizationId": null,
    "timestamp": "2024-10-23T10:15:00",
    "payload": {
        "resource": "/api/sectors/banking/accounts/999",
        "action": "GET",
        "reason": "User does not have access to this account",
        "ipAddress": "192.168.1.100"
    },
    "metadata": {
        "source": "banking-service",
        "version": "1.0"
    }
}
```

### Event Consumer Implementation

Example consumer for handling events:

```java
@Service
@Slf4j
public class SectorEventConsumer {
    
    @KafkaListener(topics = "sector-events-banking", groupId = "banking-consumer")
    public void consumeBankingEvent(SectorEvent event) {
        log.info("Received event: {} for user: {}", event.getEventType(), event.getUserId());
        
        switch (event.getEventType()) {
            case "ACCOUNT_CREATED":
                handleAccountCreated(event);
                break;
            case "TRANSACTION_PROCESSED":
                handleTransactionProcessed(event);
                break;
            default:
                log.warn("Unknown event type: {}", event.getEventType());
        }
    }
}
```


---

## API Development Guidelines

### REST API Conventions

#### Endpoint Structure

All sector-specific endpoints follow this pattern:

```
/api/sectors/{sectorCode}/{resource}
```

Examples:
- `/api/sectors/banking/accounts`
- `/api/sectors/healthcare/appointments`
- `/api/sectors/education/courses`

#### HTTP Methods

- `GET` - Retrieve resources
- `POST` - Create new resources
- `PUT` - Update existing resources (full update)
- `PATCH` - Partial update of resources
- `DELETE` - Delete resources

#### Response Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `500 Internal Server Error` - Server error

#### Request/Response Format

All requests and responses use JSON format.

**Request Example:**
```json
POST /api/sectors/banking/accounts
Content-Type: application/json
Authorization: Bearer {jwt-token}

{
    "accountType": "CHECKING",
    "initialDeposit": 1000.00,
    "currency": "USD"
}
```

**Response Example:**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
    "id": 789,
    "accountNumber": "1234567890",
    "accountType": "CHECKING",
    "balance": 1000.00,
    "currency": "USD",
    "status": "ACTIVE",
    "createdAt": "2024-10-23T10:30:00"
}
```

#### Error Response Format

```json
{
    "status": 400,
    "message": "Invalid account type",
    "timestamp": "2024-10-23T10:30:00",
    "errors": [
        {
            "field": "accountType",
            "message": "Must be one of: CHECKING, SAVINGS, INVESTMENT"
        }
    ]
}
```

### Authentication & Authorization

#### JWT Token Structure

```json
{
    "sub": "john.doe",
    "userId": 123,
    "sectorId": 1,
    "sectorCode": "BANKING",
    "organizationId": 456,
    "roles": ["USER"],
    "iat": 1698062400,
    "exp": 1698066000
}
```

#### Accessing Sector Context

In controllers, access the sector context from request attributes:

```java
@GetMapping
public ResponseEntity<?> getResources(HttpServletRequest request) {
    SectorContext context = (SectorContext) request.getAttribute("sectorContext");
    Long userId = context.getUserId();
    String sectorCode = context.getSectorCode();
    // Use context for authorization and data filtering
}
```


### Pagination

For endpoints returning lists, implement pagination:

**Request:**
```
GET /api/sectors/banking/transactions?page=0&size=20&sort=createdAt,desc
```

**Response:**
```json
{
    "content": [...],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 20,
        "sort": {
            "sorted": true,
            "unsorted": false
        }
    },
    "totalPages": 5,
    "totalElements": 100,
    "last": false,
    "first": true
}
```

**Implementation:**
```java
@GetMapping
public ResponseEntity<Page<Transaction>> getTransactions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
    Page<Transaction> transactions = service.getTransactions(pageable);
    return ResponseEntity.ok(transactions);
}
```

### Filtering and Search

Support filtering with query parameters:

```
GET /api/sectors/banking/accounts?status=ACTIVE&accountType=CHECKING
```

**Implementation:**
```java
@GetMapping
public ResponseEntity<List<Account>> getAccounts(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String accountType) {
    
    List<Account> accounts = service.getAccounts(status, accountType);
    return ResponseEntity.ok(accounts);
}
```

---

## Frontend Development Guidelines

### Component Structure

Follow this structure for sector modules:

```
features/{sector}/
├── components/          # UI components
│   ├── Dashboard.jsx
│   ├── List.jsx
│   ├── Form.jsx
│   └── Details.jsx
├── services/           # API services
│   └── api.js
├── store/              # Redux slices
│   └── slice.js
├── hooks/              # Custom hooks
│   └── useEntity.js
├── utils/              # Utility functions
│   └── helpers.js
└── Module.jsx          # Main module component
```

### State Management

Use Redux Toolkit for state management:

```javascript
// Async thunks for API calls
export const fetchEntities = createAsyncThunk(
    'sector/fetchEntities',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getAllEntities();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice definition
const slice = createSlice({
    name: 'sector',
    initialState: {
        entities: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEntities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEntities.fulfilled, (state, action) => {
                state.loading = false;
                state.entities = action.payload;
            })
            .addCase(fetchEntities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
```


### Custom Hooks

Create reusable hooks for common operations:

```javascript
// useEntity.js
export const useEntity = (entityId) => {
    const dispatch = useDispatch();
    const entity = useSelector(state => 
        state.sector.entities.find(e => e.id === entityId)
    );
    const loading = useSelector(state => state.sector.loading);
    
    useEffect(() => {
        if (!entity && entityId) {
            dispatch(fetchEntityById(entityId));
        }
    }, [entityId, entity, dispatch]);
    
    return { entity, loading };
};
```

### Styling with Tailwind

Use Tailwind CSS for styling with sector-specific themes:

```javascript
const SectorCard = ({ sector, children }) => {
    const theme = sectorThemes[sector.code.toLowerCase()];
    
    return (
        <div 
            className="rounded-lg shadow-md p-6"
            style={{ 
                backgroundColor: theme.background,
                borderLeft: `4px solid ${theme.primary}`
            }}
        >
            {children}
        </div>
    );
};
```

### Form Handling

Use controlled components with validation:

```javascript
const EntityForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    
    const validate = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
            <button type="submit">Submit</button>
        </form>
    );
};
```

### Error Handling

Implement consistent error handling:

```javascript
// Error interceptor in api.js
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Redirect to login
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            // Show unauthorized message
            toast.error('You do not have permission to access this resource');
        } else {
            // Show generic error
            toast.error(error.response?.data?.message || 'An error occurred');
        }
        return Promise.reject(error);
    }
);
```

---

## Testing Guidelines

### Backend Testing

#### Unit Tests

Test service layer with mocked dependencies:

```java
@ExtendWith(MockitoExtension.class)
class NewSectorServiceTest {
    
    @Mock
    private NewSectorEntityRepository repository;
    
    @Mock
    private KafkaProducerService kafkaProducerService;
    
    @InjectMocks
    private NewSectorService service;
    
    @Test
    void shouldCreateEntity() {
        // Arrange
        NewSectorEntity entity = NewSectorEntity.builder()
            .name("Test Entity")
            .build();
        
        when(repository.save(any())).thenReturn(entity);
        
        // Act
        NewSectorEntity result = service.createEntity(entity, 1L);
        
        // Assert
        assertNotNull(result);
        verify(kafkaProducerService).publishSectorEvent(
            eq("NEWSECTOR"), 
            eq("ENTITY_CREATED"), 
            eq(1L), 
            any()
        );
    }
}
```


#### Integration Tests

Test API endpoints with TestContainers:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class NewSectorControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private NewSectorEntityRepository repository;
    
    private String authToken;
    
    @BeforeEach
    void setUp() {
        // Get auth token
        authToken = getAuthToken();
    }
    
    @Test
    void shouldCreateEntity() {
        // Arrange
        NewSectorEntity entity = NewSectorEntity.builder()
            .name("Test Entity")
            .description("Test Description")
            .build();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        HttpEntity<NewSectorEntity> request = new HttpEntity<>(entity, headers);
        
        // Act
        ResponseEntity<NewSectorEntity> response = restTemplate.postForEntity(
            "/api/sectors/newsector/entities",
            request,
            NewSectorEntity.class
        );
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody().getId());
    }
}
```

### Frontend Testing

#### Component Tests

Test components with React Testing Library:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import EntityForm from '../EntityForm';
import { store } from '../../../store';

describe('EntityForm', () => {
    const mockOnSubmit = jest.fn();
    
    const renderForm = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <EntityForm onSubmit={mockOnSubmit} />
                </BrowserRouter>
            </Provider>
        );
    };
    
    it('should render form fields', () => {
        renderForm();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
    
    it('should validate required fields', async () => {
        renderForm();
        
        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
        
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    
    it('should submit valid form', async () => {
        renderForm();
        
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Test Entity' }
        });
        
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'Test Entity'
            });
        });
    });
});
```

#### API Integration Tests

Test API integration with MSW (Mock Service Worker):

```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { newsectorApi } from '../newsectorApi';

const server = setupServer(
    rest.get('/api/sectors/newsector/entities', (req, res, ctx) => {
        return res(ctx.json([
            { id: 1, name: 'Entity 1' },
            { id: 2, name: 'Entity 2' }
        ]));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('newsectorApi', () => {
    it('should fetch entities', async () => {
        const entities = await newsectorApi.getAllEntities();
        expect(entities).toHaveLength(2);
        expect(entities[0].name).toBe('Entity 1');
    });
});
```

---

## Security Considerations

### Authentication Security

1. **JWT Token Management**
   - Use short-lived access tokens (15 minutes)
   - Implement refresh token mechanism
   - Store tokens securely (httpOnly cookies or secure storage)

2. **Password Security**
   - Use BCrypt with appropriate work factor (12+)
   - Enforce strong password policies
   - Implement password reset with secure tokens

3. **Rate Limiting**
   - Limit login attempts (5 per 15 minutes)
   - Implement API rate limiting
   - Use exponential backoff for failed attempts

### Authorization Security

1. **Sector-Based Access Control**
   - Validate sector assignment on every request
   - Use SectorAuthorizationFilter for automatic validation
   - Return 403 for unauthorized sector access

2. **Row-Level Security**
   - Enable RLS on all sector tables
   - Set database session context for current user
   - Test RLS policies thoroughly

3. **Role-Based Access Control**
   - Define clear role hierarchies
   - Check roles at service layer
   - Use method-level security annotations

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteEntity(Long id) {
    // Only admins can delete
}
```

### Data Security

1. **Encryption at Rest**
   - Enable PostgreSQL encryption
   - Encrypt sensitive fields (PII, financial data)
   - Use AES-256 for field-level encryption

2. **Encryption in Transit**
   - Use TLS 1.3 for all connections
   - Configure HTTPS for frontend
   - Use SSL for database connections

3. **Data Masking**
   - Mask sensitive data in logs
   - Implement data masking for non-production environments
   - Sanitize error messages

### Input Validation

1. **Backend Validation**
   - Use Bean Validation annotations
   - Validate all user inputs
   - Sanitize inputs to prevent injection attacks

```java
public class EntityRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @Email(message = "Invalid email format")
    private String email;
}
```

2. **Frontend Validation**
   - Validate inputs before submission
   - Use appropriate input types
   - Implement client-side sanitization

### Audit and Monitoring

1. **Comprehensive Logging**
   - Log all authentication attempts
   - Log authorization failures
   - Log data access operations

2. **Security Monitoring**
   - Monitor for suspicious patterns
   - Alert on multiple failed login attempts
   - Track unauthorized access attempts

3. **Compliance**
   - Maintain audit trails for compliance
   - Implement data retention policies
   - Support GDPR/CCPA requirements

---

## Troubleshooting

### Common Issues

#### Issue: Sector Detection Fails

**Symptoms:**
- User redirected to sector selection page despite having assigned sector
- 403 errors when accessing sector endpoints

**Solutions:**
1. Check user's sector assignment in database:
```sql
SELECT u.id, u.username, s.code, s.name 
FROM core.users u 
LEFT JOIN core.sectors s ON u.sector_id = s.id 
WHERE u.username = 'username';
```

2. Verify JWT token contains sector information
3. Check SectorDetectionService cache
4. Ensure sector is enabled in database

#### Issue: Row-Level Security Blocking Queries

**Symptoms:**
- Queries return empty results
- Users cannot access their own data

**Solutions:**
1. Verify RLS policies are correctly configured
2. Check database session context is set:
```sql
SELECT current_setting('app.current_user_id');
```

3. Ensure application sets context before queries:
```java
@Before("execution(* com.example.cms..*Repository.*(..))")
public void setDatabaseContext() {
    // Set session context
}
```

4. Test RLS policies with different users

#### Issue: Kafka Events Not Being Consumed

**Symptoms:**
- Events published but not processed
- Consumer lag increasing

**Solutions:**
1. Check Kafka broker status:
```bash
docker-compose ps kafka
```

2. Verify topic exists:
```bash
kafka-topics --list --bootstrap-server localhost:9092
```

3. Check consumer group status:
```bash
kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group newsector-consumer-group
```

4. Review consumer logs for errors
5. Verify consumer is subscribed to correct topic

#### Issue: Frontend Module Not Loading

**Symptoms:**
- Blank page when navigating to sector
- Module not found errors

**Solutions:**
1. Verify module is registered in router
2. Check import paths are correct
3. Ensure Redux slice is registered
4. Check browser console for errors
5. Verify API endpoints are accessible

#### Issue: Database Migration Fails

**Symptoms:**
- Application fails to start
- Migration errors in logs

**Solutions:**
1. Check migration file syntax
2. Verify migration order (version numbers)
3. Check database connection
4. Review Flyway/Liquibase logs
5. Manually fix database if needed:
```sql
-- Check migration history
SELECT * FROM flyway_schema_history;

-- Mark migration as successful if manually fixed
UPDATE flyway_schema_history SET success = true WHERE version = 'X.X';
```

### Performance Issues

#### Slow Database Queries

**Diagnosis:**
```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Check slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Solutions:**
1. Add missing indexes
2. Optimize queries with EXPLAIN ANALYZE
3. Implement query result caching
4. Use pagination for large result sets

#### High Memory Usage

**Diagnosis:**
- Monitor JVM heap usage
- Check for memory leaks
- Review connection pool settings

**Solutions:**
1. Adjust JVM heap size:
```
-Xms512m -Xmx2g
```

2. Optimize connection pool:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

3. Implement caching strategically
4. Profile application with JProfiler/VisualVM

### Getting Help

1. **Check Documentation**
   - Review this guide
   - Check API documentation
   - Review design document

2. **Search Logs**
   - Backend logs: `backend/logs/`
   - Frontend console
   - Database logs

3. **Contact Team**
   - Create issue in issue tracker
   - Reach out on team chat
   - Schedule pair programming session

---

## Conclusion

This developer guide provides comprehensive documentation for working with the sector architecture framework. Follow these guidelines to ensure consistency, security, and maintainability across all sectors.

For questions or clarifications, please refer to the design document or contact the development team.

**Last Updated:** October 23, 2024
**Version:** 1.0
