-- Add missing Enhanced Profile fields to users table
ALTER TABLE users 
    ADD COLUMN avatar_url VARCHAR(255),
    ADD COLUMN bio VARCHAR(500),
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN preferences TEXT;
