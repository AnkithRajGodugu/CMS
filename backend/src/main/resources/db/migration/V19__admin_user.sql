-- V19: Global Admin Users (Final seeding)
-- Ensures admin users exist AFTER all schema changes (including email_verified in V9)

INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, created_at)
VALUES
  -- admin / user123 (hash of 'user123')
  ('admin', 'admin@cms.com', '$2a$10$mEcBvgHpMpYCiyhQcdzNteENtPwE3dJvk9gWz5nDBFzpb8Btdll8ra', 
   'ADMIN', 'INDIVIDUAL', true, true, NOW()),
   
  -- bank_admin / user123
  ('bank_admin', 'bank_admin@cms.com', '$2a$10$mEcBvgHpMpYCiyhQcdzNteENtPwE3dJvk9gWz5nDBFzpb8Btdll8ra', 
   'ADMIN', 'INDIVIDUAL', true, true, NOW())
ON CONFLICT (username) DO NOTHING;
