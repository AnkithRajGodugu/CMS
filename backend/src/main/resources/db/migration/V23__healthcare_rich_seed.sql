-- V23: Rich Healthcare seed data
-- Adds healthcare-sector users, patients, appointments, insurance claims, and health records.
-- Passwords: 'health123' hash (same bcrypt prefix used in V22)

-- ─────────────────────────────────────────────────────────────────────────────
-- 1.  Extra healthcare sector users
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (username, email, password, role, user_type, sector_id, enabled, email_verified, created_at)
SELECT 'health_user2', 'health.user2@healthmail.com',
       '$2a$10$ymSPnMfyEL.bhzet0YgjReS528VnOvrfeiNL3Yt3dIliogJjkIgqO',
       'USER', 'INDIVIDUAL', (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), true, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'health_user2');

INSERT INTO users (username, email, password, role, user_type, sector_id, enabled, email_verified, created_at)
SELECT 'health_user3', 'health.user3@healthmail.com',
       '$2a$10$ymSPnMfyEL.bhzet0YgjReS528VnOvrfeiNL3Yt3dIliogJjkIgqO',
       'USER', 'INDIVIDUAL', (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), true, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'health_user3');

-- ─────────────────────────────────────────────────────────────────────────────
-- 2.  Patients
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT001','Sarah','Johnson',34,'Hypertension',CURRENT_DATE - 5,'STABLE','+1-555-0101','sarah.j@mail.com','12 Oak St, Boston',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT001');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT002','Michael','Chen',67,'Diabetes Type 2',CURRENT_DATE - 8,'MONITORING','+1-555-0102','mchen@mail.com','34 Maple Ave, Seattle',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT002');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT003','Emily','Davis',28,'Asthma',CURRENT_DATE - 12,'STABLE','+1-555-0103','emily.d@mail.com','56 Pine Rd, Austin',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT003');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT004','Robert','Wilson',45,'Coronary Disease',CURRENT_DATE - 2,'CRITICAL','+1-555-0104','rwilson@mail.com','78 Cedar Blvd, Chicago',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT004');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT005','Jennifer','Martinez',52,'Hypothyroidism',CURRENT_DATE - 30,'STABLE','+1-555-0105','jmartinez@mail.com','90 Birch Lane, Miami',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT005');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT006','David','Lee',39,'Migraine',CURRENT_DATE - 45,'MONITORING','+1-555-0106','dlee@mail.com','14 Elm St, Denver',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT006');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT007','Lisa','Brown',61,'Arthritis',CURRENT_DATE - 7,'STABLE','+1-555-0107','lbrown@mail.com','23 Walnut Dr, Portland',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT007');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT008','James','Taylor',74,'COPD',CURRENT_DATE - 3,'CRITICAL','+1-555-0108','jtaylor@mail.com','45 Spruce Way, Phoenix',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT008');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT009','Maria','Anderson',29,'Anxiety Disorder',CURRENT_DATE - 20,'STABLE','+1-555-0109','manderson@mail.com','67 Poplar Ct, Nashville',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT009');

INSERT INTO patients (patient_id, first_name, last_name, age, condition, last_visit, status, contact_number, email, address, created_at, deleted)
SELECT 'PAT010','Thomas','White',48,'Kidney Disease',CURRENT_DATE - 1,'MONITORING','+1-555-0110','twhite@mail.com','89 Ash Ave, Minneapolis',NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT010');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3.  Appointments (using health_user's id for foreign key)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT002','Sarah Johnson','Dr. Smith',CURRENT_DATE + INTERVAL '0' DAY,'CONSULTATION','CONFIRMED','Routine blood pressure review',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT002');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT003','Michael Chen','Dr. Brown',CURRENT_DATE + INTERVAL '0' DAY,'FOLLOW_UP','CONFIRMED','Glucose monitoring follow-up',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT003');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT004','Emily Davis','Dr. Wilson',CURRENT_DATE + INTERVAL '0' DAY,'CHECK_UP','PENDING','Annual asthma check-up',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT004');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT005','Robert Wilson','Dr. Johnson',CURRENT_DATE + INTERVAL '0' DAY,'EMERGENCY','URGENT','Chest pain evaluation',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT005');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT006','Jennifer Martinez','Dr. Patel',CURRENT_DATE + INTERVAL '1' DAY,'CONSULTATION','CONFIRMED','Thyroid function review',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT006');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT007','David Lee','Dr. Kim',CURRENT_DATE + INTERVAL '1' DAY,'FOLLOW_UP','PENDING','Migraine treatment assessment',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT007');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT008','Lisa Brown','Dr. Taylor',CURRENT_DATE + INTERVAL '2' DAY,'CHECK_UP','CONFIRMED','Joint mobility assessment',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT008');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT009','James Taylor','Dr. Moore',CURRENT_DATE - INTERVAL '1' DAY,'EMERGENCY','COMPLETED','Respiratory distress follow-up',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT009');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT010','Maria Anderson','Dr. White',CURRENT_DATE - INTERVAL '3' DAY,'CONSULTATION','COMPLETED','Anxiety management plan',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT010');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at, deleted)
SELECT 'APT011','Thomas White','Dr. Harris',CURRENT_DATE - INTERVAL '2' DAY,'FOLLOW_UP','CONFIRMED','Kidney function labs review',
       (SELECT id FROM users WHERE username = 'health_user' LIMIT 1),NOW(),false
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT011');

-- ─────────────────────────────────────────────────────────────────────────────
-- 4.  Insurance Claims
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Sarah Johnson', 1250.00, 'APPROVED', NOW() - INTERVAL '5' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Sarah Johnson');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Michael Chen', 850.00, 'PENDING', NOW() - INTERVAL '8' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Michael Chen');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Emily Davis', 2100.00, 'PENDING', NOW() - INTERVAL '12' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Emily Davis');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Robert Wilson', 450.00, 'DENIED', NOW() - INTERVAL '2' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Robert Wilson');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Jennifer Martinez', 975.50, 'APPROVED', NOW() - INTERVAL '30' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Jennifer Martinez');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'David Lee', 320.00, 'PENDING', NOW() - INTERVAL '45' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'David Lee');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Lisa Brown', 1680.00, 'APPROVED', NOW() - INTERVAL '7' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Lisa Brown');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'James Taylor', 3200.00, 'APPROVED', NOW() - INTERVAL '3' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'James Taylor');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Maria Anderson', 540.00, 'DENIED', NOW() - INTERVAL '20' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Maria Anderson');

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Thomas White', 2750.00, 'PENDING', NOW() - INTERVAL '1' DAY
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Thomas White');

-- ─────────────────────────────────────────────────────────────────────────────
-- 5.  Extra Health Records for health_user
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at, deleted)
SELECT id, 'PRESCRIPTION', CURRENT_DATE - 15, 'Lisinopril 10mg Prescription', 'Dr. Smith', 'Active',
       'Prescribed for hypertension management. One tablet daily. Next review in 3 months.', NOW(), false
FROM users WHERE username = 'health_user'
AND NOT EXISTS (
  SELECT 1 FROM health_records hr JOIN users u2 ON hr.user_id = u2.id
  WHERE u2.username = 'health_user' AND hr.title = 'Lisinopril 10mg Prescription'
);

-- Health Records for health_user2
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at, deleted)
SELECT id, 'LAB_RESULT', CURRENT_DATE - 5, 'Comprehensive Metabolic Panel', 'Dr. Patel', 'Needs Review',
       'Slightly elevated fasting glucose (105 mg/dL). Recommended dietary changes and follow-up in 2 weeks.', NOW(), false
FROM users WHERE username = 'health_user2'
AND NOT EXISTS (
  SELECT 1 FROM health_records hr JOIN users u2 ON hr.user_id = u2.id
  WHERE u2.username = 'health_user2' AND hr.title = 'Comprehensive Metabolic Panel'
);

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at, deleted)
SELECT id, 'VISIT_SUMMARY', CURRENT_DATE - 20, 'Thyroid Function Follow-up', 'Dr. Brown', 'Visit Summary',
       'TSH stable at 3.1 mIU/L. Continue current dosage of levothyroxine. Follow-up in 6 months.', NOW(), false
FROM users WHERE username = 'health_user2'
AND NOT EXISTS (
  SELECT 1 FROM health_records hr JOIN users u2 ON hr.user_id = u2.id
  WHERE u2.username = 'health_user2' AND hr.title = 'Thyroid Function Follow-up'
);

-- Health Records for health_user3
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at, deleted)
SELECT id, 'IMAGING', CURRENT_DATE - 10, 'Lower Back MRI', 'City Imaging Center', 'Imaging/Scan',
       'Mild L4-L5 disc bulge noted. No nerve compression. Conservative management recommended.', NOW(), false
FROM users WHERE username = 'health_user3'
AND NOT EXISTS (
  SELECT 1 FROM health_records hr JOIN users u2 ON hr.user_id = u2.id
  WHERE u2.username = 'health_user3' AND hr.title = 'Lower Back MRI'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6.  Vitals for extra users
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO user_vitals (user_id, blood_pressure, heart_rate, weight, temperature, last_updated)
SELECT id, '118/76', '68 bpm', '65 kg', '98.4°F', NOW()
FROM users WHERE username = 'health_user2'
AND NOT EXISTS (SELECT 1 FROM user_vitals uv JOIN users u ON uv.user_id = u.id WHERE u.username = 'health_user2');

INSERT INTO user_vitals (user_id, blood_pressure, heart_rate, weight, temperature, last_updated)
SELECT id, '130/85', '80 bpm', '82 kg', '99.0°F', NOW()
FROM users WHERE username = 'health_user3'
AND NOT EXISTS (SELECT 1 FROM user_vitals uv JOIN users u ON uv.user_id = u.id WHERE u.username = 'health_user3');
