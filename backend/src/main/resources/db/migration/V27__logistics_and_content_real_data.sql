-- Migration V7: Logistics and Content modules real data structures

-- 1. Create shipment_events table
CREATE TABLE IF NOT EXISTS shipment_events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    new_status VARCHAR(50),
    shipment_id BIGINT NOT NULL,
    CONSTRAINT fk_shipment_events_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- 2. Create content_distributions table
CREATE TABLE IF NOT EXISTS content_distributions (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    followers VARCHAR(50),
    active_campaigns INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert mock data for content_distributions so frontend works instantly
INSERT INTO content_distributions (platform, status, followers, active_campaigns) VALUES 
('YouTube', 'CONNECTED', '1.2M', 3),
('Instagram', 'CONNECTED', '450K', 5),
('TikTok', 'DISCONNECTED', '890K', 0),
('Twitter/X', 'CONNECTED', '120K', 2);
