-- V28: Seed real data for Logistics and Health sectors
-- Logistics users, vehicles, shipments, inventory, routes, vendors
-- Health users linked to existing patients and records

-- ============================================================
-- SCHEMA UPGRADES (if columns missing)
-- ============================================================
ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS blood_type VARCHAR(10);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;

-- Ensure Health records table is cleaner
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;

-- ============================================================
-- LOGISTICS SECTOR USERS
-- All passwords = 'password123' (bcrypt hashed)
-- ============================================================
INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, sector_id, created_at)
VALUES
  ('logistics_admin', 'logistics.admin@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'MANAGER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'LOGISTICS'), NOW()),
  ('driver_raj', 'raj.kumar@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'LOGISTICS'), NOW()),
  ('driver_amit', 'amit.singh@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'LOGISTICS'), NOW()),
  ('warehouse_manager', 'warehouse@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'LOGISTICS'), NOW())
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- FLEET VEHICLES
-- ============================================================
INSERT INTO vehicles (plate_number, model, status, capacity, current_driver, last_service_date)
VALUES
  ('TN-01-AB-1234', 'Tata ACE', 'AVAILABLE', 1.5, 'Ramesh Kumar', NOW() - INTERVAL '15 days'),
  ('TN-02-CD-5678', 'Mahindra Bolero', 'IN_USE', 2.0, 'Raj Kumar', NOW() - INTERVAL '5 days'),
  ('TN-03-EF-9012', 'Ashok Leyland Dost', 'MAINTENANCE', 4.0, 'Amit Singh', NOW() - INTERVAL '30 days'),
  ('MH-04-GH-3456', 'Eicher Pro 1049', 'AVAILABLE', 5.0, 'Vikram Patil', NOW() - INTERVAL '10 days'),
  ('DL-05-IJ-7890', 'Tata 407', 'IN_USE', 3.5, 'Suresh Yadav', NOW() - INTERVAL '2 days'),
  ('KA-06-KL-2345', 'Force Motors Traveller', 'RETIRED', 2.5, NULL, NOW() - INTERVAL '90 days')
ON CONFLICT (plate_number) DO NOTHING;

-- ============================================================
-- SHIPMENTS
-- ============================================================
INSERT INTO shipments (shipment_tracking_id, origin, destination, status, weight, estimated_delivery, created_at, updated_at)
VALUES
  ('TRK-2026-001', 'Mumbai', 'Delhi', 'IN_TRANSIT', 12.50, NOW() + INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW()),
  ('TRK-2026-002', 'Chennai', 'Bangalore', 'DELIVERED', 5.00, NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('TRK-2026-003', 'Hyderabad', 'Pune', 'PENDING', 8.75, NOW() + INTERVAL '4 days', NOW() - INTERVAL '1 day', NOW()),
  ('TRK-2026-004', 'Kolkata', 'Chennai', 'DELAYED', 22.00, NOW() + INTERVAL '1 day', NOW() - INTERVAL '6 days', NOW()),
  ('TRK-2026-005', 'Delhi', 'Jaipur', 'DELIVERED', 3.20, NOW() - INTERVAL '2 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days')
ON CONFLICT (shipment_tracking_id) DO NOTHING;

-- ============================================================
-- SHIPMENT EVENTS
-- ============================================================
INSERT INTO shipment_events (title, location, timestamp, new_status, shipment_id)
SELECT 'Package picked up from origin warehouse', 'Mumbai Logistics Hub', NOW() - INTERVAL '3 days', 'IN_TRANSIT', id
FROM shipments WHERE shipment_tracking_id = 'TRK-2026-001';

INSERT INTO shipment_events (title, location, timestamp, new_status, shipment_id)
SELECT 'Delivered successfully', 'Bangalore East Hub', NOW() - INTERVAL '1 day', 'DELIVERED', id
FROM shipments WHERE shipment_tracking_id = 'TRK-2026-002';

-- ============================================================
-- INVENTORY ITEMS
-- ============================================================
INSERT INTO inventory_items (sku, product_name, quantity, reorder_point, warehouse_location, status, last_restocked)
VALUES
  ('SKU-EL-001', 'Industrial Power Cable 50m', 250, 30, 'Zone A - Warehouse 1', 'IN_STOCK', NOW() - INTERVAL '10 days'),
  ('SKU-MH-002', 'Steel Pallet Racking Unit', 8, 10, 'Zone B - Warehouse 2', 'LOW_STOCK', NOW() - INTERVAL '35 days'),
  ('SKU-SA-002', 'High-Vis Safety Vest', 0, 50, 'Zone E - Warehouse 3', 'OUT_OF_STOCK', NOW() - INTERVAL '60 days')
ON CONFLICT (sku) DO NOTHING;

-- ============================================================
-- ROUTES
-- ============================================================
INSERT INTO routes (start_location, end_location, distance_km, estimated_time_minutes, status)
VALUES
  ('Mumbai Central Hub', 'Pune Distribution', 147.0, 165, 'OPTIMIZED'),
  ('Delhi NCR Warehouse', 'Jaipur Logistics Park', 280.0, 300, 'OPTIMIZED')
ON CONFLICT DO NOTHING;

-- ============================================================
-- VENDORS
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    performance_score INT NOT NULL,
    contract_status VARCHAR(50) NOT NULL,
    contract_renewal_date DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vendors (name, category, performance_score, contract_status, contract_renewal_date, contact_email, contact_phone)
VALUES
  ('Acme Freight Corp', 'Freight', 94, 'ACTIVE', '2026-12-01', 'contracts@acmecorp.com', '+91-9901234567'),
  ('Global Supplies Ltd', 'Warehousing', 78, 'EXPIRING_SOON', '2026-04-15', 'ops@globalsupplies.in', '+91-9812345678'),
  ('LogiTech Partners', 'Last-Mile', 86, 'ACTIVE', '2027-01-10', 'hello@logitech-partners.com', '+91-9723456789'),
  ('FastTrack Cold Chain', 'Cold Chain', 97, 'ACTIVE', '2027-06-01', 'support@fasttrack.co.in', '+91-9634567890')
ON CONFLICT DO NOTHING;

-- ============================================================
-- HEALTH SECTOR USERS
-- ============================================================
INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, sector_id, created_at)
VALUES
  ('health_admin', 'health.admin@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'MANAGER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), NOW()),
  ('dr_priya', 'dr.priya@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), NOW()),
  ('dr_arun', 'dr.arun@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true, (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), NOW())
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- PATIENTS
-- ============================================================
INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
VALUES
  ('PAT-2026-001', 'Anitha', 'Krishnan', 45, 'FEMALE', 'Hypertension', 'MONITORING', '1981-03-15', '+91-9800001111', '+91-9800001112', 'B+', 'Penicillin', NOW() - INTERVAL '7 days', NOW() - INTERVAL '30 days'),
  ('PAT-2026-002', 'Ravi', 'Shankar', 62, 'MALE', 'Type 2 Diabetes', 'STABLE', '1964-07-22', '+91-9800002222', '+91-9800002223', 'O+', 'None', NOW() - INTERVAL '3 days', NOW() - INTERVAL '45 days'),
  ('PAT-2026-004', 'Suresh', 'Babu', 71, 'MALE', 'Heart Failure', 'CRITICAL', '1955-02-28', '+91-9800004444', '+91-9800004445', 'AB+', 'Ibuprofen, Sulfa', NOW() - INTERVAL '1 day', NOW() - INTERVAL '10 days')
ON CONFLICT (patient_id) DO NOTHING;

-- ============================================================
-- HEALTH RECORDS (linked to health_admin user for demo)
-- ============================================================
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'VISIT_SUMMARY', CURRENT_DATE - 7, 'Hypertension Review', 'Dr. Priya Menon', 'Visit Summary', 'Patient stable on current medication. BP 135/85.', NOW()
FROM users WHERE username = 'health_admin';

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'LAB_RESULT', CURRENT_DATE - 3, 'HbA1c Report', 'City Labs', 'Normal Range', 'HbA1c level is 6.5%. Continue diet plan.', NOW()
FROM users WHERE username = 'health_admin';

-- ============================================================
-- APPOINTMENTS
-- ============================================================
INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-001', 'Anitha Krishnan', 'Dr. Priya Menon', NOW() + INTERVAL '1 day', 'CONSULTATION', 'CONFIRMED', 'Blood pressure follow-up', 
       (SELECT id FROM users WHERE username = 'health_admin'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-001');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-002', 'Ravi Shankar', 'Dr. Arun Sharma', NOW() + INTERVAL '3 days', 'FOLLOW_UP', 'PENDING', 'Diabetes quarterly review', 
       (SELECT id FROM users WHERE username = 'health_admin'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-002');
