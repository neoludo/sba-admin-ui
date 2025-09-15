package com.lodh.arte.spring_boot_admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/swagger-ui")
public class SwaggerUIController {

    @GetMapping("/custom")
    public String customSwaggerUI() {
        return "forward:/custom/swagger-ui-page.html";
    }
    
    @GetMapping("/")
    public String swaggerUIRedirect() {
        return "redirect:/swagger-ui/custom";
    }
}

