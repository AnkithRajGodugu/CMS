-- Insert Sectors
INSERT INTO sectors (id, name, description) VALUES 
(1, 'Banking & Finance', 'Comprehensive customer management for banks, credit unions, and financial institutions'),
(2, 'Healthcare', 'Patient management system designed for hospitals, clinics, and healthcare providers'),
(3, 'Logistics & Supply Chain', 'Streamline operations for shipping, warehousing, and supply chain management'),
(4, 'Content Creation', 'Manage clients, projects, and content workflows for creative agencies and freelancers')
ON CONFLICT (id) DO NOTHING;

-- Insert Users (password is 'password123' encoded with BCrypt)
INSERT INTO users (id, username, password, role, sector_id) VALUES 
-- Banking Users
(1, 'banking_admin', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 1),
(2, 'banking_manager', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 1),
(3, 'banking_user', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 1),

-- Healthcare Users
(4, 'healthcare_admin', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 2),
(5, 'healthcare_manager', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 2),
(6, 'healthcare_user', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 2),

-- Logistics Users
(7, 'logistics_admin', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 3),
(8, 'logistics_manager', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 3),
(9, 'logistics_user', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 3),

-- Content Creation Users
(10, 'content_admin', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 4),
(11, 'content_manager', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 4),
(12, 'content_user', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Customers for each sector
INSERT INTO customers (id, first_name, last_name, email, phone, sector_id, created_at) VALUES 
-- Banking Customers
(1, 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', 1, NOW()),
(2, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+1-555-0102', 1, NOW()),
(3, 'Michael', 'Brown', 'michael.brown@email.com', '+1-555-0103', 1, NOW()),
(4, 'Emily', 'Davis', 'emily.davis@email.com', '+1-555-0104', 1, NOW()),
(5, 'David', 'Wilson', 'david.wilson@email.com', '+1-555-0105', 1, NOW()),

-- Healthcare Patients
(6, 'Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-0201', 2, NOW()),
(7, 'James', 'Martinez', 'james.martinez@email.com', '+1-555-0202', 2, NOW()),
(8, 'Lisa', 'Anderson', 'lisa.anderson@email.com', '+1-555-0203', 2, NOW()),
(9, 'Robert', 'Taylor', 'robert.taylor@email.com', '+1-555-0204', 2, NOW()),
(10, 'Jennifer', 'Thomas', 'jennifer.thomas@email.com', '+1-555-0205', 2, NOW()),

-- Logistics Customers
(11, 'Christopher', 'Jackson', 'chris.jackson@email.com', '+1-555-0301', 3, NOW()),
(12, 'Amanda', 'White', 'amanda.white@email.com', '+1-555-0302', 3, NOW()),
(13, 'Daniel', 'Harris', 'daniel.harris@email.com', '+1-555-0303', 3, NOW()),
(14, 'Michelle', 'Martin', 'michelle.martin@email.com', '+1-555-0304', 3, NOW()),
(15, 'Kevin', 'Thompson', 'kevin.thompson@email.com', '+1-555-0305', 3, NOW()),

-- Content Creation Clients
(16, 'Jessica', 'Garcia', 'jessica.garcia@email.com', '+1-555-0401', 4, NOW()),
(17, 'Matthew', 'Rodriguez', 'matthew.rodriguez@email.com', '+1-555-0402', 4, NOW()),
(18, 'Ashley', 'Lewis', 'ashley.lewis@email.com', '+1-555-0403', 4, NOW()),
(19, 'Joshua', 'Lee', 'joshua.lee@email.com', '+1-555-0404', 4, NOW()),
(20, 'Stephanie', 'Walker', 'stephanie.walker@email.com', '+1-555-0405', 4, NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequences to avoid conflicts
SELECT setval('sectors_id_seq', (SELECT MAX(id) FROM sectors));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));