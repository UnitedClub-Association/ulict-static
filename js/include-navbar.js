// --- File: /js/include-navbar.js ---

document.addEventListener("DOMContentLoaded", function () {
  // 1. Select the EXISTING placeholder div from your index.html
  const navbarPlaceholder = document.getElementById("navbar-placeholder");

  if (navbarPlaceholder) {
    // 2. Fetch navbar.html from the /components/ directory
    fetch("/components/navbar.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for navbar: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        // 3. Correctly insert the HTML into the navbarPlaceholder
        navbarPlaceholder.innerHTML = data;

        // This script is inside navbar.html, so we need to re-run it
        // after the content is loaded.
        const script = document.createElement('script');
        script.src = '/js/navbar.js';
        document.body.appendChild(script);

        // Re-run Feather Icons replacement after new content is added
        if (typeof feather !== 'undefined') {
          feather.replace();
        }
      })
      .catch((error) => {
        console.error("Error loading navbar:", error);
        navbarPlaceholder.innerHTML = "<p style='color:red; text-align:center;'>Failed to load navigation.</p>";
      });
  }
});