package com.example.cms.config;

import com.example.cms.entity.*;
import com.example.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

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
            Sector healthcareSector = sectorRepository.findByName("Healthcare").orElse(null);
            Sector logisticsSector = sectorRepository.findByName("Logistics").orElse(null);
            Sector contentSector = sectorRepository.findByName("Content").orElse(null);

            // Create admin user
            User admin = new User("admin", passwordEncoder.encode("admin123"), User.Role.ADMIN);
            admin.setSector(bankingSector);
            userRepository.save(admin);

            // Create sector-specific users
            User bankingUser = new User("bank_user", passwordEncoder.encode("bank123"), User.Role.banking);
            bankingUser.setSector(bankingSector);
            userRepository.save(bankingUser);

            User healthcareUser = new User("health_user", passwordEncoder.encode("health123"), User.Role.healthcare);
            healthcareUser.setSector(healthcareSector);
            userRepository.save(healthcareUser);

            User logisticsUser = new User("logistics_user", passwordEncoder.encode("logistics123"), User.Role.logistics);
            logisticsUser.setSector(logisticsSector);
            userRepository.save(logisticsUser);

            User contentUser = new User("content_user", passwordEncoder.encode("content123"), User.Role.content);
            contentUser.setSector(contentSector);
            userRepository.save(contentUser);

            System.out.println("✅ Test users initialized:");
            System.out.println("   - admin / admin123 (ADMIN)");
            System.out.println("   - bank_user / bank123 (banking)");
            System.out.println("   - health_user / health123 (healthcare)");
            System.out.println("   - logistics_user / logistics123 (logistics)");
            System.out.println("   - content_user / content123 (content)");
        }

        // Initialize sample banking data
        if (bankAccountRepository.count() == 0) {
            BankAccount acc1 = new BankAccount("ACC001", BankAccount.AccountType.CHECKING, "John Doe");
            acc1.setBalance(new BigDecimal("15420.50"));
            bankAccountRepository.save(acc1);

            BankAccount acc2 = new BankAccount("ACC002", BankAccount.AccountType.SAVINGS, "Jane Smith");
            acc2.setBalance(new BigDecimal("45230.75"));
            bankAccountRepository.save(acc2);

            BankAccount acc3 = new BankAccount("ACC003", BankAccount.AccountType.BUSINESS, "ABC Corp");
            acc3.setBalance(new BigDecimal("125000.00"));
            bankAccountRepository.save(acc3);

            BankAccount acc4 = new BankAccount("ACC004", BankAccount.AccountType.CREDIT, "Mike Johnson");
            acc4.setBalance(new BigDecimal("-2500.00"));
            bankAccountRepository.save(acc4);

            System.out.println("✅ Sample bank accounts initialized");
        }

        // Initialize sample transactions
        if (transactionRepository.count() == 0) {
            Transaction txn1 = new Transaction("TXN001", Transaction.TransactionType.DEPOSIT, new BigDecimal("2500.00"), "ACC001");
            txn1.setStatus(Transaction.TransactionStatus.COMPLETED);
            txn1.setDescription("Salary deposit");
            transactionRepository.save(txn1);

            Transaction txn2 = new Transaction("TXN002", Transaction.TransactionType.WITHDRAWAL, new BigDecimal("150.00"), "ACC002");
            txn2.setStatus(Transaction.TransactionStatus.COMPLETED);
            txn2.setDescription("ATM withdrawal");
            transactionRepository.save(txn2);

            Transaction txn3 = new Transaction("TXN003", Transaction.TransactionType.TRANSFER, new BigDecimal("1000.00"), "ACC003");
            txn3.setStatus(Transaction.TransactionStatus.PENDING);
            txn3.setDescription("Business transfer");
            transactionRepository.save(txn3);

            System.out.println("✅ Sample transactions initialized");
        }

        // Initialize sample patients
        if (patientRepository.count() == 0) {
            Patient patient1 = new Patient("PAT001", "Sarah", "Johnson");
            patient1.setAge(34);
            patient1.setCondition("Hypertension");
            patient1.setLastVisit(LocalDate.of(2024, 1, 15));
            patient1.setStatus(Patient.PatientStatus.STABLE);
            patientRepository.save(patient1);

            Patient patient2 = new Patient("PAT002", "Michael", "Chen");
            patient2.setAge(67);
            patient2.setCondition("Diabetes Type 2");
            patient2.setLastVisit(LocalDate.of(2024, 1, 12));
            patient2.setStatus(Patient.PatientStatus.MONITORING);
            patientRepository.save(patient2);

            Patient patient3 = new Patient("PAT003", "Emily", "Davis");
            patient3.setAge(28);
            patient3.setCondition("Asthma");
            patient3.setLastVisit(LocalDate.of(2024, 1, 10));
            patient3.setStatus(Patient.PatientStatus.STABLE);
            patientRepository.save(patient3);

            Patient patient4 = new Patient("PAT004", "Robert", "Wilson");
            patient4.setAge(45);
            patient4.setCondition("Heart Disease");
            patient4.setLastVisit(LocalDate.of(2024, 1, 8));
            patient4.setStatus(Patient.PatientStatus.CRITICAL);
            patientRepository.save(patient4);

            System.out.println("✅ Sample patients initialized");
        }

        // Initialize sample appointments
        if (appointmentRepository.count() == 0) {
            Appointment apt1 = new Appointment("APT001", "Sarah Johnson", "Dr. Smith", 
                LocalDateTime.of(2024, 1, 20, 9, 0), Appointment.AppointmentType.CONSULTATION);
            apt1.setStatus(Appointment.AppointmentStatus.CONFIRMED);
            appointmentRepository.save(apt1);

            Appointment apt2 = new Appointment("APT002", "Michael Chen", "Dr. Brown", 
                LocalDateTime.of(2024, 1, 20, 10, 30), Appointment.AppointmentType.FOLLOW_UP);
            apt2.setStatus(Appointment.AppointmentStatus.CONFIRMED);
            appointmentRepository.save(apt2);

            Appointment apt3 = new Appointment("APT003", "Emily Davis", "Dr. Wilson", 
                LocalDateTime.of(2024, 1, 20, 14, 0), Appointment.AppointmentType.CHECK_UP);
            apt3.setStatus(Appointment.AppointmentStatus.PENDING);
            appointmentRepository.save(apt3);

            Appointment apt4 = new Appointment("APT004", "Robert Wilson", "Dr. Johnson", 
                LocalDateTime.of(2024, 1, 20, 15, 30), Appointment.AppointmentType.EMERGENCY);
            apt4.setStatus(Appointment.AppointmentStatus.URGENT);
            appointmentRepository.save(apt4);

            System.out.println("✅ Sample appointments initialized");
        }
    }
}