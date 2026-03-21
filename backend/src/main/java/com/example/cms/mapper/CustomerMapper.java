package com.example.cms.mapper;

import com.example.cms.dto.CustomerResponse;
import com.example.cms.entity.Customer;

public final class CustomerMapper {

    private CustomerMapper() {}

    public static CustomerResponse toResponse(Customer c) {

        if (c == null) {
            System.out.println("❌ Customer is NULL");
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
            System.out.println("❌ Mapper crash for customer ID: " + c.getId());
            e.printStackTrace();

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