document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. DYNAMIC CONTENT & RENDERING ---
    const timeline = document.getElementById('timeline');
    const template = document.getElementById('timeline-item-template');

    async function fetchAndRenderSessions() {
        if (!timeline || !template) return;
        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const allEvents = await response.json();

            const sessions = allEvents
                .filter(event => event.type === 'session')
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            timeline.innerHTML = ''; // Clear spinner

            if (sessions.length === 0) {
                timeline.innerHTML = '<p class="no-results-message">No sessions found.</p>';
                return;
            }

            sessions.forEach(session => {
                const item = template.content.cloneNode(true).firstElementChild;
                
                item.querySelector('.session-date').textContent = new Date(session.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                item.querySelector('.session-title').textContent = session.title;
                item.querySelector('.session-desc').textContent = session.description;
                
                const linkElement = item.querySelector('.session-link');
                if (session.link && session.link !== '#') {
                    linkElement.href = session.link;
                } else {
                    linkElement.classList.add('disabled');
                    linkElement.removeAttribute('href');
                    linkElement.innerHTML = 'Coming Soon <i data-feather="clock"></i>';
                }

                item.querySelector('.timeline-image img').src = session.image || 'https://placehold.co/600x400/0A192F/FF9800?text=ULIC';
                item.querySelector('.timeline-image img').alt = session.title;
                
                timeline.appendChild(item);
            });
            
            feather.replace();
            initTimelineAnimations();

        } catch (error) {
            console.error("Could not fetch sessions:", error);
            timeline.innerHTML = '<p class="error-message">Could not load sessions.</p>';
        }
    }

    // --- 2. Interactive Constellation Canvas Animation ---
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const setCanvasSize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initCanvas(); // Re-initialize particles on resize
        };

        class Particle {
             constructor(x, y, dirX, dirY, size, color) {
                this.x = x; this.y = y; this.directionX = dirX; this.directionY = dirY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY;
                this.draw();
            }
        }

        const initCanvas = () => {
            particles = [];
            const numParticles = (canvas.height * canvas.width) / 12000; // Optimized particle count
            for (let i = 0; i < numParticles; i++) {
                const size = Math.random() * 2 + 0.5;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const dirX = (Math.random() * 0.4) - 0.2;
                const dirY = (Math.random() * 0.4) - 0.2;
                particles.push(new Particle(x, y, dirX, dirY, size, 'rgba(255, 152, 0, 0.7)'));
            }
        };

        const connect = () => {
            let connectRadius = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dist = Math.sqrt(Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2));
                    if (dist < connectRadius) {
                        const opacity = 1 - (dist / connectRadius);
                        ctx.strokeStyle = `rgba(255, 152, 0, ${opacity * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateCanvas = () => {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connect();
        };

        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();
        animateCanvas();
    }

    // --- 3. Scroll-triggered animations for timeline ---
    function initTimelineAnimations() {
        gsap.utils.toArray('.timeline-item').forEach(item => {
            gsap.from(item, {
                opacity: 0,
                y: 60,
                duration: 1,
                ease: 'expo.out',
                scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
            });
        });
    }

    // --- 4. INITIALIZATION ---
    fetchAndRenderSessions();
});

