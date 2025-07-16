document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-items a');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Theme management
  class ThemeManager {
    constructor() {
      this.themes = {
        light: { name: '白天模式', icon: '☀️' },
        dark: { name: '夜间模式', icon: '🌙' },
        system: { name: '根据系统选择', icon: '💻' }
      };
      
      this.currentTheme = this.getStoredTheme();
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
      this.setupThemeToggle();
      this.setupSystemThemeListener();
    }

    getStoredTheme() {
      const stored = localStorage.getItem('theme');
      if (stored && Object.keys(this.themes).includes(stored)) {
        return stored;
      }
      return 'system'; // Default to system preference
    }

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
      let actualTheme = theme;
      if (theme === 'system') {
        actualTheme = this.getSystemTheme();
      }

      // Remove existing theme
      document.documentElement.removeAttribute('data-theme');
      
      // Apply new theme
      if (actualTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      // Dark theme is default (no attribute needed)

      this.currentTheme = theme;
      localStorage.setItem('theme', theme);
      this.updateToggleButton();
    }

    setupThemeToggle() {
      const themeToggle = document.querySelector('.theme-toggle');
      if (!themeToggle) return;

      const toggleBtn = themeToggle.querySelector('.theme-toggle-btn');
      const dropdown = themeToggle.querySelector('.theme-dropdown');

      // Toggle dropdown
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.remove('show');
      });

      // Theme selection
      themeToggle.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const theme = option.dataset.theme;
          this.applyTheme(theme);
          dropdown.classList.remove('show');
        });
      });

      this.updateToggleButton();
    }

    updateToggleButton() {
      const currentThemeData = this.themes[this.currentTheme];
      const toggleBtn = document.querySelector('.theme-toggle-btn');
      
      if (toggleBtn && currentThemeData) {
        toggleBtn.innerHTML = `${currentThemeData.icon} ${currentThemeData.name}`;
      }

      // Update active state in dropdown
      document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === this.currentTheme) {
          option.classList.add('active');
        }
      });
    }

    setupSystemThemeListener() {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(() => {
        if (this.currentTheme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  // Initialize theme manager
  new ThemeManager();
});
