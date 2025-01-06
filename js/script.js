$(document).ready(function() {
    const header = $('.main-header');
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        
        const target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });

    // Add active class to navigation items and handle header color on scroll
    $(window).scroll(function() {
        let scrollDistance = $(window).scrollTop();
        
        // Handle header color change
        if (scrollDistance > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }

        // Handle active navigation items
        $('.section').each(function(i) {
            if ($(this).position().top <= scrollDistance + 100) {
                $('.nav-links a.active').removeClass('active');
                $('.nav-links a').eq(i).addClass('active');
            }
        });
    }).scroll();

    // Fade in sections on scroll
    $(window).scroll(function() {
        $('.section').each(function() {
            const bottom_of_object = $(this).offset().top + $(this).outerHeight();
            const bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if(bottom_of_window > bottom_of_object) {
                $(this).animate({'opacity':'1'}, 500);
            }
        });
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-btn i');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle menu icon with transition
            if (menuIcon.classList.contains('fa-bars')) {
                menuIcon.classList.remove('fa-bars');
                void menuIcon.offsetWidth; // Trigger reflow for smooth transition
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                void menuIcon.offsetWidth; // Trigger reflow for smooth transition
                menuIcon.classList.add('fa-bars');
            }
            
            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                void menuIcon.offsetWidth; // Trigger reflow for smooth transition
                menuIcon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }
});

// Handle scroll events for header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
