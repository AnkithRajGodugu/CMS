package com.example.cms.constants;

import java.util.Set;

public final class CustomerSortFields {

    private CustomerSortFields() {}

    public static final Set<String> ALLOWED = Set.of(
            "id",
            "firstName",
            "lastName",
            "email",
            "createdAt"
    );
}
