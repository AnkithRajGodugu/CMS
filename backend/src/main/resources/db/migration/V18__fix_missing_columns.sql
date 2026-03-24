-- Add missing 'deleted' columns to support soft deletion in entities
-- Use simplified IF NOT EXISTS for robustness

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_accounts' AND column_name = 'deleted') THEN
        ALTER TABLE bank_accounts ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'deleted') THEN
        ALTER TABLE customers ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    -- Ensure audit fields are consistent for customers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'created_at') THEN
        ALTER TABLE customers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'updated_at') THEN
        ALTER TABLE customers ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Optional: Check other sector tables
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shipments') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shipments' AND column_name = 'deleted') THEN
            ALTER TABLE shipments ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'deleted') THEN
            ALTER TABLE appointments ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'deleted') THEN
            ALTER TABLE projects ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_assets') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_assets' AND column_name = 'deleted') THEN
            ALTER TABLE content_assets ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
    END IF;
END $$;
