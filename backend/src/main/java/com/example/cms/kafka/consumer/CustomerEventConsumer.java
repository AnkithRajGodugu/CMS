package com.example.cms.kafka.consumer;

import com.example.cms.event.CustomerEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CustomerEventConsumer {

    @KafkaListener(
            topics = "customer-events",
            groupId = "cms-analytics"
    )
    public void consume(CustomerEvent event) {
        log.info(
                "📊 Customer Event | type={} id={} sector={} at={}",
                event.getEventType(),
                event.getCustomerId(),
                event.getSectorName(),
                event.getTimestamp()
        );
    }
}
