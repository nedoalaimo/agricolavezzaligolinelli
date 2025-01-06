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
