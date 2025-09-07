package com.example.cms;

import com.example.cms.entity.Customer;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createCustomer_ShouldSaveCustomer() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@example.com");
        customer.setPhone("1234567890");
        customer.setCreatedAt(LocalDateTime.now());

        when(customerRepository.save(customer)).thenReturn(customer);

        Customer result = customerService.createCustomer(customer);

        assertEquals(customer, result);
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void getCustomerById_ShouldReturnCustomer() {
        Customer customer = new Customer();
        customer.setId(1L);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerById(1L);

        assertEquals(Optional.of(customer), result);
        verify(customerRepository, times(1)).findById(1L);
    }
}