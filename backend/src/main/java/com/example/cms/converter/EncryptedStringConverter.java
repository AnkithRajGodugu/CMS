package com.example.cms.converter;

import com.example.cms.util.EncryptionUtil;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * JPA AttributeConverter for automatic encryption/decryption of String fields.
 * Apply this converter to entity fields that contain sensitive data.
 * 
 * Usage:
 * @Convert(converter = EncryptedStringConverter.class)
 * private String sensitiveField;
 */
@Converter
@Component
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    private static EncryptionUtil encryptionUtil;

    @Autowired
    public void setEncryptionUtil(EncryptionUtil encryptionUtil) {
        EncryptedStringConverter.encryptionUtil = encryptionUtil;
    }

    /**
     * Converts the entity attribute to database column value (encryption).
     * 
     * @param attribute The entity attribute value
     * @return Encrypted value for database storage
     */
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return attribute;
        }
        
        try {
            return encryptionUtil.encrypt(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt attribute", e);
        }
    }

    /**
     * Converts the database column value to entity attribute (decryption).
     * 
     * @param dbData The database column value
     * @return Decrypted value for entity attribute
     */
    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return dbData;
        }
        
        try {
            return encryptionUtil.decrypt(dbData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt attribute", e);
        }
    }
}
