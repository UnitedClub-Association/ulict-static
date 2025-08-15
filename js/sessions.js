document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded. Animations will not work.");
        return;
    }

    // --- Interactive Constellation Canvas Animation ---
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();

        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (innerWidth - size * 2) + size;
                const y = Math.random() * (innerHeight - size * 2) + size;
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = 'rgba(122, 162, 247, 0.7)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                     ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(122, 162, 247, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particles.forEach(p => p.update());
            connect();
        };

        init();
        animate();
    }

    // --- Scroll-triggered animations for timeline ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.timeline-item').forEach(item => {
        const content = item.querySelector('.timeline-content');
        const image = item.querySelector('.timeline-image');

        // Determine direction based on layout
        const isOdd = Array.from(item.parentElement.children).indexOf(item) % 2 === 0;
        const xDirection = isOdd ? -50 : 50;

        if (content) {
             gsap.from(content, {
                opacity: 0,
                x: xDirection,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
       
       if (image) {
            gsap.from(image, {
                opacity: 0,
                x: -xDirection,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
       }
    });

    // Feather Icons Initialization
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
