// Spring Boot Admin Custom View for Swagger UI
// Following the official SBA documentation patterns

const SwaggerUIView = {
  template: `
    <div class="swagger-ui-container">
      <div class="swagger-ui-header">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <div class="swagger-ui-controls">
          <button @click="refreshSpec" class="btn btn-primary" :disabled="loading">
            <i class="fa fa-refresh" :class="{ 'fa-spin': loading }"></i> Refresh
          </button>
          <button @click="toggleFullscreen" class="btn btn-secondary">
            <i class="fa fa-expand"></i> Fullscreen
          </button>
        </div>
      </div>
      <div v-if="loading" class="swagger-ui-loading">
        Loading API documentation...
      </div>
      <div v-else-if="error" class="alert alert-danger">
        <h4>Error</h4>
        <p>{{ error }}</p>
        <button @click="initializeSwaggerUI" class="btn btn-primary">Retry</button>
      </div>
      <div ref="swaggerContainer" id="swagger-ui" class="swagger-ui-content"></div>
    </div>
  `,
  data() {
    return {
      title: 'API Documentation',
      description: 'Interactive API documentation powered by Swagger UI',
      isFullscreen: false,
      loading: true,
      error: null
    };
  },
  props: ['instance'], // Optional prop for instance-level views
  async mounted() {
    console.log('[SwaggerUI] Component mounted, starting initialization...');
    // Wait for Vue to finish rendering the DOM
    await this.$nextTick();
    console.log('[SwaggerUI] DOM update completed, initializing Swagger UI...');
    
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(async () => {
      await this.initializeSwaggerUI();
    }, 100);
  },
  methods: {

    async initializeSwaggerUI() {
      try {
        console.log('[SwaggerUI] Starting Swagger UI initialization...');
        this.loading = true;
        this.error = null;
        
        // Load Swagger UI configuration from backend
        console.log('[SwaggerUI] Fetching Swagger UI configuration...');
        let configResponse;
        if (this.instance && this.instance.axios) {
          console.log('[SwaggerUI] Using instance axios for config request');
          configResponse = await this.instance.axios.get('/actuator/swaggeruiconfig');
        } else {
          console.log('[SwaggerUI] Using direct fetch for config request');
          const response = await fetch('/actuator/swaggeruiconfig');
          configResponse = { data: await response.json() };
        }
        const config = configResponse.data;
        console.log('[SwaggerUI] Configuration received:', config);

        this.title = config.title;
        this.description = config.description;
        console.log('[SwaggerUI] Title and description set:', this.title, this.description);

        // Get the container element
        console.log('[SwaggerUI] Looking for swagger-ui container...');
        let swaggerContainer = this.$refs.swaggerContainer;
        
        // If container not found, try to find it with a retry mechanism
        if (!swaggerContainer) {
          console.log('[SwaggerUI] Container not found immediately, retrying...');
          // Wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 200));
          swaggerContainer = this.$refs.swaggerContainer;
        }
        
        if (!swaggerContainer) {
          console.error('[SwaggerUI] Swagger UI container not found after retry!');
          console.log('[SwaggerUI] Available elements with id containing "swagger":', 
            Array.from(document.querySelectorAll('[id*="swagger"]')).map(el => el.id));
          console.log('[SwaggerUI] All elements with id:', 
            Array.from(document.querySelectorAll('[id]')).map(el => el.id));
          console.log('[SwaggerUI] Vue component refs:', Object.keys(this.$refs || {}));
          this.error = 'Swagger UI container not found - Vue ref "swaggerContainer" is missing';
          this.loading = false;
          return;
        }
        console.log('[SwaggerUI] Container found, clearing previous content');
        swaggerContainer.innerHTML = '';

        // Load Swagger UI libraries
        console.log('[SwaggerUI] Loading Swagger UI libraries...');
        await this.loadSwaggerUILibraries();
        console.log('[SwaggerUI] Swagger UI libraries loaded successfully');

        // Fetch the OpenAPI specification from the URL
        console.log('[SwaggerUI] Fetching OpenAPI specification from:', config.url);
        const specResponse = await fetch(config.url);
        if (!specResponse.ok) {
          throw new Error(`Failed to fetch OpenAPI spec: ${specResponse.status} ${specResponse.statusText}`);
        }
        const openApiSpec = await specResponse.json();
        console.log('[SwaggerUI] OpenAPI specification fetched successfully');

        // Initialize Swagger UI Bundle with the fetched spec
        console.log('[SwaggerUI] Initializing Swagger UI Bundle...');
        await this.initializeSwaggerUIBundle(openApiSpec, swaggerContainer);
        console.log('[SwaggerUI] Swagger UI initialization completed successfully');

      } catch (error) {
        console.error('[SwaggerUI] Error initializing Swagger UI:', error);
        this.error = 'Error loading API documentation: ' + error.message;
        this.loading = false;
      }
    },

    async loadSwaggerUILibraries() {
      return new Promise((resolve, reject) => {
        console.log('[SwaggerUI] Checking if Swagger UI libraries are already loaded...');
        // Check if Swagger UI is already loaded
        if (window.SwaggerUIBundle) {
          console.log('[SwaggerUI] SwaggerUIBundle already loaded, skipping library loading');
          resolve();
          return;
        }

        console.log('[SwaggerUI] SwaggerUIBundle not found, loading libraries...');
        
        // Load Swagger UI CSS
        if (!document.querySelector('link[href*="swagger-ui"]')) {
          console.log('[SwaggerUI] Loading Swagger UI CSS...');
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.type = 'text/css';
          cssLink.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
          document.head.appendChild(cssLink);
          console.log('[SwaggerUI] CSS link added to document head');
        } else {
          console.log('[SwaggerUI] Swagger UI CSS already loaded');
        }

        // Load Swagger UI JavaScript bundle
        console.log('[SwaggerUI] Loading Swagger UI JavaScript bundle...');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          console.log('[SwaggerUI] Swagger UI bundle loaded successfully');
          // Load standalone preset
          console.log('[SwaggerUI] Loading Swagger UI standalone preset...');
          const presetScript = document.createElement('script');
          presetScript.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js';
          presetScript.crossOrigin = 'anonymous';
          presetScript.onload = () => {
            console.log('[SwaggerUI] Swagger UI standalone preset loaded successfully');
            resolve();
          };
          presetScript.onerror = (error) => {
            console.error('[SwaggerUI] Failed to load standalone preset:', error);
            reject(error);
          };
          document.head.appendChild(presetScript);
        };
        script.onerror = (error) => {
          console.error('[SwaggerUI] Failed to load Swagger UI bundle:', error);
          reject(error);
        };
        document.head.appendChild(script);
        console.log('[SwaggerUI] Swagger UI bundle script added to document head');
      });
    },

    async initializeSwaggerUIBundle(openApiSpec, container) {
      try {
        console.log('[SwaggerUI] Initializing Swagger UI Bundle with OpenAPI spec');
        console.log('[SwaggerUI] Container element:', container);
        console.log('[SwaggerUI] Available window objects:', {
          SwaggerUIBundle: !!window.SwaggerUIBundle,
          SwaggerUIStandalonePreset: !!window.SwaggerUIStandalonePreset
        });
        
        // Initialize Swagger UI using the documented approach
        console.log('[SwaggerUI] Creating Swagger UI Bundle instance...');
        window.ui = window.SwaggerUIBundle({
          spec: openApiSpec,
          dom_id: '#swagger-ui',
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIStandalonePreset
          ],
          layout: "StandaloneLayout",
          deepLinking: true,
          showExtensions: true,
          showCommonExtensions: true,
          onComplete: () => {
            console.log('[SwaggerUI] Swagger UI Bundle initialization completed successfully');
            this.loading = false;
          },
          onFailure: (error) => {
            console.error('[SwaggerUI] Failed to load Swagger UI:', error);
            this.error = 'Failed to load API documentation';
            this.loading = false;
          }
        });
        console.log('[SwaggerUI] Swagger UI Bundle instance created and assigned to window.ui');
      } catch (error) {
        console.error('[SwaggerUI] Error initializing Swagger UI Bundle:', error);
        this.error = 'Error initializing API documentation: ' + error.message;
        this.loading = false;
      }
    },

    refreshSpec() {
      console.log('[SwaggerUI] Refreshing Swagger UI specification...');
      this.initializeSwaggerUI();
    },

    toggleFullscreen() {
      console.log('[SwaggerUI] Toggling fullscreen mode...');
      const container = document.querySelector('.swagger-ui-container');
      if (!this.isFullscreen) {
        console.log('[SwaggerUI] Entering fullscreen mode');
        container.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
      } else {
        console.log('[SwaggerUI] Exiting fullscreen mode');
        container.classList.remove('fullscreen');
        document.body.style.overflow = '';
      }
      this.isFullscreen = !this.isFullscreen;
    }
  }
};

// Add CSS styles for the Swagger UI container
const style = document.createElement('style');
style.textContent = `
  .swagger-ui-content {
    width: 100%;
    min-height: 600px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
  }
  
  .swagger-ui-container.fullscreen .swagger-ui-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: white;
    border: none;
    border-radius: 0;
  }
  
  .swagger-ui-container.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    background: white;
  }
  
  .swagger-ui-loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  
  .swagger-ui-header {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;
  }
  
  .swagger-ui-header h2 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  .swagger-ui-header p {
    margin: 0 0 15px 0;
    color: #666;
  }
  
  .swagger-ui-controls {
    display: flex;
    gap: 10px;
  }
`;
document.head.appendChild(style);

// Register the custom view with Spring Boot Admin
console.log('[SwaggerUI] Registering custom view with Spring Boot Admin...');
SBA.use({
  install({ viewRegistry, vueI18n }) {
    console.log('[SwaggerUI] Installing Swagger UI view extension...');
    // Register as an instance detail view that appears in the sidebar
    viewRegistry.addView({
      name: 'swagger-ui',
      parent: 'instances',
      path: 'swagger-ui',
      component: SwaggerUIView,
      label: 'API Documentation',
      group: 'Details',
      order: 1000,
      isEnabled: ({ instance }) => {
        console.log('[SwaggerUI] Checking if view should be enabled for instance:', instance);
        // Enable this view if the instance has our custom endpoints
        const hasSwaggerConfig = instance.hasEndpoint('swaggeruiconfig');
        const hasOpenAPI = instance.hasEndpoint('openapi');
        const enabled = hasSwaggerConfig || hasOpenAPI;
        console.log('[SwaggerUI] View enabled:', enabled, '(swaggeruiconfig:', hasSwaggerConfig, ', openapi:', hasOpenAPI, ')');
        return enabled;
      }
    });
    console.log('[SwaggerUI] View registered successfully');

    // Add i18n translations if vueI18n is available
    if (vueI18n && vueI18n.mergeLocaleMessage) {
      console.log('[SwaggerUI] Adding i18n translations...');
      vueI18n.mergeLocaleMessage('en', {
        sidebar: {
          swaggerUi: "API Documentation"
        }
      });
      console.log('[SwaggerUI] i18n translations added');
    } else {
      console.log('[SwaggerUI] vueI18n not available, skipping translations');
    }
    console.log('[SwaggerUI] Swagger UI view extension installation completed');
  }
});
