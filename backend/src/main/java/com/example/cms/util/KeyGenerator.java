package com.example.cms.util;

/**
 * Utility class for generating encryption keys.
 * Run this class to generate a new AES-256 encryption key for configuration.
 */
public class KeyGenerator {
    
    public static void main(String[] args) {
        System.out.println("=".repeat(80));
        System.out.println("AES-256 Encryption Key Generator");
        System.out.println("=".repeat(80));
        System.out.println();
        
        // Generate a new encryption key
        String key = EncryptionUtil.generateKeyString();
        
        System.out.println("Generated Encryption Key (Base64):");
        System.out.println(key);
        System.out.println();
        
        System.out.println("Add this to your application.properties:");
        System.out.println("encryption.key=" + key);
        System.out.println();
        
        System.out.println("Or set as environment variable:");
        System.out.println("export ENCRYPTION_KEY=\"" + key + "\"");
        System.out.println();
        
        System.out.println("IMPORTANT SECURITY NOTES:");
        System.out.println("1. Store this key securely - never commit it to version control");
        System.out.println("2. Use environment variables or secret management systems in production");
        System.out.println("3. Rotate keys regularly (every 90 days recommended)");
        System.out.println("4. Backup the key securely - losing it means losing access to encrypted data");
        System.out.println("5. Use different keys for different environments (dev, staging, prod)");
        System.out.println();
        System.out.println("=".repeat(80));
    }
}
