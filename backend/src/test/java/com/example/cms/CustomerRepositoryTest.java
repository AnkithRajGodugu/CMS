package com.example.cms;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
@ActiveProfiles("test")
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Test
    void saveAndFindCustomer_bySector() {

        // ✅ Create valid sector
        Sector sector = new Sector();
        sector.setName("Banking");
        sector.setCode("BANKING");
        sector.setRoutePath("/banking");   // 🔴 REQUIRED
        sector.setEnabled(true);
        sector.setDisplayOrder(1);

        sector = sectorRepository.save(sector);

        Customer customer = new Customer();
        customer.setFirstName("Uday");
        customer.setLastName("Kori");
        customer.setEmail("uday@example.com");
        customer.setSector(sector);

        customerRepository.save(customer);

        List<Customer> customers =
                customerRepository.findBySectorId(sector.getId());

        assertThat(customers).hasSize(1);
    }
}
