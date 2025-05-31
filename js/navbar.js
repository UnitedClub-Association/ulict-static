// Set a flag to prevent multiple initializations
window.navbarInitialized = true;

function initializeNavbar() {
  const navbarToggle = document.querySelector(".navbar__toggle");
  const navbarMenu = document.querySelector(".navbar__menu");
  const dropdowns = document.querySelectorAll(".dropdown");
  const navbar = document.querySelector(".navbar");

  if (!navbarToggle || !navbarMenu || !navbar) {
    console.error("Navbar elements not found");
    return;
  }

  // Toggle menu visibility with animation
  navbarToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    navbarMenu.classList.toggle("active");
    navbarToggle.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Handle dropdowns for mobile
  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector(".navbar__link");
    const menu = dropdown.querySelector(".dropdown__menu");

    if (!link || !menu) return;

    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active");
            const otherMenu = other.querySelector(".dropdown__menu");
            if (otherMenu) otherMenu.style.height = "0";
          }
        });

        // Toggle current dropdown
        dropdown.classList.toggle("active");

        // Animate height
        if (dropdown.classList.contains("active")) {
          menu.style.height = menu.scrollHeight + "px";
        } else {
          menu.style.height = "0";
        }
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      navbarMenu.contains(event.target) || navbarToggle.contains(event.target);

    if (!isClickInside && navbarMenu.classList.contains("active")) {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
      document.body.classList.remove("menu-open");

      // Close all dropdowns
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
        const menu = dropdown.querySelector(".dropdown__menu");
        if (menu) menu.style.height = "0";
      });
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        navbarMenu.classList.remove("active");
        navbarToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("active");
          const menu = dropdown.querySelector(".dropdown__menu");
          if (menu) menu.style.height = "";
        });
      }
    }, 250);
  });

  // Scroll behavior
  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
}

// Initialize navbar when DOM is loaded or when script is executed after DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeNavbar);
} else {
  initializeNavbar();
}
