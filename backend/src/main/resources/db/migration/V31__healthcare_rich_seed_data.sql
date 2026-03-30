-- V31: Rich Healthcare Sector Seed Data (corrected)
-- Covers: extra patients, appointments, health_records, user_vitals, insurance_claims

-- ============================================================
-- ADDITIONAL PATIENTS
-- ============================================================
INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-010','Kavitha','Reddy',38,'FEMALE','Migraine','STABLE','1988-06-10','+91-9811100001','+91-9811100002','A+','Aspirin',CURRENT_DATE - 5,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-010');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-011','Mohan','Das',55,'MALE','Chronic Back Pain','MONITORING','1971-09-20','+91-9811100003','+91-9811100004','O-','None',CURRENT_DATE - 2,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-011');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-012','Lakshmi','Pillai',67,'FEMALE','Osteoarthritis','STABLE','1959-12-01','+91-9811100005','+91-9811100006','B-','Codeine',CURRENT_DATE - 10,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-012');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-013','Deepak','Joshi',42,'MALE','Asthma','MONITORING','1984-04-14','+91-9811100007','+91-9811100008','AB-','Dust, Pollen',CURRENT_DATE - 1,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-013');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-014','Sunita','Verma',31,'FEMALE','Anxiety Disorder','STABLE','1995-01-25','+91-9811100009','+91-9811100010','A-','None',CURRENT_DATE - 4,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-014');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-015','Harish','Naik',74,'MALE','Parkinson Disease','CRITICAL','1952-08-30','+91-9811100011','+91-9811100012','O+','Sulfamethoxazole',CURRENT_DATE,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-015');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-016','Meena','Iyer',50,'FEMALE','Hypothyroidism','STABLE','1976-03-08','+91-9811100013','+91-9811100014','B+','Shellfish',CURRENT_DATE - 8,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-016');

INSERT INTO patients (patient_id, first_name, last_name, age, gender, condition, status, date_of_birth, contact_number, emergency_contact, blood_type, allergies, last_visit, created_at)
SELECT 'PAT-2026-017','Aditya','Kapoor',28,'MALE','Sports Injury','STABLE','1998-11-15','+91-9811100015','+91-9811100016','A+','None',CURRENT_DATE - 3,NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = 'PAT-2026-017');

-- ============================================================
-- ADDITIONAL APPOINTMENTS (all linked to healthcare_admin user)
-- ============================================================
INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-010','Kavitha Reddy','Dr. Priya Menon',NOW() + INTERVAL '2 hours','CONSULTATION','CONFIRMED','Migraine episode follow-up',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-010');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-011','Mohan Das','Dr. Arun Sharma',NOW() + INTERVAL '4 hours','FOLLOW_UP','CONFIRMED','Physiotherapy assessment',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-011');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-012','Lakshmi Pillai','Dr. Priya Menon',NOW() + INTERVAL '1 day','CHECK_UP','PENDING','Routine joint health check',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-012');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-013','Deepak Joshi','Dr. Arun Sharma',NOW() + INTERVAL '2 days','CONSULTATION','PENDING','Asthma nebuliser review',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-013');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-014','Sunita Verma','Dr. Priya Menon',NOW() + INTERVAL '3 days','CONSULTATION','CONFIRMED','Therapy session - anxiety management',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-014');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-015','Harish Naik','Dr. Arun Sharma',NOW() + INTERVAL '5 hours','EMERGENCY','CONFIRMED','Urgent neurology assessment',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-015');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-016','Meena Iyer','Dr. Priya Menon',NOW() + INTERVAL '4 days','FOLLOW_UP','PENDING','Thyroid medication adjustment',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-016');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-017','Aditya Kapoor','Dr. Arun Sharma',NOW() + INTERVAL '5 days','CHECK_UP','PENDING','Sports physio discharge review',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-017');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-018','Anitha Krishnan','Dr. Priya Menon',NOW() - INTERVAL '1 day','CONSULTATION','COMPLETED','BP medication change reviewed',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-018');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-019','Ravi Shankar','Dr. Arun Sharma',NOW() - INTERVAL '2 days','FOLLOW_UP','COMPLETED','HbA1c results discussed',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-019');

INSERT INTO appointments (appointment_id, patient_name, doctor_name, appointment_time, type, status, notes, user_id, created_at)
SELECT 'APT-2026-020','Suresh Babu','Dr. Priya Menon',NOW() - INTERVAL '3 hours','EMERGENCY','COMPLETED','Cardiac event stabilized',id,NOW()
FROM users WHERE username = 'healthcare_admin'
AND NOT EXISTS (SELECT 1 FROM appointments WHERE appointment_id = 'APT-2026-020');

-- ============================================================
-- HEALTH RECORDS (linked to individual healthcare users)
-- ============================================================
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'VISIT_SUMMARY',CURRENT_DATE - 14,'Annual Physical Exam','Dr. Priya Menon','Normal','All vitals normal. No concerns.',NOW()
FROM users WHERE username = 'health_user'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user') AND title = 'Annual Physical Exam');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'LAB_RESULT',CURRENT_DATE - 10,'Complete Blood Count','City Diagnostics','Normal','CBC normal. Haemoglobin 13.8 g/dL.',NOW()
FROM users WHERE username = 'health_user'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user') AND title = 'Complete Blood Count');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'PRESCRIPTION',CURRENT_DATE - 7,'Metformin 500mg','Dr. Arun Sharma','Active','Take twice daily for blood sugar management.',NOW()
FROM users WHERE username = 'health_user'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user') AND title = 'Metformin 500mg');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'VISIT_SUMMARY',CURRENT_DATE - 5,'Cardiology Review','Dr. Priya Menon','Reviewed','ECG normal. Continue current cardiac meds.',NOW()
FROM users WHERE username = 'health_user2'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user2') AND title = 'Cardiology Review');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'LAB_RESULT',CURRENT_DATE - 3,'Lipid Profile','City Labs','Borderline','LDL slightly elevated at 138. Dietary changes advised.',NOW()
FROM users WHERE username = 'health_user2'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user2') AND title = 'Lipid Profile');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'VISIT_SUMMARY',CURRENT_DATE - 20,'Orthopaedic Consultation','Dr. Arun Sharma','Follow-up','Knee replacement surgery planned Q3 2026.',NOW()
FROM users WHERE username = 'health_user3'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user3') AND title = 'Orthopaedic Consultation');

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description, created_at)
SELECT id,'LAB_RESULT',CURRENT_DATE - 15,'Vitamin D and B12 Panel','City Diagnostics','Deficient','Vitamin D: 18 ng/mL. Start supplement 60000 IU/week.',NOW()
FROM users WHERE username = 'health_user3'
AND NOT EXISTS (SELECT 1 FROM health_records WHERE user_id = (SELECT id FROM users WHERE username = 'health_user3') AND title = 'Vitamin D and B12 Panel');

-- ============================================================
-- USER VITALS
-- ============================================================
INSERT INTO user_vitals (user_id, heart_rate, blood_pressure, weight, temperature, last_updated)
SELECT id,'78 bpm','128/82','72 kg','98.4°F',NOW() - INTERVAL '1 day'
FROM users WHERE username = 'health_user'
ON CONFLICT (user_id) DO UPDATE SET heart_rate = '78 bpm', blood_pressure = '128/82', last_updated = NOW() - INTERVAL '1 day';

INSERT INTO user_vitals (user_id, heart_rate, blood_pressure, weight, temperature, last_updated)
SELECT id,'92 bpm','145/90','86 kg','98.8°F',NOW() - INTERVAL '2 days'
FROM users WHERE username = 'health_user2'
ON CONFLICT (user_id) DO UPDATE SET heart_rate = '92 bpm', blood_pressure = '145/90', last_updated = NOW() - INTERVAL '2 days';

INSERT INTO user_vitals (user_id, heart_rate, blood_pressure, weight, temperature, last_updated)
SELECT id,'68 bpm','118/76','64 kg','98.2°F',NOW() - INTERVAL '5 hours'
FROM users WHERE username = 'health_user3'
ON CONFLICT (user_id) DO UPDATE SET heart_rate = '68 bpm', blood_pressure = '118/76', last_updated = NOW() - INTERVAL '5 hours';

INSERT INTO user_vitals (user_id, heart_rate, blood_pressure, weight, temperature, last_updated)
SELECT id,'84 bpm','135/85','78 kg','99.1°F',NOW()
FROM users WHERE username = 'dr_priya'
ON CONFLICT (user_id) DO UPDATE SET heart_rate = '84 bpm', blood_pressure = '135/85', last_updated = NOW();

-- ============================================================
-- ADDITIONAL INSURANCE CLAIMS
-- ============================================================
INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Kavitha Reddy',12500.00,'APPROVED',CURRENT_DATE - 15
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Kavitha Reddy' AND submitted_at = CURRENT_DATE - 15);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Mohan Das',8750.00,'PENDING',CURRENT_DATE - 5
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Mohan Das' AND submitted_at = CURRENT_DATE - 5);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Deepak Joshi',4200.00,'DENIED',CURRENT_DATE - 20
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Deepak Joshi' AND submitted_at = CURRENT_DATE - 20);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Sunita Verma',6500.00,'PENDING',CURRENT_DATE - 8
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Sunita Verma' AND submitted_at = CURRENT_DATE - 8);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Harish Naik',95000.00,'APPROVED',CURRENT_DATE - 3
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Harish Naik' AND submitted_at = CURRENT_DATE - 3);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at)
SELECT 'Aditya Kapoor',15200.00,'APPROVED',CURRENT_DATE - 12
WHERE NOT EXISTS (SELECT 1 FROM insurance_claims WHERE patient_name = 'Aditya Kapoor' AND submitted_at = CURRENT_DATE - 12);
