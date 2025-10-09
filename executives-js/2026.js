document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap !== 'undefined') {
        // --- New Hero Title "Decode" Animation ---
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.dataset.text;
            let iteration = 0;
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let interval;

            const decodeAnimation = () => {
                heroTitle.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return alphabet[Math.floor(Math.random() * 26)]
                    })
                    .join("");

                if(iteration >= originalText.length){
                    clearInterval(interval);
                }
                iteration += 1 / 3;
            };
            
            // Start animation a bit after page load
            setTimeout(() => {
                interval = setInterval(decodeAnimation, 40);
            }, 500);
        }

        // --- Card Assembly Animation ---
        const cards = gsap.utils.toArray('.profile-card');
        cards.sort((a, b) => parseInt(a.dataset.rank) - parseInt(b.dataset.rank));

        gsap.from(cards, {
            opacity: 0,
            y: 60,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.board-container',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    } else {
        console.error("GSAP not loaded. Animations will not work.");
    }
});

