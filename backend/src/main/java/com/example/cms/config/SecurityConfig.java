package com.example.cms.config;

import com.example.cms.security.JwtAuthenticationFilter;
import com.example.cms.security.SectorAuthorizationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SectorAuthorizationFilter sectorAuthorizationFilter;

    // ===================== Password Encoder =====================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ===================== Authentication Manager =====================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // ===================== Security Filter Chain =====================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // -------- CORS / CSRF --------
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // -------- Stateless API --------
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // -------- Authorization --------
                .authorizeHttpRequests(auth -> auth

                        // --- Public API endpoints ---
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/health",
                                "/api/test",
                                "/api/public/**"
                        ).permitAll()


                        // --- Actuator / Monitoring ---
                        .requestMatchers("/actuator/**").permitAll()

                        // --- Admin-only APIs ---
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // --- Sector-scoped APIs (MAIN DESIGN) ---
                        .requestMatchers("/api/v1/sectors/**").authenticated()

                        // --- Any other API must be authenticated ---
                        //.requestMatchers("/api/**").authenticated()

                        // --- Frontend (React) routes ---
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login",
                                "/signup",
                                "/dashboard/**",
                                "/about",
                                "/docs",
                                "/documentation",
                                "/assets/**",
                                "/static/**",
                                "/*.js",
                                "/*.css",
                                "/*.ico",
                                "/*.svg",
                                "/*.png",
                                "/*.jpg"
                        ).permitAll()

                        // --- Everything else ---
                        .anyRequest().permitAll()

                )

                // -------- Filters --------
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .addFilterAfter(
                        sectorAuthorizationFilter,
                        JwtAuthenticationFilter.class
                );

        return http.build();
    }

    // ===================== CORS =====================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(
                List.of("http://localhost:*", "https://yourdomain.com")
        );
        config.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(
                Arrays.asList("Authorization", "Content-Type", "X-Requested-With")
        );
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
