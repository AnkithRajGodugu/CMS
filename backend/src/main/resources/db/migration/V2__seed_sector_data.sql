-- Seed data for sectors with enhanced fields
-- This script populates the sectors table with initial data

-- Insert or update sectors with all required fields
INSERT INTO sectors (code, name, description, icon, route_path, configuration, enabled, display_order)
VALUES 
    ('BANKING', 'Banking & Finance', 'Comprehensive banking and financial services management', 'bank', '/banking', '{"features": ["accounts", "transactions", "loans"], "modules": ["retail", "corporate"]}', true, 1),
    ('HEALTHCARE', 'Healthcare', 'Patient management and healthcare services', 'hospital', '/healthcare', '{"features": ["appointments", "patients", "prescriptions"], "modules": ["clinic", "pharmacy"]}', true, 2),
    ('EDUCATION', 'Education', 'Educational institution and student management', 'school', '/education', '{"features": ["students", "courses", "grades"], "modules": ["academic", "administration"]}', true, 3),
    ('RETAIL', 'Retail', 'Retail operations and inventory management', 'shopping-cart', '/retail', '{"features": ["inventory", "orders", "customers"], "modules": ["pos", "ecommerce"]}', true, 4),
    ('MANUFACTURING', 'Manufacturing', 'Manufacturing and production management', 'factory', '/manufacturing', '{"features": ["production", "quality", "inventory"], "modules": ["planning", "execution"]}', true, 5)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    route_path = EXCLUDED.route_path,
    configuration = EXCLUDED.configuration,
    enabled = EXCLUDED.enabled,
    display_order = EXCLUDED.display_order;
