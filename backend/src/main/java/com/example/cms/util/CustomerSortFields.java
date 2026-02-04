package com.example.cms.util;

import java.util.Set;

public final class CustomerSortFields {

    private CustomerSortFields() {}

    private static final Set<String> ALLOWED_FIELDS = Set.of(
            "id",
            "firstName",
            "lastName",
            "email",
            "createdAt"
    );

    public static boolean isAllowed(String field) {
        return ALLOWED_FIELDS.contains(field);
    }
}
