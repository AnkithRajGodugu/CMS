-- Migration: Add Performance Indexes
-- Description: Create indexes on frequently queried columns to improve query performance
-- Requirements: 9.3, 9.4

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_sector_id ON users(sector_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

-- Composite index for common user queries (sector + organization)
CREATE INDEX IF NOT EXISTS idx_users_sector_org ON users(sector_id, organization_id);

-- Indexes for organizations table
CREATE INDEX IF NOT EXISTS idx_organizations_sector_id ON organizations(sector_id);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(active);
CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);

-- Indexes for sectors table
CREATE INDEX IF NOT EXISTS idx_sectors_code ON sectors(code);
CREATE INDEX IF NOT EXISTS idx_sectors_enabled ON sectors(enabled);
CREATE INDEX IF NOT EXISTS idx_sectors_display_order ON sectors(display_order);

-- Indexes for bank_accounts table
CREATE INDEX IF NOT EXISTS idx_bank_accounts_account_number ON bank_accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_customer_name ON bank_accounts(customer_name);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_status ON bank_accounts(status);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_created_at ON bank_accounts(created_at);

-- Indexes for transactions table
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_number ON transactions(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_processed_at ON transactions(processed_at);

-- Composite index for transaction queries (account + status + date)
CREATE INDEX IF NOT EXISTS idx_transactions_account_status_date ON transactions(account_number, status, created_at DESC);

-- Indexes for user_roles table (if exists)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Indexes for customers table (if exists)
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;

-- Indexes for patients table (if exists)
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone) WHERE phone IS NOT NULL;

-- Indexes for appointments table (if exists)
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date ON appointments(appointment_date) WHERE appointment_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status) WHERE status IS NOT NULL;

-- Comments for documentation
COMMENT ON INDEX idx_users_sector_id IS 'Improves sector-based user queries';
COMMENT ON INDEX idx_users_organization_id IS 'Improves organization-based user queries';
COMMENT ON INDEX idx_users_sector_org IS 'Composite index for multi-tenant queries';
COMMENT ON INDEX idx_transactions_account_status_date IS 'Optimizes transaction history queries';
