document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the footer
  const footerPlaceholder = document.createElement("div");
  footerPlaceholder.id = "footer-placeholder";
  document.body.appendChild(footerPlaceholder); // Insert at the bottom of the body

  // Fetch the footer HTML
  fetch("/components/footer.html") // Use relative path
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      // Insert the footer HTML into the placeholder
      footerPlaceholder.innerHTML = data;
      
      // Initialize Feather Icons if available
      if (typeof feather !== 'undefined') {
        feather.replace({
          'aria-hidden': 'true'
        });
      }
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
      
      // Create a simple fallback footer if the main one fails to load
      footerPlaceholder.innerHTML = `
        <footer style="background-color: #1a1e2e; color: #e0e6ed; padding: 2rem; text-align: center;">
          <p>&copy; 2025 UCA. All rights reserved.</p>
        </footer>
      `;
    });
});
