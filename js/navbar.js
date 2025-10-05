(function() {
    'use strict';

    if (window.enhancedNavbarScriptInitialized) {
        return;
    }
    window.enhancedNavbarScriptInitialized = true;

    const initializeEnhancedNavbar = () => {
        const header = document.querySelector('.navbar-header');
        
        // --- 1. Hide header on scroll down, show on scroll up (Desktop & Mobile) ---
        if (header) {
            let lastScrollTop = 0;
            window.addEventListener("scroll", function() {
               let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
               if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight){
                 // Scroll Down
                 header.style.top = `-${header.offsetHeight}px`;
               } else {
                 // Scroll Up
                 header.style.top = "0";
               }
               lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, { passive: true });
        }

        // --- 2. Mobile menu toggle functionality ---
        const mobileMenuContainer = document.querySelector('.nav-menu-mobile-group');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

        if (mobileMenuToggle && mobileMenuContainer) {
            mobileMenuToggle.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from bubbling up to the document
                const isOpen = mobileMenuContainer.classList.toggle('is-open');
                mobileMenuToggle.setAttribute('aria-expanded', isOpen);
                
                // Change icon on toggle
                const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = isOpen ? 'close' : 'menu';
                }
            });

            // --- 3. Close mobile menu when clicking outside ---
            document.addEventListener('click', (event) => {
                const isOpen = mobileMenuContainer.classList.contains('is-open');
                // If menu is open and the click is outside the menu container
                if (isOpen && !mobileMenuContainer.contains(event.target)) {
                    mobileMenuContainer.classList.remove('is-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.textContent = 'menu';
                    }
                }
            });
        }
    };

    // Run the initialization function when the DOM is ready
    document.addEventListener('DOMContentLoaded', initializeEnhancedNavbar);

})();
