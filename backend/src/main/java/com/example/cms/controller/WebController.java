package com.example.cms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for serving the frontend application.
 * Forwards all non-API requests to index.html for React Router to handle.
 */
@Controller
public class WebController {

    /**
     * Forward all non-API requests to index.html
     * This allows React Router to handle client-side routing
     */
    @GetMapping(value = {
            "/",
            "/login",
            "/signup",
            "/test-credentials",
            "/dashboard/**",
            "/sectors/**",
            "/banking/**",
            "/healthcare/**",
            "/logistics/**",
            "/content/**",
            "/about",
            "/docs",
            "/documentation"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
