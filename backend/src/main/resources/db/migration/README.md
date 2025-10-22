# Database Migration Guide

## Overview

This directory contains database migration scripts for the Sector Architecture Framework enhancement. The application uses Hibernate's `ddl-auto=update` mode, which automatically creates and updates the database schema based on JPA entities.

## Migration Strategy

### Automatic Schema Updates (Current Approach)

The application is configured with `spring.jpa.hibernate.ddl-auto=update` in `application.properties`. This means:

1. **New Tables**: Hibernate will automatically create new tables (e.g., `organizations`, `user_roles`, `audit_log`)
2. **New Columns**: Hibernate will add new columns to existing tables (e.g., `email`, `user_type`, `organization_id` in `users` table)
3. **Enhanced Columns**: Hibernate will add new columns to `sectors` table (e.g., `code`, `route_path`, `configuration`, `enabled`, `display_order`)

### Data Initialization

The `data.sql` file in the resources directory contains seed data that will be executed after schema creation. This includes:

- Enhanced sector definitions with all new fields
- Sample organizations
- Updated user records with email and user_type fields

## Migration Files

### V1__initial_schema_enhancement.sql

This file contains manual migration scripts for reference. It includes:

- ALTER TABLE statements for adding new columns
- CREATE TABLE statements for new tables
- Index creation for performance optimization
- Foreign key constraints

**Note**: This file is for reference only. Hibernate will handle most of these changes automatically.

### V2__seed_sector_data.sql

Contains INSERT statements for populating sectors with enhanced data. This is also handled by `data.sql` but provided here for reference.

## Manual Migration (Optional)

If you prefer to use manual migrations instead of Hibernate's auto-update:

1. Change `spring.jpa.hibernate.ddl-auto=update` to `spring.jpa.hibernate.ddl-auto=validate` in `application.properties`
2. Install Flyway or Liquibase
3. Execute the migration scripts in order

### Using Flyway

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Configure in `application.properties`:
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

## Schema Changes Summary

### New Tables

1. **organizations**
   - id (BIGSERIAL PRIMARY KEY)
   - name (VARCHAR NOT NULL)
   - domain (VARCHAR)
   - sector_id (BIGINT NOT NULL, FK to sectors)
   - settings (JSONB)
   - active (BOOLEAN DEFAULT true)
   - created_at (TIMESTAMP)

2. **user_roles**
   - user_id (BIGINT, FK to users)
   - role_name (VARCHAR)
   - PRIMARY KEY (user_id, role_name)

3. **audit_log**
   - id (BIGSERIAL PRIMARY KEY)
   - user_id (BIGINT NOT NULL)
   - sector_id (BIGINT)
   - organization_id (BIGINT)
   - action (VARCHAR NOT NULL)
   - resource_type (VARCHAR)
   - resource_id (VARCHAR)
   - details (JSONB)
   - ip_address (VARCHAR)
   - timestamp (TIMESTAMP)

### Enhanced Tables

#### sectors
- Added: code (VARCHAR UNIQUE NOT NULL)
- Added: icon (VARCHAR)
- Added: route_path (VARCHAR NOT NULL)
- Added: configuration (JSONB)
- Added: enabled (BOOLEAN DEFAULT true)
- Added: display_order (INTEGER DEFAULT 0)

#### users
- Added: email (VARCHAR UNIQUE NOT NULL)
- Added: user_type (VARCHAR NOT NULL DEFAULT 'INDIVIDUAL')
- Added: organization_id (BIGINT, FK to organizations)
- Added: enabled (BOOLEAN DEFAULT true)
- Added: created_at (TIMESTAMP)
- Added: last_login (TIMESTAMP)

## Rollback Strategy

If you need to rollback changes:

1. Backup your database before running the application
2. Use database-specific tools to restore from backup
3. For manual rollback, create reverse migration scripts

## Testing

After migration:

1. Verify all tables exist: `\dt` in psql
2. Check table structures: `\d table_name`
3. Verify data integrity: Check foreign key constraints
4. Test application startup and basic operations

## Notes

- JSONB columns are used for flexible configuration storage (PostgreSQL specific)
- All timestamps use `LocalDateTime` in Java, stored as TIMESTAMP in database
- Indexes are created on foreign keys and frequently queried columns for performance
- Row-level security policies can be enabled manually if needed (see V1 script)
