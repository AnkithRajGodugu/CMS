package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BulkImportService {

    private final CustomerRepository customerRepository;
    private final SectorRepository sectorRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional
    public int importCustomersFromExcel(MultipartFile file, SectorContext ctx) {
        Sector sector = sectorRepository.findById(ctx.getSectorId())
                .orElseThrow(() -> new RuntimeException("Sector not found"));

        List<Customer> customers = new ArrayList<>();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            // Skip header
            if (rows.hasNext()) rows.next();
            
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                
                Customer customer = new Customer();
                customer.setFirstName(getCellValue(currentRow.getCell(0)));
                customer.setLastName(getCellValue(currentRow.getCell(1)));
                customer.setEmail(getCellValue(currentRow.getCell(2)));
                customer.setPhone(getCellValue(currentRow.getCell(3)));
                customer.setSector(sector);
                customer.setCreatedBy(ctx.getUserId());
                
                if (customer.getFirstName() != null && !customer.getFirstName().isBlank()) {
                    customers.add(customer);
                }
            }
            
            customerRepository.saveAll(customers);
            
            notificationService.sendSectorNotification(
                sector.getCode(),
                "BULK_IMPORT_COMPLETE",
                "Successfully imported " + customers.size() + " customers via Excel",
                java.util.Map.of("count", customers.size())
            );
            
            auditService.logAction(ctx.getUserId(), ctx.getSectorId(), null, 
                "BULK_IMPORT_EXCEL", "CUSTOMER", "BATCH", 
                java.util.Map.of("count", customers.size()), "SYSTEM");
            
            return customers.size();
            
        } catch (Exception e) {
            log.error("Failed to parse Excel file", e);
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return null;
        }
    }
}
