document.addEventListener("DOMContentLoaded", function () {
  // Performance monitoring
  if (window.performance) {
    const timing = performance.timing;
    window.addEventListener('load', () => {
      console.log(`Page load time: ${timing.loadEventEnd - timing.navigationStart}ms`);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Initialize Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace({
      "aria-hidden": "true",
      stroke: getComputedStyle(document.documentElement).getPropertyValue('--primary')
    });
  } else {
    console.warn("Feather Icons script not loaded.");
  }

  // IntersectionObserver for lazy-loading animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.load-anim').forEach(element => {
    observer.observe(element);
  });
});