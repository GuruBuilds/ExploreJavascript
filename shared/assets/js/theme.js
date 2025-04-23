class ThemeManager {
    constructor() {
      this.isDark = localStorage.getItem('theme') === 'dark';
      this.init();
    }
  
    init() {
      this.applyTheme();
      document.body.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggle')) {
          this.toggle();
        }
      });
    }
  
    toggle() {
      this.isDark = !this.isDark;
      this.applyTheme();
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      
      // Reinitialize particles when theme changes
      if (window.particleSystem) {
        particleSystem.init();
      }
    }
  
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
      
      const themeIcon = document.getElementById('themeIcon');
      if (themeIcon) {
        themeIcon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      // Update button colors
      this.updateButtonColors();
    }
  
    updateButtonColors() {
      const buttons = document.querySelectorAll('.btn, .calc-btn, .ctrl-btn');
      buttons.forEach(btn => {
        if (btn.classList.contains('operator')) {
          btn.style.backgroundColor = this.isDark 
            ? 'rgba(166, 110, 250, 0.3)' 
            : 'rgba(108, 92, 231, 0.3)';
        }
        else if (btn.classList.contains('function-btn')) {
          btn.style.backgroundColor = this.isDark 
            ? 'rgba(255, 107, 129, 0.3)' 
            : 'rgba(255, 71, 87, 0.3)';
        }
      });
    }
  }
  
  // Initialize theme manager
  const themeManager = new ThemeManager();