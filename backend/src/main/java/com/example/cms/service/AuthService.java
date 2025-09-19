package com.example.cms.service;

import com.example.cms.entity.User;
import com.example.cms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public Optional<User> findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? Optional.of(user) : Optional.empty();
    }

    public User createUser(String username, String password, User.Role role, Long sectorId) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        // Set sector if provided
        if (sectorId != null) {
            // You would fetch the sector entity here
            // user.setSector(sectorRepository.findById(sectorId).orElse(null));
        }
        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }
}