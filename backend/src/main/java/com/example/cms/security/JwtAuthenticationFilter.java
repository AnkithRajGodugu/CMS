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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter that validates JWT tokens and sets up security context.
 * Also sets the database user context for row-level security policies.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final DatabaseContextService databaseContextService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token is in the form "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (Exception e) {
                logger.warn("Unable to get JWT Token or JWT Token has expired");
            }
        }

        // Validate token and set security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("🔥 Authentication set for: " + username);
                System.out.println("🔥 Authorities: " + userDetails.getAuthorities());
                // Set database context for row-level security
                try {
                    User user = userRepository.findByUsername(username);
                    if (user != null && user.getId() != null) {
                        databaseContextService.setUserContext(user.getId());
                        if (logger.isDebugEnabled()) {
                            logger.debug("Set database context for user: " + username + " (ID: " + user.getId() + ")");
                        }
                    }
                } catch (Exception e) {
                    logger.error("Failed to set database context for user: " + username, e);
                    // Continue processing even if database context setting fails
                }
            }
        }
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            // Clear database context after request processing
            // This ensures context doesn't leak between requests
            try {
                databaseContextService.clearUserContext();
            } catch (Exception e) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Error clearing database context: " + e.getMessage());
                }
            }
        }
    }
}