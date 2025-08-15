document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded. Animations will not work.");
        return;
    }
    
    // --- Hero Text Decoding Animation ---
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) {
        const originalText = heroTitle.dataset.text || heroTitle.innerText;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_!@#$%^&*()-+=[]{}|;:,.<>?';
        let interval = null;
        let iteration = 0;

        // Scramble effect
        const scramble = () => {
            heroTitle.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
                // Animate subtitle after title is decoded
                gsap.to(heroSubtitle, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
            }
            iteration += 1 / 3;
        };

        // Initial setup for subtitle animation
        gsap.set(heroSubtitle, { opacity: 0, y: 20 });
        
        // Start animation after a short delay
        setTimeout(() => {
            interval = setInterval(scramble, 40);
        }, 500);
    }

    // --- Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    if (filterButtons.length > 0 && eventCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                // Animate cards
                gsap.to(eventCards, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.3,
                    stagger: 0.05,
                    onComplete: () => {
                        eventCards.forEach(card => {
                            const category = card.dataset.category;
                            if (filter === 'all' || category === filter) {
                                card.classList.remove('hide');
                            } else {
                                card.classList.add('hide');
                            }
                        });
                        gsap.to('.event-card:not(.hide)', {
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            stagger: 0.1
                        });
                    }
                });
            });
        });
    }

    // --- Initial Card Load Animation ---
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.event-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.event-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // Feather Icons Initialization
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
