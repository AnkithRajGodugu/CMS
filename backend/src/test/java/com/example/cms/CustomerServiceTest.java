package com.example.cms;

import java.security.Principal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.CustomerService;

class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomerService customerService;

    @Mock
    private Principal principal;

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
        // createdAt is automatically set in constructor

        User user = new User();
        user.setUsername("admin");
        user.setRole(User.Role.ADMIN);

        when(principal.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(user);
        when(customerRepository.save(customer)).thenReturn(customer);

        Customer result = customerService.createCustomer(customer, principal);

        assertEquals(customer, result);
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void getCustomerById_ShouldReturnCustomer() {
        Customer customer = new Customer();
        customer.setId(1L);
        User user = new User();
        user.setUsername("admin");
        user.setRole(User.Role.ADMIN);

        when(principal.getName()).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(user);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerById(1L, principal);

        assertEquals(Optional.of(customer), result);
        verify(customerRepository, times(1)).findById(1L);
    }
}
