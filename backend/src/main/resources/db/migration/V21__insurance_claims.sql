-- V21: Insurance Claims for Healthcare dashboard

CREATE TABLE IF NOT EXISTS insurance_claims (
    id BIGSERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO insurance_claims (patient_name, amount, status, submitted_at) VALUES 
('John Doe', 12500.00, 'APPROVED', CURRENT_TIMESTAMP - INTERVAL '2' DAY),
('Sarah Jenkins', 5200.00, 'APPROVED', CURRENT_TIMESTAMP - INTERVAL '5' DAY),
('Michael Ross', 27530.00, 'APPROVED', CURRENT_TIMESTAMP - INTERVAL '10' DAY),
('Rachel Zane', 8500.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1' DAY),
('Donna Paulsen', 4350.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '3' DAY),
('Harvey Specter', 3450.00, 'DENIED', CURRENT_TIMESTAMP - INTERVAL '7' DAY);
