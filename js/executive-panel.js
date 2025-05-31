document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace({
      'stroke-width': 2,
      'color': 'currentColor',
      'size': 20
    });
  }
  
  // Update the current date display
  updateCurrentDate();
  
  // Calculate and update the timeline progress
  updateTimelineProgress();
  
  // Add animation to timeline items
  animateTimelineItems();
  
  // Initialize filtering functionality
  initializeFiltering();
  
  // Add smooth animation to executive cards
  animateExecutiveCards();
  
  // Fix any layout issues after images load
  fixLayoutAfterImagesLoad();
  
  // Add hover effects to cards
  addCardHoverEffects();
});

/**
 * Calculates and updates the timeline progress bar based on current date
 */
function updateTimelineProgress() {
  const progressBar = document.getElementById('timeline-progress');
  if (!progressBar) return;
  
  // Define start and end dates for the current council term
  const startDate = new Date('2024-10-10');
  const endDate = new Date('2025-12-31');
  const currentDate = new Date();
  
  // Calculate progress percentage
  let progressPercentage = 0;
  if (currentDate >= startDate && currentDate <= endDate) {
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    progressPercentage = (elapsedDuration / totalDuration) * 100;
  } else if (currentDate > endDate) {
    progressPercentage = 100;
  }
  
  // Apply the progress with a smooth animation
  setTimeout(() => {
    progressBar.style.width = `${progressPercentage}%`;
  }, 300);
}

/**
 * Updates the current date display in the timeline
 */
function updateCurrentDate() {
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
  }
}

/**
 * Adds animation to timeline items when they come into view
 */
function animateTimelineItems() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe each timeline item
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

/**
 * Initializes the filtering functionality for executive cards
 */
function initializeFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const executiveCards = document.querySelectorAll('.executive-card');
  
  if (!filterButtons.length || !executiveCards.length) return;
  
  // Set initial state - ensure all cards are visible
  executiveCards.forEach(card => {
    card.style.display = 'block';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter cards with staggered animation
      let visibleIndex = 0;
      
      executiveCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          
          // Reset opacity and transform first to prepare for animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Add a small delay for a staggered animation effect
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50 * visibleIndex);
          
          visibleIndex++;
        } else {
          // Fade out before hiding
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Hide after animation completes
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Animates executive cards with a staggered entrance effect
 */
function animateExecutiveCards() {
  const executiveCards = document.querySelectorAll('.executive-card');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the index for staggered animation
        const index = Array.from(executiveCards).indexOf(entry.target);
        
        // Add animation with delay based on index
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100 * (index % 8)); // Modulo to keep delays reasonable
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Set initial styles and observe each card
  executiveCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

/**
 * Fixes layout issues after all images have loaded
 */
function fixLayoutAfterImagesLoad() {
  const images = document.querySelectorAll('.card-image img');
  let loadedImages = 0;
  
  if (!images.length) return;
  
  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === images.length) {
          // All images loaded, fix any layout issues
          equalizeCardHeights();
        }
      });
      
      // Handle image loading errors
      img.addEventListener('error', () => {
        loadedImages++;
        // Replace with placeholder if image fails to load
        img.src = '/images/placeholder-logo.jpg';
        
        if (loadedImages === images.length) {
          equalizeCardHeights();
        }
      });
    }
  });
  
  // If all images were already loaded
  if (loadedImages === images.length) {
    equalizeCardHeights();
  }
  
  // Add resize handler for responsive layout
  window.addEventListener('resize', debounce(equalizeCardHeights, 250));
}

/**
 * Equalizes the heights of cards in the same row
 */
function equalizeCardHeights() {
  const executiveCards = document.querySelectorAll('.executive-card');
  if (!executiveCards.length) return;
  
  // Reset heights first
  executiveCards.forEach(card => {
    card.style.height = 'auto';
  });
  
  // Get the computed style of the first card to determine grid properties
  const firstCard = executiveCards[0];
  const cardStyle = window.getComputedStyle(firstCard);
  const cardWidth = firstCard.offsetWidth;
  const containerWidth = firstCard.parentElement.offsetWidth;
  
  // Calculate how many cards fit in a row
  const cardsPerRow = Math.floor(containerWidth / cardWidth);
  
  if (cardsPerRow <= 1) {
    // On mobile, don't equalize heights
    return;
  }
  
  // Group cards by rows
  for (let i = 0; i < executiveCards.length; i += cardsPerRow) {
    const rowCards = Array.from(executiveCards).slice(i, i + cardsPerRow);
    
    // Find the tallest card in this row
    let maxHeight = 0;
    rowCards.forEach(card => {
      const height = card.offsetHeight;
      maxHeight = Math.max(maxHeight, height);
    });
    
    // Set all cards in this row to the same height
    rowCards.forEach(card => {
      card.style.height = `${maxHeight}px`;
    });
  }
}

/**
 * Adds hover effects to executive cards
 */
function addCardHoverEffects() {
  const cards = document.querySelectorAll('.executive-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const overlay = card.querySelector('.card-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const overlay = card.querySelector('.card-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
      }
    });
  });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}