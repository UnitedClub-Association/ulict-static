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
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // Particles
        const material = new THREE.PointsMaterial({
            color: 0x00CFDE, // --secondary-glow
            size: 2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.7
        });

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const numParticles = 5000;

        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
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
            requestAnimationFrame(animate);
            const time = Date.now() * 0.00005;
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            particles.rotation.x = time * 0.2;
            particles.rotation.y = time * 0.5;
            renderer.render(scene, camera);
        }
        
        animate();
    }

    // --- 2. GSAP Scroll-Triggered Animations ---
    function initScrollAnimations() {
        const animations = {
            'hero-title': {
                y: 30,
                duration: 1.5,
                ease: 'expo.out',
                delay: 0.5
            },
            'hero-subtitle': {
                y: 30,
                duration: 1.5,
                ease: 'expo.out',
                delay: 0.7
            },
            'fade-up': {
                y: 50,
                duration: 1.2,
                ease: 'expo.out'
            }
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
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
            }
        });

        // Staggered card animation
        gsap.utils.toArray('.data-card-grid').forEach(grid => {
            gsap.fromTo(grid.querySelectorAll('.data-card'),
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'expo.out',
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });
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
