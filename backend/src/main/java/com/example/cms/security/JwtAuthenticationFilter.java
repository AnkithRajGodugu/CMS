package com.example.cms.security;

import com.example.cms.entity.User;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.DatabaseContextService;
import com.example.cms.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * - Validates JWT
 * - Sets Spring Security context
 * - (RLS DISABLED for now to avoid DB crashes)
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final DatabaseContextService databaseContextService; // kept but disabled

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // =========================
        // 1️⃣ Extract JWT
        // =========================
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);

            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (Exception e) {
                logger.warn("⚠️ Invalid or expired JWT token");
            }
        }

        // =========================
        // 2️⃣ Validate & authenticate
        // =========================
        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("🔥 Authentication set for: " + username);
                System.out.println("🔥 Roles: " + userDetails.getAuthorities());

                // =========================
                // ❌ RLS DISABLED (IMPORTANT FIX)
                // =========================
                try {
                    if (userDetails instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
                        User user = customUserDetails.getUser();
                        if (user != null && user.getId() != null) {
                            // databaseContextService.setUserContext(user.getId());
                            logger.debug("⚠️ RLS DISABLED - skipping DB context for user: {}", username);
                        }
                    }

                } catch (Exception e) {
                    logger.error("Error fetching user for context", e);
                }
            }
        }

        // =========================
        // 3️⃣ Continue request
        // =========================
        try {
            filterChain.doFilter(request, response);
        } finally {

            // =========================
            // ❌ RLS CLEAR DISABLED
            // =========================
            try {
                // databaseContextService.clearUserContext(); // DISABLED
            } catch (Exception e) {
                logger.debug("Error clearing DB context: {}", e.getMessage());
            }
        }
    }
}