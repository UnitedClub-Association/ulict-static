// include-fonts.js
document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the fonts
  const fontPlaceholder = document.createElement("div");
  fontPlaceholder.id = "font-placeholder";
  document.head.appendChild(fontPlaceholder); // Insert into the <head>

  // Fetch the font HTML
  fetch("/components/font.html") // Use relative path
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      // Insert the font HTML into the placeholder
      fontPlaceholder.innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading fonts:", error);
      // Add fallback font loading if needed
      const fallbackLink = document.createElement("link");
      fallbackLink.rel = "stylesheet";
      fallbackLink.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
      document.head.appendChild(fallbackLink);
    });
});
