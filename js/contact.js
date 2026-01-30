document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dependencies Check ---
    if (typeof anime === 'undefined') {
        console.error("Anime.js not loaded.");
        return;
    }
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP/ScrollTrigger not loaded.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. Anime.js Background Grid Animation ---
    function initAnimeGrid() {
        const gridContainer = document.getElementById('anime-grid');
        if (!gridContainer) return;

        // Calculate grid size based on viewport
        const width = window.innerWidth;
        const height = gridContainer.offsetHeight;
        const dotSize = 25; // Size + margin
        const columns = Math.floor(width / dotSize);
        const rows = Math.floor(height / dotSize);
        const totalDots = columns * rows;

        // Create dots
        gridContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        // Limit dots for performance on mobile
        const limit = window.innerWidth < 768 ? 200 : 400;
        const actualDots = Math.min(totalDots, limit);

        for (let i = 0; i < actualDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('grid-dot');
            fragment.appendChild(dot);
        }
        gridContainer.appendChild(fragment);

        // Anime.js Staggered Wave
        anime({
            targets: '.grid-dot',
            scale: [
                {value: .1, easing: 'easeOutSine', duration: 500},
                {value: 1, easing: 'easeInOutQuad', duration: 1200}
            ],
            opacity: [
                {value: 0, easing: 'linear', duration: 500},
                {value: 0.5, easing: 'linear', duration: 1000}
            ],
            delay: anime.stagger(200, {grid: [columns, Math.ceil(actualDots/columns)], from: 'center'}),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }

    // --- 3. Anime.js Text Reveal ---
    function animateTitle() {
        // Wrap every letter in a span
        const textWrapper = document.querySelector('.hero-title .letters');
        if (textWrapper) {
            textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

            anime.timeline({loop: false})
            .add({
                targets: '.hero-title .letter',
                translateY: ["1.1em", 0],
                translateZ: 0,
                duration: 750,
                delay: (el, i) => 50 * i,
                easing: "easeOutExpo"
            });
        }
        
        // Subtitle Fade
        gsap.to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.8,
            ease: 'power3.out'
        });
    }

    // --- 4. Micro-Interactions (Social Icons) ---
    function initMicroInteractions() {
        const icons = document.querySelectorAll('.social-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                anime({
                    targets: icon,
                    scale: 1.15,
                    rotate: '1turn',
                    duration: 800,
                    easing: 'easeOutElastic(1, .5)'
                });
            });
            
            icon.addEventListener('mouseleave', () => {
                anime({
                    targets: icon,
                    scale: 1,
                    rotate: 0,
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            });
        });

        // Form Focus Effects
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                anime({
                    targets: input,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            input.addEventListener('blur', () => {
                anime({
                    targets: input,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // --- 5. Scroll Animations (GSAP) ---
    function initScrollAnimations() {
        gsap.from('.info-panel', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-layout',
                start: 'top 85%'
            }
        });

        gsap.from('.form-panel', {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.2, // Stagger effect
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-layout',
                start: 'top 85%'
            }
        });
    }

    // --- 6. Form Submission (Mailto Logic) ---
    function initFormHandling() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            // HTML onsubmit="event.preventDefault()" handles the basic stop, 
            // but we ensure it here too just in case.
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Construct the mailto URL
            const recipient = "ulictclub2024@gmail.com";
            const emailSubject = encodeURIComponent(`[Website Contact] ${subject}`);
            const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            const mailtoLink = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

            // Animate Button & Open Mail Client
            const btn = form.querySelector('.submit-btn');
            const originalContent = btn.innerHTML;
            
            anime({
                targets: btn,
                scale: [1, 0.95, 1],
                duration: 400,
                easing: 'easeInOutQuad',
                complete: function() {
                    // Open default mail client
                    window.location.href = mailtoLink;
                    
                    // Visual Feedback
                    btn.style.background = 'var(--secondary-glow)'; // Switch to Cyan success color
                    btn.innerHTML = `<span>Opening Mail App...</span> <i data-feather="external-link"></i>`;
                    if (typeof feather !== 'undefined') feather.replace();

                    // Reset form and button after a few seconds
                    setTimeout(() => {
                        btn.style.background = ''; // Revert to gradient
                        btn.innerHTML = originalContent;
                        if (typeof feather !== 'undefined') feather.replace();
                        form.reset();
                    }, 3000);
                }
            });
        });
    }

    // --- Init ---
    function init() {
        initAnimeGrid();
        animateTitle();
        initMicroInteractions();
        initScrollAnimations();
        initFormHandling(); // Added form handling
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    init();
    
    // Handle Resize for Grid
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initAnimeGrid, 250);
    });
});