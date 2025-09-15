package com.lodh.arte.spring_boot_admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AdminViewExtension implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Add custom view controller for Swagger UI integration
        registry.addViewController("/swagger-ui-custom").setViewName("forward:/custom/swagger-ui-page.html");
    }
}
