(function() {
  'use strict';

  if (window.navbarInitialized) {
    return;
  }
  window.navbarInitialized = true;

  function initializeNavbar() {
    const navbarToggle = document.querySelector(".navbar__toggle");
    const navbarMenu = document.querySelector(".navbar__menu");
    const dropdowns = document.querySelectorAll(".dropdown");
    const navbar = document.querySelector(".navbar");
    const body = document.body;

    if (!navbarToggle || !navbarMenu || !navbar) {
      console.error("Essential navbar elements not found");
      return;
    }

    navbarToggle.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isActive = navbarMenu.classList.contains("active");
      isActive ? closeMenu() : openMenu();
    });

    // Handle close button click
    navbarMenu.addEventListener("click", function(e) {
      if (e.target === navbarMenu || e.target === navbarMenu.querySelector("::before")) {
        closeMenu();
      }
    });

    function openMenu() {
      navbarMenu.classList.add("active");
      navbarToggle.classList.add("active");
      body.classList.add("menu-open");
      navbarToggle.setAttribute("aria-expanded", "true");
      navbarMenu.setAttribute("aria-hidden", "false");
      navbarMenu.focus();
    }

    function closeMenu() {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
      body.classList.remove("menu-open");
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove("active");
        const menu = dropdown.querySelector(".dropdown__menu");
        if (menu) menu.style.maxHeight = "0";
      });
      navbarToggle.setAttribute("aria-expanded", "false");
      navbarMenu.setAttribute("aria-hidden", "true");
    }

    dropdowns.forEach((dropdown) => {
      const link = dropdown.querySelector(".navbar__link");
      const menu = dropdown.querySelector(".dropdown__menu");

      if (!link || !menu) return;

      link.addEventListener("click", function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          const isActive = dropdown.classList.contains("active");
          dropdowns.forEach((other) => {
            if (other !== dropdown) {
              other.classList.remove("active");
              const otherMenu = other.querySelector(".dropdown__menu");
              if (otherMenu) otherMenu.style.maxHeight = "0";
            }
          });
          if (isActive) {
            dropdown.classList.remove("active");
            menu.style.maxHeight = "0";
          } else {
            dropdown.classList.add("active");
            menu.style.maxHeight = menu.scrollHeight + "px";
          }
        }
      });
    });

    document.addEventListener("click", function(event) {
      if (!navbar.contains(event.target) && navbarMenu.classList.contains("active")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && navbarMenu.classList.contains("active")) {
        closeMenu();
        navbarToggle.focus();
      }
    });

    let lastScrollTop = 0;
    let scrollTimeout;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > scrollThreshold) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      lastScrollTop = currentScroll;
    }

    window.addEventListener("scroll", function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
    });

    let resizeTimeout;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (window.innerWidth > 768) {
          closeMenu();
          dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector(".dropdown__menu");
            if (menu) menu.style.maxHeight = "";
          });
        }
      }, 150);
    });

    navbarToggle.setAttribute("aria-expanded", "false");
    navbarToggle.setAttribute("aria-controls", "navbar-menu");
    navbarToggle.setAttribute("aria-label", "Toggle navigation menu");
    navbarMenu.setAttribute("aria-hidden", "true");
    navbarMenu.setAttribute("id", "navbar-menu");
    navbarMenu.setAttribute("tabindex", "-1");

    navbarToggle.addEventListener("focus", function() {
      this.style.outline = "2px solid var(--primary)";
    });

    navbarToggle.addEventListener("blur", function() {
      this.style.outline = "none";
    });

    // Focus trapping
    const focusableElements = navbarMenu.querySelectorAll('a, button, [tabindex]');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navbarMenu.addEventListener("keydown", function(e) {
      if (!navbarMenu.classList.contains("active")) return;
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

    console.log("Enhanced navbar initialized successfully");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNavbar);
  } else {
    initializeNavbar();
  }
})();