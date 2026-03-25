package com.example.cms.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

/**
 * TotpService — RFC 6238 compliant TOTP (Time-based One-Time Password).
 *
 * Compatible with Google Authenticator, Authy, and any TOTP app.
 * Uses HMAC-SHA1, 30-second window, 6-digit codes.
 * Allows ±1 window tolerance to handle clock skew.
 */
@Service
@Slf4j
public class TotpService {

    private static final int CODE_DIGITS = 6;
    private static final long TIME_STEP_SECONDS = 30;
    private static final int WINDOW_TOLERANCE = 1; // allow ±1 window
    private static final String HMAC_SHA1 = "HmacSHA1";

    public String generateSecret() {
        byte[] bytes = new byte[20]; // 160-bit secret
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Generates the Google Authenticator QR code URL (otpauth:// URI).
     */
    public String buildQrCodeUrl(String username, String secret, String issuer) {
        String encodedIssuer = urlEncode(issuer);
        String encodedUser = urlEncode(issuer + ":" + username);
        return "otpauth://totp/" + encodedUser
                + "?secret=" + secret
                + "&issuer=" + encodedIssuer
                + "&algorithm=SHA1&digits=6&period=30";
    }

    /**
     * Returns a Google Charts QR image URL for the otpauth URI.
     * In production, replace with server-side QR generation (ZXing library).
     */
    public String buildQrImageUrl(String username, String secret, String issuer) {
        String otpauthUri = buildQrCodeUrl(username, secret, issuer);
        return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + urlEncode(otpauthUri);
    }

    /**
     * Verifies a 6-digit TOTP code against the secret, with ±1 window tolerance.
     */
    public boolean verify(String secret, int code) {
        long currentWindow = Instant.now().getEpochSecond() / TIME_STEP_SECONDS;
        for (int i = -WINDOW_TOLERANCE; i <= WINDOW_TOLERANCE; i++) {
            if (generate(secret, currentWindow + i) == code) {
                return true;
            }
        }
        return false;
    }

    // ─── Internal HOTP generation (RFC 4226) ──────────────────────────────────

    private int generate(String secret, long counter) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            byte[] counterBytes = ByteBuffer.allocate(8).putLong(counter).array();

            Mac mac = Mac.getInstance(HMAC_SHA1);
            mac.init(new SecretKeySpec(keyBytes, HMAC_SHA1));
            byte[] hash = mac.doFinal(counterBytes);

            int offset = hash[hash.length - 1] & 0x0F;
            int binary = ((hash[offset] & 0x7F) << 24)
                    | ((hash[offset + 1] & 0xFF) << 16)
                    | ((hash[offset + 2] & 0xFF) << 8)
                    | (hash[offset + 3] & 0xFF);

            return binary % (int) Math.pow(10, CODE_DIGITS);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("TOTP generation failed", e);
        }
    }

    private String urlEncode(String s) {
        try {
            return java.net.URLEncoder.encode(s, "UTF-8").replace("+", "%20");
        } catch (Exception e) {
            return s;
        }
    }
}
