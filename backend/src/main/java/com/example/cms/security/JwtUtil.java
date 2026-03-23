package com.example.cms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Long expiration;
    private final Long refreshExpiration;

    public JwtUtil(
            @Value("${jwt.secret:mySecretKey12345678901234567890123456789012345678901234567890}") String secret,
            @Value("${jwt.expiration:86400000}") Long expiration,           // 24 hours
            @Value("${jwt.refresh.expiration:604800000}") Long refreshExpiration // 7 days
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
    }

    // ─── Token Generation ───────────────────────────────────────────────────

    public String generateToken(String username, String role, String sector) {
        return Jwts.builder()
                .claims(Map.of("role", role, "sector", sector == null ? "NONE" : sector))
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .claims(Map.of("type", "refresh"))
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // ─── Token Validation ───────────────────────────────────────────────────

    public Boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * Validates the token without knowing the username in advance.
     * Used by the WebSocket handshake interceptor.
     */
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean validateRefreshToken(String token) {
        String type = getClaimFromToken(token, claims -> claims.get("type", String.class));
        return "refresh".equals(type) && !isTokenExpired(token);
    }

    // ─── Claims Extraction ──────────────────────────────────────────────────

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public String getRoleFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("role", String.class));
    }

    public String getSectorFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("sector", String.class));
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }
}