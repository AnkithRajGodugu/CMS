-- V20: Add Health Records and User Vitals tables

CREATE TABLE IF NOT EXISTS user_vitals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    blood_pressure VARCHAR(20),
    heart_rate VARCHAR(20),
    weight VARCHAR(20),
    temperature VARCHAR(20),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS health_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    record_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    status VARCHAR(100),
    description TEXT,
    attachment_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Seed some vitals for users where role is HEALTHCARE or USER
INSERT INTO user_vitals (user_id, blood_pressure, heart_rate, weight, temperature, last_updated)
SELECT id, '120/80', '72 bpm', '70 kg', '98.6°F', CURRENT_TIMESTAMP
FROM users u
WHERE role IN ('ROLE_USER', 'ROLE_HEALTHCARE', 'ROLE_ADMIN')
AND NOT EXISTS (SELECT 1 FROM user_vitals uv WHERE uv.user_id = u.id);

-- Seed some health records for admin to test
INSERT INTO health_records (user_id, type, record_date, title, provider, status, description)
SELECT id, 'LAB_RESULT', CURRENT_DATE - INTERVAL '10' DAY, 'Complete Blood Count (CBC)', 'Ordered by Dr. Michael Ross', 'Normal Range', 'All values are within normal limits. White blood cell count and hemoglobin levels are healthy.'
FROM users WHERE role = 'ROLE_USER' LIMIT 1;

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description)
SELECT id, 'VISIT_SUMMARY', CURRENT_DATE - INTERVAL '30' DAY, 'Annual Physical Summary', 'Dr. Sarah Jenkins', 'Visit Summary', 'Diagnosis: Essential hypertension (controlled). Vitals: BP 120/80, HR 72, Temp 98.6°F'
FROM users WHERE role = 'ROLE_USER' LIMIT 1;

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description)
SELECT id, 'IMAGING', CURRENT_DATE - INTERVAL '60' DAY, 'Chest X-Ray', 'City Imaging Center', 'Imaging/Scan', 'Clear lungs, no abnormalities detected.'
FROM users WHERE role = 'ROLE_USER' LIMIT 1;

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description)
SELECT id, 'LAB_RESULT', CURRENT_DATE - INTERVAL '5' DAY, 'Comprehensive Metabolic Panel', 'Dr. Smith', 'Needs Review', 'Slightly elevated fasting glucose. Recommended dietary changes.'
FROM users WHERE username = 'admin' LIMIT 1;

INSERT INTO health_records (user_id, type, record_date, title, provider, status, description)
SELECT id, 'VACCINATION', CURRENT_DATE - INTERVAL '1' YEAR, 'Influenza Vaccine', 'City Clinic', 'Completed', 'Administered standard flu shot.'
FROM users WHERE username = 'admin' LIMIT 1;
