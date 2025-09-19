package com.example.cms.config;

import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class ServerConfig implements ApplicationListener<WebServerInitializedEvent> {

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        int port = event.getWebServer().getPort();
        System.out.println("🚀 CMS Backend Server started successfully!");
        System.out.println("📍 Server URL: http://localhost:" + port);
        System.out.println("🔗 API Base URL: http://localhost:" + port + "/api");
        System.out.println("🧪 Test Login: POST http://localhost:" + port + "/api/auth/login");
        System.out.println("📊 Health Check: GET http://localhost:" + port + "/api/health");
        System.out.println("===============================================");
    }
}