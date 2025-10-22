package com.example.cms.service;

import com.example.cms.event.AuditEvent;
import com.example.cms.event.CustomerEvent;
import com.example.cms.event.SectorEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String CUSTOMER_TOPIC = "customer-events";
    private static final String AUDIT_TOPIC = "audit-events";
    private static final String SECTOR_TOPIC_PREFIX = "sector-events-";

    public void sendCustomerEvent(CustomerEvent event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send(CUSTOMER_TOPIC, event.getCustomerId().toString(), event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Customer event sent successfully: {} with offset: {}", 
                        event.getEventType(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to send customer event: {}", event.getEventType(), ex);
                }
            });
        } catch (Exception e) {
            log.error("Error sending customer event to Kafka", e);
        }
    }

    public void sendNotification(String topic, String message) {
        try {
            kafkaTemplate.send(topic, message);
            log.info("Notification sent to topic: {}", topic);
        } catch (Exception e) {
            log.error("Error sending notification to Kafka", e);
        }
    }

    /**
     * Publishes a sector-specific event to Kafka with dynamic topic routing.
     * 
     * @param sectorCode The sector code (e.g., BANKING, HEALTHCARE)
     * @param eventType The type of event (e.g., ACCOUNT_CREATED, TRANSACTION_PROCESSED)
     * @param userId The ID of the user who triggered the event
     * @param organizationId The ID of the organization (optional)
     * @param payload The event payload containing sector-specific data
     * @param metadata Additional metadata about the event
     */
    @Retryable(
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public void publishSectorEvent(String sectorCode, String eventType, Long userId, 
                                   Long organizationId, Map<String, Object> payload, 
                                   Map<String, String> metadata) {
        try {
            // Generate unique event ID
            String eventId = UUID.randomUUID().toString();
            
            // Build sector event
            SectorEvent event = SectorEvent.builder()
                .eventId(eventId)
                .eventType(eventType)
                .sectorCode(sectorCode)
                .userId(userId)
                .organizationId(organizationId)
                .timestamp(LocalDateTime.now())
                .payload(payload)
                .metadata(metadata)
                .build();
            
            // Determine topic based on sector code
            String topic = SECTOR_TOPIC_PREFIX + sectorCode.toLowerCase();
            
            // Send event to Kafka
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send(topic, eventId, event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Sector event published successfully: {} to topic: {} with offset: {}", 
                        eventType, topic, result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish sector event: {} to topic: {}", eventType, topic, ex);
                    throw new RuntimeException("Failed to publish sector event", ex);
                }
            });
            
        } catch (Exception e) {
            log.error("Error publishing sector event to Kafka: sectorCode={}, eventType={}", 
                sectorCode, eventType, e);
            throw new RuntimeException("Error publishing sector event", e);
        }
    }

    /**
     * Publishes an audit event to Kafka for audit logging.
     * 
     * @param auditEvent The audit event to publish
     */
    @Retryable(
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public void publishAuditEvent(AuditEvent auditEvent) {
        try {
            // Generate unique ID if not provided
            if (auditEvent.getId() == null) {
                auditEvent.setId(UUID.randomUUID().toString());
            }
            
            // Set timestamp if not provided
            if (auditEvent.getTimestamp() == null) {
                auditEvent.setTimestamp(LocalDateTime.now());
            }
            
            // Send event to Kafka
            CompletableFuture<SendResult<String, Object>> future = 
                kafkaTemplate.send(AUDIT_TOPIC, auditEvent.getId(), auditEvent);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Audit event published successfully: {} for user: {} with offset: {}", 
                        auditEvent.getAction(), auditEvent.getUserId(), 
                        result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish audit event: {} for user: {}", 
                        auditEvent.getAction(), auditEvent.getUserId(), ex);
                    throw new RuntimeException("Failed to publish audit event", ex);
                }
            });
            
        } catch (Exception e) {
            log.error("Error publishing audit event to Kafka: action={}, userId={}", 
                auditEvent.getAction(), auditEvent.getUserId(), e);
            throw new RuntimeException("Error publishing audit event", e);
        }
    }
}