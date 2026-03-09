CREATE TABLE audit_log (
                           id BIGSERIAL PRIMARY KEY,
                           user_id BIGINT,
                           sector_id BIGINT,
                           organization_id BIGINT,
                           action VARCHAR(255) NOT NULL,
                           resource_type VARCHAR(255),
                           resource_id VARCHAR(255),
                           details JSONB,
                           ip_address VARCHAR(45),
                           timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           status VARCHAR(50),
                           error_message VARCHAR(1000)
);

CREATE INDEX idx_audit_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_sector_id ON audit_log(sector_id);
CREATE INDEX idx_audit_organization_id ON audit_log(organization_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_resource_type ON audit_log(resource_type);
CREATE INDEX idx_audit_user_timestamp ON audit_log(user_id, timestamp);