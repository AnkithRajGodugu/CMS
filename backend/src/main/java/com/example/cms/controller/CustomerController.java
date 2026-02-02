package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/sectors/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer, Principal principal) {
        return ResponseEntity.ok(customerService.createCustomer(customer, principal));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(Principal principal) {
        List<Customer> customers = customerService.getCustomersForUser(principal);
        return customers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id, Principal principal) {
        return customerService.getCustomerById(id, principal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails, Principal principal) {
        return customerService.updateCustomer(id, customerDetails, principal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id, Principal principal) {
        if (customerService.deleteCustomer(id, principal)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam(required = false) String name, @RequestParam(required = false) String email, Principal principal) {
        List<Customer> customers = customerService.searchCustomersForUser(name, email, principal);
        return customers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(customers);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<Customer>> createBulkCustomers(@Valid @RequestBody List<Customer> customers, Principal principal) {
        List<Customer> savedCustomers = customerService.createBulkCustomers(customers, principal);
        return ResponseEntity.ok(savedCustomers);
    }
}
