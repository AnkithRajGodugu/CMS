package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUserFromPrincipal(Principal principal) {
        return userRepository.findByUsername(principal.getName());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Customer createCustomer(Customer customer, Principal principal) {
        User currentUser = getUserFromPrincipal(principal);
        if (currentUser.getRole() == User.Role.MANAGER) {
            customer.setSector(currentUser.getSector());
        }
        return customerRepository.save(customer);
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
            return customerRepository.save(customer);
        });
    }

    @PreAuthorize("hasRole('ADMIN') or @authz.isManagerOfCustomer(principal, #id)")
    public boolean deleteCustomer(Long id, Principal principal) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
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
        return customerRepository.saveAll(customers);
    }
}
