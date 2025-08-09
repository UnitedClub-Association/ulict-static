document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded before using them
    const libsCheck = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            clearInterval(libsCheck);
            initializeAnimations();
        }
    }, 100);

    // --- Particle Animation for Hero Section ---
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${Math.random() * 3 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particlesContainer.appendChild(particle);
        }
        // Add particle styles dynamically to the head
        const style = document.createElement('style');
        style.innerHTML = `
        .particle {
            position: absolute;
            background-color: var(--primary-glow);
            border-radius: 50%;
            opacity: 0;
            animation: float 15s infinite linear;
        }
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            25% { opacity: 0.7; }
            50% { transform: translateY(-100px) translateX(20px); }
            75% { opacity: 0.7; }
            100% { transform: translateY(0) translateX(0); opacity: 0; }
        }`;
        document.head.appendChild(style);
    }

    // --- GSAP Scroll-Triggered Animations ---
    function initializeAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Fade-in animations
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

        // Slide-up animations
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
        
        // Card animations
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

        // Bubble animations
        gsap.from(".anim-bubble", {
            scrollTrigger: {
                trigger: ".speech-bubbles",
                start: "top 80%",
            },
            opacity: 0,
            scale: 0.5,
            y: 30,
            stagger: 0.2,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }

    // --- Feather Icons ---
    if (typeof feather !== "undefined") {
        feather.replace();
    }
});
