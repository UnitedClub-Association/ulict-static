(function() {
  'use strict';

  if (window.navbarInitialized) {
    return;
  }
  window.navbarInitialized = true;

  function initializeNavbar() {
    const mobileToggle = document.querySelector(".navbar--mobile .navbar__toggle");
    const mobileMenu = document.querySelector(".navbar--mobile .navbar__menu");
    const mobileNavbar = document.querySelector(".navbar--mobile");
    const desktopNavbar = document.querySelector(".navbar--desktop");
    const body = document.body;

    if (!mobileToggle || !mobileMenu || !mobileNavbar || !desktopNavbar) {
      console.error("Essential navbar elements not found");
      return;
    }

    // Mobile menu toggle
    mobileToggle.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isActive = mobileMenu.classList.contains("active");
      isActive ? closeMenu() : openMenu();
    });

    // Handle close button click
    mobileMenu.addEventListener("click", function(e) {
      if (e.target === mobileMenu || e.target === mobileMenu.querySelector("::before")) {
        closeMenu();
      }
    });

    function openMenu() {
      mobileMenu.classList.add("active");
      mobileToggle.classList.add("active");
      body.classList.add("menu-open");
      mobileToggle.setAttribute("aria-expanded", "true");
      mobileMenu.setAttribute("aria-hidden", "false");
      mobileMenu.focus();
    }

    function closeMenu() {
      mobileMenu.classList.remove("active");
      mobileToggle.classList.remove("active");
      body.classList.remove("menu-open");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    // Close menu on outside click
    document.addEventListener("click", function(event) {
      if (!mobileNavbar.contains(event.target) && mobileMenu.classList.contains("active")) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu();
        mobileToggle.focus();
      }
    });

    // Scroll behavior for both navbars
    let lastScrollTop = 0;
    let scrollTimeout;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > scrollThreshold) {
        mobileNavbar.classList.add("scrolled");
        desktopNavbar.classList.add("scrolled");
      } else {
        mobileNavbar.classList.remove("scrolled");
        desktopNavbar.classList.remove("scrolled");
      }
      lastScrollTop = currentScroll;
    }

    window.addEventListener("scroll", function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
    });

    // Close mobile menu on resize to desktop
    let resizeTimeout;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      }, 150);
    });

    // Accessibility attributes
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-controls", "mobile-navbar-menu");
    mobileToggle.setAttribute("aria-label", "Toggle navigation menu");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.setAttribute("id", "mobile-navbar-menu");
    mobileMenu.setAttribute("tabindex", "-1");

    mobileToggle.addEventListener("focus", function() {
      this.style.outline = "2px solid var(--primary)";
    });

    mobileToggle.addEventListener("blur", function() {
      this.style.outline = "none";
    });

    // Focus trapping for mobile menu
    const focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener("keydown", function(e) {
      if (!mobileMenu.classList.contains("active")) return;
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    console.log("Dual navbar initialized successfully");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNavbar);
  } else {
    initializeNavbar();
  }
})();