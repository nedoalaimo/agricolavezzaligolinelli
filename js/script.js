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
