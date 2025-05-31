document.addEventListener("DOMContentLoaded", function () {
  // Performance monitoring
  if (window.performance) {
    const timing = performance.timing;
    window.addEventListener('load', () => {
      console.log(`Page load time: ${timing.loadEventEnd - timing.navigationStart}ms`);
    });
  }

  // CSS animations triggered by IntersectionObserver
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !prefersReducedMotion.matches) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '20px'
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });

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