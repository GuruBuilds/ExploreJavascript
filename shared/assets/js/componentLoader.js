class ComponentLoader {
    static async loadComponent(componentName, replacements = {}) {
      try {
        const response = await fetch(`../shared/components/${componentName}.html`);
        if (!response.ok) throw new Error('Component not found');
        
        let html = await response.text();
        
        // Apply replacements
        for (const [key, value] of Object.entries(replacements)) {
          html = html.replace(new RegExp(`\\\${${key}}`, 'g'), value);
        }
        return html;
      } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        return `<div class="error">Error loading ${componentName} component</div>`;
      }
    }
  
    static async loadHeader(icon = 'code', title = 'App') {
      const headerHtml = await this.loadComponent('header', {
        APP_ICON: icon,
        APP_TITLE: title
      });
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }
  
    static async loadFooter() {
      const footerHtml = await this.loadComponent('footer');
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
  }