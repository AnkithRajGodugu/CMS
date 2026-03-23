package com.example.cms.config;

import com.example.cms.security.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    /**
     * Override the allowed origins via env var for production deployments.
     * Defaults to localhost ports for local development.
     *
     * Example production value: https://yourdomain.com
     */
    @Value("${websocket.allowed-origins:http://localhost:3000,http://localhost:5173,http://localhost:8080}")
    private String[] allowedOrigins;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // In-memory broker; upgrade to Redis relay for multi-node deployments
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws")
            .setAllowedOrigins(allowedOrigins)   // ← was setAllowedOriginPatterns("*")
            .addInterceptors(webSocketAuthInterceptor)  // ← JWT gate on upgrade
            .withSockJS();
    }
}
