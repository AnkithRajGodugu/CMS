-- Phase 2: Extend Soft Delete to Customer entity for compliance
ALTER TABLE customers ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
