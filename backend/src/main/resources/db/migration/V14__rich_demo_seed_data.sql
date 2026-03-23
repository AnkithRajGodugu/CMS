-- V14: Rich Demo Seed Data for all sectors
-- Ensures the frontend looks fully populated for demos

-- =====================
-- HEALTHCARE: Patients
-- =====================
INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
VALUES
  ('PAT002', 'Rahul',    'Sharma',   '1985-04-12', 41, 'Diabetes Type 2',      '2026-03-10', 'MONITORING', '9876543210', 'rahul@example.com',    'Mumbai, MH', NOW(), false),
  ('PAT003', 'Priya',    'Mehta',    '1992-07-22', 33, 'Asthma',               '2026-03-18', 'STABLE',     '9876500001', 'priya@example.com',    'Delhi, DL',  NOW(), false),
  ('PAT004', 'Arun',     'Nair',     '1975-11-05', 50, 'Cardiac Arrhythmia',   '2026-03-20', 'CRITICAL',   '9123456780', 'arun@example.com',     'Chennai, TN',NOW(), false),
  ('PAT005', 'Sunita',   'Reddy',    '1988-03-30', 38, 'Hypertension',         '2026-03-15', 'STABLE',     '9234567890', 'sunita@example.com',   'Hyderabad, TS', NOW(), false),
  ('PAT006', 'Karan',    'Kapoor',   '2000-01-15', 26, 'Fractured Arm',        '2026-03-22', 'DISCHARGED', '9345678901', 'karan@example.com',    'Pune, MH',   NOW(), false),
  ('PAT007', 'Deepika',  'Singh',    '1965-09-08', 60, 'Knee Replacement',     '2026-02-28', 'MONITORING', '9456789012', 'deepika@example.com',  'Ahmedabad, GJ', NOW(), false);

-- =====================
-- HEALTHCARE: Appointments
-- =====================
INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, created_at, deleted)
VALUES
  ('APT002', 'Rahul Sharma',  'Dr. Patel',  '2026-03-25 10:00:00', 'FOLLOW_UP',    'CONFIRMED', 'Quarterly diabetes review',     NOW(), false),
  ('APT003', 'Priya Mehta',   'Dr. Gupta',  '2026-03-24 14:30:00', 'CHECK_UP',     'PENDING',   'Pulmonary function test',        NOW(), false),
  ('APT004', 'Arun Nair',     'Dr. Iyer',   '2026-03-23 09:00:00', 'EMERGENCY',    'CONFIRMED', 'ECG monitoring required',        NOW(), false),
  ('APT005', 'Sunita Reddy',  'Dr. Verma',  '2026-03-26 11:00:00', 'CONSULTATION', 'PENDING',   'BP medication adjustment',       NOW(), false),
  ('APT006', 'Karan Kapoor',  'Dr. Joshi',  '2026-03-22 16:00:00', 'FOLLOW_UP',    'COMPLETED', 'Post-surgery follow up cleared', NOW(), false);

-- =====================
-- BANKING: Transactions
-- =====================
INSERT INTO transactions (transaction_id, type, amount, account_number, status, description, created_at, processed_at, deleted)
VALUES
  ('TXN003', 'TRANSFER',   5000.00,  'ACC001', 'COMPLETED', 'Rent payment',          NOW(), NOW(), false),
  ('TXN004', 'DEPOSIT',    10000.00, 'ACC002', 'COMPLETED', 'Business revenue',      NOW(), NOW(), false),
  ('TXN005', 'WITHDRAWAL', 300.00,   'ACC003', 'COMPLETED', 'Office supplies',       NOW(), NOW(), false),
  ('TXN006', 'PAYMENT',    1500.00,  'ACC004', 'PENDING',   'EMI payment',           NOW(), NULL,  false),
  ('TXN007', 'DEPOSIT',    25000.00, 'ACC001', 'COMPLETED', 'Project milestone payment', NOW(), NOW(), false),
  ('TXN008', 'TRANSFER',   2000.00,  'ACC002', 'FAILED',    'Insufficient balance',  NOW(), NULL,  false);

-- =====================
-- LOGISTICS: Routes
-- =====================
INSERT INTO routes (start_location, end_location, distance_km, estimated_time_minutes, status)
VALUES
  ('Mumbai',     'Pune',       150.5, 180, 'OPTIMIZED'),
  ('Delhi',      'Agra',       200.0, 270, 'OPTIMIZED'),
  ('Chennai',    'Bangalore',  346.0, 360, 'PENDING'),
  ('Hyderabad',  'Mumbai',     710.0, 720, 'OPTIMIZED'),
  ('Ahmedabad',  'Surat',      265.0, 330, 'OPTIMIZED');

-- =====================
-- LOGISTICS: Shipments
-- =====================
INSERT INTO shipments (shipment_tracking_id, origin, destination, status, weight, estimated_delivery, created_at, updated_at)
VALUES
  ('SHP-999-003', 'Delhi',      'Bangalore', 'DELIVERED',   92.0,  '2026-03-21 22:00:00', NOW(), NOW()),
  ('SHP-999-004', 'Mumbai',     'Chennai',   'IN_TRANSIT',  210.5, '2026-03-28 22:00:00', NOW(), NOW()),
  ('SHP-999-005', 'Hyderabad',  'Pune',      'PENDING',     50.0,  '2026-03-30 22:00:00', NOW(), NOW()),
  ('SHP-999-006', 'Ahmedabad',  'Delhi',     'IN_TRANSIT',  325.0, '2026-03-26 22:00:00', NOW(), NOW());

-- =====================
-- LOGISTICS: Inventory
-- =====================
INSERT INTO inventory_items (sku, product_name, quantity, reorder_point, warehouse_location, status)
VALUES
  ('SKU-1003', 'Steel Bolts (box/100)',   1200, 300, 'Warehouse A', 'IN_STOCK'),
  ('SKU-1004', 'Rubber Gaskets',           80,  150, 'Warehouse B', 'LOW_STOCK'),
  ('SKU-1005', 'Hydraulic Fluid (20L)',     0,   50, 'Warehouse C', 'OUT_OF_STOCK'),
  ('SKU-1006', 'Safety Gloves (dozen)',   400,   80, 'Warehouse A', 'IN_STOCK'),
  ('SKU-1007', 'Packing Foam Sheets',     600,  100, 'Warehouse D', 'IN_STOCK');

-- =====================
-- CONTENT: Projects
-- =====================
INSERT INTO projects (project_name, client_name, status, start_date, deadline, budget, created_at, updated_at)
VALUES
  ('Social Media Strategy', 'StartupX',     'PLANNING',     '2026-04-01', '2026-05-15', 8000.0,  NOW(), NOW()),
  ('Brand Identity Refresh', 'MegaCorp',    'IN_PROGRESS',  '2026-03-10', '2026-04-30', 30000.0, NOW(), NOW()),
  ('Annual Report Design',   'Finance Ltd', 'COMPLETED',    '2026-01-15', '2026-02-28', 12000.0, NOW(), NOW()),
  ('Product Launch Kit',     'Tech Unicorn','IN_PROGRESS',  '2026-03-20', '2026-04-15', 22000.0, NOW(), NOW());

-- =====================
-- CONTENT: Assets
-- =====================
INSERT INTO content_assets (title, type, project_id, file_url, created_at, updated_at)
VALUES
  ('Q4-hero-banner.png',    'IMAGE',  1, 'https://cdn.example.com/q4-hero.png',    NOW(), NOW()),
  ('brand-deck.pdf',        'DOCUMENT', 2, 'https://cdn.example.com/brand-deck.pdf', NOW(), NOW()),
  ('intro-video.mp4',       'VIDEO',  4, 'https://cdn.example.com/intro-video.mp4', NOW(), NOW()),
  ('annual-report-v2.pdf',  'DOCUMENT', 3, 'https://cdn.example.com/annual-v2.pdf', NOW(), NOW()),
  ('logo-variants.zip',     'IMAGE',  2, 'https://cdn.example.com/logos.zip',       NOW(), NOW());
