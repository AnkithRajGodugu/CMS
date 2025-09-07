// Updated CustomerService.java (added methods for role-based filtering)
package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getCustomersForUser(User user) {
        if (user.getRole() == User.Role.ADMIN) {
            return customerRepository.findAll();
        } else if (user.getRole() == User.Role.MANAGER && user.getSector() != null) {
            return customerRepository.findBySector(user.getSector());
        }
        return Collections.emptyList();
    }

    public List<Customer> searchCustomersForUser(String name, String email, User user) {
        List<Customer> allForUser = getCustomersForUser(user);
        // Simple filter; for better performance, add queries to repo
        if (name != null && !name.isEmpty()) {
            return allForUser.stream()
                    .filter(c -> c.getFirstName().contains(name) || c.getLastName().contains(name))
                    .toList();
        } else if (email != null && !email.isEmpty()) {
            return allForUser.stream()
                    .filter(c -> c.getEmail() != null && c.getEmail().contains(email))
                    .toList();
        }
        return allForUser;
    }

    public List<Customer> createBulkCustomers(@Valid List<Customer> customers) {
        return customerRepository.saveAll(customers);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> updateCustomer(Long id, Customer customerDetails) {
        return customerRepository.findById(id).map(customer -> {
            customer.setFirstName(customerDetails.getFirstName());
            customer.setLastName(customerDetails.getLastName());
            customer.setEmail(customerDetails.getEmail());
            customer.setPhone(customerDetails.getPhone());
            customer.setSector(customerDetails.getSector());
            return customerRepository.save(customer);
        });
    }

    public boolean deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}