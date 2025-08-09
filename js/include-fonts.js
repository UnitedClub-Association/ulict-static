// include-fonts.js

document.addEventListener("DOMContentLoaded", function () {
  // Create a container in the <head> to hold the font links.
  const fontPlaceholder = document.createElement("div");
  fontPlaceholder.id = "font-placeholder";
  document.head.appendChild(fontPlaceholder);

  // Fetch the contents of font.html.
  fetch("/components/font.html") // Ensure this path is correct for your project structure.
    .then((response) => {
      // If the response is not successful (e.g., 404 Not Found), throw an error.
      if (!response.ok) {
        throw new Error(`Failed to fetch fonts. Status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      // If successful, inject the font links into the placeholder.
      fontPlaceholder.innerHTML = html;
    })
    .catch((error) => {
      // Log the specific error to the console for easier debugging.
      console.error("Error loading fonts:", error);

      // As a fallback, load a reliable default font from Google Fonts.
      const fallbackLink = document.createElement("link");
      fallbackLink.rel = "stylesheet";
      fallbackLink.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
      document.head.appendChild(fallbackLink);
    });
});