package com.example.cms.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id:cms-group}")
    private String groupId;

    @Value("${spring.kafka.topic.partitions:3}")
    private int defaultPartitions;

    @Value("${spring.kafka.topic.replication-factor:1}")
    private short defaultReplicationFactor;

    // Producer Configuration
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        configProps.put(ProducerConfig.ACKS_CONFIG, "all");
        configProps.put(ProducerConfig.RETRIES_CONFIG, 3);
        configProps.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // Consumer Configuration
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    // Admin Configuration
    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(configs);
    }

    // Sector-specific topic configurations
    
    /**
     * Banking sector events topic
     */
    @Bean
    public NewTopic bankingSectorTopic() {
        return new NewTopic("sector-events-banking", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Healthcare sector events topic
     */
    @Bean
    public NewTopic healthcareSectorTopic() {
        return new NewTopic("sector-events-healthcare", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Education sector events topic
     */
    @Bean
    public NewTopic educationSectorTopic() {
        return new NewTopic("sector-events-education", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Retail sector events topic
     */
    @Bean
    public NewTopic retailSectorTopic() {
        return new NewTopic("sector-events-retail", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Manufacturing sector events topic
     */
    @Bean
    public NewTopic manufacturingSectorTopic() {
        return new NewTopic("sector-events-manufacturing", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Audit events topic
     */
    @Bean
    public NewTopic auditEventsTopic() {
        return new NewTopic("audit-events", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Notification events topic
     */
    @Bean
    public NewTopic notificationEventsTopic() {
        return new NewTopic("notification-events", defaultPartitions, defaultReplicationFactor);
    }

    /**
     * Customer events topic (existing)
     */
    @Bean
    public NewTopic customerEventsTopic() {
        return new NewTopic("customer-events", defaultPartitions, defaultReplicationFactor);
    }
}