-- V22: Force update all seeded user passwords to valid BCrypt hashes for testing
-- This ensures that users who didn't clear their databases after V17/V19 issue still get correct passwords matching the demo UI.

UPDATE users 
SET password = '$2a$10$ymSPnMfyEL.bhzet0YgjReS528VnOvrfeiNL3Yt3dIliogJjkIgqO' 
WHERE username IN ('bank_user1', 'bank_user2', 'bank_user3');

UPDATE users 
SET password = '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O' 
WHERE username IN ('admin', 'bank_admin', 'health_admin', 'logistics_admin', 'content_admin');
