package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service("authz")
public class AuthorizationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public boolean isManagerOfCustomer(Principal principal, Long customerId) {
        User currentUser = userRepository.findByUsername(principal.getName());
        if (currentUser == null || currentUser.getRole() != User.Role.MANAGER) {
            return false;
        }
        return customerRepository.findById(customerId)
                .map(customer -> customer.getSector().equals(currentUser.getSector()))
                .orElse(false);
    }
}
