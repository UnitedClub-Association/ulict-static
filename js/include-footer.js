// --- File: /js/include-footer.js ---

document.addEventListener("DOMContentLoaded", function () {
  // 1. Select the EXISTING placeholder div from index.html
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    // 2. Fetch footer.html from the /components/ directory
    fetch("/components/footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for footer: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        // 3. Correctly insert the HTML into the footer placeholder
        footerPlaceholder.innerHTML = data;

        // Re-run Feather Icons replacement after new content is added
        if (typeof feather !== 'undefined') {
          feather.replace();
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
        footerPlaceholder.innerHTML = `<p style='color:red; text-align:center;'>Failed to load footer.</p>`;
      });
  }
});