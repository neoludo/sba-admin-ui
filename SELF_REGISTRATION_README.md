# Spring Boot Admin Self-Registration Configuration

This document explains how the Spring Boot Admin application is configured to register itself as a client to the Spring Boot Admin server.

## 🎯 Configuration Overview

The application is now configured to act as both:
1. **Spring Boot Admin Server** - Monitors other applications
2. **Spring Boot Admin Client** - Registers itself for monitoring

## 📋 What's Been Configured

### 1. **Dependencies Added**

```xml
<!-- Spring Boot Admin Client for self-registration -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
```

### 2. **Application Properties Configuration**

```properties
# Spring Boot Admin Client configuration (self-registration)
spring.boot.admin.client.url=http://localhost:9080
spring.boot.admin.client.instance.name=Spring Boot Admin Server
spring.boot.admin.client.instance.service-url=http://localhost:9080
spring.boot.admin.client.instance.management-url=http://localhost:9080/actuator
spring.boot.admin.client.instance.health-url=http://localhost:9080/actuator/health
```

### 3. **Actuator Endpoints Configuration**

```properties
# Actuator configuration for custom endpoints
management.endpoints.web.exposure.include=health,info,swaggeruiconfig,openapi
management.endpoint.health.show-details=always
```

### 4. **Custom Endpoint Fixes**

- Fixed endpoint ID from `swagger-ui-config` to `swaggeruiconfig` (removed invalid characters)
- Updated all references to use the correct endpoint names

## 🚀 How It Works

### **Self-Registration Process**

1. **Application Starts**: Spring Boot Admin server starts on port 9080
2. **Client Registration**: The client component automatically registers the server instance with itself
3. **Monitoring**: The server monitors itself as a client application
4. **Custom Views**: The custom Swagger UI views become available for the self-registered instance

### **Registration Details**

- **Instance Name**: "Spring Boot Admin Server"
- **Service URL**: http://localhost:9080
- **Management URL**: http://localhost:9080/actuator
- **Health URL**: http://localhost:9080/actuator/health

## 🎨 Custom Views Available

Once the application is running, you'll see:

### **1. Top-Level View**
- **Location**: Main navigation bar
- **Name**: "API Documentation"
- **Purpose**: Shows global API documentation for the admin server

### **2. Instance-Level View**
- **Location**: Sidebar for the self-registered instance
- **Name**: "API Docs" (under "Custom" group)
- **Purpose**: Shows instance-specific API documentation

## 🔧 Testing the Configuration

### **1. Start the Application**
```bash
mvn spring-boot:run
```

### **2. Access Spring Boot Admin**
- **URL**: http://localhost:9080
- **Expected**: Spring Boot Admin UI with the server instance listed

### **3. Verify Self-Registration**
- Look for "Spring Boot Admin Server" in the applications list
- The instance should show as "UP" with health status

### **4. Test Custom Views**
- **Top-Level**: Click "API Documentation" in main navigation
- **Instance-Level**: Click on the server instance → Look for "API Docs" in sidebar

### **5. Test Endpoints**
```bash
# Health endpoint
curl http://localhost:9080/actuator/health

# Custom Swagger UI config
curl http://localhost:9080/actuator/swaggeruiconfig

# OpenAPI specification
curl http://localhost:9080/actuator/openapi
```

## 🎯 Benefits of Self-Registration

1. **Self-Monitoring**: The admin server can monitor its own health and metrics
2. **Custom Views**: Access to custom Swagger UI views for the server itself
3. **Unified Interface**: All monitoring in one place
4. **Development Testing**: Easy way to test custom views and endpoints

## 🔍 Troubleshooting

### **Application Not Starting**
- Check if port 9080 is available
- Verify all dependencies are properly added
- Check logs for any configuration errors

### **Self-Registration Not Working**
- Verify the client URL matches the server port
- Check that actuator endpoints are exposed
- Ensure the client dependency is included

### **Custom Views Not Appearing**
- Verify the endpoint IDs are correct (no hyphens)
- Check that the JavaScript files are in the correct location
- Ensure the endpoints are exposed in actuator configuration

## 📚 Configuration Reference

### **Key Properties**
- `spring.boot.admin.client.url`: URL of the admin server
- `spring.boot.admin.client.instance.name`: Name of the registered instance
- `spring.boot.admin.client.instance.service-url`: Service URL of the instance
- `spring.boot.admin.client.instance.management-url`: Management endpoint URL
- `spring.boot.admin.client.instance.health-url`: Health endpoint URL

### **Actuator Endpoints**
- `/actuator/health`: Health status
- `/actuator/info`: Application information
- `/actuator/swaggeruiconfig`: Swagger UI configuration
- `/actuator/openapi`: OpenAPI specification

This configuration allows the Spring Boot Admin server to monitor itself while providing custom Swagger UI views for API documentation! 🎉

