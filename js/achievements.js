document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded. Animations will not work.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Hero Entrance Animation ---
    function animateHero() {
        const heroTitle = document.querySelector('[data-anim="hero-title"]');
        const heroSubtitle = document.querySelector('[data-anim="hero-subtitle"]');

        if (!heroTitle || !heroSubtitle) return;
        
        const tl = gsap.timeline({ delay: 0.3 });
        tl.fromTo(heroTitle, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }
        )
        .fromTo(heroSubtitle,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            "-=0.8"
        );
    }

    // --- 2. Scroll-Triggered Animations ---
    function initScrollAnimations() {
        // General fade-up animation for section headers and other single elements
        gsap.utils.toArray('[data-anim="fade-up"]').forEach(elem => {
            gsap.fromTo(elem,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });

        // Staggered animation for foundation cards
        gsap.utils.toArray('.foundation-card').forEach((card, index) => {
             gsap.fromTo(card,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: index * 0.15,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.foundation-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });
    }

    // --- 3. Initialization ---
    function init() {
        animateHero();
        initScrollAnimations();
        if (typeof feather !== 'undefined') {
            feather.replace();
        } else {
            console.warn("Feather icons not loaded.");
        }
    }
    
    init();
});
