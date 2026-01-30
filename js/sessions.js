document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Init ---
    if (typeof feather !== 'undefined') feather.replace();
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const DOM = {
        timeline: document.getElementById('sessions-timeline'),
        sessionCount: document.getElementById('session-count'),
        template: document.getElementById('timeline-item-template'),
        particles: document.getElementById('sessions-particles'),
        emptyState: document.getElementById('empty-state'),
        loadingState: document.querySelector('.loading-state')
    };

    // --- 1. Particle Animation (Anime.js) ---
    // UPDATED: Using Apricot/Cyan Palette
    function initParticles() {
        if (!DOM.particles || typeof anime === 'undefined') return;
        
        DOM.particles.innerHTML = '';
        const count = 30;
        const colors = [
            'rgba(253, 186, 116, 0.3)', // Apricot
            'rgba(94, 234, 212, 0.2)'   // Cyan
        ];
        
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 4 + 2;
            p.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%; /* or 0 for squares to be more techy? let's stick to circles for soft modern */
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            DOM.particles.appendChild(p);
        }

        anime({
            targets: DOM.particles.children,
            translateY: [
                { value: -50, duration: 4000 },
                { value: 50, duration: 4000 }
            ],
            opacity: [
                { value: 0.1, duration: 2000 },
                { value: 0.6, duration: 2000 }
            ],
            delay: anime.stagger(200),
            duration: 6000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }

    // --- 2. Data Logic ---
    async function loadData() {
        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) throw new Error('Failed to load');
            const allEvents = await response.json();
            
            processData(allEvents);
        } catch (error) {
            console.error(error);
            if (DOM.loadingState) DOM.loadingState.style.display = 'none';
            if (DOM.emptyState) {
                DOM.emptyState.classList.remove('hidden');
            }
        }
    }

    function processData(events) {
        // Filter: Sessions only
        const sessions = events.filter(e => e.type === 'session');
        
        // Sort: Newest first
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update count
        if (DOM.sessionCount) DOM.sessionCount.textContent = sessions.length.toString().padStart(2, '0');

        // Render
        renderTimeline(sessions);
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'UNKNOWN DATE';
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        // Output format: SEP 18, 2025
        return new Date(dateStr).toLocaleDateString('en-US', options).toUpperCase();
    }

    function renderTimeline(items) {
        if (DOM.loadingState) DOM.loadingState.style.display = 'none';

        if (items.length === 0) {
            DOM.emptyState.classList.remove('hidden');
            return;
        }

        items.forEach((item, index) => {
            const node = DOM.template.content.cloneNode(true);
            
            // Image
            const img = node.querySelector('.card-img');
            img.src = item.image || '/images/default-session.jpg';
            img.alt = item.title;

            // Content
            node.querySelector('.log-date').textContent = formatDate(item.date);
            node.querySelector('.card-title').textContent = item.title;
            node.querySelector('.card-desc').textContent = item.description;
            
            const link = node.querySelector('.log-card');
            link.href = item.link || '#';

            DOM.timeline.appendChild(node);
        });

        if (typeof feather !== 'undefined') feather.replace();
        
        // Trigger Animations
        animateItems();
    }

    // --- 3. Animations ---
    function animateItems() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const items = document.querySelectorAll('.log-item');
        
        items.forEach((item, i) => {
            const card = item.querySelector('.log-card');
            const marker = item.querySelector('.log-marker');
            const date = item.querySelector('.log-date');

            // Timeline: Reveal from Bottom with Staggered elements
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.fromTo(marker, 
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            )
            .fromTo(date,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4 },
                "-=0.2"
            )
            .fromTo(card, 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                "-=0.3"
            );
        });
    }

    // Start
    initParticles();
    loadData();
});