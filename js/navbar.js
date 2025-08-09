(function() {
    'use strict';

    // Prevent re-initialization if the script is loaded multiple times by include-navbar.js
    if (window.navbarScriptInitialized) {
        return;
    }
    window.navbarScriptInitialized = true;

    // --- Main Function to Initialize All Navbar Logic ---
    const initializeNavbar = () => {
        // --- Feather Icons ---
        // Initialize Feather Icons if the library is present
        if (typeof feather !== 'undefined') {
            feather.replace({ 'stroke-width': 1.5 });
        }

        // --- Desktop Navbar Logic ---
        const desktopNavbar = document.querySelector('.navbar--desktop');
        if (desktopNavbar) {
            // Dropdown radial gradient effect
            const dropdowns = document.querySelectorAll('.navbar--desktop .dropdown__menu');
            dropdowns.forEach(menu => {
                menu.addEventListener('mousemove', e => {
                    const rect = menu.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    menu.style.setProperty('--x', `${x}px`);
                    menu.style.setProperty('--y', `${y}px`);
                });
            });

            // GSAP Intro Animation for desktop
            if (typeof gsap !== 'undefined') {
                gsap.from('.navbar--desktop .logo-container', { duration: 1, x: -100, opacity: 0, ease: 'power3.out' });
                gsap.from('.navbar--desktop .navbar__item', { duration: 0.8, y: -50, opacity: 0, stagger: 0.1, ease: 'power3.out', delay: 0.4 });
            }
        
            // Hide navbar on scroll down, show on scroll up
            let lastScrollTop = 0;
            window.addEventListener("scroll", function() {
               let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
               if (currentScroll > lastScrollTop && currentScroll > desktopNavbar.offsetHeight){
                 // Scroll Down
                 desktopNavbar.style.top = `-${desktopNavbar.offsetHeight}px`;
               } else {
                 // Scroll Up
                 desktopNavbar.style.top = "0";
               }
               lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, false);
        }


        // --- Mobile Navbar Logic ---
        const body = document.body;
        const mobileToggle = document.querySelector('.navbar__toggle');
        const mobileMenuContainer = document.querySelector('.mobile-menu__container');
        const mobileLinks = document.querySelectorAll('.navbar__item--mobile');

        if (mobileToggle && mobileMenuContainer) {
            const toggleMenu = () => {
                const isActive = mobileMenuContainer.classList.contains('active');
                
                body.classList.toggle('mobile-menu-active');
                mobileToggle.classList.toggle('active');
                mobileMenuContainer.classList.toggle('active');

                // Animate links based on menu state
                if (!isActive) { // If menu is OPENING
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: mobileLinks,
                            translateY: [30, 0],
                            opacity: [0, 1],
                            delay: anime.stagger(80, {start: 300}),
                            easing: 'easeOutExpo'
                        });
                    }
                } else { // If menu is CLOSING
                     if (typeof anime !== 'undefined') {
                        // Instantly hide links to prepare for next opening animation
                        anime({
                            targets: mobileLinks,
                            opacity: 0,
                            duration: 0
                        });
                    }
                }
            };

            // Attach the event listener to the hamburger button
            mobileToggle.addEventListener('click', toggleMenu);
        }
    };

    // Since this script is loaded after the navbar HTML is injected,
    // we can run the initialization logic directly.
    initializeNavbar();

})();
