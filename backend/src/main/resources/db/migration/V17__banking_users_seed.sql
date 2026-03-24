-- =============================================================
-- V17: Banking Sector - Realistic Users, Accounts & Transactions
-- Passwords are BCrypt hash of 'user123'
-- =============================================================

-- ── Step 1: Insert banking sector users ──────────────────────────────────────
INSERT INTO users (username, email, password, role, user_type, sector_id, enabled, email_verified, created_at)
VALUES
  ('bank_user1', 'john.doe@bankmail.com',
   '$2a$10$mEcBvgHpMpYCiyhQcdzNteENtPwE3dJvvk9gWz5nDBFzpb8Btdll8ra-',
   'USER', 'INDIVIDUAL', (SELECT id FROM sectors WHERE code = 'BANKING'), true, true, NOW()),

  ('bank_user2', 'jane.smith@bankmail.com',
   '$2a$10$mEcBvgHpMpYCiyhQcdzNteENtPwE3dJvvk9gWz5nDBFzpb8Btdll8ra-',
   'USER', 'INDIVIDUAL', (SELECT id FROM sectors WHERE code = 'BANKING'), true, true, NOW()),

  ('bank_user3', 'michael.jones@bankmail.com',
   '$2a$10$mEcBvgHpMpYCiyhQcdzNteENtPwE3dJvvk9gWz5nDBFzpb8Btdll8ra-',
   'USER', 'INDIVIDUAL', (SELECT id FROM sectors WHERE code = 'BANKING'), true, true, NOW());

-- ── Step 2: Bank Accounts ────────────────────────────────────────────────────
-- bank_user1 (John Doe)
INSERT INTO bank_accounts (account_number, account_type, balance, customer_name, status, user_id, created_at, updated_at)
VALUES
  ('ACC-JD-001', 'SAVINGS',   45000.00, 'John Doe', 'ACTIVE',    (SELECT id FROM users WHERE username='bank_user1'), NOW(), NOW()),
  ('ACC-JD-002', 'CHECKING',  8750.50,  'John Doe', 'ACTIVE',    (SELECT id FROM users WHERE username='bank_user1'), NOW(), NOW()),
  ('ACC-JD-003', 'SAVINGS', 100000.00, 'John Doe', 'ACTIVE', (SELECT id FROM users WHERE username='bank_user1'), NOW(), NOW());

-- bank_user2 (Jane Smith)
INSERT INTO bank_accounts (account_number, account_type, balance, customer_name, status, user_id, created_at, updated_at)
VALUES
  ('ACC-JS-001', 'SAVINGS',   29500.00, 'Jane Smith', 'ACTIVE',  (SELECT id FROM users WHERE username='bank_user2'), NOW(), NOW()),
  ('ACC-JS-002', 'CHECKING',  3200.75,  'Jane Smith', 'ACTIVE',  (SELECT id FROM users WHERE username='bank_user2'), NOW(), NOW()),
  ('ACC-JS-003', 'BUSINESS',  150000.00,'Jane Smith', 'ACTIVE',  (SELECT id FROM users WHERE username='bank_user2'), NOW(), NOW());

-- bank_user3 (Michael Jones)
INSERT INTO bank_accounts (account_number, account_type, balance, customer_name, status, user_id, created_at, updated_at)
VALUES
  ('ACC-MJ-001', 'SAVINGS',   12000.00, 'Michael Jones', 'ACTIVE',   (SELECT id FROM users WHERE username='bank_user3'), NOW(), NOW()),
  ('ACC-MJ-002', 'CHECKING',  500.00,   'Michael Jones', 'SUSPENDED', (SELECT id FROM users WHERE username='bank_user3'), NOW(), NOW()),
  ('ACC-MJ-003', 'CREDIT',    -2400.00, 'Michael Jones', 'ACTIVE',   (SELECT id FROM users WHERE username='bank_user3'), NOW(), NOW());


-- ── Step 3: Transactions ─────────────────────────────────────────────────────
-- John Doe (ACC-JD-001 / ACC-JD-002)
INSERT INTO transactions (transaction_id, type, amount, account_number, status, description, created_at, processed_at)
VALUES
  ('TXN-JD-001', 'DEPOSIT',    50000.00, 'ACC-JD-001', 'COMPLETED', 'Initial savings deposit',       NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  ('TXN-JD-002', 'WITHDRAWAL', 5000.00,  'ACC-JD-001', 'COMPLETED', 'Home loan downpayment',         NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
  ('TXN-JD-003', 'TRANSFER',   2000.00,  'ACC-JD-001', 'COMPLETED', 'Transfer to checking account',  NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('TXN-JD-004', 'DEPOSIT',    9500.00,  'ACC-JD-001', 'COMPLETED', 'Monthly salary credit',         NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('TXN-JD-005', 'PAYMENT',    500.00,   'ACC-JD-001', 'PENDING',   'Insurance premium EMI',         NOW(), NULL),
  ('TXN-JD-006', 'DEPOSIT',    8750.50,  'ACC-JD-002', 'COMPLETED', 'Salary transfer inward',        NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  ('TXN-JD-007', 'WITHDRAWAL', 1200.00,  'ACC-JD-002', 'COMPLETED', 'Grocery and utilities',         NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('TXN-JD-008', 'TRANSFER',   3000.00,  'ACC-JD-002', 'FAILED',    'Transfer to friend - insufficient', NOW() - INTERVAL '2 days',  NULL);

-- Jane Smith (ACC-JS-001 / ACC-JS-002 / ACC-JS-003)
INSERT INTO transactions (transaction_id, type, amount, account_number, status, description, created_at, processed_at)
VALUES
  ('TXN-JS-001', 'DEPOSIT',    30000.00, 'ACC-JS-001', 'COMPLETED', 'Initial savings deposit',       NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
  ('TXN-JS-002', 'WITHDRAWAL', 500.00,   'ACC-JS-001', 'COMPLETED', 'ATM withdrawal',                NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('TXN-JS-003', 'DEPOSIT',    9500.00,  'ACC-JS-002', 'COMPLETED', 'Salary inward',                 NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('TXN-JS-004', 'PAYMENT',    2500.00,  'ACC-JS-002', 'COMPLETED', 'Credit card bill payment',      NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
  ('TXN-JS-005', 'TRANSFER',   1800.00,  'ACC-JS-002', 'PENDING',   'Office rent transfer',          NOW(), NULL),
  ('TXN-JS-006', 'DEPOSIT',    80000.00, 'ACC-JS-003', 'COMPLETED', 'Business revenue Q1',           NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  ('TXN-JS-007', 'PAYMENT',    15000.00, 'ACC-JS-003', 'COMPLETED', 'Staff payroll disbursement',    NOW() - INTERVAL '7 days',  NOW() - INTERVAL '7 days'),
  ('TXN-JS-008', 'WITHDRAWAL', 5000.00,  'ACC-JS-003', 'COMPLETED', 'Equipment maintenance',         NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days');

-- Michael Jones (ACC-MJ-001 / ACC-MJ-003)
INSERT INTO transactions (transaction_id, type, amount, account_number, status, description, created_at, processed_at)
VALUES
  ('TXN-MJ-001', 'DEPOSIT',    15000.00, 'ACC-MJ-001', 'COMPLETED', 'Initial deposit',               NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
  ('TXN-MJ-002', 'WITHDRAWAL', 3000.00,  'ACC-MJ-001', 'COMPLETED', 'Laptop purchase',               NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  ('TXN-MJ-003', 'DEPOSIT',    8500.00,  'ACC-MJ-001', 'COMPLETED', 'Freelance payment received',    NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  ('TXN-MJ-004', 'WITHDRAWAL', 8000.00,  'ACC-MJ-001', 'COMPLETED', 'Rent payment',                  NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('TXN-MJ-005', 'PAYMENT',    1200.00,  'ACC-MJ-003', 'COMPLETED', 'Credit card outstanding',       NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('TXN-MJ-006', 'PAYMENT',    800.00,   'ACC-MJ-003', 'COMPLETED', 'Subscription charges',          NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('TXN-MJ-007', 'PAYMENT',    400.00,   'ACC-MJ-003', 'FAILED',    'Payment declined - limit exceeded', NOW() - INTERVAL '2 days', NULL);
