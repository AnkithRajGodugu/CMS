package com.example.cms.kafka;

import com.example.cms.event.CustomerEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomerEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(CustomerEvent event) {
        kafkaTemplate.send(
                KafkaTopics.CUSTOMER_EVENTS,
                event.getCustomerId().toString(),
                event
        );
    }
}
