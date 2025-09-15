# Spring Boot Admin Custom View Integration

This project demonstrates how to integrate Swagger UI as a proper custom view in Spring Boot Admin, following the official [Spring Boot Admin documentation](https://docs.spring-boot-admin.com/2.7.14/#customizing-custom-views).

## 🎯 What's Been Implemented

### 1. **Proper Spring Boot Admin Custom View Structure**

Following the official documentation, the custom view is now properly integrated using:

- **Extension Directory**: `/META-INF/spring-boot-admin-server-ui/extensions/`
- **SBA.use() Pattern**: Proper view registration using the official API
- **Actuator Endpoints**: Custom endpoints for view detection and data

### 2. **Two Types of Custom Views**

#### **Instance-Level View** (`swagger-ui-view.js`)
- Appears in the sidebar for each application instance
- Shows API documentation specific to that instance
- Uses the instance's axios client for API calls
- Only appears when the instance has the required endpoints

#### **Top-Level View** (`swagger-ui-top-level.js`)
- Appears as a main navigation item
- Shows global API documentation
- Accessible from the main navigation bar

### 3. **Custom Actuator Endpoints**

The implementation includes custom actuator endpoints that Spring Boot Admin can detect:

- **`/actuator/swagger-ui-config`**: Returns Swagger UI configuration
- **`/actuator/openapi`**: Returns the OpenAPI specification

## 📁 Project Structure

```
src/main/resources/
├── META-INF/
│   └── spring-boot-admin-server-ui/
│       └── extensions/
│           ├── swagger-ui-view.js          # Instance-level view
│           ├── swagger-ui-top-level.js     # Top-level view
│           ├── swagger-ui-styles.css       # Custom styles
│           └── routes.txt                  # Route configuration
└── application.properties                  # Actuator endpoint configuration
```

## 🚀 How It Works

### 1. **View Registration**

The custom views are registered using the official Spring Boot Admin pattern:

```javascript
SBA.use({
  install({ viewRegistry, vueI18n }) {
    viewRegistry.addView({
      name: 'swagger-ui',
      parent: 'instances',  // For instance-level view
      path: 'swagger-ui',
      component: SwaggerUIView,
      label: 'API Docs',
      group: 'custom',
      order: 1000,
      isEnabled: ({ instance }) => {
        return instance.hasEndpoint('swagger-ui-config') || 
               instance.hasEndpoint('openapi');
      }
    });
  }
});
```

### 2. **Endpoint Detection**

Spring Boot Admin automatically detects the custom endpoints:

```java
@Component
@Endpoint(id = "swagger-ui-config")
public static class SwaggerUIConfigEndpoint {
    @ReadOperation
    public SwaggerUIConfig getSwaggerUIConfig() {
        // Returns configuration for Swagger UI
    }
}
```

### 3. **Dynamic View Enabling**

The view only appears when the instance has the required endpoints:

```javascript
isEnabled: ({ instance }) => {
  return instance.hasEndpoint('swagger-ui-config') || 
         instance.hasEndpoint('openapi');
}
```

## 🎨 Features

### **Instance-Level View**
- ✅ **Dynamic Loading**: Loads API docs specific to each instance
- ✅ **Instance Context**: Uses the instance's axios client for API calls
- ✅ **Conditional Display**: Only shows when endpoints are available
- ✅ **Grouped Navigation**: Appears in the "Custom" group in the sidebar

### **Top-Level View**
- ✅ **Global Access**: Available from main navigation
- ✅ **Server-Level Docs**: Shows documentation for the admin server itself
- ✅ **Always Available**: No conditional display requirements

### **Common Features**
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Fullscreen Mode**: Toggle for better viewing experience
- ✅ **Error Handling**: Comprehensive error handling and retry functionality
- ✅ **Loading States**: Visual feedback during API loading
- ✅ **Theme Integration**: Matches Spring Boot Admin's theme

## 🔧 Configuration

### **Actuator Endpoints**

The following endpoints are exposed for the custom view:

```properties
management.endpoints.web.exposure.include=health,info,swagger-ui-config,openapi
management.endpoint.health.show-details=always
```

### **Custom Endpoints**

- **`/actuator/swagger-ui-config`**: Returns Swagger UI configuration
- **`/actuator/openapi`**: Returns the OpenAPI specification
- **`/api/swagger-ui-config`**: REST endpoint for configuration
- **`/api/openapi.json`**: REST endpoint for OpenAPI spec

## 🎯 Usage

### **Running the Application**

```bash
mvn spring-boot:run
```

### **Accessing the Custom Views**

1. **Instance-Level View**:
   - Navigate to any application instance
   - Look for "API Docs" in the sidebar under "Custom" group
   - Click to view the instance-specific API documentation

2. **Top-Level View**:
   - Look for "API Documentation" in the main navigation
   - Click to view the global API documentation

### **Testing the Endpoints**

You can test the custom endpoints directly:

```bash
# Get Swagger UI configuration
curl http://localhost:8080/actuator/swagger-ui-config

# Get OpenAPI specification
curl http://localhost:8080/actuator/openapi

# Get REST API configuration
curl http://localhost:8080/api/swagger-ui-config

# Get REST API OpenAPI spec
curl http://localhost:8080/api/openapi.json
```

## 🎨 Customization

### **Styling**

The custom styles are in `swagger-ui-styles.css` and can be customized:

- Colors and themes
- Layout and spacing
- Responsive breakpoints
- Animation effects

### **API Documentation**

To customize the API documentation, modify the `OpenAPIEndpoint` class:

```java
@Component
@Endpoint(id = "openapi")
public static class OpenAPIEndpoint {
    @ReadOperation
    public OpenAPI getOpenAPISpec() {
        // Customize your OpenAPI specification here
    }
}
```

### **View Configuration**

To modify the view behavior, edit the JavaScript files:

- **Instance view**: `swagger-ui-view.js`
- **Top-level view**: `swagger-ui-top-level.js`

## 🔍 Troubleshooting

### **View Not Appearing**

1. Check that the actuator endpoints are exposed:
   ```properties
   management.endpoints.web.exposure.include=swagger-ui-config,openapi
   ```

2. Verify the endpoints are accessible:
   ```bash
   curl http://localhost:8080/actuator/swagger-ui-config
   ```

3. Check browser console for JavaScript errors

### **API Documentation Not Loading**

1. Verify the OpenAPI endpoint is working:
   ```bash
   curl http://localhost:8080/actuator/openapi
   ```

2. Check that Swagger UI resources are loaded
3. Verify the API URL in the configuration

## 📚 References

- [Spring Boot Admin Custom Views Documentation](https://docs.spring-boot-admin.com/2.7.14/#customizing-custom-views)
- [Spring Boot Actuator Endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## 🎉 Benefits of This Approach

1. **Official Integration**: Uses the official Spring Boot Admin extension mechanism
2. **Automatic Detection**: Spring Boot Admin automatically detects and enables the view
3. **Instance Context**: Each instance gets its own API documentation view
4. **Proper Theming**: Integrates seamlessly with Spring Boot Admin's UI
5. **Extensible**: Easy to add more custom views following the same pattern
6. **Maintainable**: Follows established patterns and best practices

This implementation provides a robust, maintainable, and properly integrated Swagger UI experience within Spring Boot Admin! 🚀

