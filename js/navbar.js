(function() {
    'use strict';

    if (window.enhancedNavbarScriptInitialized) {
        return;
    }
    window.enhancedNavbarScriptInitialized = true;

    const initializeEnhancedNavbar = () => {
        const header = document.querySelector('.navbar-header');
        
        // --- 1. Auto-Highlight Active Link Logic ---
        const highlightActiveLink = () => {
            const currentPath = window.location.pathname;
            
            // Normalize path (handle trailing slashes or index.html)
            const normalize = (path) => path.replace(/\/$/, '') || '/';
            const currentNorm = normalize(currentPath);

            const allLinks = document.querySelectorAll('.nav-link, .sidebar-link, .dropdown-menu a, .sidebar-dropdown-menu a');
            
            allLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (!linkHref || linkHref.startsWith('http') || linkHref === '#') return;

                const linkNorm = normalize(linkHref);

                // Exact match or if we are in a sub-section
                if (linkNorm === currentNorm || (currentNorm.length > 1 && currentNorm.includes(linkNorm) && linkNorm !== '/')) {
                    link.classList.add('active');
                    
                    // If it's a mobile submenu link, highlight parent accordion
                    const parentDropdown = link.closest('.sidebar-dropdown');
                    if (parentDropdown) {
                        parentDropdown.classList.add('active-parent');
                    }
                    
                    // If it's a desktop dropdown link, highlight parent nav-link
                    const desktopGroup = link.closest('.nav-item-group');
                    if (desktopGroup) {
                        const trigger = desktopGroup.querySelector('.nav-link');
                        if (trigger) trigger.classList.add('active');
                    }
                }
            });
        };
        highlightActiveLink();

        // --- 2. Hide header on scroll down, show on scroll up ---
        if (header) {
            let lastScrollTop = 0;
            window.addEventListener("scroll", function() {
               let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
               if (Math.abs(lastScrollTop - currentScroll) <= 5) return;

               // Hide only if we've scrolled down past the header height
               if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight){
                   header.style.top = `-${header.offsetHeight}px`;
               } else {
                   header.style.top = "0";
               }
               lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, { passive: true });
        }

        // --- 3. Mobile Full-Screen Overlay Logic ---
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebarWrapper = document.querySelector('.sidebar-wrapper');
        const sidebarItems = document.querySelectorAll('.sidebar-item-anim');
        const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('span') : null;

        const toggleSidebar = () => {
            const isOpen = sidebarWrapper.classList.toggle('is-open');
            
            // Toggle Icon: Menu <-> Close
            if (menuIcon) {
                menuIcon.textContent = isOpen ? 'close' : 'menu';
                // Add rotation effect
                menuIcon.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; // Bouncy
                menuIcon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
                menuIcon.style.color = isOpen ? '#FDBA74' : ''; // Apricot when active
            }

            // Lock body scroll
            document.body.style.overflow = isOpen ? 'hidden' : '';
            
            if (isOpen) {
                // Staggered Animation for Items
                sidebarItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'none';
                    
                    // Trigger reflow
                    void item.offsetWidth;
                    
                    // Add transition with delay
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 150 + (index * 70));
                });
            } else {
                // Reset immediately on close
                setTimeout(() => {
                   if(!sidebarWrapper.classList.contains('is-open')) {
                        sidebarItems.forEach(item => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px)';
                        });
                   }
                }, 400);
            }

            if(mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        };
        
        if (mobileMenuToggle && sidebarWrapper) {
            mobileMenuToggle.addEventListener('click', toggleSidebar);
        }

        // --- 4. Mobile Accordion Logic ---
        const dropdowns = document.querySelectorAll('.sidebar-dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.sidebar-link');
            
            if (link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Close all others
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('is-open');
                        }
                    });
                    
                    // Toggle clicked
                    dropdown.classList.toggle('is-open');
                });
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnhancedNavbar);
    } else {
        initializeEnhancedNavbar();
    }

})();