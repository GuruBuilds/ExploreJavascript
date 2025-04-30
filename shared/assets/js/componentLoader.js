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

    static async loadHeader(icon = 'code', title = 'App', isHome = false) {
      const headerHtml = await this.loadComponent('header');
      document.body.insertAdjacentHTML('afterbegin', headerHtml);      
      const titleContainer = document.getElementById('titleContainer');
      if (isHome) {
        titleContainer.innerHTML = `
          <h1 class="title">
            <i class="fas fa-${icon}"></i>
            <span class="title-text">${title}</span>
          </h1>
        `;
      } else {
        titleContainer.innerHTML = `
          <a href="/JavaScriptProjectHub/" class="title-link">
            <h1 class="title">
              <i class="fas fa-${icon}"></i>
              <span class="title-text">${title}</span>
              <span class="back-arrow">← Back</span>
            </h1>
          </a>
        `;
      }
    }
  
    static async loadFooter() {
      const footerHtml = await this.loadComponent('footer');
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
  }