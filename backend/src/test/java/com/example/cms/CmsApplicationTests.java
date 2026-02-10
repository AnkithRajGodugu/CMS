package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import com.example.cms.config.TestCacheConfig;
import com.example.cms.config.TestKafkaConfig;
import com.example.cms.config.TestKafkaDisableConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest

@Import({
        NoSecurityConfig.class,
        TestKafkaConfig.class,

        TestKafkaDisableConfig.class
})

@ActiveProfiles("test")
class CmsApplicationTests {

    @Test
    void contextLoads() {
    }
}