document.addEventListener('DOMContentLoaded', () => {
    // Check for GSAP library
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded. Animations will not work.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. HERO CANVAS ANIMATION ---
    function initParticleCanvas() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = canvas.offsetHeight;
        
        let particles = [];
        const particleCount = Math.floor(width * height / 20000); // Adjust density
        const primaryColor = '#FF9800';
        const secondaryColor = '#00CFDE';

        const mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
         window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.offsetHeight;
            initParticles(); // Re-initialize particles on resize
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
                if (this.x > width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // Mouse collision
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < width - this.size * 10) { this.x += 5; }
                    if (mouse.x > this.x && this.x > this.size * 10) { this.x -= 5; }
                    if (mouse.y < this.y && this.y < height - this.size * 10) { this.y += 5; }
                    if (mouse.y > this.y && this.y > this.size * 10) { this.y -= 5; }
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                let size = (Math.random() * 2.5) + 1;
                let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                let color = Math.random() > 0.1 ? secondaryColor : primaryColor;

                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }
        
        function connectParticles() {
            let opacityValue = 1;
            for(let a = 0; a < particles.length; a++) {
                for(let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    if (distance < (width/7) * (height/7)) {
                        opacityValue = 1 - (distance/20000);
                        let dx = mouse.x - particles[a].x;
                        let dy = mouse.y - particles[a].y;
                        let mouseDistance = Math.sqrt(dx*dx + dy*dy);
                        if (mouseDistance < mouse.radius) {
                             ctx.strokeStyle = `rgba(255, 152, 0, ${opacityValue})`;
                        } else {
                            ctx.strokeStyle = `rgba(0, 207, 222, ${opacityValue})`;
                        }
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
        }

        initParticles();
        animate();
    }

    // --- 2. HERO TEXT ANIMATION ---
    function animateHeroText() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroTitle || !heroSubtitle) return;

        gsap.set(heroSubtitle, { opacity: 0, y: 20 });

        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(heroTitle, {
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: 'expo.out'
        }).to(heroSubtitle, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.8");
    }
    
    // --- 3. SCROLL-TRIGGERED ANIMATIONS ---
    function initScrollAnimations() {
        gsap.from('.info-panel', {
            opacity: 0,
            x: -50,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact-layout',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        gsap.from('.form-panel', {
            opacity: 0,
            x: 50,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact-layout',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    // --- 4. INITIALIZATION ---
    function init() {
        initParticleCanvas();
        animateHeroText();
        initScrollAnimations();
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    init();
});