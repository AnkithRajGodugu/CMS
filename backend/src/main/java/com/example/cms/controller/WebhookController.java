package com.example.cms.controller;

import com.example.cms.entity.WebhookSubscription;
import com.example.cms.service.WebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations/{orgId}/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<WebhookSubscription>> list(@PathVariable Long orgId) {
        return ResponseEntity.ok(webhookService.getByOrganization(orgId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WebhookSubscription> create(
            @PathVariable Long orgId,
            @RequestBody WebhookSubscription subscription) {
        WebhookSubscription created = webhookService.create(orgId, subscription);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{webhookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WebhookSubscription> update(
            @PathVariable Long orgId,
            @PathVariable Long webhookId,
            @RequestBody WebhookSubscription subscription) {
        return webhookService.update(webhookId, subscription)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{webhookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> delete(
            @PathVariable Long orgId,
            @PathVariable Long webhookId) {
        webhookService.delete(webhookId);
        return ResponseEntity.noContent().build();
    }
}
