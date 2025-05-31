document.addEventListener("DOMContentLoaded", function () {
  // Create a placeholder element for the navbar
  const navbarPlaceholder = document.createElement("div");
  navbarPlaceholder.id = "navbar-placeholder";
  document.body.prepend(navbarPlaceholder); // Insert at the top of the body

  // Fetch the navbar HTML
  fetch("/components/navbar.html") // Use relative path
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // Insert the navbar HTML into the placeholder
      navbarPlaceholder.innerHTML = data;

      // Inject the logo and text into the navbar
      const logoContainer = document.createElement("a");
      logoContainer.href = "/index.html";
      logoContainer.classList.add("logo-container");

      const logoImg = document.createElement("img");
      logoImg.src = "/images/uca_logo.png";
      logoImg.alt = "UCA Logo";
      logoImg.classList.add("logo-img");

      const logoText = document.createElement("div");
      logoText.classList.add("logo-text");

      const logoTextMain = document.createElement("span");
      logoTextMain.classList.add("logo-text-main");
      logoTextMain.textContent = "UCA";

      const logoTextSub = document.createElement("span");
      logoTextSub.classList.add("logo-text-sub");
      logoTextSub.textContent = "United Club Association";

      // Append elements to the logo container
      logoText.appendChild(logoTextMain);
      logoText.appendChild(logoTextSub);
      logoContainer.appendChild(logoImg);
      logoContainer.appendChild(logoText);

      // Insert the logo container into the navbar
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.prepend(logoContainer);
      }

      // Initialize Feather Icons
      if (window.feather) {
        feather.replace();
      }

      // Load and initialize navbar.js
      if (!window.navbarInitialized) {
        const script = document.createElement("script");
        script.src = "/js/navbar.js";
        script.onload = () => console.log("navbar.js loaded successfully");
        script.onerror = () => console.error("Error loading navbar.js");
        document.head.appendChild(script);
      }
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});
