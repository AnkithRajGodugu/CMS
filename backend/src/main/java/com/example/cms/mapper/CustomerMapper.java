package com.example.cms.mapper;

import com.example.cms.dto.CustomerResponse;
import com.example.cms.entity.Customer;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class CustomerMapper {

    private CustomerMapper() {}

    public static CustomerResponse toResponse(Customer c) {

        if (c == null) {
            log.warn("CustomerMapper.toResponse called with null customer");
            return null;
        }

        try {
            return new CustomerResponse(
                    c.getId(),

                    // ✅ NULL SAFE STRINGS
                    safe(c.getFirstName()),
                    safe(c.getLastName()),
                    safe(c.getEmail()),
                    safe(c.getPhone()),

                    // ✅ NULL SAFE DATE
                    c.getCreatedAt() != null ? c.getCreatedAt() : null
            );

        } catch (Exception e) {
            log.error("CustomerMapper failed for customer ID: {} — {}", c.getId(), e.getMessage(), e);

            // 🔥 VERY IMPORTANT: DON'T CRASH WHOLE API
            return new CustomerResponse(
                    c.getId(),
                    "ERROR",
                    "ERROR",
                    "ERROR",
                    "ERROR",
                    null
            );
        }
    }

    // ✅ HELPER METHOD (CLEAN + SAFE)
    private static String safe(String value) {
        return value != null ? value : "";
    }
}