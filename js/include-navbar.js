document.addEventListener("DOMContentLoaded", function () {
  // Check if navbar is already included to prevent duplication
  if (document.getElementById("navbar-placeholder")) {
    console.log("Navbar already included, skipping re-injection.");
    return;
  }

  // Create a placeholder element for the navbar
  const navbarPlaceholder = document.createElement("div");
  navbarPlaceholder.id = "navbar-placeholder";
  document.body.prepend(navbarPlaceholder); // Insert at the top of the body

  // Fetch the navbar HTML
  fetch("/components/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // Insert the navbar HTML into the placeholder
      navbarPlaceholder.innerHTML = data;

      // Initialize Feather Icons
      if (window.feather) {
        feather.replace();
      }

      // Load and initialize navbar.js only if not already initialized
      if (!window.navbarInitialized) {
        const script = document.createElement("script");
        script.src = "/js/navbar.js";
        script.onload = () => console.log("navbar.js loaded successfully");
        script.onerror = () => console.error("Error loading navbar.js");
        document.head.appendChild(script);
      } else {
        console.log("navbar.js already initialized, skipping reload.");
      }
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});