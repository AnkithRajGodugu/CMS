package com.example.cms.kafka;

import com.example.cms.event.CustomerEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnBean(KafkaTemplate.class)
public class CustomerEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(CustomerEvent event) {

        try {
            kafkaTemplate.send(
                    KafkaTopics.CUSTOMER_EVENTS,
                    event.getCustomerId() == null
                            ? "bulk"
                            : event.getCustomerId().toString(),
                    event
            );

            log.info("Customer event published: {}", event.getEventType());

        } catch (Exception ex) {
            log.error("Kafka publish failed", ex);
        }
    }
}
