-- Add user_id column to sector-specific tables
ALTER TABLE bank_accounts ADD COLUMN user_id BIGINT;
ALTER TABLE appointments ADD COLUMN user_id BIGINT;
ALTER TABLE shipments ADD COLUMN user_id BIGINT;
ALTER TABLE projects ADD COLUMN user_id BIGINT;
ALTER TABLE content_assets ADD COLUMN user_id BIGINT;

-- Add foreign key constraints
ALTER TABLE bank_accounts ADD CONSTRAINT fk_bank_accounts_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE projects ADD CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE content_assets ADD CONSTRAINT fk_content_assets_user FOREIGN KEY (user_id) REFERENCES users(id);

-- Add indexes for performance
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_shipments_user_id ON shipments(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_content_assets_user_id ON content_assets(user_id);
