package com.example.cms.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing database session context for row-level security (RLS).
 *
 * It sets a PostgreSQL session variable:
 *      app.current_user_id
 *
 * This can be used inside RLS policies like:
 *      current_setting('app.current_user_id')
 */
@Service
public class DatabaseContextService {

    private static final Logger logger =
            LoggerFactory.getLogger(DatabaseContextService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Sets the current user ID into PostgreSQL session context.
     * Uses built-in set_config() function.
     *
     * Uses REQUIRES_NEW to avoid affecting main transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void setUserContext(Long userId) {

        if (userId == null) {
            logger.warn("Attempted to set null user context");
            return;
        }

        try {
            entityManager.createNativeQuery(
                            "SELECT set_config('app.current_user_id', ?1, false)"
                    )
                    .setParameter(1, userId.toString())
                    .getSingleResult();

            logger.debug("Database user context set to user ID: {}", userId);

        } catch (Exception e) {
            logger.warn("Failed to set database user context (RLS may not be enabled): {}",
                    e.getMessage());
        }
    }

    /**
     * Clears the PostgreSQL session variable.
     * Safe cleanup after request.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void clearUserContext() {

        try {
            entityManager.createNativeQuery(
                    "SELECT set_config('app.current_user_id', '', false)"
            ).getSingleResult();

            logger.debug("Database user context cleared");

        } catch (Exception e) {
            logger.debug("Failed to clear database user context (safe to ignore): {}",
                    e.getMessage());
        }
    }


    /**
     * Returns current user ID from PostgreSQL session variable.
     */
    @Transactional(readOnly = true)
    public Long getCurrentUserContext() {

        try {
            String result = (String) entityManager
                    .createNativeQuery(
                            "SELECT current_setting('app.current_user_id', true)"
                    )
                    .getSingleResult();

            if (result == null || result.isEmpty()) {
                return null;
            }

            return Long.parseLong(result);

        } catch (Exception e) {
            logger.debug("No user context found: {}", e.getMessage());
            return null;
        }

    }

}