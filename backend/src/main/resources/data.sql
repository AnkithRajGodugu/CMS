-- Insert Sectors with enhanced fields
INSERT INTO sectors (id, code, name, description, icon, route_path, configuration, enabled, display_order) VALUES 
(1, 'BANKING', 'Banking & Finance', 'Comprehensive customer management for banks, credit unions, and financial institutions', 'bank', '/dashboard/banking', '{"features": ["accounts", "transactions", "loans"], "modules": ["retail", "corporate"]}', true, 1),
(2, 'HEALTHCARE', 'Healthcare', 'Patient management system designed for hospitals, clinics, and healthcare providers', 'hospital', '/dashboard/healthcare', '{"features": ["appointments", "patients", "prescriptions"], "modules": ["clinic", "pharmacy"]}', true, 2),
(3, 'LOGISTICS', 'Logistics & Supply Chain', 'Streamline operations for shipping, warehousing, and supply chain management', 'truck', '/dashboard/logistics', '{"features": ["shipments", "inventory", "tracking"], "modules": ["warehouse", "delivery"]}', true, 3),
(4, 'CONTENT', 'Content Creation', 'Manage clients, projects, and content workflows for creative agencies and freelancers', 'edit', '/dashboard/content', '{"features": ["projects", "clients", "workflows"], "modules": ["creative", "publishing"]}', true, 4),
(5, 'EDUCATION', 'Education', 'Educational institution and student management', 'school', '/dashboard/education', '{"features": ["students", "courses", "grades"], "modules": ["academic", "administration"]}', true, 5),
(6, 'RETAIL', 'Retail', 'Retail operations and inventory management', 'shopping-cart', '/dashboard/retail', '{"features": ["inventory", "orders", "customers"], "modules": ["pos", "ecommerce"]}', true, 6),
(7, 'MANUFACTURING', 'Manufacturing', 'Manufacturing and production management', 'factory', '/dashboard/manufacturing', '{"features": ["production", "quality", "inventory"], "modules": ["planning", "execution"]}', true, 7)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Organizations
INSERT INTO organizations (id, name, domain, sector_id, settings, active, created_at) VALUES
(1, 'First National Bank', 'firstnational.com', 1, '{"branchCount": 50, "region": "North America"}', true, NOW()),
(2, 'City General Hospital', 'cityhospital.com', 2, '{"bedCount": 500, "departments": ["Emergency", "Surgery", "Pediatrics"]}', true, NOW()),
(3, 'Global Logistics Inc', 'globallogistics.com', 3, '{"warehouseCount": 20, "fleetSize": 100}', true, NOW()),
(4, 'Creative Media Agency', 'creativemedia.com', 4, '{"teamSize": 25, "specialties": ["Video", "Design", "Copy"]}', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Users with enhanced fields (password is 'password123' encoded with BCrypt)
INSERT INTO users (id, username, email, password, role, user_type, sector_id, enabled, created_at) VALUES 
-- Banking Users
(1, 'banking_admin', 'banking_admin@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 'INDIVIDUAL', 1, true, NOW()),
(2, 'banking_manager', 'banking_manager@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 'INDIVIDUAL', 1, true, NOW()),
(3, 'banking_user', 'banking_user@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 'INDIVIDUAL', 1, true, NOW()),

-- Healthcare Users
(4, 'healthcare_admin', 'healthcare_admin@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 'INDIVIDUAL', 2, true, NOW()),
(5, 'healthcare_manager', 'healthcare_manager@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 'INDIVIDUAL', 2, true, NOW()),
(6, 'healthcare_user', 'healthcare_user@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 'INDIVIDUAL', 2, true, NOW()),

-- Logistics Users
(7, 'logistics_admin', 'logistics_admin@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 'INDIVIDUAL', 3, true, NOW()),
(8, 'logistics_manager', 'logistics_manager@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 'INDIVIDUAL', 3, true, NOW()),
(9, 'logistics_user', 'logistics_user@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 'INDIVIDUAL', 3, true, NOW()),

-- Content Creation Users
(10, 'content_admin', 'content_admin@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'ADMIN', 'INDIVIDUAL', 4, true, NOW()),
(11, 'content_manager', 'content_manager@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'MANAGER', 'INDIVIDUAL', 4, true, NOW()),
(12, 'content_user', 'content_user@example.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ta.4hy/Xx6oUH5Hx8fzMOn9O1k7Ej7.K2e', 'USER', 'INDIVIDUAL', 4, true, NOW())
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
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));