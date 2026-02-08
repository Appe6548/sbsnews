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
            // Setup theme toggle
            this.setupThemeToggle();

            // Apply initial theme
            this.applyTheme(this.currentTheme);

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
            this.updateToggleButtonIcon(theme);
        }

        setupThemeToggle() {
            const toggleButton = document.querySelector('.theme-toggle-button, .theme-toggle-btn');
            const themeRoot = toggleButton ? toggleButton.closest('.theme-toggle') : null;
            const themeMenu = (themeRoot && themeRoot.querySelector('.theme-menu')) || document.querySelector('.theme-menu');
            const themeOptions = themeMenu ? themeMenu.querySelectorAll('.theme-option') : [];
            let suppressClickUntil = 0;

            if (!toggleButton || !themeMenu || !themeOptions.length) return;

            toggleButton.setAttribute('type', 'button');
            if (!toggleButton.hasAttribute('aria-label')) {
                toggleButton.setAttribute('aria-label', '主题切换');
            }
            toggleButton.setAttribute('aria-haspopup', 'true');
            toggleButton.setAttribute('aria-expanded', 'false');
            this.renderThemeOptionIcons(themeOptions);

            const setMenuOpen = (isOpen) => {
                themeMenu.classList.toggle('active', isOpen);
                toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            };

            const toggleMenu = () => {
                setMenuOpen(!themeMenu.classList.contains('active'));
            };

            const markPointerInteraction = () => {
                suppressClickUntil = Date.now() + 450;
            };

            const isSuppressedClick = () => Date.now() < suppressClickUntil;

            // Toggle menu on button click / touch
            toggleButton.addEventListener('click', (e) => {
                if (isSuppressedClick()) return;
                e.stopPropagation();
                toggleMenu();
            });

            toggleButton.addEventListener('pointerup', (e) => {
                if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
                markPointerInteraction();
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (themeRoot && themeRoot.contains(e.target)) return;
                setMenuOpen(false);
            });

            // Prevent menu from closing when clicking inside
            themeMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Handle theme selection
            const applyThemeSelection = (selectedTheme) => {
                this.saveTheme(selectedTheme);
                this.applyTheme(selectedTheme);
                setMenuOpen(false);
            };

            themeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    if (isSuppressedClick()) return;
                    const selectedTheme = option.getAttribute('data-theme');
                    applyThemeSelection(selectedTheme);
                });

                option.addEventListener('pointerup', (e) => {
                    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
                    markPointerInteraction();
                    e.preventDefault();
                    e.stopPropagation();
                    const selectedTheme = option.getAttribute('data-theme');
                    applyThemeSelection(selectedTheme);
                });
            });

            // Set initial button icon
            this.updateToggleButtonIcon(this.currentTheme);
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

        getThemeIconSvg(theme, size = 16) {
            const common = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"`;

            if (theme === 'light') {
                return `<svg ${common}><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.7v2.1M12 19.2v2.1M4.7 4.7l1.5 1.5M17.8 17.8l1.5 1.5M2.7 12h2.1M19.2 12h2.1M4.7 19.3l1.5-1.5M17.8 6.2l1.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
            }

            if (theme === 'dark') {
                return `<svg ${common}><path d="M15.6 3.4a8.8 8.8 0 1 0 5 15.8 9.1 9.1 0 0 1-5.8-8.6c0-2.7 1.2-5.1 3.1-6.8a8.8 8.8 0 0 0-2.3-.4z" fill="currentColor"/></svg>`;
            }

            return `<svg ${common}><rect x="3.2" y="4.5" width="17.6" height="12" rx="2.2" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 19.5h5M12 16.6v2.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
        }

        renderThemeOptionIcons(themeOptions) {
            themeOptions.forEach(option => {
                const iconHolder = option.querySelector('.theme-icon');
                const theme = option.getAttribute('data-theme');
                if (!iconHolder || !theme) return;
                iconHolder.innerHTML = this.getThemeIconSvg(theme, 16);
            });
        }

        updateToggleButtonIcon(theme) {
            const toggleButton = document.querySelector('.theme-toggle-button, .theme-toggle-btn');
            if (!toggleButton) return;

            const labels = {
                light: '主题切换：浅色模式',
                dark: '主题切换：深色模式',
                system: '主题切换：跟随系统'
            };
            toggleButton.innerHTML = this.getThemeIconSvg(theme, 16);
            toggleButton.setAttribute('aria-label', labels[theme] || labels.system);
            toggleButton.setAttribute('title', labels[theme] || labels.system);
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
