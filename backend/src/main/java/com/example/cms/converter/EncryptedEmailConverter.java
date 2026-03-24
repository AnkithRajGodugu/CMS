package com.example.cms.converter;

import com.example.cms.util.EncryptionUtil;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * JPA AttributeConverter for automatic encryption/decryption of email addresses.
 * This converter is specifically designed for email fields to ensure PII protection.
 * 
 * Usage:
 * @Convert(converter = EncryptedEmailConverter.class)
 * private String email;
 */
@Converter
@Component
public class EncryptedEmailConverter implements AttributeConverter<String, String> {

    private static EncryptionUtil encryptionUtil;

    @Autowired
    public void setEncryptionUtil(EncryptionUtil encryptionUtil) {
        EncryptedEmailConverter.encryptionUtil = encryptionUtil;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return attribute;
        }
        
        // Validate email format before encryption
        if (!isValidEmail(attribute)) {
            throw new IllegalArgumentException("Invalid email format: " + attribute);
        }
        
        try {
            return encryptionUtil.encrypt(attribute.toLowerCase().trim());
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt email", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return dbData;
        }
        
        // If it's not encrypted (e.g. from a raw SQL seed), return as is
        if (!encryptionUtil.isEncrypted(dbData)) {
            return dbData;
        }
        
        try {
            return encryptionUtil.decrypt(dbData);
        } catch (Exception e) {
            // Fallback for non-matching keys in dev, but log it
            return dbData;
        }
    }

    /**
     * Basic email validation.
     * 
     * @param email The email to validate
     * @return true if email format is valid
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        
        // Simple regex for email validation
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
}
