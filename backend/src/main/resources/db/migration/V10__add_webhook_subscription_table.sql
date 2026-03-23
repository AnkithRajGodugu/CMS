CREATE TABLE webhook_subscription (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    secret VARCHAR(255),
    event_types VARCHAR(500) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_org_id ON webhook_subscription(organization_id);
CREATE INDEX idx_webhook_active ON webhook_subscription(is_active);
