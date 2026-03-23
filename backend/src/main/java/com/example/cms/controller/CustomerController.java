package com.example.cms.controller;

import com.example.cms.dto.MonthlyCustomerCountResponse;
import com.example.cms.dto.SectorMonthlyCustomerCountResponse;
import com.example.cms.dto.CustomerResponse;
import com.example.cms.dto.PagedResponse;
import com.example.cms.entity.Customer;
import com.example.cms.mapper.CustomerMapper;
import com.example.cms.model.SectorContext;
import com.example.cms.service.CustomerService;
import com.example.cms.util.PageUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sectors/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;


    private SectorContext sector(HttpServletRequest request) {
        return (SectorContext) request.getAttribute("sectorContext");
    }

    /* =========================
       BASIC READ
    ========================== */

    @GetMapping
    public ResponseEntity<List<Customer>> getAll(HttpServletRequest request) {
        return ResponseEntity.ok(
                customerService.getAllCustomers(sector(request))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                customerService.getCustomer(id, sector(request))
        );
    }

    /* =========================
       PAGINATED READ
    ========================== */

    @GetMapping("/paged")
    public ResponseEntity<PagedResponse<CustomerResponse>> getPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to,
            @PageableDefault(size = 20, sort = "id") Pageable pageable,
            HttpServletRequest request
    ) {

        System.out.println("✅ STEP 1 - Controller hit");

        SectorContext ctx = sector(request);
        System.out.println("🔥 SECTOR CONTEXT: " + ctx);
        System.out.println("🔥 SectorContext object: " + ctx);
        System.out.println("🔥 Sector ID: " + (ctx != null ? ctx.getSectorId() : "NULL"));
        System.out.println("🔥 Sector ID: " + ctx.getSectorId());
        System.out.println("🔥 Search: " + search);
        System.out.println("🔥 From: " + from);
        System.out.println("🔥 To: " + to);

        Page<Customer> page = customerService.getCustomersPaged(ctx, search, from, to, pageable);

        System.out.println("✅ STEP 2 - Got page from service: " + page.getContent().size());

        Page<CustomerResponse> dtoPage = page.map(customer -> {
            System.out.println("Mapping customer: " + customer.getId());
            return CustomerMapper.toResponse(customer);
        });

        System.out.println("✅ STEP 3 - Mapping done");

        return ResponseEntity.ok(PageUtils.from(dtoPage));
    }
    /* =========================
       REPORTS
    ========================== */

    @GetMapping("/reports/monthly")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> monthlyReport(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end,
            HttpServletRequest request
    ) {
        SectorContext ctx = sector(request);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        boolean isAdmin = ctx != null &&
                ctx.getRoles() != null &&
                ctx.getRoles().stream()
                        .anyMatch(r -> r.equals("ROLE_ADMIN") || r.equals("ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(
                    customerService
                            .getAdminMonthlyCustomerReport(startDateTime, endDateTime)
                            .stream()
                            .map(r -> new MonthlyCustomerCountResponse(
                                    r.year(),
                                    r.month(),
                                    r.count()
                            ))
                            .toList()
            );
        }

        return ResponseEntity.ok(
                customerService.getMonthlyCustomerReport(
                        ctx,
                        startDateTime,
                        endDateTime
                )
        );
    }

    /* =========================
       ADMIN REPORT
    ========================== */

    @GetMapping("/reports/admin/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SectorMonthlyCustomerCountResponse>> adminMonthlyReport(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {

        return ResponseEntity.ok(
                customerService.getAdminMonthlyCustomerReport(
                        start.atStartOfDay(),
                        end.atTime(23, 59, 59)
                )
        );
    }

    /* =========================
       CRUD
    ========================== */

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Customer> create(
            @Valid @RequestBody Customer customer,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                customerService.createCustomer(customer, sector(request))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Customer> update(
            @PathVariable Long id,
            @Valid @RequestBody Customer customer,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                customerService.updateCustomer(id, customer, sector(request))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        customerService.deleteCustomer(id, sector(request));
        return ResponseEntity.noContent().build();
    }

    /* =========================
       BULK CSV
    ========================== */

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Map<String, Object>> bulkCreate(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        int count = customerService.bulkCreateFromCsv(file, sector(request));
        return ResponseEntity.ok(Map.of("created", count));
    }

}
