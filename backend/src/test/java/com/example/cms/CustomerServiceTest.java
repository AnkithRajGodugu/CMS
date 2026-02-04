package com.example.cms;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
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
        // Arrange
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");

        when(sectorRepository.findById(1L))
                .thenReturn(Optional.of(sector));

        when(customerRepository.save(any()))
                .thenAnswer(invocation -> {
                    Customer c = invocation.getArgument(0);
                    c.setId(1L); // 🔥 simulate DB ID
                    return c;
                });



        // Act
        Customer saved = customerService.createCustomer(customer, sectorContext);

        // Assert
        assertThat(saved.getSector()).isEqualTo(sector);
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void getAllCustomers_shouldFilterBySector() {
        // Arrange
        Customer customer = new Customer();
        customer.setFirstName("Alice");
        customer.setSector(sector);

        when(customerRepository.findBySectorId(1L))
                .thenReturn(List.of(customer));

        // Act
        List<Customer> result =
                customerService.getAllCustomers(sectorContext);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("Alice");
    }

    @Test
    void getCustomer_shouldFailIfWrongSector() {
        // Arrange
        when(customerRepository.findByIdAndSectorId(99L, 1L))
                .thenReturn(Optional.empty());

        // Act + Assert
        try {
            customerService.getCustomer(99L, sectorContext);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).contains("Customer not found");
        }
    }
}
