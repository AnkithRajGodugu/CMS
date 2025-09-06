// Updated CustomerController.java (added role-based logic for access)
package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        String username = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByUsername(username);
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (currentUser.getRole() == User.Role.MANAGER) {
            if (currentUser.getSector() == null || (customer.getSector() != null && !customer.getSector().equals(currentUser.getSector()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            customer.setSector(currentUser.getSector());
        } else if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Customer> customers = customerService.getCustomersForUser(currentUser);
        return customers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Customer> customerOpt = customerService.getCustomerById(id);
        if (customerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer customer = customerOpt.get();
        if (currentUser.getRole() == User.Role.ADMIN ||
                (currentUser.getRole() == User.Role.MANAGER && customer.getSector() != null && customer.getSector().equals(currentUser.getSector()))) {
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Customer> existingOpt = customerService.getCustomerById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer existing = existingOpt.get();
        if (currentUser.getRole() == User.Role.ADMIN ||
                (currentUser.getRole() == User.Role.MANAGER && existing.getSector() != null && existing.getSector().equals(currentUser.getSector()))) {
            if (currentUser.getRole() == User.Role.MANAGER && (customerDetails.getSector() != null && !customerDetails.getSector().equals(currentUser.getSector()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return customerService.updateCustomer(id, customerDetails)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Customer> customerOpt = customerService.getCustomerById(id);
        if (customerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer customer = customerOpt.get();
        if (currentUser.getRole() == User.Role.ADMIN ||
                (currentUser.getRole() == User.Role.MANAGER && customer.getSector() != null && customer.getSector().equals(currentUser.getSector()))) {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam(required = false) String name, @RequestParam(required = false) String email) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Customer> customers = customerService.searchCustomersForUser(name, email, currentUser);
        return customers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(customers);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Customer>> createBulkCustomers(@Valid @RequestBody List<Customer> customers) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (currentUser.getRole() == User.Role.MANAGER) {
            for (Customer c : customers) {
                c.setSector(currentUser.getSector());
            }
        } else if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Customer> savedCustomers = customerService.createBulkCustomers(customers);
        return ResponseEntity.ok(savedCustomers);
    }
}