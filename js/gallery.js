document.addEventListener('DOMContentLoaded', () => {
    // Check for GSAP library
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded. Animations will not work.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. HERO ANIMATION ---
    function animateHero() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroTitle || !heroSubtitle) return;

        // Scramble Text Animation
        const originalText = heroTitle.innerText;
        heroTitle.innerText = '';
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        
        const tl = gsap.timeline({ delay: 0.5 });

        for (let i = 0; i < originalText.length; i++) {
            const letter = originalText[i];
            const span = document.createElement('span');
            span.innerText = letter;
            heroTitle.appendChild(span);

            if (letter.trim() === '') continue; // Skip spaces

            const randomDuration = Math.random() * 0.5 + 0.3;
            tl.from(span, {
                innerText: () => chars[Math.floor(Math.random() * chars.length)],
                duration: randomDuration,
                ease: "power2.inOut",
                onUpdate: function() {
                    const currentFrame = Math.round(this.progress() * 10);
                    if (currentFrame % 2 === 0) {
                        span.innerText = chars[Math.floor(Math.random() * chars.length)];
                    }
                },
                onComplete: () => {
                    span.innerText = letter;
                }
            }, i * 0.1);
        }

        // Fade in subtitle after title animation
        tl.to(heroSubtitle, { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'expo.out' 
        }, "-=0.5");
    }

    // --- 2. SCROLL-TRIGGERED ANIMATIONS ---
    function initScrollAnimations() {
        // Staggered animation for placeholder cards
        gsap.utils.toArray('.placeholder-card').forEach((card, index) => {
             gsap.from(card, {
                opacity: 0,
                y: 60,
                duration: 1,
                delay: index * 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    // --- 3. INITIALIZATION ---
    function init() {
        // Set initial states for elements to be animated
        gsap.set('.hero-subtitle', { opacity: 0, y: 20 });
        
        animateHero();
        initScrollAnimations();
        
        // Feather Icons Replacement
        if (typeof feather !== 'undefined') {
            feather.replace();
        } else {
            console.warn("Feather icons not loaded.");
        }
    }
    
    init();
});
