document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded before using them
    const libsCheck = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof feather !== 'undefined') {
            clearInterval(libsCheck);
            initializePage();
        }
    }, 100);

    function initializePage() {
        // --- Feather Icons ---
        feather.replace();

        // --- Vertical Tabs Logic for Featured Highlights ---
        const tabs = document.querySelectorAll('.highlight-tab');
        const tabContents = document.querySelectorAll('.highlight-content');
        const highlighter = document.querySelector('.tab-highlighter');

        if (tabs.length > 0 && tabContents.length > 0) {
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Update tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Move highlighter
                    if (highlighter) {
                        highlighter.style.top = `${index * tab.offsetHeight + index * 10}px`; // 10 is the gap
                    }

                    // Update content
                    const targetId = `tab-content-${tab.dataset.tab}`;
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetId) {
                            content.classList.add('active');
                        }
                    });
                });
            });
             // Set initial highlighter position
            if (highlighter) {
                highlighter.style.top = '0px';
            }
        }


        // --- GSAP Scroll-Triggered Animations ---
        gsap.registerPlugin(ScrollTrigger);

        // General fade-in animations
        gsap.utils.toArray('.anim-fade-in').forEach(elem => {
            gsap.from(elem, {
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // General slide-up animations
        gsap.utils.toArray('.anim-slide-up').forEach(elem => {
            gsap.from(elem, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Card grid animations
        gsap.from(".anim-card", {
            scrollTrigger: {
                trigger: ".cards-grid",
                start: "top 80%",
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out"
        });
        
        // Animate quote section
        gsap.from(".philosophy-section blockquote", {
             scrollTrigger: {
                trigger: ".philosophy-section",
                start: "top 80%",
            },
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power3.out"
        });
    }
});
