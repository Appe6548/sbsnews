// Theme management system
(function() {
    'use strict';

    const THEME_KEY = 'mmc-theme-preference';
    const DEFAULT_THEME = 'system';

    class ThemeManager {
        constructor() {
            this.currentTheme = this.loadTheme();
            this.init();
        }

        init() {
            // Apply initial theme
            this.applyTheme(this.currentTheme);

            // Setup theme toggle
            this.setupThemeToggle();

            // Listen for system theme changes
            this.listenForSystemThemeChanges();
        }

        loadTheme() {
            return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        }

        saveTheme(theme) {
            localStorage.setItem(THEME_KEY, theme);
            this.currentTheme = theme;
        }

        applyTheme(theme) {
            const root = document.documentElement;
            
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            } else {
                root.setAttribute('data-theme', theme);
            }

            // Update active state in menu
            this.updateActiveMenuItem(theme);
        }

        setupThemeToggle() {
            const toggleButton = document.querySelector('.theme-toggle-button');
            const themeMenu = document.querySelector('.theme-menu');
            const themeOptions = document.querySelectorAll('.theme-option');

            if (!toggleButton || !themeMenu) return;

            // Toggle menu on button click
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                themeMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', () => {
                themeMenu.classList.remove('active');
            });

            // Prevent menu from closing when clicking inside
            themeMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Handle theme selection
            themeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedTheme = option.getAttribute('data-theme');
                    this.saveTheme(selectedTheme);
                    this.applyTheme(selectedTheme);
                    themeMenu.classList.remove('active');
                    this.updateToggleButtonText(selectedTheme);
                });
            });

            // Set initial button text
            this.updateToggleButtonText(this.currentTheme);
        }

        updateActiveMenuItem(theme) {
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                if (option.getAttribute('data-theme') === theme) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }

        updateToggleButtonText(theme) {
            const toggleButton = document.querySelector('.theme-toggle-button');
            if (!toggleButton) return;

            const themeIcons = {
                'light': '☀️',
                'dark': '🌙',
                'system': '💻'
            };

            toggleButton.textContent = themeIcons[theme] || '💻';
        }

        listenForSystemThemeChanges() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'system') {
                    this.applyTheme('system');
                }
            });
        }
    }

    // Initialize theme manager when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ThemeManager();
        });
    } else {
        new ThemeManager();
    }

    // Smooth page transitions
    document.addEventListener('DOMContentLoaded', () => {
        // Add smooth transitions to all internal links
        const internalLinks = document.querySelectorAll('a[href^="/"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's an anchor link or external link
                if (href.startsWith('#') || this.target === '_blank') {
                    return;
                }
                
                // Add fade-out effect before navigation
                e.preventDefault();
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });

        // Fade in on page load
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

})();
