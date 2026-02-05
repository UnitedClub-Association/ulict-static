document.addEventListener('DOMContentLoaded', () => {
    const bannerRoot = document.getElementById('ulic-banner-root');
    if (!bannerRoot) return;

    // --- 1. VISUALIZER / PARTICLES SYSTEM ---
    const initBannerCanvas = () => {
        const cGrid = document.getElementById('banner-bg-grid');
        const cParts = document.getElementById('banner-bg-particles');
        
        if (!cGrid || !cParts) return;

        const ctxGrid = cGrid.getContext('2d');
        const ctxParts = cParts.getContext('2d');
        
        let w, h;
        
        // Particles Array
        let particles = [];
        // Role Colors
        const colors = ['#FF0000', '#00FFFF', '#FFD700', '#00A86B', '#A259FF', '#FF4500'];

        const resize = () => {
            // Use banner dimensions, not window
            w = bannerRoot.offsetWidth;
            h = bannerRoot.offsetHeight;
            cGrid.width = w; cGrid.height = h;
            cParts.width = w; cParts.height = h;
        };
        
        // Initial sizing
        resize();
        
        // Update on window resize
        window.addEventListener('resize', resize);

        // Init Particles
        for(let i=0; i<60; i++) { // Reduced count slightly for container size
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 3,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.1
            });
        }

        // Animation Loop
        const animate = () => {
            // Check if banner still exists (removable requirement)
            if (!document.getElementById('ulic-banner-root')) return;

            // 1. Grid Layer
            ctxGrid.clearRect(0, 0, w, h);
            ctxGrid.strokeStyle = 'rgba(255,255,255,0.05)';
            ctxGrid.lineWidth = 1;
            
            const time = Date.now() * 0.0005;
            const gridSize = 60;
            const offsetX = (time * 20) % gridSize;
            
            ctxGrid.beginPath();
            // Verticals
            for (let x = offsetX; x < w; x += gridSize) {
                ctxGrid.moveTo(x, 0); ctxGrid.lineTo(x, h);
            }
            // Horizontals
            for (let y = 0; y < h; y += gridSize) {
                ctxGrid.moveTo(0, y); ctxGrid.lineTo(w, y);
            }
            ctxGrid.stroke();

            // 2. Particles Layer
            ctxParts.clearRect(0, 0, w, h);
            
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctxParts.beginPath();
                ctxParts.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctxParts.fillStyle = p.color;
                ctxParts.globalAlpha = p.alpha;
                ctxParts.fill();
                ctxParts.globalAlpha = 1;

                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 100) {
                        ctxParts.beginPath();
                        ctxParts.moveTo(p.x, p.y);
                        ctxParts.lineTo(p2.x, p2.y);
                        ctxParts.strokeStyle = `rgba(255,255,255,${0.1 - dist/1000})`;
                        ctxParts.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };
        animate();
    };

    // --- 2. GSAP ENTRANCE ---
    const runBannerIntro = () => {
        // Wait for GSAP to load if not already
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#ulic-banner-root",
                start: "top 80%"
            }
        });

        tl.from(".banner-hud-corner", {
            scale: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        tl.to(".banner-glitch-wrapper", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.4");

        tl.to(".banner-subtitle-bar", {
            opacity: 1,
            duration: 0.5
        });
        
        tl.from(".banner-role-pip", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");
    };

    // Initialize
    initBannerCanvas();
    // Small delay to ensure layout is ready
    setTimeout(runBannerIntro, 100);
});