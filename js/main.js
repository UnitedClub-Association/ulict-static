document.addEventListener('DOMContentLoaded', () => {
    // 1. Wait for libraries to load
    const libsCheck = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof feather !== 'undefined' && typeof anime !== 'undefined') {
            clearInterval(libsCheck);
            initApp();
        }
    }, 100);

    function initApp() {
        feather.replace();
        initHeroAnimation();
        initTabs();
        initScrollAnimations();
    }

    // --- 2. HERO ANIMATION (Anime.js Grid) ---
    function initHeroAnimation() {
        const gridContainer = document.getElementById('hero-grid');
        if (!gridContainer) return;

        // Configuration
        const dotCount = 40; // Number of floating particles
        
        // Generate dots
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('grid-dot');
            gridContainer.appendChild(dot);
        }

        // Animate dots randomly
        anime({
            targets: '.grid-dot',
            translateX: () => anime.random(-50, window.innerWidth + 50),
            translateY: () => anime.random(-50, window.innerHeight + 50),
            scale: () => anime.random(0.5, 1.5),
            opacity: [0, 0.4],
            easing: 'easeInOutQuad',
            duration: 2000,
            delay: anime.stagger(50),
            complete: animateDots // Start continuous loop
        });

        function animateDots() {
            anime({
                targets: '.grid-dot',
                translateX: () => anime.random(0, window.innerWidth),
                translateY: () => anime.random(0, window.innerHeight),
                opacity: [0.1, 0.6],
                easing: 'easeInOutSine',
                duration: () => anime.random(5000, 15000), // Slow floating
                delay: anime.stagger(200),
                loop: true,
                direction: 'alternate'
            });
        }
        
        // Intro Text Animation sequence
        const tl = anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        });

        tl.add({
            targets: '.anim-hero-entry',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(200, {start: 500})
        });
    }

    // --- 3. TAB LOGIC (Refined) ---
    function initTabs() {
        const tabs = document.querySelectorAll('.highlight-tab');
        const contents = document.querySelectorAll('.highlight-content');
        const highlighter = document.querySelector('.tab-highlighter');

        if (!tabs.length || !highlighter) return;

        function updateHighlighter(activeTab) {
            const rect = activeTab.getBoundingClientRect();
            const parentRect = activeTab.parentElement.getBoundingClientRect();
            
            // Calculate relative position
            highlighter.style.width = `${rect.width}px`;
            highlighter.style.transform = `translateX(${rect.left - parentRect.left}px)`;
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // UI State
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateHighlighter(tab);

                // Content Switch
                const target = tab.dataset.tab;
                contents.forEach(c => {
                    c.classList.remove('active');
                    if(c.id === `tab-content-${target}`) {
                        c.classList.add('active');
                    }
                });
                
                // Trigger ScrollTrigger refresh to recalculate layout height
                setTimeout(() => ScrollTrigger.refresh(), 300);
            });
        });

        // Initialize position on load & resize
        updateHighlighter(document.querySelector('.highlight-tab.active'));
        window.addEventListener('resize', () => {
            updateHighlighter(document.querySelector('.highlight-tab.active'));
        });
    }

    // --- 4. SCROLL ANIMATIONS (GSAP) ---
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Standard Fade Up
        gsap.utils.toArray('.anim-slide-up, .anim-fade-in').forEach(elem => {
            gsap.from(elem, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Staggered Cards
        const cards = gsap.utils.toArray('.anim-card');
        if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
                start: 'top 85%',
                onEnter: batch => gsap.to(batch, {
                    opacity: 1, 
                    y: 0, 
                    stagger: 0.15, 
                    duration: 0.8, 
                    ease: 'back.out(1.7)'
                }),
                onLeaveBack: batch => gsap.to(batch, {opacity: 0, y: 50}) // Optional: Hide on scroll up
            });
            // Initial Set
            gsap.set(cards, {opacity: 0, y: 50});
        }
    }
});