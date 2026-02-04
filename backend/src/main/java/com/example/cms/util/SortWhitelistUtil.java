package com.example.cms.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;
import java.util.stream.Collectors;

public class SortWhitelistUtil {

    private SortWhitelistUtil() {}

    public static Pageable apply(
            Pageable pageable,
            Set<String> allowedFields
    ) {

        Sort safeSort = Sort.by(
                pageable.getSort().stream()
                        .filter(order -> allowedFields.contains(order.getProperty()))
                        .collect(Collectors.toList())
        );

        if (safeSort.isUnsorted()) {
            return PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize()
            );
        }

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                safeSort
        );
    }
}
