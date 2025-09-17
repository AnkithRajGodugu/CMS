package com.example.cms;

import com.example.cms.config.TestcontainersConfig;
import com.example.cms.entity.Customer;
import com.example.cms.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CustomerRepositoryTest extends TestcontainersConfig {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void testSaveAndFindCustomer() {
        // Arrange
        Customer customer = new Customer();
        customer.setFirstName("Uday");
        customer.setLastName("Kori");
        customer.setEmail("uday@example.com");

        // Act
        customerRepository.save(customer);
        Customer found = customerRepository.findByEmail("uday@example.com");

        // Assert
        assertThat(found).isNotNull();
        assertThat(found.getFirstName()).isEqualTo("Uday");
    }
}
