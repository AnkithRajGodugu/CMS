package com.example.cms.service;

import com.example.cms.entity.WebhookSubscription;
import com.example.cms.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    private final WebhookSubscriptionRepository webhookSubscriptionRepository;
    private final RestTemplate restTemplate;

    // ------------------------------------------------
    // CRUD Management for Webhook Subscriptions
    // ------------------------------------------------

    @Transactional(readOnly = true)
    public List<WebhookSubscription> getByOrganization(Long organizationId) {
        return webhookSubscriptionRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public Optional<WebhookSubscription> findById(Long id) {
        return webhookSubscriptionRepository.findById(id);
    }

    @Transactional
    public WebhookSubscription create(Long organizationId, WebhookSubscription incoming) {
        incoming.setOrganizationId(organizationId);
        return webhookSubscriptionRepository.save(incoming);
    }

    @Transactional
    public Optional<WebhookSubscription> update(Long id, WebhookSubscription incoming) {
        return webhookSubscriptionRepository.findById(id).map(existing -> {
            existing.setUrl(incoming.getUrl());
            existing.setSecret(incoming.getSecret());
            existing.setEventTypes(incoming.getEventTypes());
            existing.setActive(incoming.isActive());
            return webhookSubscriptionRepository.save(existing);
        });
    }

    @Transactional
    public void delete(Long id) {
        webhookSubscriptionRepository.deleteById(id);
    }

    // ------------------------------------------------
    // Event Dispatch
    // ------------------------------------------------

    /**
     * Dispatch a named event to all matching active webhook subscribers.
     * This is called asynchronously so it never blocks the main transaction.
     */
    @Async
    public void dispatch(String eventType, Map<String, Object> payload) {
        List<WebhookSubscription> subscribers = webhookSubscriptionRepository.findByIsActiveTrue();

        for (WebhookSubscription sub : subscribers) {
            boolean matches = sub.getEventTypes().contains("*")
                    || Arrays.asList(sub.getEventTypes().split(",")).contains(eventType);

            if (!matches) continue;

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("X-CMS-Event", eventType);

                // Sign the payload if a secret is provided
                if (sub.getSecret() != null && !sub.getSecret().isBlank()) {
                    String signature = sign(payload.toString(), sub.getSecret());
                    headers.set("X-CMS-Signature", "sha256=" + signature);
                }

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                restTemplate.postForEntity(sub.getUrl(), entity, String.class);
                log.info("Webhook dispatched: event={}, url={}", eventType, sub.getUrl());

            } catch (Exception e) {
                log.error("Failed to dispatch webhook to {}: {}", sub.getUrl(), e.getMessage());
            }
        }
    }

    private String sign(String payload, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(hash);
    }
}
