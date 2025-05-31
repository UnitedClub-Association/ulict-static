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
});