-- V15: Align User Roles
-- Converts sector-specific roles (BANKING, HEALTHCARE, LOGISTICS, CONTENT) to a unified USER role.
-- Permission levels are now handled by the 'role' column, while domain/interest is handled by the 'sector_id' column.

UPDATE users 
SET role = 'USER' 
WHERE role IN ('BANKING', 'HEALTHCARE', 'LOGISTICS', 'CONTENT');
