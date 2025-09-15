package com.lodh.arte.spring_boot_admin.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = OpenAPIController.class)
@ContextConfiguration(classes = {OpenAPIController.class})
class OpenAPIControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetOpenAPISpec() throws Exception {
        mockMvc.perform(get("/api/openapi.json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.info.title").value("Spring Boot Admin API"))
                .andExpect(jsonPath("$.info.version").value("1.0.0"))
                .andExpect(jsonPath("$.servers").isArray());
    }

    @Test
    void testGetSwaggerUIConfig() throws Exception {
        mockMvc.perform(get("/api/swagger-ui-config"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.url").value("/api/openapi.json"))
                .andExpect(jsonPath("$.title").value("Spring Boot Admin API"))
                .andExpect(jsonPath("$.description").value("Custom Swagger UI for Spring Boot Admin"));
    }
}
