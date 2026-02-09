-- Monthly sector-bound reports
CREATE INDEX idx_customers_sector_created_at
    ON customers (sector_id, created_at);

-- Admin cross-sector reports
CREATE INDEX idx_customers_created_at
    ON customers (created_at);

-- Pagination + sorting
CREATE INDEX idx_customers_sector_id_id
    ON customers (sector_id, id);
