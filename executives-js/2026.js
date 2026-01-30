document.addEventListener('DOMContentLoaded', () => {

    // --- Dependency Check ---
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP/ScrollTrigger not detected. Animations may be limited.");
    } else {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- 1. Optimized Circuit Background (Canvas) ---
    function initCircuitCanvas() {
        const canvas = document.getElementById('circuit-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        const ctx = canvas.getContext('2d', { alpha: true });
        let width, height;
        let nodes = [];
        let signals = [];
        
        // Reduced counts for performance (mobile friendly)
        const nodeCount = window.innerWidth < 768 ? 30 : 50; 
        const connectionDistance = 160;

        function setDimensions() {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        }

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.2 + 0.8;
                this.pulse = Math.random() * Math.PI;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                this.pulse += 0.03;
            }

            draw() {
                const p = (Math.sin(this.pulse) + 1) / 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + p * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + p * 0.6})`;
                ctx.fill();
            }
        }

        class Signal {
            constructor(start, end) {
                this.start = start;
                this.end = end;
                this.progress = 0;
                this.speed = 0.015 + Math.random() * 0.02;
                this.alive = true;
            }
            update() {
                this.progress += this.speed;
                if (this.progress >= 1) this.alive = false;
            }
            draw() {
                const x = this.start.x + (this.end.x - this.start.x) * this.progress;
                const y = this.start.y + (this.end.y - this.start.y) * this.progress;
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#FFF';
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#FFD700';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function createNodes() {
            nodes = [];
            for (let i = 0; i < nodeCount; i++) nodes.push(new Node());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connections first (Layered bottom)
            ctx.lineWidth = 0.5;
            for (let i = 0; i < nodes.length; i++) {
                // Performance: only check a subset of nodes or nearby nodes if complex
                // Here we keep it simple but limit the total checks
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistance * connectionDistance) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / connectionDistance) * 0.2;
                        ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();

                        if (Math.random() < 0.0008) {
                            signals.push(new Signal(nodes[i], nodes[j]));
                        }
                    }
                }
            }

            nodes.forEach(n => { n.update(); n.draw(); });
            signals = signals.filter(s => {
                s.update();
                s.draw();
                return s.alive;
            });

            requestAnimationFrame(animate);
        }

        setDimensions();
        createNodes();
        animate();

        window.addEventListener('resize', () => {
            setDimensions();
            createNodes();
        });
    }

    // --- 2. "Data Reconstitution" Card Animation ---
    function initCardAnimations() {
        const cards = document.querySelectorAll('.profile-card');
        const connectors = document.querySelectorAll('.tier-connector, .tier-connector-branch');
        
        if (!cards.length) return;

        // Reset state for animation
        gsap.set(cards, { 
            opacity: 0, 
            scale: 0.8, 
            filter: 'brightness(0) contrast(2)',
            clipPath: 'inset(100% 0% 0% 0%)' 
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.board-container',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // 1. Animate Connectors (The "Circuits" powering up)
        tl.fromTo(connectors, 
            { scaleY: 0, opacity: 0 }, 
            { scaleY: 1, opacity: 0.5, duration: 1, ease: 'power2.inOut', transformOrigin: 'top center' }
        );

        // 2. Staggered Card "Materialization"
        tl.to(cards, {
            opacity: 1,
            scale: 1,
            filter: 'brightness(1) contrast(1)',
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            stagger: 0.2,
            ease: 'expo.out',
            onComplete: () => {
                // Add a "glitch" finish to each card
                cards.forEach(card => {
                    card.classList.add('is-ready');
                });
            }
        }, "-=0.5");
    }

    // Initialize with micro-delay for DOM stability
    setTimeout(() => {
        initCircuitCanvas();
        initCardAnimations();
    }, 50);
});