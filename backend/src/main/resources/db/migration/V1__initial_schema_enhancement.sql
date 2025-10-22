-- Migration script for sector architecture framework
-- This script enhances the existing schema with new fields and tables

-- Step 1: Enhance sectors table
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS icon VARCHAR(255);
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS route_path VARCHAR(255);
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS configuration JSONB;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing sectors with code values if they don't have them
UPDATE sectors SET code = UPPER(REPLACE(name, ' ', '_')) WHERE code IS NULL;
UPDATE sectors SET route_path = CONCAT('/', LOWER(REPLACE(name, ' ', '-'))) WHERE route_path IS NULL;

-- Make code and route_path NOT NULL after populating
ALTER TABLE sectors ALTER COLUMN code SET NOT NULL;
ALTER TABLE sectors ALTER COLUMN route_path SET NOT NULL;

-- Step 2: Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    sector_id BIGINT NOT NULL,
    settings JSONB,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_organizations_sector_id ON organizations(sector_id);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(active);

-- Step 3: Enhance users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'INDIVIDUAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Add foreign key constraint for organization
ALTER TABLE users ADD CONSTRAINT fk_users_organization 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- Update existing users with email if they don't have one
UPDATE users SET email = CONCAT(username, '@example.com') WHERE email IS NULL;

-- Make email NOT NULL after populating
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN user_type SET NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_sector_id ON users(sector_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 4: Create user_roles table for additional roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, role_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Step 5: Create audit_log table for tracking user actions
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sector_id BIGINT,
    organization_id BIGINT,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_sector_id ON audit_log(sector_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_organization_id ON audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
