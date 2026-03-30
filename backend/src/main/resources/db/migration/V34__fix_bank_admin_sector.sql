-- V34: Fix bank_admin sector assignment
-- The bank_admin user was created without a sector_id in V19,
-- causing SectorNotAssignedException on every sector-scoped API call.
-- This migration assigns bank_admin to the BANKING sector.

-- Assign bank_admin to BANKING sector
UPDATE users
SET sector_id = (SELECT id FROM sectors WHERE code = 'BANKING')
WHERE username = 'bank_admin'
  AND sector_id IS NULL;

-- Also make sure the global 'admin' user has a sector fallback (BANKING)
-- so admin-bypass doesn't throw before the bypass check runs.
-- The SectorDetectionService is called before admin bypass is applied,
-- so admin must have a sector_id as well.
UPDATE users
SET sector_id = (SELECT id FROM sectors WHERE code = 'BANKING')
WHERE username = 'admin'
  AND sector_id IS NULL;

-- Seed more realistic banking customers for the Customers page
-- (in addition to the 2 from V5)
INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Emily',   'Johnson',  'emily.johnson@bankmail.com',   '+91-9811111111', s.id, 1, 1, NOW() - INTERVAL '60 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'emily.johnson@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Michael', 'Brown',    'michael.brown@bankmail.com',   '+91-9822222222', s.id, 1, 1, NOW() - INTERVAL '45 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'michael.brown@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Priya',   'Nair',     'priya.nair@bankmail.com',      '+91-9833333333', s.id, 1, 1, NOW() - INTERVAL '30 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'priya.nair@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Karan',   'Mehta',    'karan.mehta@bankmail.com',     '+91-9844444444', s.id, 1, 1, NOW() - INTERVAL '25 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'karan.mehta@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Sunita',  'Reddy',    'sunita.reddy@bankmail.com',    '+91-9855555555', s.id, 1, 1, NOW() - INTERVAL '20 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'sunita.reddy@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Arun',    'Kumar',    'arun.kumar@bankmail.com',      '+91-9866666666', s.id, 1, 1, NOW() - INTERVAL '15 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'arun.kumar@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Deepika', 'Singh',    'deepika.singh@bankmail.com',   '+91-9877777777', s.id, 1, 1, NOW() - INTERVAL '10 days', NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'deepika.singh@bankmail.com');

INSERT INTO customers (first_name, last_name, email, phone, sector_id, created_by, updated_by, created_at, updated_at, deleted)
SELECT 'Rohit',   'Sharma',   'rohit.sharma@bankmail.com',    '+91-9888888888', s.id, 1, 1, NOW() - INTERVAL '5 days',  NOW(), false FROM sectors s WHERE s.code = 'BANKING'
  AND NOT EXISTS (SELECT 1 FROM customers WHERE email = 'rohit.sharma@bankmail.com');
