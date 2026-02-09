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
        kafkaTemplate
                .send(CUSTOMER_TOPIC, event.getCustomerId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Customer event sent: {} offset={}",
                                event.getEventType(),
                                result.getRecordMetadata().offset());
                    } else {
                        log.error("Customer event send failed: {}", event.getEventType(), ex);
                    }
                });
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public void publishSectorEvent(
            String sectorCode,
            String eventType,
            Long userId,
            Long organizationId,
            Map<String, Object> payload,
            Map<String, String> metadata) {

        SectorEvent event = SectorEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(eventType)
                .sectorCode(sectorCode)
                .userId(userId)
                .organizationId(organizationId)
                .timestamp(LocalDateTime.now())
                .payload(payload)
                .metadata(metadata)
                .build();

        String topic = SECTOR_TOPIC_PREFIX + sectorCode.toLowerCase();

        kafkaTemplate
                .send(topic, event.getEventId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Sector event sent: {} topic={}", eventType, topic);
                    } else {
                        log.error("Sector event send failed: {}", eventType, ex);
                    }
                });
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public void publishAuditEvent(AuditEvent auditEvent) {

        if (auditEvent.getId() == null) {
            auditEvent.setId(UUID.randomUUID().toString());
        }
        if (auditEvent.getTimestamp() == null) {
            auditEvent.setTimestamp(LocalDateTime.now());
        }

        kafkaTemplate
                .send(AUDIT_TOPIC, auditEvent.getId(), auditEvent)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Audit event sent: {} user={}",
                                auditEvent.getAction(), auditEvent.getUserId());
                    } else {
                        log.error("Audit event send failed: {}", auditEvent.getAction(), ex);
                    }
                });
    }
}
