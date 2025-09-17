package com.example.cms.service;

import com.example.cms.event.CustomerEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String CUSTOMER_TOPIC = "customer-events";

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
}