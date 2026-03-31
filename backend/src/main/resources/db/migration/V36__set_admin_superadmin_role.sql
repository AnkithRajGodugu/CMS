-- V36: Promote the global platform admin to SUPERADMIN role
-- This distinguishes the cross-sector platform admin from sector-specific admins (bank_admin, etc.)
-- SUPERADMIN has bypassed sector restrictions and can switch between all sector dashboards.

UPDATE users
SET role = 'SUPERADMIN'
WHERE username = 'admin';
