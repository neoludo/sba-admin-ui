package com.lodh.arte.spring_boot_admin.controller;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.stereotype.Component;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OpenAPIController {

    @GetMapping("/openapi.json")
    public OpenAPI getOpenAPISpec() {
        OpenAPI openAPI = new OpenAPI();
        
        // Basic API information
        openAPI.setInfo(new Info()
                .title("Spring Boot Admin API")
                .description("API documentation for Spring Boot Admin with custom Swagger UI")
                .version("1.0.0")
                .contact(new Contact()
                        .name("Spring Boot Admin Team")
                        .email("admin@example.com"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT")));
        
        // Server information
        openAPI.setServers(List.of(
                new Server().url("http://localhost:8080").description("Development server"),
                new Server().url("https://api.example.com").description("Production server")
        ));
        
        // Add example API paths
        Paths paths = new Paths();
        paths.addPathItem("/api/health", createHealthEndpoint());
        paths.addPathItem("/api/status", createStatusEndpoint());
        paths.addPathItem("/api/swagger-ui-config", createSwaggerUIConfigEndpoint());
        openAPI.setPaths(paths);
        
        return openAPI;
    }
    
    private PathItem createHealthEndpoint() {
        Operation operation = new Operation()
                .summary("Health Check")
                .description("Returns the health status of the application")
                .responses(new ApiResponses()
                        .addApiResponse("200", new ApiResponse()
                                .description("Application is healthy")
                                .content(new Content()
                                        .addMediaType("application/json", new MediaType()
                                                .schema(new StringSchema().example("{\"status\":\"UP\"}"))))));
        
        return new PathItem().get(operation);
    }
    
    private PathItem createStatusEndpoint() {
        Operation operation = new Operation()
                .summary("Application Status")
                .description("Returns detailed status information about the application")
                .responses(new ApiResponses()
                        .addApiResponse("200", new ApiResponse()
                                .description("Status information retrieved successfully")
                                .content(new Content()
                                        .addMediaType("application/json", new MediaType()
                                                .schema(new StringSchema().example("{\"status\":\"UP\",\"uptime\":\"2h 30m\"}"))))));
        
        return new PathItem().get(operation);
    }
    
    private PathItem createSwaggerUIConfigEndpoint() {
        Operation operation = new Operation()
                .summary("Swagger UI Configuration")
                .description("Returns configuration for the Swagger UI")
                .responses(new ApiResponses()
                        .addApiResponse("200", new ApiResponse()
                                .description("Configuration retrieved successfully")
                                .content(new Content()
                                        .addMediaType("application/json", new MediaType()
                                                .schema(new StringSchema().example("{\"url\":\"/api/openapi.json\",\"title\":\"Spring Boot Admin API\"}"))))));
        
        return new PathItem().get(operation);
    }
    
    @GetMapping("/swagger-ui-config")
    public SwaggerUIConfig getSwaggerUIConfig() {
        return new SwaggerUIConfig(
                "/api/openapi.json",
                "Spring Boot Admin API",
                "Custom Swagger UI for Spring Boot Admin"
        );
    }
    
    // Configuration class for Swagger UI
    public static class SwaggerUIConfig {
        private String url;
        private String title;
        private String description;
        
        public SwaggerUIConfig(String url, String title, String description) {
            this.url = url;
            this.title = title;
            this.description = description;
        }
        
        // Getters
        public String getUrl() { return url; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
    }
    
    // Actuator endpoints for Spring Boot Admin custom view detection
    @Component
    @Endpoint(id = "swaggeruiconfig")
    public static class SwaggerUIConfigEndpoint {
        
        @ReadOperation
        public SwaggerUIConfig getSwaggerUIConfig() {
            return new SwaggerUIConfig(
                    "/api/openapi.json",
                    "Spring Boot Admin API",
                    "Custom Swagger UI for Spring Boot Admin"
            );
        }
    }
    
    @Component
    @Endpoint(id = "openapi")
    public static class OpenAPIEndpoint {
        
        @ReadOperation
        public OpenAPI getOpenAPISpec() {
            OpenAPI openAPI = new OpenAPI();
            
            // Basic API information
            openAPI.setInfo(new Info()
                    .title("Spring Boot Admin API")
                    .description("API documentation for Spring Boot Admin with custom Swagger UI")
                    .version("1.0.0")
                    .contact(new Contact()
                            .name("Spring Boot Admin Team")
                            .email("admin@example.com"))
                    .license(new License()
                            .name("MIT License")
                            .url("https://opensource.org/licenses/MIT")));
            
            // Server information
            openAPI.setServers(List.of(
                    new Server().url("http://localhost:8080").description("Development server"),
                    new Server().url("https://api.example.com").description("Production server")
            ));
            
            // Add example API paths
            Paths paths = new Paths();
            paths.addPathItem("/api/health", createHealthEndpoint());
            paths.addPathItem("/api/status", createStatusEndpoint());
            paths.addPathItem("/api/swagger-ui-config", createSwaggerUIConfigEndpoint());
            openAPI.setPaths(paths);
            
            return openAPI;
        }
        
        private PathItem createHealthEndpoint() {
            Operation operation = new Operation()
                    .summary("Health Check")
                    .description("Returns the health status of the application")
                    .responses(new ApiResponses()
                            .addApiResponse("200", new ApiResponse()
                                    .description("Application is healthy")
                                    .content(new Content()
                                            .addMediaType("application/json", new MediaType()
                                                    .schema(new StringSchema().example("{\"status\":\"UP\"}"))))));
            
            return new PathItem().get(operation);
        }
        
        private PathItem createStatusEndpoint() {
            Operation operation = new Operation()
                    .summary("Application Status")
                    .description("Returns detailed status information about the application")
                    .responses(new ApiResponses()
                            .addApiResponse("200", new ApiResponse()
                                    .description("Status information retrieved successfully")
                                    .content(new Content()
                                            .addMediaType("application/json", new MediaType()
                                                    .schema(new StringSchema().example("{\"status\":\"UP\",\"uptime\":\"2h 30m\"}"))))));
            
            return new PathItem().get(operation);
        }
        
        private PathItem createSwaggerUIConfigEndpoint() {
            Operation operation = new Operation()
                    .summary("Swagger UI Configuration")
                    .description("Returns configuration for the Swagger UI")
                    .responses(new ApiResponses()
                            .addApiResponse("200", new ApiResponse()
                                    .description("Configuration retrieved successfully")
                                    .content(new Content()
                                            .addMediaType("application/json", new MediaType()
                                                    .schema(new StringSchema().example("{\"url\":\"/api/openapi.json\",\"title\":\"Spring Boot Admin API\"}"))))));
            
            return new PathItem().get(operation);
        }
    }
}
