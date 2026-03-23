-- Phase 2: Security & Compliance
-- Add Soft Delete support for heavily regulated sector entities

ALTER TABLE patients ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE appointments ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE bank_accounts ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE transactions ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
