-- V32: Guaranteed health_admin complete seed data
-- Ensures Overview, Appointments and Medical History pages show data
-- All inserts are idempotent (WHERE NOT EXISTS guards)

-- ============================================================
-- ENSURE health_admin USER EXISTS (safety guard)
-- ============================================================
INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, sector_id, created_at)
SELECT 'health_admin', 'health.admin@cms.com',
       '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O',
       'MANAGER', 'INDIVIDUAL', true, true,
       (SELECT id FROM sectors WHERE code = 'HEALTHCARE'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'health_admin');

-- ============================================================
-- HEALTH RECORDS for health_admin (visible in Medical History)
-- ============================================================
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'VISIT_SUMMARY', CURRENT_DATE - 7, 'Hypertension Review', 'Dr. Priya Menon', 'Reviewed',
       'Patient stable on current medication. BP 135/85. Continue Amlodipine 5mg.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'Hypertension Review');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'LAB_RESULT', CURRENT_DATE - 3, 'HbA1c Report', 'City Labs', 'Normal Range',
       'HbA1c level is 6.5%. Continue diet plan. Recheck in 3 months.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'HbA1c Report');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'PRESCRIPTION', CURRENT_DATE - 1, 'Amlodipine 5mg Prescription', 'Dr. Arun Sharma', 'Active',
       'Take once daily for blood pressure management. Review in 1 month.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'Amlodipine 5mg Prescription');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'IMAGING', CURRENT_DATE - 14, 'Chest X-Ray Report', 'City Imaging Center', 'Normal',
       'No abnormalities detected. Lung fields clear bilaterally.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'Chest X-Ray Report');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'LAB_RESULT', CURRENT_DATE - 20, 'Lipid Profile Panel', 'City Diagnostics', 'Borderline',
       'LDL: 138 mg/dL (slightly elevated). Dietary changes and exercise recommended.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'Lipid Profile Panel');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id, 'VACCINATION', CURRENT_DATE - 90, 'Influenza Vaccine 2025', 'City Clinic', 'Completed',
       'Standard annual influenza vaccine administered. No adverse reactions.', NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_admin') AND title = 'Influenza Vaccine 2025');

-- ============================================================
-- APPOINTMENTS for health_admin (visible in Appointments page)
-- Today + upcoming + past = full rich list
-- ============================================================
INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-001', 'Anitha Krishnan', 'Dr. Priya Menon',
       NOW() + INTERVAL '2 hours', 'CONSULTATION', 'CONFIRMED',
       'Blood pressure follow-up - quarterly review',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-001');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-002', 'Ravi Shankar', 'Dr. Arun Sharma',
       NOW() + INTERVAL '4 hours', 'FOLLOW_UP', 'PENDING',
       'Diabetes quarterly review - HbA1c results',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-002');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-003', 'Suresh Babu', 'Dr. Priya Menon',
       NOW() + INTERVAL '6 hours', 'CHECK_UP', 'CONFIRMED',
       'Post-cardiac event monitoring check',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-003');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-004', 'Kavitha Reddy', 'Dr. Arun Sharma',
       NOW() + INTERVAL '1 day', 'CONSULTATION', 'PENDING',
       'Migraine episode follow-up and medication review',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-004');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-005', 'Deepak Joshi', 'Dr. Priya Menon',
       NOW() + INTERVAL '2 days', 'CHECK_UP', 'PENDING',
       'Asthma nebuliser review and spirometry',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-005');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-006', 'Harish Naik', 'Dr. Arun Sharma',
       NOW() + INTERVAL '3 days', 'EMERGENCY', 'CONFIRMED',
       'Urgent neurology consultation for Parkinson progression',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-006');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-007', 'Meena Iyer', 'Dr. Priya Menon',
       NOW() - INTERVAL '1 day', 'FOLLOW_UP', 'COMPLETED',
       'Thyroid medication dosage adjustment - TSH within range',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-007');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-008', 'Lakshmi Pillai', 'Dr. Arun Sharma',
       NOW() - INTERVAL '2 days', 'CONSULTATION', 'COMPLETED',
       'Osteoarthritis management plan reviewed',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-008');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-009', 'Aditya Kapoor', 'Dr. Priya Menon',
       NOW() - INTERVAL '3 days', 'CHECK_UP', 'COMPLETED',
       'Sports injury discharge review - cleared for light activity',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-009');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-ADM-010', 'Sunita Verma', 'Dr. Arun Sharma',
       NOW() - INTERVAL '4 days', 'CONSULTATION', 'COMPLETED',
       'Anxiety management therapy progress review',
       id, NOW()
FROM users WHERE username = 'health_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-ADM-010');

-- ============================================================
-- EXTRA PATIENTS (if not already seeded)
-- ============================================================
INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-020', 'Preethi', 'Nair', 36, 'FEMALE', 'Rheumatoid Arthritis', 'MONITORING',
       '1990-05-12', '+91-9821100201', '+91-9821100202', 'A+', 'NSAIDs', CURRENT_DATE - 2, NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-020');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-021', 'Kiran', 'Rao', 48, 'MALE', 'Coronary Artery Disease', 'CRITICAL',
       '1978-02-28', '+91-9821100203', '+91-9821100204', 'B+', 'None', CURRENT_DATE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-021');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-022', 'Gayatri', 'Sharma', 29, 'FEMALE', 'PCOS', 'STABLE',
       '1997-08-19', '+91-9821100205', '+91-9821100206', 'O+', 'None', CURRENT_DATE - 5, NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-022');

-- ============================================================
-- INSURANCE CLAIMS (a few more for completeness)
-- ============================================================
INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Preethi Nair', 9800.00, 'PENDING', CURRENT_DATE - 3
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Preethi Nair' AND submitted_at = CURRENT_DATE - 3);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Kiran Rao', 145000.00, 'APPROVED', CURRENT_DATE - 7
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Kiran Rao' AND submitted_at = CURRENT_DATE - 7);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Gayatri Sharma', 3200.00, 'PENDING', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Gayatri Sharma' AND submitted_at = CURRENT_DATE - 1);
