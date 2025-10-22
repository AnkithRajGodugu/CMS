package com.example.cms.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing database session context for row-level security.
 * Sets the current user ID in the database session to enable RLS policies.
 */
@Service
public class DatabaseContextService {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseContextService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Sets the current user context in the database session.
     * This enables row-level security policies to filter data based on the current user.
     *
     * @param userId The ID of the current user
     */
    @Transactional
    public void setUserContext(Long userId) {
        if (userId == null) {
            logger.warn("Attempted to set null user context");
            return;
        }

        try {
            entityManager.createNativeQuery("SELECT set_user_context(:userId)")
                    .setParameter("userId", userId)
                    .getSingleResult();
            
            logger.debug("Set database user context for user ID: {}", userId);
        } catch (Exception e) {
            logger.error("Failed to set user context for user ID: {}", userId, e);
            throw new RuntimeException("Failed to set database user context", e);
        }
    }

    /**
     * Clears the current user context from the database session.
     * Should be called when the user session ends or when switching users.
     */
    @Transactional
    public void clearUserContext() {
        try {
            entityManager.createNativeQuery("SELECT clear_user_context()")
                    .getSingleResult();
            
            logger.debug("Cleared database user context");
        } catch (Exception e) {
            logger.error("Failed to clear user context", e);
            // Don't throw exception here as this is cleanup code
        }
    }

    /**
     * Gets the current user ID from the database session context.
     *
     * @return The current user ID, or null if not set
     */
    @Transactional(readOnly = true)
    public Long getCurrentUserContext() {
        try {
            String result = (String) entityManager
                    .createNativeQuery("SELECT current_setting('app.current_user_id', true)")
                    .getSingleResult();
            
            if (result == null || result.isEmpty()) {
                return null;
            }
            
            return Long.parseLong(result);
        } catch (Exception e) {
            logger.debug("No user context set or error retrieving it: {}", e.getMessage());
            return null;
        }
    }
}
