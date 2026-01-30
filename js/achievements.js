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
        
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(heroTitle, 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' }
        )
        .fromTo(heroSubtitle,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out' },
            "-=1.0"
        );
    }

    // --- 2. Scroll-Triggered Animations ---
    function initScrollAnimations() {
        // General fade-up animation (smoother ease)
        gsap.utils.toArray('[data-anim="fade-up"]').forEach(elem => {
            gsap.fromTo(elem,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });

        // Staggered animation for Foundation Cards
        gsap.utils.toArray('.foundation-grid').forEach(grid => {
             gsap.fromTo(grid.querySelectorAll('.foundation-card'),
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    delay: 0,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });

        // Staggered animation for Roadmap Items
        const roadmapItems = gsap.utils.toArray('.roadmap-item');
        if (roadmapItems.length > 0) {
            roadmapItems.forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
            });
        }
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