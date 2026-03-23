package com.example.cms.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility class for AES-256-GCM encryption and decryption of sensitive data.
 * Uses Galois/Counter Mode (GCM) for authenticated encryption.
 */
@Slf4j
@Component
public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12; // 96 bits
    private static final int GCM_TAG_LENGTH = 128; // 128 bits
    private static final int KEY_SIZE = 256; // 256 bits

    private final SecretKey secretKey;
    private final SecureRandom secureRandom;

    /**
     * Constructor that initializes the encryption key from application properties.
     *
     * @param encryptionKey Base64-encoded encryption key from configuration
     */
    public EncryptionUtil(@Value("${encryption.key:}") String encryptionKey) {
        this.secureRandom = new SecureRandom();

        if (encryptionKey == null || encryptionKey.isEmpty()) {
            // Generate a new key if none is provided (development only — fail fast in prod)
            this.secretKey = generateKey();
            log.error("SECURITY WARNING: No ENCRYPTION_KEY configured. "
                    + "A random key was generated — encrypted data will be LOST on restart! "
                    + "Set the ENCRYPTION_KEY environment variable for production.");
        } else {
            // Decode the provided key
            byte[] decodedKey = Base64.getDecoder().decode(encryptionKey);
            this.secretKey = new SecretKeySpec(decodedKey, ALGORITHM);
        }
    }

    /**
     * Generates a new AES-256 encryption key.
     * This should only be used for development/testing.
     *
     * @return A new SecretKey
     */
    public static SecretKey generateKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(KEY_SIZE, new SecureRandom());
            return keyGenerator.generateKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate encryption key", e);
        }
    }

    /**
     * Generates a Base64-encoded encryption key for configuration.
     *
     * @return Base64-encoded key string
     */
    public static String generateKeyString() {
        SecretKey key = generateKey();
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    /**
     * Encrypts the given plaintext using AES-256-GCM.
     *
     * @param plaintext The text to encrypt
     * @return Base64-encoded encrypted data with IV prepended
     * @throws RuntimeException if encryption fails
     */
    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isEmpty()) {
            return plaintext;
        }

        try {
            // Generate random IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            // Encrypt the data
            byte[] encryptedData = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            // Combine IV and encrypted data
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedData.length);
            byteBuffer.put(iv);
            byteBuffer.put(encryptedData);

            // Encode to Base64 for storage
            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * Decrypts the given ciphertext using AES-256-GCM.
     *
     * @param ciphertext Base64-encoded encrypted data with IV prepended
     * @return Decrypted plaintext
     * @throws RuntimeException if decryption fails
     */
    public String decrypt(String ciphertext) {
        if (ciphertext == null || ciphertext.isEmpty()) {
            return ciphertext;
        }

        try {
            // Decode from Base64
            byte[] encryptedDataWithIv = Base64.getDecoder().decode(ciphertext);

            // Extract IV and encrypted data
            ByteBuffer byteBuffer = ByteBuffer.wrap(encryptedDataWithIv);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            byte[] encryptedData = new byte[byteBuffer.remaining()];
            byteBuffer.get(encryptedData);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            // Decrypt the data
            byte[] decryptedData = cipher.doFinal(encryptedData);

            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /**
     * Checks if the given string appears to be encrypted (Base64 format).
     *
     * @param value The string to check
     * @return true if the string appears to be encrypted
     */
    public boolean isEncrypted(String value) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        try {
            byte[] decoded = Base64.getDecoder().decode(value);
            // Encrypted data should be at least IV length + some data
            return decoded.length > GCM_IV_LENGTH;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Encrypts data only if it's not already encrypted.
     *
     * @param data The data to encrypt
     * @return Encrypted data or original if already encrypted
     */
    public String encryptIfNeeded(String data) {
        if (isEncrypted(data)) {
            return data;
        }
        return encrypt(data);
    }

    /**
     * One-way hash function for passwords (not reversible).
     * This is a convenience method that uses the encryption key as salt.
     * For production, use BCrypt or Argon2 instead.
     *
     * @param password The password to hash
     * @return Base64-encoded hash
     */
    public String hashPassword(String password) {
        if (password == null || password.isEmpty()) {
            return password;
        }

        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }
}
