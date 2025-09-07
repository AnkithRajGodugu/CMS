package com.example.cms.config;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

public abstract class TestcontainersConfig {

    // Start a Postgres container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("cms_db")
            .withUsername("cms_user")
            .withPassword("cms_pass")
            .withUrlParam("currentSchema", "public")
            .withUrlParam("TimeZone", "UTC");

    static {
        postgres.start();
    }

    // Override Spring Boot datasource properties
    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}
