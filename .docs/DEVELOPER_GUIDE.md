# Developer Guide

## Overview

This guide provides comprehensive information for developers working on the Sector Architecture Framework. It covers how to add new sectors, understand the database schema, work with Kafka events, and follow best practices.

---

## Table of Contents

1. [Adding a New Sector](#adding-a-new-sector)
2. [Database Schema](#database-schema)
3. [Kafka Event Schemas](#kafka-event-schemas)
4. [Development Environment Setup](#development-environment-setup)
5. [Code Structure](#code-structure)
6. [Testing Guidelines](#testing-guidelines)
7. [Security Best Practices](#security-best-practices)
8. [Performance Optimization](#performance-optimization)

---

## Adding a New Sector

This section provides a step-by-step guide for adding a new sector to the system.

### Step 1: Database Setup

1. **Create Sector Record**

Insert a new sector into the `sectors` table:

```sql
INSERT INTO sectors (code, name, description, icon, route_path, enabled, display_order)
VALUES (
    'RETAIL',
    'Retail & E-commerce',
    'Retail operations and e-commerce management',
    'retail-icon.svg',
    '/retail',
    true,
    4
);
```

2. **Create Sector-Specific Schema (Optional)**

If your sector requires isolated data:

```sql
CREATE SCHEMA retail;

-- Create sector-specific tables
CREATE TABLE retail.products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    user_id BIGINT NOT NULL,
    organization_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES core.users(id),
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id)
);

-- Enable row-level security
ALTER TABLE retail.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY retail_product_access ON retail.products
    USING (
        user_id = current_setting('app.current_user_id')::BIGINT
        OR organization_id = current_setting('app.current_org_id')::BIGINT
    );
```

### Step 2: Backend Implementation

1. **Create Entity Classes**

Create entities in `backend/src/main/java/com/example/cms/entity/`:

```java
@Entity
@Table(name = "products", schema = "retail")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String sku;
    private BigDecimal price;
    private Integer stockQuantity;
    private Long userId;
    private Long organizationId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

2. **Create Repository**

Create repository in `backend/src/main/java/com/example/cms/repository/`:

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUserId(Long userId);
    List<Product> findByOrganizationId(Long organizationId);
    Optional<Product> findBySku(String sku);
}
```

3. **Create Service Layer**

Create service in `backend/src/main/java/com/example/cms/service/`:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class RetailService {
    
    private final ProductRepository productRepository;
    private final KafkaProducerService kafkaProducerService;
    
    public Product createProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        
        // Publish event to Kafka
        Map<String, Object> payload = new HashMap<>();
        payload.put("productId", savedProduct.getId());
        payload.put("sku", savedProduct.getSku());
        payload.put("name", savedProduct.getName());
        
        kafkaProducerService.publishSectorEvent(
            "RETAIL",
            "PRODUCT_CREATED",
            savedProduct.getUserId(),
            savedProduct.getOrganizationId(),
            payload,
            new HashMap<>()
        );
        
        return savedProduct;
    }
    
    public List<Product> getProductsByUser(Long userId) {
        return productRepository.findByUserId(userId);
    }
}
```

4. **Create Controller**

Create controller in `backend/src/main/java/com/example/cms/controller/`:

```java
@RestController
@RequestMapping("/api/retail")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('retail')")
public class RetailController {
    
    private final RetailService retailService;
    
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        // Get current user from security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        // Fetch products for user
        List<Product> products = retailService.getProductsByUser(userId);
        return ResponseEntity.ok(products);
    }
    
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product created = retailService.createProduct(product);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        // Add sector-specific statistics
        return ResponseEntity.ok(stats);
    }
}
```

### Step 3: Kafka Configuration

1. **Add Topic Configuration**

Update `KafkaConfig.java`:

```java
@Bean
public NewTopic retailEventsTopic() {
    return TopicBuilder.name("sector-events-retail")
            .partitions(3)
            .replicas(1)
            .build();
}
```

2. **Add Consumer**

Update `KafkaConsumerService.java`:

```java
@KafkaListener(topics = "sector-events-retail", groupId = "retail-consumer-group")
public void consumeRetailEvents(SectorEvent event) {
    log.info("Received retail event: {}", event.getEventType());
    
    switch (event.getEventType()) {
        case "PRODUCT_CREATED":
            handleProductCreated(event);
            break;
        case "ORDER_PLACED":
            handleOrderPlaced(event);
            break;
        // Add more event handlers
    }
}
```

### Step 4: Frontend Implementation

1. **Create Sector Module**

Create directory structure:
```
frontend/src/
├── components/
│   └── sector-specific/
│       └── retail/
│           ├── RetailDashboard.jsx
│           ├── ProductList.jsx
│           ├── ProductForm.jsx
│           └── RetailStats.jsx
```

2. **Create Dashboard Component**

`RetailDashboard.jsx`:

```javascript
import React, { useEffect, useState } from 'react';
import { SectorLayout } from '../../shared/SectorLayout';
import { ProductList } from './ProductList';
import { RetailStats } from './RetailStats';
import api from '../../../services/api';

export const RetailDashboard = () => {
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    const fetchDashboardData = async () => {
        try {
            const [statsRes, productsRes] = await Promise.all([
                api.get('/retail/dashboard/stats'),
                api.get('/retail/products')
            ]);
            setStats(statsRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };
    
    return (
        <SectorLayout sector={{ code: 'RETAIL', name: 'Retail & E-commerce' }}>
            <div className="retail-dashboard">
                <h1>Retail Dashboard</h1>
                <RetailStats stats={stats} />
                <ProductList products={products} onRefresh={fetchDashboardData} />
            </div>
        </SectorLayout>
    );
};
```

3. **Add Routing**

Update `SectorRouter.jsx`:

```javascript
import { RetailModule } from './sector-specific/retail/RetailModule';

export const SectorRouter = () => {
    // ... existing code
    
    return (
        <Routes>
            <Route path="/banking/*" element={<BankingModule />} />
            <Route path="/healthcare/*" element={<HealthcareModule />} />
            <Route path="/retail/*" element={<RetailModule />} />
            {/* Add more sectors */}
        </Routes>
    );
};
```

4. **Create Theme Configuration**

Update `themes.js`:

```javascript
export const sectorThemes = {
    // ... existing themes
    retail: {
        primary: '#dc2626',      // Red
        secondary: '#eab308',    // Yellow
        accent: '#14b8a6',       // Teal
        background: '#fef2f2',
        text: '#7f1d1d'
    }
};
```

### Step 5: Testing

1. **Backend Tests**

Create `RetailServiceTest.java`:

```java
@SpringBootTest
class RetailServiceTest {
    
    @Autowired
    private RetailService retailService;
    
    @Test
    void shouldCreateProduct() {
        Product product = new Product();
        product.setName("Test Product");
        product.setSku("TEST-001");
        product.setPrice(new BigDecimal("99.99"));
        
        Product created = retailService.createProduct(product);
        
        assertNotNull(created.getId());
        assertEquals("Test Product", created.getName());
    }
}
```

2. **Frontend Tests**

Create `RetailDashboard.test.jsx`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { RetailDashboard } from './RetailDashboard';

test('renders retail dashboard', async () => {
    render(<RetailDashboard />);
    
    await waitFor(() => {
        expect(screen.getByText('Retail Dashboard')).toBeInTheDocument();
    });
});
```

### Step 6: Documentation

1. Update API documentation with new endpoints
2. Add sector-specific user guide
3. Document any custom configurations

---

## Database Schema

### Core Schema

The core schema contains shared tables used across all sectors.

#### Users Table

```sql
CREATE TABLE core.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,  -- 'INDIVIDUAL' or 'ORGANIZATION'
    organization_id BIGINT,
    sector_id BIGINT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id),
    FOREIGN KEY (sector_id) REFERENCES core.sectors(id)
);

-- Indexes
CREATE INDEX idx_users_username ON core.users(username);
CREATE INDEX idx_users_email ON core.users(email);
CREATE INDEX idx_users_sector_id ON core.users(sector_id);
CREATE INDEX idx_users_organization_id ON core.users(organization_id);

-- Row-level security
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation_policy ON core.users
    USING (
        id = current_setting('app.current_user_id')::BIGINT
        OR current_setting('app.current_user_role') = 'ADMIN'
    );
```

#### Organizations Table

```sql
CREATE TABLE core.organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    sector_id BIGINT NOT NULL,
    settings JSONB,  -- Flexible JSON configuration
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES core.sectors(id)
);

-- Indexes
CREATE INDEX idx_organizations_sector_id ON core.organizations(sector_id);
CREATE INDEX idx_organizations_domain ON core.organizations(domain);
CREATE INDEX idx_organizations_active ON core.organizations(active);
```

#### Sectors Table

```sql
CREATE TABLE core.sectors (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    route_path VARCHAR(255) NOT NULL,
    configuration JSONB,  -- Sector-specific configuration
    enabled BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_sectors_code ON core.sectors(code);
CREATE INDEX idx_sectors_enabled ON core.sectors(enabled);
CREATE INDEX idx_sectors_display_order ON core.sectors(display_order);
```

#### Audit Log Table

```sql
CREATE TABLE core.audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sector_id BIGINT NOT NULL,
    organization_id BIGINT,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES core.users(id),
    FOREIGN KEY (sector_id) REFERENCES core.sectors(id),
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id)
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_log_user_id ON core.audit_log(user_id);
CREATE INDEX idx_audit_log_sector_id ON core.audit_log(sector_id);
CREATE INDEX idx_audit_log_timestamp ON core.audit_log(timestamp);
CREATE INDEX idx_audit_log_action ON core.audit_log(action);
```

### Sector-Specific Schemas

#### Banking Schema

```sql
CREATE SCHEMA banking;

CREATE TABLE banking.accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    organization_id BIGINT,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES core.users(id),
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id)
);

CREATE TABLE banking.transactions (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    reference_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES banking.accounts(id)
);

-- Indexes
CREATE INDEX idx_banking_accounts_user_id ON banking.accounts(user_id);
CREATE INDEX idx_banking_accounts_org_id ON banking.accounts(organization_id);
CREATE INDEX idx_banking_transactions_account_id ON banking.transactions(account_id);
CREATE INDEX idx_banking_transactions_status ON banking.transactions(status);
```

#### Healthcare Schema

```sql
CREATE SCHEMA healthcare;

CREATE TABLE healthcare.patients (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20),
    condition TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    contact_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    user_id BIGINT NOT NULL,
    organization_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES core.users(id),
    FOREIGN KEY (organization_id) REFERENCES core.organizations(id)
);

CREATE TABLE healthcare.appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(255),
    doctor_name VARCHAR(255),
    appointment_time TIMESTAMP NOT NULL,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES healthcare.patients(id)
);

-- Indexes
CREATE INDEX idx_healthcare_patients_user_id ON healthcare.patients(user_id);
CREATE INDEX idx_healthcare_patients_org_id ON healthcare.patients(organization_id);
CREATE INDEX idx_healthcare_appointments_patient_id ON healthcare.appointments(patient_id);
CREATE INDEX idx_healthcare_appointments_time ON healthcare.appointments(appointment_time);
```

### Database Migration Strategy

Use Flyway or Liquibase for database migrations:

1. Create migration files in `backend/src/main/resources/db/migration/`
2. Name files with version prefix: `V1__core_schema.sql.`, `V2__add_retail_sector.sql`
3. Run migrations automatically on application startup

---

## Kafka Event Schemas

### SectorEvent Schema

The primary event model for sector-specific operations.

```json
{
  "eventId": "uuid-string",
  "eventType": "EVENT_TYPE_NAME",
  "sectorCode": "SECTOR_CODE",
  "userId": 123,
  "organizationId": 456,
  "timestamp": "2024-01-15T10:30:00",
  "payload": {
    "key1": "value1",
    "key2": "value2"
  },
  "metadata": {
    "source": "service-name",
    "version": "1.0"
  }
}
```

**Field Descriptions:**

- `eventId`: Unique identifier for the event (UUID)
- `eventType`: Type of event (e.g., ACCOUNT_CREATED, PATIENT_REGISTERED)
- `sectorCode`: Sector code (BANKING, HEALTHCARE, etc.)
- `userId`: ID of the user who triggered the event
- `organizationId`: ID of the organization (null for individual users)
- `timestamp`: When the event occurred (ISO 8601 format)
- `payload`: Event-specific data (flexible JSON object)
- `metadata`: Additional context about the event

### Event Types by Sector

#### Banking Events

- `ACCOUNT_CREATED` - New bank account created
- `ACCOUNT_UPDATED` - Account details updated
- `TRANSACTION_PROCESSED` - Transaction completed
- `TRANSACTION_FAILED` - Transaction failed
- `BALANCE_UPDATED` - Account balance changed
- `LOAN_APPROVED` - Loan application approved
- `LOAN_REJECTED` - Loan application rejected

**Example - ACCOUNT_CREATED:**
```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "ACCOUNT_CREATED",
  "sectorCode": "BANKING",
  "userId": 123,
  "organizationId": 456,
  "timestamp": "2024-01-15T10:30:00",
  "payload": {
    "accountId": 789,
    "accountNumber": "ACC001",
    "accountType": "SAVINGS",
    "initialBalance": 1000.00,
    "currency": "USD"
  },
  "metadata": {
    "source": "banking-service",
    "version": "1.0"
  }
}
```

#### Healthcare Events

- `PATIENT_REGISTERED` - New patient registered
- `PATIENT_UPDATED` - Patient information updated
- `APPOINTMENT_SCHEDULED` - Appointment created
- `APPOINTMENT_CANCELLED` - Appointment cancelled
- `APPOINTMENT_COMPLETED` - Appointment finished
- `PRESCRIPTION_ISSUED` - Prescription created
- `LAB_RESULT_READY` - Lab results available

**Example - APPOINTMENT_SCHEDULED:**
```json
{
  "eventId": "660e8400-e29b-41d4-a716-446655440001",
  "eventType": "APPOINTMENT_SCHEDULED",
  "sectorCode": "HEALTHCARE",
  "userId": 234,
  "organizationId": 567,
  "timestamp": "2024-01-15T11:00:00",
  "payload": {
    "appointmentId": 890,
    "patientId": 345,
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "appointmentTime": "2024-01-20T10:00:00",
    "type": "CHECKUP"
  },
  "metadata": {
    "source": "healthcare-service",
    "version": "1.0"
  }
}
```

### AuditEvent Schema

Used for audit logging and compliance tracking.

```json
{
  "id": "uuid-string",
  "userId": 123,
  "sectorId": 1,
  "organizationId": 456,
  "action": "ACTION_NAME",
  "resourceType": "RESOURCE_TYPE",
  "resourceId": "resource-id",
  "details": "Action details",
  "ipAddress": "192.168.1.1",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Common Actions:**
- `LOGIN` - User logged in
- `LOGOUT` - User logged out
- `CREATE` - Resource created
- `UPDATE` - Resource updated
- `DELETE` - Resource deleted
- `VIEW` - Resource viewed
- `EXPORT` - Data exported
- `UNAUTHORIZED_ACCESS` - Access denied

### Kafka Topics

**Topic Naming Convention:** `sector-events-{sectorCode}`

- `sector-events-banking`
- `sector-events-healthcare`
- `sector-events-education`
- `sector-events-retail`
- `sector-events-manufacturing`
- `audit-events` (cross-sector)
- `notification-events` (cross-sector)

**Topic Configuration:**
- Partitions: 3 (configurable based on load)
- Replication Factor: 1 (development), 3 (production)
- Retention: 7 days (configurable)

### Publishing Events

```java
// In your service class
kafkaProducerService.publishSectorEvent(
    "BANKING",                    // sectorCode
    "ACCOUNT_CREATED",            // eventType
    userId,                       // userId
    organizationId,               // organizationId (can be null)
    payload,                      // Map<String, Object>
    metadata                      // Map<String, String>
);
```

### Consuming Events

```java
@KafkaListener(topics = "sector-events-banking", groupId = "banking-consumer-group")
public void consumeBankingEvents(SectorEvent event) {
    log.info("Received event: {}", event.getEventType());
    
    // Process event based on type
    switch (event.getEventType()) {
        case "ACCOUNT_CREATED":
            handleAccountCreated(event);
            break;
        // Add more handlers
    }
}
```

---

## Development Environment Setup

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 15
- Docker and Docker Compose
- Maven 3.8+
- Git

### Local Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd cms-project
```

2. **Start Infrastructure Services**
```bash
docker-compose up -d postgres kafka zookeeper
```

3. **Configure Backend**

Create `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cms_db
spring.datasource.username=postgres
spring.datasource.password=postgres

spring.kafka.bootstrap-servers=localhost:9092

jwt.secret=your-secret-key-here
jwt.expiration=900000

encryption.key=your-encryption-key-here
```

4. **Build and Run Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

5. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

6. **Run Frontend**
```bash
npm run dev
```

7. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html (if configured)

### Docker Development

Run entire stack with Docker Compose:
```bash
docker-compose up --build
```

---

## Code Structure

### Backend Structure

```
backend/src/main/java/com/example/cms/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── KafkaConfig.java
│   └── CacheConfig.java
├── controller/          # REST controllers
│   ├── AuthController.java
│   ├── SectorController.java
│   └── BankingController.java
├── service/             # Business logic
│   ├── AuthService.java
│   ├── SectorDetectionService.java
│   └── KafkaProducerService.java
├── repository/          # Data access
│   ├── UserRepository.java
│   └── SectorRepository.java
├── entity/              # JPA entities
│   ├── User.java
│   └── Sector.java
├── dto/                 # Data transfer objects
│   ├── LoginResponse.java
│   └── OrganizationRequest.java
├── security/            # Security components
│   ├── JwtTokenProvider.java
│   └── SectorAuthorizationFilter.java
├── exception/           # Custom exceptions
│   ├── GlobalExceptionHandler.java
│   └── SectorNotFoundException.java
├── event/               # Event models
│   ├── SectorEvent.java
│   └── AuditEvent.java
└── util/                # Utility classes
    └── EncryptionUtil.java
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── shared/              # Shared components
│   │   ├── SectorLayout.jsx
│   │   ├── SectorHeader.jsx
│   │   ├── SectorSidebar.jsx
│   │   └── DataTable.jsx
│   ├── sector-specific/     # Sector modules
│   │   ├── banking/
│   │   ├── healthcare/
│   │   └── retail/
│   ├── ui/                  # UI primitives (Radix)
│   ├── SectorRouter.jsx
│   └── HeroPage.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/
│   ├── api.js               # Axios configuration
│   └── authService.js
├── hooks/
│   ├── useAuth.js
│   └── useSector.js
├── utils/
│   ├── themes.js
│   └── constants.js
├── test/
│   ├── setup.js
│   └── test-utils.jsx
└── App.jsx
```

---

## Testing Guidelines

### Backend Testing

#### Unit Tests

Test individual components in isolation:

```java
@SpringBootTest
class SectorDetectionServiceTest {
    
    @Autowired
    private SectorDetectionService sectorDetectionService;
    
    @MockBean
    private UserRepository userRepository;
    
    @Test
    void shouldDetectUserSector() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setSector(new Sector("BANKING", "Banking"));
        
        when(userRepository.findByUsername("testuser"))
            .thenReturn(Optional.of(user));
        
        // Act
        SectorContext context = sectorDetectionService.detectSector(auth);
        
        // Assert
        assertEquals("BANKING", context.getSectorCode());
    }
}
```

#### Integration Tests

Test complete workflows with TestContainers:

```java
@SpringBootTest
@Testcontainers
class AuthenticationIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:15");
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldLoginSuccessfully() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"admin123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.token").exists());
    }
}
```

### Frontend Testing

#### Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import { SectorLayout } from './SectorLayout';

test('renders sector layout with header', () => {
    const sector = { code: 'BANKING', name: 'Banking' };
    render(<SectorLayout sector={sector} />);
    
    expect(screen.getByText('Banking')).toBeInTheDocument();
});
```

#### Integration Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from './LoginPage';

test('user can login successfully', async () => {
    render(
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
    );
    
    await userEvent.type(screen.getByLabelText('Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
});
```

### Running Tests

**Backend:**
```bash
cd backend
mvn test                    # Run all tests
mvn test -Dtest=ClassName   # Run specific test
```

**Frontend:**
```bash
cd frontend
npm test                    # Run all tests
npm test -- --coverage      # With coverage
```

---

## Security Best Practices

### Authentication

1. **Password Security**
   - Use BCrypt for password hashing
   - Minimum password length: 8 characters
   - Enforce password complexity rules

2. **JWT Tokens**
   - Short expiration time (15 minutes)
   - Use strong secret keys (256-bit minimum)
   - Implement refresh token mechanism
   - Store tokens securely (httpOnly cookies or secure storage)

3. **Rate Limiting**
   - Limit login attempts (5 per 15 minutes)
   - Implement IP-based rate limiting
   - Use Redis for distributed rate limiting in production

### Authorization

1. **Role-Based Access Control**
   - Use Spring Security's `@PreAuthorize` annotations
   - Implement sector-based authorization
   - Check permissions at both controller and service layers

2. **Row-Level Security**
   - Enable PostgreSQL RLS policies
   - Set database session context for current user
   - Validate organization/sector access

### Data Protection

1. **Encryption**
   - Encrypt sensitive data at rest (AES-256)
   - Use TLS for data in transit
   - Implement field-level encryption for PII

2. **Input Validation**
   - Validate all user inputs
   - Use Bean Validation annotations
   - Sanitize data to prevent injection attacks

3. **Audit Logging**
   - Log all authentication attempts
   - Log data access and modifications
   - Include user context in all logs
   - Never log sensitive data (passwords, tokens)

---

## Performance Optimization

### Database Optimization

1. **Indexing Strategy**
```sql
-- Index frequently queried columns
CREATE INDEX idx_users_sector_id ON core.users(sector_id);
CREATE INDEX idx_audit_log_timestamp ON core.audit_log(timestamp);

-- Composite indexes for common queries
CREATE INDEX idx_users_sector_org ON core.users(sector_id, organization_id);
```

2. **Query Optimization**
```java
// Use fetch joins to avoid N+1 queries
@Query("SELECT u FROM User u JOIN FETCH u.sector WHERE u.id = :id")
Optional<User> findByIdWithSector(@Param("id") Long id);

// Use pagination for large result sets
Page<User> findBySectorId(Long sectorId, Pageable pageable);
```

3. **Connection Pooling**
```properties
# HikariCP configuration
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

### Caching Strategy

1. **Application-Level Caching**
```java
@Cacheable(value = "sectors", key = "#id")
public Sector getSectorById(Long id) {
    return sectorRepository.findById(id)
        .orElseThrow(() -> new SectorNotFoundException("Sector not found"));
}

@CacheEvict(value = "sectors", key = "#sector.id")
public Sector updateSector(Sector sector) {
    return sectorRepository.save(sector);
}
```

2. **HTTP Caching**
```java
@GetMapping("/public/sectors")
public ResponseEntity<List<Sector>> getPublicSectors() {
    List<Sector> sectors = sectorService.getEnabledSectors();
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
        .body(sectors);
}
```

3. **Frontend Caching**
```javascript
// Use React Query for API caching
const { data, isLoading } = useQuery(
    ['sectors'],
    () => api.get('/public/sectors'),
    {
        staleTime: 1000 * 60 * 60, // 1 hour
        cacheTime: 1000 * 60 * 60 * 24 // 24 hours
    }
);
```

### Kafka Optimization

1. **Producer Configuration**
```properties
spring.kafka.producer.batch-size=16384
spring.kafka.producer.linger-ms=10
spring.kafka.producer.compression-type=snappy
spring.kafka.producer.acks=1
```

2. **Consumer Configuration**
```properties
spring.kafka.consumer.max-poll-records=500
spring.kafka.consumer.fetch-min-size=1024
spring.kafka.consumer.fetch-max-wait=500
```

3. **Async Processing**
```java
@Async
public void processEvent(SectorEvent event) {
    // Process event asynchronously
}
```

### Frontend Optimization

1. **Code Splitting**
```javascript
// Lazy load sector modules
const BankingModule = lazy(() => import('./sector-specific/banking/BankingModule'));
const HealthcareModule = lazy(() => import('./sector-specific/healthcare/HealthcareModule'));
```

2. **Image Optimization**
- Use WebP format
- Implement lazy loading
- Optimize image sizes

3. **Bundle Optimization**
```javascript
// vite.config.js
export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
                }
            }
        }
    }
};
```

---

## Monitoring and Logging

### Application Logging

1. **Log Levels**
- ERROR: Critical errors requiring immediate attention
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Detailed debugging information

2. **Structured Logging**
```java
log.info("User logged in: userId={}, sectorId={}, timestamp={}", 
    userId, sectorId, LocalDateTime.now());
```

3. **Log Configuration**
```xml
<!-- logback-spring.xml -->
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
</configuration>
```

### Performance Monitoring

1. **Slow Query Logging**
```properties
spring.jpa.properties.hibernate.show_sql=false
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

2. **API Response Time Monitoring**
```java
@Component
public class PerformanceMonitoringService {
    
    public void logSlowRequest(String endpoint, long duration) {
        if (duration > 2000) { // 2 seconds
            log.warn("Slow request detected: endpoint={}, duration={}ms", 
                endpoint, duration);
        }
    }
}
```

### Error Monitoring

1. **Error Rate Tracking**
```java
@Service
public class ErrorRateMonitoringService {
    
    private final AtomicLong errorCount = new AtomicLong(0);
    private final AtomicLong requestCount = new AtomicLong(0);
    
    public void recordError() {
        errorCount.incrementAndGet();
        checkErrorRate();
    }
    
    private void checkErrorRate() {
        double rate = (double) errorCount.get() / requestCount.get();
        if (rate > 0.05) { // 5% error rate
            log.error("High error rate detected: {}%", rate * 100);
            // Trigger alert
        }
    }
}
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL is running: `docker ps`
   - Verify connection string in application.properties
   - Check firewall rules

2. **Kafka Connection Issues**
   - Verify Kafka and Zookeeper are running
   - Check bootstrap servers configuration
   - Review Kafka logs: `docker logs kafka`

3. **Authentication Failures**
   - Verify JWT secret is configured
   - Check token expiration settings
   - Review user credentials in database

4. **Sector Detection Failures**
   - Ensure user has sector assigned
   - Check sector_id foreign key constraint
   - Verify sector is enabled

### Debug Mode

Enable debug logging:
```properties
logging.level.com.example.cms=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.kafka=DEBUG
```

---

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [Quick Start Guide](./QUICK_START_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)

---

## Contributing

1. Create a feature branch from `main`
2. Follow code style guidelines
3. Write tests for new features
4. Update documentation
5. Submit pull request for review

### Code Style

**Java:**
- Follow Google Java Style Guide
- Use Lombok to reduce boilerplate
- Add JavaDoc for public methods

**JavaScript:**
- Follow Airbnb JavaScript Style Guide
- Use ESLint and Prettier
- Add JSDoc for complex functions

### Commit Messages

Follow conventional commits format:
```
feat: add retail sector support
fix: resolve sector detection bug
docs: update API documentation
test: add integration tests for banking
```

---

## Support

For questions or issues:
- Check existing documentation
- Review GitHub issues
- Contact development team
- Consult system architecture diagrams
