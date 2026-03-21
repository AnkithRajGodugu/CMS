package com.example.cms.service;

import com.example.cms.dto.MonthlyCustomerCountResponse;
import com.example.cms.dto.SectorMonthlyCustomerCountResponse;
import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.util.SecurityUtils;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SectorRepository sectorRepository;
    private final AuditService auditService;
    private final MeterRegistry meterRegistry;

    private final Counter customerCreatedCounter;
    private final Counter customerDeletedCounter;
    private final Counter customerBulkCreatedCounter;

    public CustomerService(CustomerRepository customerRepository,
                           SectorRepository sectorRepository,
                           AuditService auditService,
                           MeterRegistry meterRegistry) {

        this.customerRepository = customerRepository;
        this.sectorRepository = sectorRepository;
        this.auditService = auditService;
        this.meterRegistry = meterRegistry;

        // Safe metric initialization (Spring + Mockito safe)
        if (meterRegistry != null) {
            this.customerCreatedCounter =
                    meterRegistry.counter("customers.created");

            this.customerDeletedCounter =
                    meterRegistry.counter("customers.deleted");

            this.customerBulkCreatedCounter =
                    meterRegistry.counter("customers.bulk.created");
        } else {
            this.customerCreatedCounter = null;
            this.customerDeletedCounter = null;
            this.customerBulkCreatedCounter = null;
        }
    }

    /* =========================================================
       READ
    ========================================================== */

    @Cacheable(value = "customers", key = "#ctx.sectorId")
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

    @Cacheable(value = "customer", key = "#id + '-' + #ctx.sectorId")
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

    /* =========================================================
       PAGINATION
    ========================================================== */

//    @Cacheable(
//            value = "customersPaged",
//            key = "T(String).valueOf(#ctx.sectorId) + '-' + T(String).valueOf(#search) + '-' + T(String).valueOf(#from) + '-' + T(String).valueOf(#to) + '-' + #pageable.pageNumber"
//    )


    public Page<Customer> getCustomersPaged(
            SectorContext ctx,
            String search,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    ) {

        if (ctx == null || ctx.getSectorId() == null) {
            throw new RuntimeException("SectorContext is missing");
        }

        // ✅ Fix for Hibernate 6 'IS NULL' SemanticException: Provide default values instead of null
        String safeSearch = search == null || search.trim().isEmpty() ? "" : search.trim();
        LocalDateTime safeFrom = from != null ? from : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime safeTo = to != null ? to : LocalDateTime.of(2099, 12, 31, 23, 59, 59);

        // ✅ USE CORRECT QUERY
        return customerRepository.findBySectorWithSearchAndDateRange(
                ctx.getSectorId(),
                safeSearch,
                safeFrom,
                safeTo,
                pageable
        );
    }
    /* =========================================================
       REPORTING
    ========================================================== */

    @Transactional(readOnly = true)
    @Cacheable(
            value = "monthlyReport",
            key = "#ctx.sectorId + '-' + #start + '-' + #end"
    )
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
    @Cacheable(
            value = "adminMonthlyReport",
            key = "#start + '-' + #end"
    )
    public List<SectorMonthlyCustomerCountResponse> getAdminMonthlyCustomerReport(
            LocalDateTime start,
            LocalDateTime end
    ) {


        return customerRepository.getMonthlyCustomerCountsAllSectors(start, end);
    }

    /* =========================================================
       CRUD
    ========================================================== */

    @CacheEvict(
            value = {"customers", "customer", "customersPaged", "monthlyReport", "adminMonthlyReport"},
            allEntries = true
    )
    public Customer createCustomer(Customer customer, SectorContext ctx) {

        if (ctx == null || ctx.getSectorId() == null) {
            throw new IllegalArgumentException("Sector context is required");
        }

        Sector sector = sectorRepository.findById(ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Sector not found"));

        Long userId =
                Optional.ofNullable(SecurityUtils.currentUserId())
                        .orElse(0L);

        customer.setSector(sector);
        customer.setCreatedBy(userId);
        customer.setUpdatedBy(userId);

        Customer saved = customerRepository.save(customer);

        if (customerCreatedCounter != null) {
            customerCreatedCounter.increment();
        }

        auditService.logAction(
                userId,
                ctx.getSectorId(),
                null,
                "CREATE_CUSTOMER",
                "CUSTOMER",
                saved.getId().toString(),
                null,
                SecurityUtils.clientIp()
        );

        return saved;
    }

    @CacheEvict(
            value = {"customers", "customer", "customersPaged", "monthlyReport", "adminMonthlyReport"},
            allEntries = true
    )
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

    @CacheEvict(
            value = {"customers", "customer", "customersPaged", "monthlyReport", "adminMonthlyReport"},
            allEntries = true
    )
    public void deleteCustomer(Long id, SectorContext ctx) {

        if (!customerRepository.existsByIdAndSectorId(id, ctx.getSectorId())) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);

        if (customerDeletedCounter != null) {
            customerDeletedCounter.increment();
        }

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

    /* =========================================================
       BULK CSV
    ========================================================== */

    @CacheEvict(
            value = {"customers", "customer", "customersPaged", "monthlyReport", "adminMonthlyReport"},
            allEntries = true
    )
    public int bulkCreateFromCsv(MultipartFile file, SectorContext ctx) {

        Sector sector = sectorRepository.findById(ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Sector not found"));

        Long userId =
                Optional.ofNullable(SecurityUtils.currentUserId())
                        .orElse(0L);

        List<Customer> customers = new ArrayList<>();

        try (BufferedReader reader =
                     new BufferedReader(
                             new InputStreamReader(file.getInputStream()))) {

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

        if (customerBulkCreatedCounter != null) {
            customerBulkCreatedCounter.increment(customers.size());
        }

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
