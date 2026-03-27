package com.example.cms;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.event.CustomerEvent;
import com.example.cms.kafka.CustomerEventPublisher;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.service.AuditService;
import com.example.cms.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

@Mock
private AuditService auditService;

@Mock
private CustomerRepository customerRepository;

@Mock
private SectorRepository sectorRepository;

@Mock
private com.example.cms.service.NotificationService notificationService;

@InjectMocks
private CustomerService customerService;

private SectorContext sectorContext;
private Sector sector;

@BeforeEach
void setup() {
    MockitoAnnotations.openMocks(this);

    sector = new Sector();
    sector.setId(1L);
    sector.setCode("BANKING");

    sectorContext = SectorContext.builder()
            .sectorId(1L)
            .sectorCode("BANKING")
            .userId(10L)
            .build();
}

@Test
void createCustomer_shouldAttachSectorAutomatically() {

    Customer customer = new Customer();
    customer.setFirstName("John");
    customer.setLastName("Doe");

    when(sectorRepository.findById(1L))
            .thenReturn(Optional.of(sector));

    when(customerRepository.save(any()))
            .thenAnswer(invocation -> {
                Customer c = invocation.getArgument(0);
                c.setId(1L);
                return c;
            });

    Customer saved = customerService.createCustomer(customer, sectorContext);

    assertThat(saved.getSector()).isEqualTo(sector);

    verify(customerRepository).save(any(Customer.class));

    // ✅ IMPORTANT: verify audit, NOT kafka
    verify(auditService).logAction(
            any(),
            eq(1L),
            isNull(),
            eq("CREATE_CUSTOMER"),
            eq("CUSTOMER"),
            eq("1"),
            any(),
            any()
    );
}
}
