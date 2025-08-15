document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded. Animations will not work.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- General Fade-in Animation ---
    // Targets any element with the .anim-fade-in class
    gsap.utils.toArray('.anim-fade-in').forEach(elem => {
        gsap.to(elem, {
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // --- General Slide-up Animation ---
    // Targets any element with the .anim-slide-up class
    gsap.utils.toArray('.anim-slide-up').forEach(elem => {
        gsap.to(elem, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            // Set initial state
            y: 50 
        });
    });

    // --- Card Stagger Animation ---
    // Targets any element with the .anim-card class (for mission/vision)
    gsap.utils.toArray('.anim-card').forEach(card => {
         gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card.parentElement, // Trigger based on the container
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
             // Set initial state
            y: 40
        });
    });

    // Feather Icons Initialization
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
