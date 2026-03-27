package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Import({
        NoSecurityConfig.class,

})

@ActiveProfiles("test")
class CmsApplicationTests {

    @Test
    void contextLoads() {
    }
}