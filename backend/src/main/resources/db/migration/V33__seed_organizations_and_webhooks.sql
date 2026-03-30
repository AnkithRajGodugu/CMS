-- V33: Seed Organizations and Webhook Subscriptions for all sectors
-- This ensures the Webhooks UI in the frontend is fully populated for demos.

-- ============================================================
-- 1. SEED ORGANIZATIONS
-- One representative organization for each sector
-- ============================================================
INSERT INTO organizations (name, domain, sector_id, active, created_at)
SELECT 'Global Bank Corp', 'globalbank.com', id, true, NOW()
FROM sectors WHERE code = 'BANKING'
AND NOT EXISTS (SELECT 1 FROM organizations WHERE domain = 'globalbank.com');

INSERT INTO organizations (name, domain, sector_id, active, created_at)
SELECT 'City Health Group', 'cityhealth.org', id, true, NOW()
FROM sectors WHERE code = 'HEALTHCARE'
AND NOT EXISTS (SELECT 1 FROM organizations WHERE domain = 'cityhealth.org');

INSERT INTO organizations (name, domain, sector_id, active, created_at)
SELECT 'Express Logistics Ltd', 'expresslogistics.net', id, true, NOW()
FROM sectors WHERE code = 'LOGISTICS'
AND NOT EXISTS (SELECT 1 FROM organizations WHERE domain = 'expresslogistics.net');

INSERT INTO organizations (name, domain, sector_id, active, created_at)
SELECT 'Creative Media Hub', 'creativemedia.co', id, true, NOW()
FROM sectors WHERE code = 'CONTENT'
AND NOT EXISTS (SELECT 1 FROM organizations WHERE domain = 'creativemedia.co');

-- ============================================================
-- 2. LINK ADMIN USERS TO ORGANIZATIONS
-- Update sector-specific admin accounts to belong to these organizations
-- ============================================================
UPDATE users 
SET organization_id = (SELECT id FROM organizations WHERE domain = 'globalbank.com')
WHERE username = 'bank_admin' AND organization_id IS NULL;

UPDATE users 
SET organization_id = (SELECT id FROM organizations WHERE domain = 'cityhealth.org')
WHERE username = 'health_admin' AND organization_id IS NULL;

UPDATE users 
SET organization_id = (SELECT id FROM organizations WHERE domain = 'expresslogistics.net')
WHERE username = 'logistics_admin' AND organization_id IS NULL;

UPDATE users 
SET organization_id = (SELECT id FROM organizations WHERE domain = 'creativemedia.co')
WHERE username = 'content_admin' AND organization_id IS NULL;

-- ============================================================
-- 3. SEED WEBHOOK SUBSCRIPTIONS
-- Active sample webhooks for each organization
-- ============================================================
-- Banking Webhooks
INSERT INTO webhook_subscription (organization_id, url, secret, event_types, is_active, created_at)
SELECT id, 'https://webhook.site/demo-bank-ledger-sync', 'sk_live_bank_123', 'TRANSACTION_CREATED,TRANSFER_COMPLETED', true, NOW()
FROM organizations WHERE domain = 'globalbank.com'
AND NOT EXISTS (SELECT 1 FROM webhook_subscription WHERE url = 'https://webhook.site/demo-bank-ledger-sync');

-- Healthcare Webhooks
INSERT INTO webhook_subscription (organization_id, url, secret, event_types, is_active, created_at)
SELECT id, 'https://webhook.site/health-appointment-alerts', 'sk_test_health_456', 'APPOINTMENT_SCHEDULED,PATIENT_CRITICAL', true, NOW()
FROM organizations WHERE domain = 'cityhealth.org'
AND NOT EXISTS (SELECT 1 FROM webhook_subscription WHERE url = 'https://webhook.site/health-appointment-alerts');

-- Logistics Webhooks
INSERT INTO webhook_subscription (organization_id, url, secret, event_types, is_active, created_at)
SELECT id, 'https://webhook.site/logistics-tracking-webhook', 'logistics_secret_789', '*', true, NOW()
FROM organizations WHERE domain = 'expresslogistics.net'
AND NOT EXISTS (SELECT 1 FROM webhook_subscription WHERE url = 'https://webhook.site/logistics-tracking-webhook');

-- Content Webhooks
INSERT INTO webhook_subscription (organization_id, url, secret, event_types, is_active, created_at)
SELECT id, 'https://webhook.site/content-asset-pipeline', 'media_pipeline_abc', 'ASSET_UPLOADED,PROJECT_PUBLISHED', true, NOW()
FROM organizations WHERE domain = 'creativemedia.co'
AND NOT EXISTS (SELECT 1 FROM webhook_subscription WHERE url = 'https://webhook.site/content-asset-pipeline');
