package com.example.cms.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * Validates the JWT token during the WebSocket handshake (HTTP Upgrade request).
 * This replaces the wide-open setAllowedOriginPatterns("*") approach.
 *
 * Token can be provided in two ways (in priority order):
 *   1. Query parameter: ws://host/ws?token=<JWT>
 *   2. Authorization header: Authorization: Bearer <JWT>  (for non-SockJS clients)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            // 1. Try query parameter first (most common with SockJS)
            String token = servletRequest.getServletRequest().getParameter("token");

            // 2. Fall back to Authorization header
            if (token == null || token.isBlank()) {
                String authHeader = request.getHeaders().getFirst("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }

            if (token == null || token.isBlank()) {
                log.warn("WebSocket handshake rejected — no token provided from {}", request.getRemoteAddress());
                return false;
            }

            try {
                if (!jwtUtil.validateToken(token)) {
                    log.warn("WebSocket handshake rejected — invalid token from {}", request.getRemoteAddress());
                    return false;
                }

                // Store the principal name in WebSocket session attributes
                String username = jwtUtil.getUsernameFromToken(token);
                attributes.put("username", username);
                log.debug("WebSocket handshake accepted for user '{}'", username);
                return true;

            } catch (Exception e) {
                log.warn("WebSocket handshake rejected — token validation error: {}", e.getMessage());
                return false;
            }
        }

        log.warn("WebSocket handshake rejected — not a servlet request");
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
        // No-op — nothing to clean up after handshake
    }
}
