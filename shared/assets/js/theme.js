class ThemeManager {
  constructor() {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.init();
  }

  init() {
    this.applyTheme();
    document.addEventListener('click', (e) => {
      if (e.target.closest('#themeToggle')) this.toggle();
    });
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    if (window.particleSystem) particleSystem.updateColors();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

const themeManager = new ThemeManager();