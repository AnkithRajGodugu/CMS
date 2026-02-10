package com.example.cms.service;

import com.example.cms.event.AuditEvent;
import com.example.cms.event.CustomerEvent;
import com.example.cms.event.SectorEvent;
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

    /**
     * Consumer for banking sector events
     */
    @KafkaListener(topics = "sector-events-banking", groupId = "banking-consumer-group")
    public void consumeBankingEvents(@Payload SectorEvent event,
                                    @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                    @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                    @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received banking event: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), topic, partition, offset);
            
            routeSectorEvent(event, "BANKING");
            
        } catch (Exception e) {
            log.error("Error processing banking event: {}", event, e);
        }
    }

    /**
     * Consumer for healthcare sector events
     */
    @KafkaListener(topics = "sector-events-healthcare", groupId = "healthcare-consumer-group")
    public void consumeHealthcareEvents(@Payload SectorEvent event,
                                       @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                       @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                       @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received healthcare event: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), topic, partition, offset);
            
            routeSectorEvent(event, "HEALTHCARE");
            
        } catch (Exception e) {
            log.error("Error processing healthcare event: {}", event, e);
        }
    }

    /**
     * Consumer for education sector events
     */
    @KafkaListener(topics = "sector-events-education", groupId = "education-consumer-group")
    public void consumeEducationEvents(@Payload SectorEvent event,
                                      @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                      @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received education event: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), topic, partition, offset);
            
            routeSectorEvent(event, "EDUCATION");
            
        } catch (Exception e) {
            log.error("Error processing education event: {}", event, e);
        }
    }

    /**
     * Consumer for retail sector events
     */
    @KafkaListener(topics = "sector-events-retail", groupId = "retail-consumer-group")
    public void consumeRetailEvents(@Payload SectorEvent event,
                                   @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                   @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                   @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received retail event: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), topic, partition, offset);
            
            routeSectorEvent(event, "RETAIL");
            
        } catch (Exception e) {
            log.error("Error processing retail event: {}", event, e);
        }
    }

    /**
     * Consumer for manufacturing sector events
     */
    @KafkaListener(topics = "sector-events-manufacturing", groupId = "manufacturing-consumer-group")
    public void consumeManufacturingEvents(@Payload SectorEvent event,
                                          @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                          @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                          @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received manufacturing event: {} from topic: {}, partition: {}, offset: {}",
                    event.getEventType(), topic, partition, offset);
            
            routeSectorEvent(event, "MANUFACTURING");
            
        } catch (Exception e) {
            log.error("Error processing manufacturing event: {}", event, e);
        }
    }

    /**
     * Consumer for audit events
     */
    @KafkaListener(topics = "audit-events", groupId = "audit-consumer-group")
    public void consumeAuditEvents(@Payload AuditEvent event,
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received audit event: {} for user: {} from topic: {}, partition: {}, offset: {}",
                    event.getAction(), event.getUserId(), topic, partition, offset);
            
            processAuditEvent(event);
            
        } catch (Exception e) {
            log.error("Error processing audit event: {}", event, e);
        }
    }

    /**
     * Routes sector events based on event type
     */
    private void routeSectorEvent(SectorEvent event, String sector) {
        String eventType = event.getEventType();
        
        log.info("Routing {} sector event: {} for user: {}", 
                sector, eventType, event.getUserId());
        
        // Route to appropriate handler based on event type
        switch (sector) {
            case "BANKING":
                handleBankingEvent(event);
                break;
            case "HEALTHCARE":
                handleHealthcareEvent(event);
                break;
            case "EDUCATION":
                handleEducationEvent(event);
                break;
            case "RETAIL":
                handleRetailEvent(event);
                break;
            case "MANUFACTURING":
                handleManufacturingEvent(event);
                break;
            default:
                log.warn("Unknown sector: {}", sector);
        }
    }

    /**
     * Handles banking-specific events
     */
    private void handleBankingEvent(SectorEvent event) {
        switch (event.getEventType()) {
            case "ACCOUNT_CREATED":
                log.info("Processing account creation for user: {}", event.getUserId());
                // Add business logic for account creation
                break;
            case "TRANSACTION_PROCESSED":
                log.info("Processing transaction for user: {}", event.getUserId());
                // Add business logic for transaction processing
                break;
            case "BALANCE_UPDATED":
                log.info("Processing balance update for user: {}", event.getUserId());
                // Add business logic for balance update
                break;
            case "LOAN_APPROVED":
                log.info("Processing loan approval for user: {}", event.getUserId());
                // Add business logic for loan approval
                break;
            default:
                log.warn("Unknown banking event type: {}", event.getEventType());
        }
    }

    /**
     * Handles healthcare-specific events
     */
    private void handleHealthcareEvent(SectorEvent event) {
        switch (event.getEventType()) {
            case "APPOINTMENT_SCHEDULED":
                log.info("Processing appointment scheduling for user: {}", event.getUserId());
                // Add business logic for appointment scheduling
                break;
            case "PATIENT_REGISTERED":
                log.info("Processing patient registration for user: {}", event.getUserId());
                // Add business logic for patient registration
                break;
            case "PRESCRIPTION_ISSUED":
                log.info("Processing prescription issuance for user: {}", event.getUserId());
                // Add business logic for prescription issuance
                break;
            case "LAB_RESULT_READY":
                log.info("Processing lab result for user: {}", event.getUserId());
                // Add business logic for lab result
                break;
            default:
                log.warn("Unknown healthcare event type: {}", event.getEventType());
        }
    }

    /**
     * Handles education-specific events
     */
    private void handleEducationEvent(SectorEvent event) {
        switch (event.getEventType()) {
            case "STUDENT_ENROLLED":
                log.info("Processing student enrollment for user: {}", event.getUserId());
                // Add business logic for student enrollment
                break;
            case "COURSE_COMPLETED":
                log.info("Processing course completion for user: {}", event.getUserId());
                // Add business logic for course completion
                break;
            case "GRADE_SUBMITTED":
                log.info("Processing grade submission for user: {}", event.getUserId());
                // Add business logic for grade submission
                break;
            case "ASSIGNMENT_CREATED":
                log.info("Processing assignment creation for user: {}", event.getUserId());
                // Add business logic for assignment creation
                break;
            default:
                log.warn("Unknown education event type: {}", event.getEventType());
        }
    }

    /**
     * Handles retail-specific events
     */
    private void handleRetailEvent(SectorEvent event) {
        switch (event.getEventType()) {
            case "ORDER_PLACED":
                log.info("Processing order placement for user: {}", event.getUserId());
                // Add business logic for order placement
                break;
            case "PAYMENT_PROCESSED":
                log.info("Processing payment for user: {}", event.getUserId());
                // Add business logic for payment processing
                break;
            case "INVENTORY_UPDATED":
                log.info("Processing inventory update for user: {}", event.getUserId());
                // Add business logic for inventory update
                break;
            case "SHIPMENT_DISPATCHED":
                log.info("Processing shipment dispatch for user: {}", event.getUserId());
                // Add business logic for shipment dispatch
                break;
            default:
                log.warn("Unknown retail event type: {}", event.getEventType());
        }
    }

    /**
     * Handles manufacturing-specific events
     */
    private void handleManufacturingEvent(SectorEvent event) {
        switch (event.getEventType()) {
            case "PRODUCTION_STARTED":
                log.info("Processing production start for user: {}", event.getUserId());
                // Add business logic for production start
                break;
            case "QUALITY_CHECK_COMPLETED":
                log.info("Processing quality check for user: {}", event.getUserId());
                // Add business logic for quality check
                break;
            case "INVENTORY_RESTOCKED":
                log.info("Processing inventory restock for user: {}", event.getUserId());
                // Add business logic for inventory restock
                break;
            case "ORDER_FULFILLED":
                log.info("Processing order fulfillment for user: {}", event.getUserId());
                // Add business logic for order fulfillment
                break;
            default:
                log.warn("Unknown manufacturing event type: {}", event.getEventType());
        }
    }

    /**
     * Processes audit events
     */
    private void processAuditEvent(AuditEvent event) {
        log.info("Processing audit event: {} by user: {} on resource: {} ({})",
                event.getAction(), event.getUserId(), event.getResourceType(), event.getResourceId());
        
        // Add business logic for audit event processing
        // This could include:
        // - Storing in audit log database
        // - Triggering alerts for suspicious activities
        // - Generating compliance reports
        // - Sending notifications to administrators
    }

    private void processCustomerEvent(CustomerEvent event) {
        switch (event.getEventType()) {
            case CREATED:
                log.info("Processing customer creation: {}", event.getCustomerId());
                // Add business logic for customer creation
                break;
            case UPDATED:
                log.info("Processing customer update: {}", event.getCustomerId());
                // Add business logic for customer update
                break;
            case DELETED:
                log.info("Processing customer deletion: {}", event.getCustomerId());
                // Add business logic for customer deletion
                break;
            default:
                log.warn("Unknown event type: {}", event.getEventType());
        }
    }
}