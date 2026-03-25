-- V19: Global Admin Users (Final seeding)
-- Ensures admin users exist AFTER all schema changes (including email_verified in V9)

INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, created_at)
SELECT 'admin', 'admin@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 
       'ADMIN', 'INDIVIDUAL', true, true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, created_at)
SELECT 'bank_admin', 'bank_admin@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 
       'ADMIN', 'INDIVIDUAL', true, true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'bank_admin');
