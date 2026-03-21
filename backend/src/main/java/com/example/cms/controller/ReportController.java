package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final CustomerRepository customerRepository;
    private final SectorRepository sectorRepository;
    private final UserRepository userRepository;

    public ReportController(CustomerRepository customerRepository,
                            SectorRepository sectorRepository,
                            UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.sectorRepository = sectorRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByUsername(username);
    }

    /**
     * ADMIN → any sector
     * MANAGER → only their sector
     */
    @GetMapping("/customers-this-month")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Long> customersCreatedThisMonth(
            @RequestParam String sectorCode) {

        User user = getCurrentUser();
        Sector sector = sectorRepository.findByCode(sectorCode)
                .orElseThrow(() -> new IllegalArgumentException("Sector not found"));

        // MANAGER safety check
        if (user.getRole() == User.Role.MANAGER &&
                !sector.equals(user.getSector())) {
            return ResponseEntity.status(403).build();
        }

        LocalDateTime start = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        LocalDateTime end = start.plusMonths(1);

        long count = customerRepository
                .countBySectorAndCreatedAtBetween(sector, start, end);

        return ResponseEntity.ok(count);
    }

    @GetMapping("/customers/excel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public void exportCustomersToExcel(@RequestParam String sectorCode, HttpServletResponse response) throws IOException {
        Sector sector = sectorRepository.findByCode(sectorCode)
                .orElseThrow(() -> new IllegalArgumentException("Sector not found"));

        validateAccess(sector);

        List<Customer> customers = customerRepository.findBySector(sector);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Customers");

        // Header
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("First Name");
        header.createCell(2).setCellValue("Last Name");
        header.createCell(3).setCellValue("Email");
        header.createCell(4).setCellValue("Phone");
        header.createCell(5).setCellValue("Created At");

        int rowNum = 1;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Customer c : customers) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(c.getId());
            row.createCell(1).setCellValue(c.getFirstName());
            row.createCell(2).setCellValue(c.getLastName());
            row.createCell(3).setCellValue(c.getEmail());
            row.createCell(4).setCellValue(c.getPhone() != null ? c.getPhone() : "");
            row.createCell(5).setCellValue(c.getCreatedAt().format(formatter));
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=customers_" + sectorCode + ".xlsx");
        workbook.write(response.getOutputStream());
        workbook.close();
    }

    @GetMapping("/customers/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public void exportCustomersToPdf(@RequestParam String sectorCode, HttpServletResponse response) throws IOException {
        Sector sector = sectorRepository.findByCode(sectorCode)
                .orElseThrow(() -> new IllegalArgumentException("Sector not found"));

        validateAccess(sector);

        List<Customer> customers = customerRepository.findBySector(sector);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=customers_" + sectorCode + ".pdf");

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);

        Paragraph p = new Paragraph("Customer List - " + sector.getName(), font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table, customers);

        document.add(table);
        document.close();
    }

    private void validateAccess(Sector sector) {
        User user = getCurrentUser();
        if (user.getRole() == User.Role.MANAGER && !sector.equals(user.getSector())) {
            throw new SecurityException("Forbidden: Cannot access other sector's reports");
        }
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);

        cell.setPhrase(new Phrase("ID", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Name", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Email", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Phone", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Created At", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table, List<Customer> customers) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Customer customer : customers) {
            table.addCell(String.valueOf(customer.getId()));
            table.addCell(customer.getFirstName() + " " + customer.getLastName());
            table.addCell(customer.getEmail());
            table.addCell(customer.getPhone() != null ? customer.getPhone() : "");
            table.addCell(customer.getCreatedAt().format(formatter));
        }
    }
}
