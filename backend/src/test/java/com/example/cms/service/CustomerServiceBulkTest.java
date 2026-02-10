package com.example.cms.service;

import com.example.cms.entity.Sector;
import com.example.cms.event.CustomerEvent;
import com.example.cms.kafka.CustomerEventPublisher;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CustomerServiceBulkTest {

    @Mock
    CustomerRepository customerRepository;

    @Mock
    SectorRepository sectorRepository;

    @Mock
    AuditService auditService;

    @Mock
    CustomerEventPublisher customerEventPublisher;

    @InjectMocks
    CustomerService customerService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void bulkCreateFromCsv_shouldSaveAllAndAudit() throws Exception {

        Sector sector = new Sector();
        sector.setId(1L);

        when(sectorRepository.findById(1L))
                .thenReturn(Optional.of(sector));

        doNothing().when(customerEventPublisher)
                .publish(any(CustomerEvent.class));

        String csv = """
                firstName,lastName,email,phone
                John,Doe,john@example.com,999
                Jane,Smith,jane@example.com,888
                """;

        MockMultipartFile file =
                new MockMultipartFile("file", "c.csv", "text/csv", csv.getBytes());

        SectorContext ctx = SectorContext.builder()
                .sectorId(1L)
                .build();

        int count = customerService.bulkCreateFromCsv(file, ctx);

        assertEquals(2, count);
        verify(customerRepository).saveAll(any());
    }
}
