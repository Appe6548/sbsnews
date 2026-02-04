// Theme management system
(function() {
    'use strict';

    const THEME_KEY = 'mmc-theme-preference';
    const DEFAULT_THEME = 'system';
    const VALID_THEMES = new Set(['light', 'dark', 'system']);

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
            const stored = localStorage.getItem(THEME_KEY);
            if (stored && VALID_THEMES.has(stored)) return stored;

            // Legacy key used by older pages/scripts in this repo.
            const legacy = localStorage.getItem('theme');
            if (legacy && VALID_THEMES.has(legacy)) return legacy;

            return DEFAULT_THEME;
        }

        saveTheme(theme) {
            if (!VALID_THEMES.has(theme)) return;
            localStorage.setItem(THEME_KEY, theme);
            // Write legacy key for compatibility.
            localStorage.setItem('theme', theme);
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
            
            const handler = () => {
                if (this.currentTheme === 'system') this.applyTheme('system');
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handler);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handler);
            }
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
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Liquid Glass: subtle nav compression on scroll + specular highlight tracking.
        const root = document.documentElement;
        const updateScrollState = () => {
            root.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        updateScrollState();
        window.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState, { passive: true });

        const supportsFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
        if (!prefersReducedMotion && supportsFinePointer) {
            root.style.setProperty('--lg-pointer-x', '50%');
            root.style.setProperty('--lg-pointer-y', '20%');

            let raf = 0;
            let lastX = 0;
            let lastY = 0;

            const commitPointer = () => {
                raf = 0;
                const x = Math.max(0, Math.min(100, Math.round((lastX / window.innerWidth) * 100)));
                const y = Math.max(0, Math.min(100, Math.round((lastY / window.innerHeight) * 100)));
                root.style.setProperty('--lg-pointer-x', `${x}%`);
                root.style.setProperty('--lg-pointer-y', `${y}%`);
            };

            window.addEventListener('pointermove', (e) => {
                lastX = e.clientX;
                lastY = e.clientY;
                if (raf) return;
                raf = window.requestAnimationFrame(commitPointer);
            }, { passive: true });
        }

        if (prefersReducedMotion) return;

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
