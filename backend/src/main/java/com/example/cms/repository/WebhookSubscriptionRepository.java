package com.example.cms.repository;

import com.example.cms.entity.WebhookSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookSubscriptionRepository extends JpaRepository<WebhookSubscription, Long> {
    List<WebhookSubscription> findByOrganizationId(Long organizationId);
    List<WebhookSubscription> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    List<WebhookSubscription> findByIsActiveTrue();
}
