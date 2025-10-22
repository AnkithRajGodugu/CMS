# Field-Level Encryption Guide

This guide explains how to use the field-level encryption utilities in the CMS application.

## Overview

The CMS implements AES-256-GCM encryption for sensitive data fields. This provides:
- **Confidentiality**: Data is encrypted at rest in the database
- **Integrity**: GCM mode provides authentication to detect tampering
- **Performance**: Efficient encryption/decryption with minimal overhead
- **Compliance**: Meets requirements for GDPR, HIPAA, and PCI DSS

## Components

### 1. EncryptionUtil

Core utility class that provides encryption/decryption methods using AES-256-GCM.

**Key Features:**
- AES-256 encryption with Galois/Counter Mode (GCM)
- Random IV generation for each encryption operation
- Base64 encoding for database storage
- Automatic key management from configuration

**Usage:**
```java
@Autowired
private EncryptionUtil encryptionUtil;

// Encrypt data
String encrypted = encryptionUtil.encrypt("sensitive data");

// Decrypt data
String decrypted = encryptionUtil.decrypt(encrypted);

// Check if data is encrypted
boolean isEncrypted = encryptionUtil.isEncrypted(someValue);

// Encrypt only if not already encrypted
String result = encryptionUtil.encryptIfNeeded(someValue);
```

### 2. JPA Attribute Converters

Automatic encryption/decryption for entity fields using JPA converters.

#### EncryptedStringConverter

General-purpose converter for any string field:

```java
@Entity
public class MyEntity {
    @Convert(converter = EncryptedStringConverter.class)
    @Column(length = 1000) // Encrypted data is longer
    private String sensitiveField;
}
```

#### EncryptedEmailConverter

Specialized converter for email addresses with validation:

```java
@Entity
public class User {
    @Convert(converter = EncryptedEmailConverter.class)
    @Column(length = 1000)
    private String email;
}
```

## Setup Instructions

### 1. Generate Encryption Key

Run the KeyGenerator utility to create a new encryption key:

```bash
cd backend
mvn compile
mvn exec:java -Dexec.mainClass="com.example.cms.util.KeyGenerator"
```

This will output a Base64-encoded AES-256 key.

### 2. Configure Application

#### Development Environment

Add to `application.properties`:
```properties
encryption.key=<your-generated-key>
```

#### Production Environment

Use environment variables:
```bash
export ENCRYPTION_KEY="<your-generated-key>"
```

Or use a secret management system:
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Kubernetes Secrets

### 3. Apply Encryption to Entity Fields

Add the `@Convert` annotation to sensitive fields:

```java
@Entity
@Table(name = "users")
public class User {
    
    // Encrypt email (PII)
    @Convert(converter = EncryptedEmailConverter.class)
    @Column(length = 1000)
    private String email;
    
    // Encrypt phone number (PII)
    @Convert(converter = EncryptedStringConverter.class)
    @Column(length = 1000)
    private String phoneNumber;
    
    // Encrypt SSN (PII)
    @Convert(converter = EncryptedStringConverter.class)
    @Column(length = 1000)
    private String ssn;
    
    // Note: Passwords should use BCrypt, not encryption
    @Column(nullable = false)
    private String password; // Already hashed with BCrypt
}
```

### 4. Update Database Schema

Encrypted fields need more storage space. Update column lengths:

```sql
-- Increase column length for encrypted fields
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(1000);
ALTER TABLE users ALTER COLUMN phone_number TYPE VARCHAR(1000);
```

## Best Practices

### 1. What to Encrypt

**DO encrypt:**
- Email addresses
- Phone numbers
- Social Security Numbers (SSN)
- Credit card numbers
- Medical record numbers
- Personal addresses
- Any Personally Identifiable Information (PII)

**DON'T encrypt:**
- Passwords (use BCrypt or Argon2 instead)
- Usernames (needed for queries)
- IDs and foreign keys
- Timestamps
- Status flags
- Non-sensitive data

### 2. Database Considerations

**Column Length:**
- Encrypted data is ~1.5x longer than plaintext
- Use VARCHAR(1000) for most encrypted fields
- Adjust based on expected data length

**Indexing:**
- Cannot create indexes on encrypted columns
- Create separate hash columns for searchability if needed
- Use database-level encryption for indexed fields

**Queries:**
- Cannot use WHERE clauses on encrypted fields
- Cannot use ORDER BY on encrypted fields
- Decrypt in application layer for filtering/sorting

### 3. Key Management

**Storage:**
- Never commit keys to version control
- Use environment variables or secret management
- Separate keys for each environment
- Document key locations securely

**Rotation:**
- Rotate keys every 90 days (recommended)
- Keep old keys for decrypting existing data
- Implement gradual re-encryption process

**Backup:**
- Backup keys separately from data
- Store in multiple secure locations
- Test key recovery procedures
- Document key recovery process

### 4. Performance Optimization

**Caching:**
- Cache decrypted values in application memory
- Use Redis for distributed caching
- Set appropriate TTL for cached data

**Batch Operations:**
- Decrypt in batches when possible
- Use async processing for large datasets
- Consider lazy loading for encrypted fields

**Database:**
- Use connection pooling
- Optimize queries to minimize decryption
- Consider read replicas for heavy loads

## Migration Guide

### Encrypting Existing Data

If you have existing unencrypted data, follow this migration process:

#### Step 1: Add Encryption Support

```java
@Entity
public class User {
    @Convert(converter = EncryptedEmailConverter.class)
    @Column(length = 1000)
    private String email;
}
```

#### Step 2: Create Migration Script

```java
@Service
public class EncryptionMigrationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EncryptionUtil encryptionUtil;
    
    @Transactional
    public void migrateUserEmails() {
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            String email = user.getEmail();
            
            // Check if already encrypted
            if (!encryptionUtil.isEncrypted(email)) {
                // Encrypt and save
                user.setEmail(email); // Converter will encrypt
                userRepository.save(user);
            }
        }
    }
}
```

#### Step 3: Run Migration

```bash
# Create a migration endpoint or command-line tool
curl -X POST http://localhost:8080/api/admin/migrate/encrypt-emails
```

#### Step 4: Verify Migration

```sql
-- Check that all emails are now encrypted (Base64 format)
SELECT id, email FROM users LIMIT 10;
```

## Troubleshooting

### Common Issues

#### 1. "Encryption failed" Error

**Cause:** Missing or invalid encryption key

**Solution:**
```bash
# Generate new key
mvn exec:java -Dexec.mainClass="com.example.cms.util.KeyGenerator"

# Set in environment
export ENCRYPTION_KEY="<generated-key>"
```

#### 2. "Decryption failed" Error

**Cause:** Data encrypted with different key or corrupted

**Solution:**
- Verify encryption key matches the one used for encryption
- Check if data was manually modified in database
- Restore from backup if data is corrupted

#### 3. "Column too small" Error

**Cause:** Database column too short for encrypted data

**Solution:**
```sql
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(1000);
```

#### 4. Performance Issues

**Cause:** Too many encryption/decryption operations

**Solution:**
- Implement caching for frequently accessed data
- Use lazy loading for encrypted fields
- Consider database-level encryption for better performance

### Debugging

Enable debug logging:

```properties
logging.level.com.example.cms.util.EncryptionUtil=DEBUG
logging.level.com.example.cms.converter=DEBUG
```

Test encryption/decryption:

```java
@Test
public void testEncryption() {
    EncryptionUtil util = new EncryptionUtil("test-key");
    
    String original = "test@example.com";
    String encrypted = util.encrypt(original);
    String decrypted = util.decrypt(encrypted);
    
    assertNotEquals(original, encrypted);
    assertEquals(original, decrypted);
}
```

## Security Considerations

### 1. Compliance

**GDPR:**
- Encryption satisfies "appropriate technical measures"
- Document encryption methods in privacy policy
- Implement key rotation procedures

**HIPAA:**
- AES-256 meets HIPAA encryption requirements
- Maintain audit logs of key access
- Implement access controls for keys

**PCI DSS:**
- Encryption required for cardholder data
- Use strong cryptography (AES-256 ✓)
- Implement key management procedures

### 2. Threat Model

**Protected Against:**
- Database breaches (data at rest)
- Backup theft
- Unauthorized database access
- SQL injection (data remains encrypted)

**Not Protected Against:**
- Application-level attacks (data decrypted in memory)
- Key theft (if attacker has key, can decrypt)
- Side-channel attacks
- Insider threats with application access

### 3. Additional Security Layers

**Application Security:**
- Use HTTPS for data in transit
- Implement authentication and authorization
- Use prepared statements to prevent SQL injection
- Sanitize user inputs

**Database Security:**
- Enable SSL/TLS for database connections
- Use row-level security policies
- Implement audit logging
- Restrict database user permissions

**Infrastructure Security:**
- Use encrypted storage volumes
- Implement network segmentation
- Use firewalls and security groups
- Enable monitoring and alerting

## References

- [NIST Encryption Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Java Cryptography Architecture](https://docs.oracle.com/en/java/javase/17/security/java-cryptography-architecture-jca-reference-guide.html)
- [AES-GCM Specification](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)
