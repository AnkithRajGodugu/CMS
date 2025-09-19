package com.example.cms.service;

import com.example.cms.event.CustomerEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConsumerService {

    @KafkaListener(topics = "customer-events", groupId = "cms-group")
    public void handleCustomerEvent(
            @Payload CustomerEvent event,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        try {
            log.info("Received customer event: {} for customer ID: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), event.getCustomerId(), topic, partition, offset);
            
            // Process the event (e.g., update analytics, send notifications, etc.)
            processCustomerEvent(event);
            
            // Manually acknowledge the message
            acknowledgment.acknowledge();
            
        } catch (Exception e) {
            log.error("Error processing customer event: {}", event, e);
            // In production, you might want to send to a dead letter queue
        }
    }

    @KafkaListener(topics = "notifications", groupId = "cms-notification-group")
    public void handleNotification(@Payload String message) {
        log.info("Received notification: {}", message);
        // Process notification (e.g., send email, SMS, etc.)
    }

    private void processCustomerEvent(CustomerEvent event) {
        switch (event.getEventType()) {
            case "CREATED":
                log.info("Processing customer creation: {}", event.getCustomerId());
                // Add business logic for customer creation
                break;
            case "UPDATED":
                log.info("Processing customer update: {}", event.getCustomerId());
                // Add business logic for customer update
                break;
            case "DELETED":
                log.info("Processing customer deletion: {}", event.getCustomerId());
                // Add business logic for customer deletion
                break;
            default:
                log.warn("Unknown event type: {}", event.getEventType());
        }
    }
}