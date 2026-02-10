package com.example.cms.config;

import com.example.cms.kafka.CustomerEventPublisher;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestKafkaConfig {

    @Bean
    public CustomerEventPublisher customerEventPublisher() {
        return Mockito.mock(CustomerEventPublisher.class);
    }
}

