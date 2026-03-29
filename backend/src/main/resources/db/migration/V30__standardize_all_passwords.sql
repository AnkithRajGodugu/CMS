-- V30: Standardize all seed user passwords to 'admin123'
-- This eliminates the split where some early demo users (like bank_user1) had different BCrypt hashes.
-- Hash corresponds to 'admin123'

UPDATE users 
SET password = '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O';
