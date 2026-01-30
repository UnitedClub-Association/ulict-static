document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dependencies Check ---
    if (typeof anime === 'undefined') {
        console.error("Anime.js not loaded.");
        return;
    }
    if (typeof VanillaTilt === 'undefined') {
        console.error("VanillaTilt not loaded.");
        return;
    }

    // --- 2. Initialize Vanilla Tilt (3D Cards) ---
    // This library handles the 3D mouse-follow effect automatically based on data attributes in HTML
    VanillaTilt.init(document.querySelectorAll(".executive-dossier"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        scale: 1.02
    });

    // --- 3. Matrix Digital Rain (Custom Canvas) ---
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = canvas.offsetHeight;

        const characters = '01MATRIXULICORIGIN'; // Custom char set
        const fontSize = 16;
        const columns = width / fontSize;

        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const colors = ['#5EEAD4', '#FDBA74', '#9CA3AF']; // Cyan, Apricot, Muted

        function draw() {
            // Fade effect (translucent black background)
            ctx.fillStyle = 'rgba(11, 17, 29, 0.05)'; // Matches --bg-secondary
            ctx.fillRect(0, 0, width, height);

            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                
                // Random color from palette
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        // Loop
        let animationId = setInterval(draw, 50);

        // Resize Handler
        window.addEventListener('resize', () => {
            clearInterval(animationId);
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.offsetHeight;
            animationId = setInterval(draw, 50);
        });
    }

    // --- 4. Anime.js Entrance Animations ---
    function runAnimations() {
        // Hero Title Glitch/Type Effect
        anime({
            targets: '.hero-title',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1500,
            easing: 'easeOutExpo',
            delay: 300
        });

        // Session Year Fade
        anime({
            targets: '.session-year',
            opacity: [0, 1],
            duration: 1000,
            delay: 1000,
            easing: 'linear'
        });

        // Dossier Cards Staggered Pop-up
        // Using Intersection Observer to trigger when scrolled into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [100, 0],
                        scale: [0.9, 1],
                        duration: 1000,
                        easing: 'easeOutElastic(1, .6)'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.executive-dossier').forEach(card => {
            observer.observe(card);
        });
    }

    // --- Init ---
    initMatrixRain();
    runAnimations();
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});