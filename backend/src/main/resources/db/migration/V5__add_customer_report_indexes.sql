-- Speeds up monthly reports per sector
CREATE INDEX IF NOT EXISTS idx_customer_sector_created
    ON customers (sector_id, created_at);

-- Speeds up admin cross-sector reports
CREATE INDEX IF NOT EXISTS idx_customer_created
    ON customers (created_at);
