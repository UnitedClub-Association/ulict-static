document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the footer
  const footerPlaceholder = document.createElement("div");
  footerPlaceholder.id = "footer-placeholder";
  document.body.appendChild(footerPlaceholder);

  // Fetch the footer HTML
  fetch("/components/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      footerPlaceholder.innerHTML = data;

      // Initialize Feather Icons
      if (typeof feather !== 'undefined') {
        feather.replace({ 'stroke-width': 2, 'stroke': '#FFA500', 'aria-hidden': 'true' });
      }

      // Add current year to copyright text
      const copyrightYear = document.querySelector(".footer-bottom p");
      if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace("2025", currentYear);
      }
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
      footerPlaceholder.innerHTML = `
        <footer style="background: #2E003E; color: #ffbd59; padding: 2rem; text-align: center;">
          <p>© ${new Date().getFullYear()} ULIC. All rights reserved.</p>
        </footer>
      `;
    });
});