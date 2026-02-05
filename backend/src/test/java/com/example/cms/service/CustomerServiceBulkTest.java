package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CustomerServiceBulkTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void bulkCreateFromCsv_shouldSaveAllAndAudit() throws Exception {

        // ✅ sector
        Sector sector = new Sector();
        sector.setId(1L);

        when(sectorRepository.findById(1L))
                .thenReturn(Optional.of(sector));

        // ✅ CSV content
        String csv = """
                firstName,lastName,email,phone
                John,Doe,john@example.com,9999999999
                Jane,Smith,jane@example.com,8888888888
                """;

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "customers.csv",
                "text/plain",
                csv.getBytes()
        );

        // ✅ sector context
        SectorContext ctx = SectorContext.builder()
                .sectorId(1L)
                .build();

        // 🔥 execute
        int created = customerService.bulkCreateFromCsv(file, ctx);

        // ✅ assertions
        assertEquals(2, created);

        verify(customerRepository).saveAll(anyList());

        verify(auditService).logAction(
                any(),
                eq(sector.getId()),
                isNull(),
                eq("BULK_CREATE_CUSTOMERS"),
                eq("CUSTOMER"),
                eq("CSV_UPLOAD"),
                any(),
                any()
        );


    }
}
