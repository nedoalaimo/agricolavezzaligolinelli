// Navigation configurations
const navConfigs = {
    home: `
        <ul class="nav-links">
            <li><a href="#azienda">AZIENDA</a></li>
            <li><a href="#tour">TOUR ED EVENTI</a></li>
            <li><a href="#prodotti">PRODOTTI</a></li>
            <li><a href="#contatti">CONTATTI</a></li>
        </ul>
    `,
    other: `
        <ul class="nav-links">
            <li><a href="index.html#azienda">AZIENDA</a></li>
            <li><a href="tour_ed_eventi.html">TOUR ED EVENTI</a></li>
            <li><a href="index.html#prodotti">PRODOTTI</a></li>
            <li><a href="index.html#contatti">CONTATTI</a></li>
        </ul>
    `
};

// Load templates
async function loadTemplate(templateName) {
    try {
        const response = await fetch(`templates/${templateName}.html`);
        return await response.text();
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
        return '';
    }
}

async function loadTemplates() {
    // Get header and footer content
    const headerContent = await loadTemplate('header');
    const footerContent = await loadTemplate('footer');

    // Insert header and footer
    $('#header-placeholder').html(headerContent);
    $('#footer-placeholder').html(footerContent);

    // Determine which navigation to use
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/');
    const navContent = isHomePage ? navConfigs.home : navConfigs.other;

    // Insert the appropriate navigation
    $('#nav-placeholder').html(navContent);

    // Initialize all functionality after templates are loaded
    initializeAll();
}

function initializeAll() {
    initializeMobileMenu();
    initializeScrollEffects();
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuBtn = $('.menu-btn');
    const navLinks = $('.nav-links');
    const menuIcon = $('.menu-btn i');

    // Function to close mobile menu
    function closeMobileMenu() {
        navLinks.removeClass('active');
        menuIcon.removeClass('fa-times').addClass('fa-bars');
        $('body').css('overflow', '');
    }

    // Toggle menu on button click
    menuBtn.on('click', function() {
        navLinks.toggleClass('active');
        
        // Toggle menu icon
        if (menuIcon.hasClass('fa-bars')) {
            menuIcon.removeClass('fa-bars').addClass('fa-times');
        } else {
            menuIcon.removeClass('fa-times').addClass('fa-bars');
        }
        
        // Toggle body scroll
        $('body').css('overflow', navLinks.hasClass('active') ? 'hidden' : '');
    });

    // Close menu when clicking any navigation link
    $('.nav-links a').on('click', function() {
        closeMobileMenu();
    });
}

// Initialize scroll effects and smooth scrolling
function initializeScrollEffects() {
    const header = $('.main-header');
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/');

    // Smooth scrolling for anchor links on homepage using event delegation
    if (isHomePage) {
        $(document).on('click', '.nav-links a[href^="#"], .btn-scroll', function(e) {
            e.preventDefault();
            
            const targetId = $(this).attr('href');
            const target = $(targetId);
            
            if (target.length) {
                const headerHeight = header.outerHeight();
                const targetPosition = target.offset().top - headerHeight;
                
                $('html, body').stop().animate({
                    scrollTop: targetPosition
                }, {
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: function() {
                        // Update URL hash after animation completes
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        } else {
                            location.hash = targetId;
                        }
                    }
                });
            }
        });
    }

    // Add jQuery easing function if not exists
    if (typeof $.easing.easeInOutQuad !== 'function') {
        $.extend($.easing, {
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            }
        });
    }

    // Handle header color change on scroll
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    });

    // Handle active navigation items
    if (isHomePage) {
        $(window).on('scroll', function() {
            let scrollDistance = $(window).scrollTop();
            
            $('.section').each(function(i) {
                if ($(this).position().top - header.outerHeight() <= scrollDistance) {
                    $('.nav-links a.active').removeClass('active');
                    $('.nav-links a').eq(i).addClass('active');
                }
            });
        });
    }
}

// Initialize everything when DOM is ready
$(document).ready(function() {
    loadTemplates();
});

// Cookie Consent Implementation
const cookieConsent = {
    settings: {
        essential: true, // Always true and cannot be changed
        analytics: false,
        marketing: false
    },
    
    init() {
        // Load saved settings if they exist
        const savedSettings = this.loadSettings();
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
            this.applySettings();
        } else {
            this.showModal();
        }
        this.createSettingsButton();
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <h2>Impostazioni Cookie</h2>
                <p>Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Seleziona le tue preferenze:</p>
                
                <div class="cookie-options">
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" checked disabled>
                            <span>Cookie Essenziali</span>
                        </label>
                        <p>Necessari per il funzionamento del sito. Non possono essere disattivati.</p>
                    </div>
                    
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" id="analytics-cookies" ${this.settings.analytics ? 'checked' : ''}>
                            <span>Cookie Analitici</span>
                        </label>
                        <p>Ci aiutano a migliorare il sito analizzando il suo utilizzo.</p>
                    </div>
                    
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" id="marketing-cookies" ${this.settings.marketing ? 'checked' : ''}>
                            <span>Cookie Marketing</span>
                        </label>
                        <p>Utilizzati per personalizzare gli annunci in base ai tuoi interessi.</p>
                    </div>
                </div>

                <div class="cookie-modal-footer">
                    <a href="./privacy-policy.html" class="privacy-link">Privacy Policy</a>
                    <div class="cookie-buttons">
                        <button id="accept-all">Accetta Tutti</button>
                        <button id="save-preferences">Salva Preferenze</button>
                        <button id="reject-all">Rifiuta Tutti</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.bindEvents(modal);
    },

    bindEvents(modal) {
        document.getElementById('accept-all').addEventListener('click', () => {
            this.acceptAll();
            this.hideModal();
        });

        document.getElementById('reject-all').addEventListener('click', () => {
            this.rejectAll();
            this.hideModal();
        });

        document.getElementById('save-preferences').addEventListener('click', () => {
            this.savePreferences();
            this.hideModal();
        });

        // Update settings when checkboxes change
        document.getElementById('analytics-cookies').addEventListener('change', (e) => {
            this.settings.analytics = e.target.checked;
        });

        document.getElementById('marketing-cookies').addEventListener('change', (e) => {
            this.settings.marketing = e.target.checked;
        });
    },

    showModal() {
        this.createModal();
        document.getElementById('cookie-modal').style.display = 'flex';
        document.body.classList.add('cookie-modal-open');
    },

    hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.remove();
        }
        document.body.classList.remove('cookie-modal-open');
    },

    createSettingsButton() {
        const button = document.createElement('button');
        button.id = 'cookie-settings-button';
        button.innerHTML = '<i class="fas fa-cookie-bite"></i>';
        button.title = 'Impostazioni Cookie';
        button.onclick = () => this.showModal();
        document.body.appendChild(button);
    },

    acceptAll() {
        this.settings.analytics = true;
        this.settings.marketing = true;
        this.saveSettings();
        this.applySettings();
    },

    rejectAll() {
        this.settings.analytics = false;
        this.settings.marketing = false;
        this.saveSettings();
        this.applySettings();
    },

    savePreferences() {
        this.saveSettings();
        this.applySettings();
    },

    saveSettings() {
        const data = {
            settings: this.settings,
            timestamp: new Date().getTime()
        };
        
        // Save to localStorage
        localStorage.setItem('cookieConsent', JSON.stringify(data));
        
        // Set actual cookies
        this.setCookie('essential', 'true', 180); // Essential cookies always set
        this.setCookie('analytics', this.settings.analytics.toString(), 180);
        this.setCookie('marketing', this.settings.marketing.toString(), 180);
    },

    loadSettings() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) return null;
        
        const { settings, timestamp } = JSON.parse(consent);
        const sixMonths = 180 * 24 * 60 * 60 * 1000; // 180 days in milliseconds
        
        // Check if consent is older than 6 months
        if (new Date().getTime() - timestamp > sixMonths) {
            localStorage.removeItem('cookieConsent');
            this.deleteAllCookies();
            return null;
        }
        
        return settings;
    },

    applySettings() {
        // Initialize analytics if enabled
        if (this.settings.analytics) {
            this.initializeAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Initialize marketing cookies if enabled
        if (this.settings.marketing) {
            this.initializeMarketing();
        } else {
            this.disableMarketing();
        }
    },

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;Secure;SameSite=Strict";
    },

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure;SameSite=Strict';
    },

    deleteAllCookies() {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            this.deleteCookie(name.trim());
        }
    },

    initializeAnalytics() {
        // Example: Initialize Google Analytics
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    },

    disableAnalytics() {
        // Example: Disable Google Analytics
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    },

    initializeMarketing() {
        // Example: Enable marketing cookies
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
    },

    disableMarketing() {
        // Example: Disable marketing cookies
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
    }
};

// Initialize cookie consent on page load
window.addEventListener('load', () => {
    cookieConsent.init();
});
