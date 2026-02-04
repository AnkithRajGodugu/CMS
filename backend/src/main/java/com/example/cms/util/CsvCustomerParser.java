package com.example.cms.util;

import com.example.cms.entity.Customer;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CsvCustomerParser {

    public static List<Customer> parse(MultipartFile file) {
        try {
            List<Customer> customers = new ArrayList<>();
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            );

            reader.readLine(); // skip header

            String line;
            while ((line = reader.readLine()) != null) {
                String[] cols = line.split(",");

                Customer c = new Customer();
                c.setFirstName(cols[0].trim());
                c.setLastName(cols[1].trim());
                c.setEmail(cols[2].trim());
                c.setPhone(cols.length > 3 ? cols[3].trim() : null);

                customers.add(c);
            }
            return customers;
        } catch (Exception e) {
            throw new RuntimeException("Invalid CSV file", e);
        }
    }
}
