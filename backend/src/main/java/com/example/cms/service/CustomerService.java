package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.event.CustomerEvent;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final KafkaProducerService kafkaProducerService;

    public CustomerService(CustomerRepository customerRepository,
            UserRepository userRepository,
            @Autowired(required = false) KafkaProducerService kafkaProducerService) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    private User getUserFromPrincipal(Principal principal) {
        return userRepository.findByUsername(principal.getName());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Customer createCustomer(Customer customer, Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        if (currentUser.getRole() == User.Role.MANAGER) {
            customer.setSector(currentUser.getSector());
        }
        Customer savedCustomer = customerRepository.save(customer);

        // Publish customer creation event
        publishCustomerEvent(savedCustomer, "CREATED", currentUser.getUsername());

        return savedCustomer;
    }

    public List<Customer> getCustomersForUser(Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        if (currentUser.getRole() == User.Role.ADMIN) {
            return customerRepository.findAll();
        } else {
            return customerRepository.findBySector(currentUser.getSector());
        }
    }

    @PostAuthorize("hasRole('ADMIN') or @authz.isManagerOfCustomer(principal, returnObject.get().id)")
    public Optional<Customer> getCustomerById(Long id, Principal principal) {
        return customerRepository.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or @authz.isManagerOfCustomer(principal, #id)")
    public Optional<Customer> updateCustomer(Long id, Customer customerDetails, Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        return customerRepository.findById(id).map(customer -> {
            if (currentUser.getRole() == User.Role.MANAGER && customerDetails.getSector() != null && !customerDetails.getSector().equals(currentUser.getSector())) {
                // Manager can't change sector
                return null;
            }
            customer.setFirstName(customerDetails.getFirstName());
            customer.setLastName(customerDetails.getLastName());
            customer.setEmail(customerDetails.getEmail());
            customer.setPhone(customerDetails.getPhone());
            customer.setSector(customerDetails.getSector());
            Customer updatedCustomer = customerRepository.save(customer);

            // Publish customer update event
            publishCustomerEvent(updatedCustomer, "UPDATED", currentUser.getUsername());

            return updatedCustomer;
        });
    }

    @PreAuthorize("hasRole('ADMIN') or @authz.isManagerOfCustomer(principal, #id)")
    public boolean deleteCustomer(Long id, Principal principal) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            User currentUser = getUserFromPrincipal(principal);

            customerRepository.deleteById(id);

            // Publish customer deletion event
            publishCustomerEvent(customer, "DELETED", currentUser.getUsername());

            return true;
        }
        return false;
    }

    public List<Customer> searchCustomersForUser(String name, String email, Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        if (currentUser.getRole() == User.Role.ADMIN) {
            return customerRepository.searchAllCustomers(name, email);
        } else {
            return customerRepository.searchCustomersInSector(currentUser.getSector(), name, email);
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<Customer> createBulkCustomers(@Valid List<Customer> customers, Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        if (currentUser.getRole() == User.Role.MANAGER) {
            for (Customer customer : customers) {
                customer.setSector(currentUser.getSector());
            }
        }
        List<Customer> savedCustomers = customerRepository.saveAll(customers);

        // Publish bulk creation events
        for (Customer customer : savedCustomers) {
            publishCustomerEvent(customer, "CREATED", currentUser.getUsername());
        }

        return savedCustomers;
    }

    private void publishCustomerEvent(Customer customer, String eventType, String performedBy) {
        if (kafkaProducerService != null) {
            try {
                CustomerEvent event = new CustomerEvent(
                        customer.getId(),
                        eventType,
                        customer.getFirstName(),
                        customer.getLastName(),
                        customer.getEmail(),
                        customer.getPhone(),
                        customer.getSector() != null ? customer.getSector().getName() : null,
                        LocalDateTime.now(),
                        performedBy
                );
                kafkaProducerService.sendCustomerEvent(event);
            } catch (Exception e) {
                // Log error but don't fail the main operation
                System.err.println("Failed to publish customer event: " + e.getMessage());
            }
        }
    }
}
