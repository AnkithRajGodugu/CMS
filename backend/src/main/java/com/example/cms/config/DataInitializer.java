package com.example.cms.config;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sectors if they don't exist
        if (sectorRepository.count() == 0) {
            Sector banking = new Sector("Banking", "Banking & Finance");
            Sector healthcare = new Sector("Healthcare", "Healthcare Services");
            Sector logistics = new Sector("Logistics", "Logistics & Supply Chain");
            Sector content = new Sector("Content", "Content Creation");

            sectorRepository.save(banking);
            sectorRepository.save(healthcare);
            sectorRepository.save(logistics);
            sectorRepository.save(content);

            System.out.println("✅ Sectors initialized");
        }

        // Initialize users if they don't exist
        if (userRepository.count() == 0) {
            Sector bankingSector = sectorRepository.findByName("Banking").orElse(null);

            // Create admin user
            User admin = new User("admin", passwordEncoder.encode("password123"), User.Role.ADMIN);
            admin.setSector(bankingSector);
            userRepository.save(admin);

            // Create manager users
            User bankingManager = new User("banking_manager", passwordEncoder.encode("password123"), User.Role.MANAGER);
            bankingManager.setSector(bankingSector);
            userRepository.save(bankingManager);

            // Create regular users
            User bankingUser = new User("banking_user", passwordEncoder.encode("password123"), User.Role.USER);
            bankingUser.setSector(bankingSector);
            userRepository.save(bankingUser);

            System.out.println("✅ Test users initialized:");
            System.out.println("   - admin / password123 (ADMIN)");
            System.out.println("   - banking_manager / password123 (MANAGER)");
            System.out.println("   - banking_user / password123 (USER)");
        }
    }
}