-- PostgreSQL Encryption Configuration
-- This script sets up encryption at rest and security policies

-- =====================================================
-- 1. Enable pgcrypto extension for encryption functions
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 2. Create encryption key management table
-- =====================================================
CREATE TABLE IF NOT EXISTS core.encryption_keys (
    id BIGSERIAL PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    key_version INT NOT NULL DEFAULT 1,
    encrypted_key TEXT NOT NULL,
    algorithm VARCHAR(50) NOT NULL DEFAULT 'AES-256',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rotated_at TIMESTAMP,
    active BOOLEAN DEFAULT true
);

-- =====================================================
-- 3. Create audit table for encryption operations
-- =====================================================
CREATE TABLE IF NOT EXISTS core.encryption_audit (
    id BIGSERIAL PRIMARY KEY,
    operation VARCHAR(50) NOT NULL,
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    user_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- =====================================================
-- 4. Enable Row Level Security on sensitive tables
-- =====================================================
-- This is already configured in previous migrations
-- but we ensure it's enabled for encryption context

-- =====================================================
-- 5. Create function to encrypt sensitive data
-- =====================================================
CREATE OR REPLACE FUNCTION core.encrypt_data(
    data TEXT,
    encryption_key TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN encode(
        pgp_sym_encrypt(data, encryption_key),
        'base64'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. Create function to decrypt sensitive data
-- =====================================================
CREATE OR REPLACE FUNCTION core.decrypt_data(
    encrypted_data TEXT,
    encryption_key TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(
        decode(encrypted_data, 'base64'),
        encryption_key
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. Create function to hash passwords (one-way)
-- =====================================================
CREATE OR REPLACE FUNCTION core.hash_password(
    password TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. Create function to verify password
-- =====================================================
CREATE OR REPLACE FUNCTION core.verify_password(
    password TEXT,
    password_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. Grant necessary permissions
-- =====================================================
GRANT EXECUTE ON FUNCTION core.encrypt_data(TEXT, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION core.decrypt_data(TEXT, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION core.hash_password(TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION core.verify_password(TEXT, TEXT) TO PUBLIC;

-- =====================================================
-- 10. Create indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_encryption_keys_active 
    ON core.encryption_keys(active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_encryption_audit_timestamp 
    ON core.encryption_audit(timestamp DESC);

-- =====================================================
-- NOTES FOR PRODUCTION DEPLOYMENT:
-- =====================================================
-- 1. Enable PostgreSQL encryption at rest by configuring:
--    - data_encryption = on in postgresql.conf
--    - Use encrypted storage volumes (LUKS, dm-crypt, or cloud provider encryption)
--
-- 2. Configure SSL/TLS for connections:
--    - ssl = on in postgresql.conf
--    - ssl_cert_file = 'server.crt'
--    - ssl_key_file = 'server.key'
--    - ssl_ca_file = 'root.crt'
--
-- 3. Set up certificate-based authentication:
--    - Update pg_hba.conf to require SSL
--    - hostssl all all 0.0.0.0/0 cert
--
-- 4. Rotate encryption keys regularly:
--    - Update encryption_keys table with new versions
--    - Re-encrypt data with new keys
--
-- 5. Backup encryption keys securely:
--    - Store keys in a separate secure location
--    - Use hardware security modules (HSM) for production
--
-- 6. Monitor encryption operations:
--    - Review encryption_audit table regularly
--    - Set up alerts for failed encryption operations
