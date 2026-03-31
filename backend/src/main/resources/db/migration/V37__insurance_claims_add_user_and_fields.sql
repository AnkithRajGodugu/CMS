-- V37: Add user_id FK and richer fields to insurance_claims
-- Columns are nullable so existing seed data is unaffected.
-- Note: ADD CONSTRAINT IF NOT EXISTS is NOT valid PostgreSQL syntax;
-- use a DO block to guard it conditionally.

ALTER TABLE insurance_claims
    ADD COLUMN IF NOT EXISTS user_id      BIGINT       DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS description  VARCHAR(500) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS claim_type   VARCHAR(100) DEFAULT NULL;

-- Add FK only if it does not already exist (safe for re-runs via DO block)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_insurance_claims_user'
    ) THEN
        ALTER TABLE insurance_claims
            ADD CONSTRAINT fk_insurance_claims_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END;
$$;
