# Database Encryption Setup Guide

This guide explains how to configure PostgreSQL encryption at rest and TLS for secure database connections.

## Overview

The CMS implements multiple layers of database security:
1. **Encryption at Rest**: Data stored on disk is encrypted
2. **TLS/SSL Connections**: Data in transit is encrypted
3. **Field-Level Encryption**: Sensitive fields are encrypted in the application layer
4. **Row-Level Security**: Access control at the database level

## 1. Encryption at Rest

### Option A: PostgreSQL Transparent Data Encryption (TDE)

PostgreSQL doesn't have built-in TDE, but you can use:

#### Linux (LUKS)
```bash
# Create encrypted volume
cryptsetup luksFormat /dev/sdb
cryptsetup luksOpen /dev/sdb postgres_encrypted

# Format and mount
mkfs.ext4 /dev/mapper/postgres_encrypted
mount /dev/mapper/postgres_encrypted /var/lib/postgresql/data
```

#### Docker Volume Encryption
```yaml
# docker-compose.yml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind,encryption=aes-256-xts
      device: /encrypted/postgres
```

### Option B: Cloud Provider Encryption

#### AWS RDS
- Enable encryption when creating the RDS instance
- Uses AWS KMS for key management
- Automatic encryption of backups and snapshots

#### Azure Database for PostgreSQL
- Enable encryption at rest in Azure Portal
- Uses Azure Key Vault for key management

#### Google Cloud SQL
- Encryption at rest is enabled by default
- Uses Google-managed encryption keys

## 2. TLS/SSL Configuration

### Generate SSL Certificates

```bash
# Generate private key
openssl genrsa -out server.key 2048

# Generate certificate signing request
openssl req -new -key server.key -out server.csr

# Generate self-signed certificate (for development)
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# Generate root CA certificate (for production)
openssl req -new -x509 -days 3650 -key server.key -out root.crt
```

### Configure PostgreSQL for SSL

Edit `postgresql.conf`:
```conf
# Enable SSL
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
ssl_ca_file = '/path/to/root.crt'

# Require SSL for all connections
ssl_min_protocol_version = 'TLSv1.2'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL'
ssl_prefer_server_ciphers = on
```

Edit `pg_hba.conf`:
```conf
# Require SSL for all connections
hostssl all all 0.0.0.0/0 md5
hostssl all all ::/0 md5

# For certificate-based authentication
hostssl all all 0.0.0.0/0 cert clientcert=verify-full
```

### Docker Configuration

Update `docker-compose.yml`:
```yaml
postgres:
  image: postgres:15
  volumes:
    - ./certs/server.crt:/var/lib/postgresql/server.crt:ro
    - ./certs/server.key:/var/lib/postgresql/server.key:ro
    - ./certs/root.crt:/var/lib/postgresql/root.crt:ro
  command: >
    postgres
    -c ssl=on
    -c ssl_cert_file=/var/lib/postgresql/server.crt
    -c ssl_key_file=/var/lib/postgresql/server.key
    -c ssl_ca_file=/var/lib/postgresql/root.crt
```

## 3. Application Configuration

### Development Environment

`application.properties`:
```properties
# Use prefer mode for development (allows non-SSL fallback)
spring.datasource.url=jdbc:postgresql://localhost:5432/cms_db?ssl=true&sslmode=prefer
```

### Production Environment

`application-prod.properties`:
```properties
# Require SSL in production
spring.datasource.url=jdbc:postgresql://db.example.com:5432/cms_db?ssl=true&sslmode=require

# For certificate verification
spring.datasource.hikari.data-source-properties.sslmode=verify-full
spring.datasource.hikari.data-source-properties.sslrootcert=/path/to/root.crt
spring.datasource.hikari.data-source-properties.sslcert=/path/to/client.crt
spring.datasource.hikari.data-source-properties.sslkey=/path/to/client.key
```

## 4. Initialize Encryption Functions

Run the encryption setup script:
```bash
psql -U postgres -d cms_db -f V8__postgresql-encryption-setup.sql
```

This creates:
- `pgcrypto` extension for encryption functions
- Encryption key management tables
- Helper functions for encrypt/decrypt operations
- Audit tables for encryption operations

## 5. Verify Configuration

### Check SSL Status
```sql
-- Check if SSL is enabled
SHOW ssl;

-- Check current connection SSL status
SELECT * FROM pg_stat_ssl WHERE pid = pg_backend_pid();

-- List all SSL connections
SELECT datname, usename, ssl, cipher, bits 
FROM pg_stat_ssl 
JOIN pg_stat_activity ON pg_stat_ssl.pid = pg_stat_activity.pid;
```

### Test Encryption Functions
```sql
-- Test encryption
SELECT core.encrypt_data('sensitive data', 'encryption_key_here');

-- Test decryption
SELECT core.decrypt_data(
    core.encrypt_data('sensitive data', 'encryption_key_here'),
    'encryption_key_here'
);
```

## 6. Security Best Practices

1. **Key Management**
   - Store encryption keys in environment variables or secret management systems
   - Never commit keys to version control
   - Rotate keys regularly (every 90 days recommended)

2. **Certificate Management**
   - Use certificates from trusted CAs in production
   - Set appropriate expiration dates
   - Monitor certificate expiration

3. **Access Control**
   - Limit database user permissions
   - Use separate users for different services
   - Enable audit logging

4. **Monitoring**
   - Monitor failed SSL connection attempts
   - Track encryption/decryption operations
   - Set up alerts for security events

5. **Backup Security**
   - Encrypt database backups
   - Store backups in secure locations
   - Test backup restoration regularly

## 7. Troubleshooting

### SSL Connection Issues

```bash
# Test SSL connection
psql "postgresql://user@host:5432/db?sslmode=require"

# Check certificate validity
openssl x509 -in server.crt -text -noout

# Verify certificate chain
openssl verify -CAfile root.crt server.crt
```

### Common Errors

**Error: "SSL connection has been closed unexpectedly"**
- Check certificate permissions (should be 600 for key files)
- Verify certificate paths in postgresql.conf
- Check certificate expiration dates

**Error: "sslmode value 'require' invalid when SSL support is not compiled in"**
- Rebuild PostgreSQL with SSL support
- Use a PostgreSQL distribution with SSL enabled

**Error: "could not accept SSL connection: wrong version number"**
- Check TLS version compatibility
- Update ssl_min_protocol_version setting

## 8. Compliance Considerations

### GDPR
- Encryption at rest and in transit required for personal data
- Document encryption methods and key management
- Implement data retention and deletion policies

### HIPAA
- Encryption required for Protected Health Information (PHI)
- Use FIPS 140-2 validated encryption modules
- Maintain audit logs of all data access

### PCI DSS
- Encryption required for cardholder data
- Use strong cryptography (AES-256, RSA-2048+)
- Implement key rotation and management procedures

## References

- [PostgreSQL SSL Support](https://www.postgresql.org/docs/current/ssl-tcp.html)
- [pgcrypto Extension](https://www.postgresql.org/docs/current/pgcrypto.html)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/security.html)
