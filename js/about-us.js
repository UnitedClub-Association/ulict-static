document.addEventListener('DOMContentLoaded', () => {
    // Check if libraries are loaded
    if (typeof gsap === 'undefined' || typeof THREE === 'undefined') {
        console.error("GSAP or THREE.js not loaded. Animations will not work.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Interactive 3D Hero Background ---
    function initHeroCanvas() {
        const container = document.getElementById('hero-canvas-container');
        if (!container) return;

        let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
        let animationId;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // Particles Material - Updated to Soft Cyan to match new theme
        const material = new THREE.PointsMaterial({
            color: 0x5EEAD4, // --secondary-glow hex value
            size: 2.5,       // Slightly larger for softness
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.6     // Slightly more subtle
        });

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const numParticles = 4000; // Optimized count

        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * 2500 - 1250;
            const y = Math.random() * 2500 - 1250;
            const z = Math.random() * 2500 - 1250;
            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Event Listeners
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
        
        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.5;
            mouseY = (event.clientY - windowHalfY) * 0.5;
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // Animation loop
        function animate() {
            animationId = requestAnimationFrame(animate);
            const time = Date.now() * 0.00005;
            
            // Smoother camera movement
            camera.position.x += (mouseX - camera.position.x) * 0.03;
            camera.position.y += (-mouseY - camera.position.y) * 0.03;
            
            camera.lookAt(scene.position);
            
            // Gentle rotation
            particles.rotation.x = time * 0.15;
            particles.rotation.y = time * 0.3;
            
            renderer.render(scene, camera);
        }
        
        // Performance: Pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                } else {
                    cancelAnimationFrame(animationId);
                }
            });
        });
        
        if(container.parentElement) observer.observe(container.parentElement);
        else animate();
    }

    // --- 2. GSAP Scroll-Triggered Animations ---
    function initScrollAnimations() {
        const animations = {
            'hero-title': { y: 40, duration: 1.6, ease: 'power3.out', delay: 0.2 },
            'hero-subtitle': { y: 20, duration: 1.4, ease: 'power3.out', delay: 0.4 },
            'fade-up': { y: 60, duration: 1, ease: 'power2.out' }
        };

        gsap.utils.toArray('[data-anim]').forEach(elem => {
            const animType = elem.dataset.anim;
            const config = animations[animType];

            if (config) {
                gsap.fromTo(elem, 
                    { opacity: 0, y: config.y || 0 }, 
                    {
                        opacity: 1,
                        y: 0,
                        duration: config.duration,
                        ease: config.ease,
                        delay: config.delay || 0,
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 88%', // Trigger slightly earlier
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
            }
        });

        // Staggered Cards
        gsap.utils.toArray('.data-card-grid').forEach(grid => {
            gsap.fromTo(grid.querySelectorAll('.data-card'),
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });

        // Timeline Items Stagger
        const timelineItems = gsap.utils.toArray('.timeline-item');
        if (timelineItems.length > 0) {
            timelineItems.forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
            });
        }
    }

    // --- 3. Initialization ---
    function init() {
        initHeroCanvas();
        initScrollAnimations();
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    init();
});