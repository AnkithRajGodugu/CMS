package com.example.cms.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;

@TestConfiguration
public class TestKafkaDisableConfig {

    @Bean
    ConcurrentKafkaListenerContainerFactory<?, ?> kafkaListenerContainerFactory() {
        // dummy factory → prevents Kafka startup
        return new ConcurrentKafkaListenerContainerFactory<>();
    }
}
