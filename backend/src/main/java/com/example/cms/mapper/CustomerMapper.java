package com.example.cms.mapper;

import com.example.cms.dto.CustomerResponse;
import com.example.cms.entity.Customer;

public final class CustomerMapper {

    private CustomerMapper() {}

    public static CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(
                c.getId(),
                c.getFirstName(),
                c.getLastName(),
                c.getEmail(),
                c.getPhone(),
                c.getCreatedAt()
        );
    }
}
