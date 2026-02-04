package com.example.cms.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName();
    }

    /** Used by audit + entities */
    public static Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return 0L; // system / batch
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails user) {
            // adapt if your UserDetails exposes ID
            try {
                return (Long) user.getClass().getMethod("getId").invoke(user);
            } catch (Exception e) {
                return 0L;
            }
        }
        return 0L;
    }

    /** Safe for tests */
    public static String clientIp() {
        return "SYSTEM";
    }
}
