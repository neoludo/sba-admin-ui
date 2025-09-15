# Custom Swagger UI Integration for Spring Boot Admin

This project demonstrates how to integrate a custom Vue.js-based Swagger UI view into Spring Boot Admin, allowing you to display interactive API documentation from provisioned OpenAPI contracts.

## Features

- **Custom Vue.js Component**: A reusable Vue.js component that integrates Swagger UI
- **Dynamic OpenAPI Loading**: Fetches OpenAPI specifications from your backend
- **Responsive Design**: Mobile-friendly interface that adapts to different screen sizes
- **Fullscreen Mode**: Toggle between normal and fullscreen viewing modes
- **Spring Boot Admin Integration**: Seamlessly integrates with the existing Spring Boot Admin UI
- **Customizable Styling**: CSS that matches Spring Boot Admin's theme

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/lodh/arte/spring_boot_admin/
│   │       ├── config/
│   │       │   └── AdminUIConfiguration.java      # Web configuration for static resources
│   │       ├── controller/
│   │       │   ├── OpenAPIController.java         # REST endpoints for OpenAPI specs
│   │       │   └── SwaggerUIController.java       # Controller for custom Swagger UI page
│   │       └── SpringBootAdminApplication.java    # Main application class
│   └── resources/
│       ├── static/
│       │   └── custom/
│       │       ├── swagger-ui-view.js             # Vue.js component
│       │       ├── swagger-ui-styles.css          # Custom CSS styles
│       │       └── swagger-ui-page.html           # HTML template
│       └── application.properties                 # Application configuration
└── test/
```

## Getting Started

### 1. Dependencies

The following dependencies have been added to `pom.xml`:

- `spring-boot-admin-server-ui`: For UI customization
- `springdoc-openapi-starter-webmvc-ui`: For OpenAPI/Swagger support
- `spring-boot-starter-web`: For REST controller support

### 2. Configuration

The application is configured with the following key properties in `application.properties`:

```properties
# OpenAPI/Swagger configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.try-it-out-enabled=true

# Custom Swagger UI configuration
swagger-ui.title=Spring Boot Admin API
swagger-ui.description=Interactive API documentation for Spring Boot Admin
swagger-ui.version=1.0.0
```

### 3. Running the Application

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### 4. Accessing the Custom Swagger UI

Once the application is running, you can access the custom Swagger UI at:

- **Custom Swagger UI**: http://localhost:8080/swagger-ui/custom
- **Standard Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/openapi.json
- **Swagger UI Config**: http://localhost:8080/api/swagger-ui-config

## API Endpoints

### OpenAPI Controller (`/api`)

- `GET /api/openapi.json`: Returns the OpenAPI specification
- `GET /api/swagger-ui-config`: Returns configuration for the Swagger UI

### Swagger UI Controller (`/swagger-ui`)

- `GET /swagger-ui/custom`: Serves the custom Vue.js-based Swagger UI
- `GET /swagger-ui/`: Redirects to the custom Swagger UI

## Customization

### Adding Your Own OpenAPI Specification

To use your own OpenAPI specification, modify the `OpenAPIController.java`:

```java
@GetMapping("/openapi.json")
public OpenAPI getOpenAPISpec() {
    // Load your OpenAPI spec from file, database, or external service
    // Return your custom OpenAPI object
}
```

### Styling Customization

The CSS styles are located in `src/main/resources/static/custom/swagger-ui-styles.css`. You can customize:

- Colors and themes
- Layout and spacing
- Responsive breakpoints
- Animation effects

### Vue.js Component Customization

The Vue.js component is in `src/main/resources/static/custom/swagger-ui-view.js`. You can extend it with:

- Additional controls and buttons
- Custom validation logic
- Integration with other APIs
- Enhanced error handling

## Integration with Spring Boot Admin

The custom Swagger UI integrates with Spring Boot Admin through:

1. **Static Resource Configuration**: Custom CSS and JavaScript files are served through Spring Boot Admin's static resource handling
2. **Theme Integration**: CSS variables are used to match Spring Boot Admin's theme
3. **Navigation**: The custom view can be accessed through Spring Boot Admin's navigation system

## Advanced Features

### Fullscreen Mode

The Vue.js component includes a fullscreen toggle that allows users to view the API documentation in fullscreen mode for better readability.

### Dynamic Refresh

Users can refresh the OpenAPI specification without reloading the entire page, ensuring they always see the latest API documentation.

### Error Handling

The component includes comprehensive error handling for:
- Network failures
- Invalid OpenAPI specifications
- Missing configuration

### Responsive Design

The interface adapts to different screen sizes, providing an optimal viewing experience on desktop, tablet, and mobile devices.

## Troubleshooting

### Common Issues

1. **Swagger UI not loading**: Check that all static resources are properly configured in `AdminUIConfiguration.java`
2. **OpenAPI spec not found**: Verify that the `OpenAPIController` is properly mapped and accessible
3. **Styling issues**: Ensure the custom CSS is loaded after the Swagger UI CSS

### Debug Mode

Enable debug logging by setting:

```properties
logging.level.com.lodh.arte.spring_boot_admin=DEBUG
logging.level.org.springframework.web=DEBUG
```

## Contributing

To extend this implementation:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

