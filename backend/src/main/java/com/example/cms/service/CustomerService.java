package com.example.cms.service;

import com.example.cms.dto.MonthlyCustomerCountResponse;
import com.example.cms.dto.SectorMonthlyCustomerCountResponse;
import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SectorRepository sectorRepository;
    private final AuditService auditService;

    /* =========================
       READ
    ========================== */

    public List<Customer> getAllCustomers(SectorContext ctx) {
        List<Customer> customers =
                customerRepository.findBySectorId(ctx.getSectorId());

        auditService.logDataAccess(
                SecurityUtils.currentUserId(),
                ctx.getSectorId(),
                null,
                "CUSTOMER",
                "ALL",
                "READ",
                SecurityUtils.clientIp()
        );
        return customers;
    }

    public Customer getCustomer(Long id, SectorContext ctx) {
        Customer customer = customerRepository
                .findByIdAndSectorId(id, ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        auditService.logDataAccess(
                SecurityUtils.currentUserId(),
                ctx.getSectorId(),
                null,
                "CUSTOMER",
                id.toString(),
                "READ",
                SecurityUtils.clientIp()
        );
        return customer;
    }

    /* =========================
       PAGINATION
    ========================== */

    public Page<Customer> getCustomersPaged(
            SectorContext ctx,
            String search,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    ) {
        return customerRepository.findBySectorWithSearchAndDateRange(
                ctx.getSectorId(), search, from, to, pageable
        );
    }

    /* =========================
       REPORTING
    ========================== */

    @Transactional(readOnly = true)
    public List<MonthlyCustomerCountResponse> getMonthlyCustomerReport(
            SectorContext ctx,
            LocalDateTime start,
            LocalDateTime end
    ) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }

        return customerRepository.getMonthlyCustomerCounts(
                ctx.getSectorId(),
                start,
                end
        );
    }

    @Transactional(readOnly = true)
    public List<SectorMonthlyCustomerCountResponse> getAdminMonthlyCustomerReport(
            LocalDateTime start,
            LocalDateTime end
    ) {
        return customerRepository.getMonthlyCustomerCountsAllSectors(start, end);
    }

    /* =========================
       CRUD
    ========================== */

    public Customer createCustomer(Customer customer, SectorContext ctx) {

        if (ctx == null || ctx.getSectorId() == null) {
            throw new IllegalArgumentException("Sector context is required");
        }

        Sector sector = sectorRepository.findById(ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Sector not found"));

        Long userId = Optional.ofNullable(SecurityUtils.currentUserId()).orElse(0L);

        customer.setSector(sector);
        customer.setCreatedBy(userId);
        customer.setUpdatedBy(userId);


        Customer saved = customerRepository.save(customer);

        Map<String, Object> metadata = new HashMap<>();
        if (saved.getEmail() != null) {
            metadata.put("email", saved.getEmail());
        }

        auditService.logAction(
                userId,
                ctx.getSectorId(),
                null,
                "CREATE_CUSTOMER",
                "CUSTOMER",
                saved.getId().toString(),
                metadata.isEmpty() ? null : metadata,
                SecurityUtils.clientIp()
        );


        return saved;
    }

    public Customer updateCustomer(Long id, Customer updated, SectorContext ctx) {
        Customer existing = getCustomer(id, ctx);

        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setUpdatedBy(SecurityUtils.currentUserId());

        Customer saved = customerRepository.save(existing);

        auditService.logAction(
                SecurityUtils.currentUserId(),
                ctx.getSectorId(),
                null,
                "UPDATE_CUSTOMER",
                "CUSTOMER",
                saved.getId().toString(),
                null,
                SecurityUtils.clientIp()
        );

        return saved;
    }

    public void deleteCustomer(Long id, SectorContext ctx) {
        if (!customerRepository.existsByIdAndSectorId(id, ctx.getSectorId())) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);

        auditService.logAction(
                SecurityUtils.currentUserId(),
                ctx.getSectorId(),
                null,
                "DELETE_CUSTOMER",
                "CUSTOMER",
                id.toString(),
                null,
                SecurityUtils.clientIp()
        );
    }

    /* =========================
       BULK CSV
    ========================== */

    public int bulkCreateFromCsv(MultipartFile file, SectorContext ctx) {

        Sector sector = sectorRepository.findById(ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Sector not found"));

        Long userId = Optional.ofNullable(SecurityUtils.currentUserId()).orElse(0L);

        List<Customer> customers = new ArrayList<>();

        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            reader.readLine(); // skip header
            String line;

            while ((line = reader.readLine()) != null) {
                String[] f = line.split(",");

                Customer c = new Customer();
                c.setFirstName(f[0].trim());
                c.setLastName(f[1].trim());
                c.setEmail(f.length > 2 ? f[2].trim() : null);
                c.setPhone(f.length > 3 ? f[3].trim() : null);
                c.setSector(sector);
                c.setCreatedBy(userId);
                c.setUpdatedBy(userId);

                customers.add(c);
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid CSV format", e);
        }

        customerRepository.saveAll(customers);

        auditService.logAction(
                userId,
                ctx.getSectorId(),
                null,
                "BULK_CREATE_CUSTOMERS",
                "CUSTOMER",
                "CSV_UPLOAD",
                Map.of("count", customers.size()),
                SecurityUtils.clientIp()
        );

        return customers.size();
    }
}