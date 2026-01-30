document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Init ---
    if (typeof feather !== 'undefined') feather.replace();
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const DOM = {
        challengesGrid: document.getElementById('challenges-grid'),
        talksGrid: document.getElementById('talks-grid'),
        talksSection: document.getElementById('talks-section'),
        activeCount: document.getElementById('active-count'),
        template: document.getElementById('mini-card-template'),
        particles: document.getElementById('mini-hero-particles')
    };

    // --- 1. Particle Animation (Anime.js) ---
    function initParticles() {
        if (!DOM.particles || typeof anime === 'undefined') return;
        
        DOM.particles.innerHTML = '';
        const count = 25;
        
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: rgba(245, 158, 11, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            DOM.particles.appendChild(p);
        }

        anime({
            targets: DOM.particles.children,
            translateY: [
                { value: -30, duration: 3000 },
                { value: 30, duration: 3000 }
            ],
            opacity: [
                { value: 0.1, duration: 1500 },
                { value: 0.5, duration: 1500 }
            ],
            delay: anime.stagger(150),
            duration: 5000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
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
            DOM.challengesGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem;">
                    <i data-feather="alert-circle" style="margin-bottom: 0.5rem"></i>
                    <p>Unable to load events.</p>
                </div>
            `;
            if (typeof feather !== 'undefined') feather.replace();
        }
    }

    function processData(events) {
        // Filter: Mini-Events (Challenges)
        const challenges = events.filter(e => e.type === 'mini-event');
        
        // Filter: Talks (Explicit 'talk' type or sessions with 'talk' in title)
        const talks = events.filter(e => 
            e.type === 'talk' || 
            (e.type === 'session' && e.title.toLowerCase().includes('talk'))
        );

        // Render Challenges
        renderGrid(DOM.challengesGrid, challenges, 'No active challenges at the moment.');
        
        // Render Talks (or hide section)
        if (talks.length > 0) {
            DOM.talksSection.classList.remove('hidden');
            renderGrid(DOM.talksGrid, talks, 'No upcoming talks.');
        } else {
            DOM.talksSection.classList.add('hidden');
        }

        // Update Count
        if (DOM.activeCount) DOM.activeCount.textContent = challenges.length;

        // Init Card Animations
        animateCards();
    }

    // --- 3. Rendering Helpers ---
    function getStatus(event) {
        const now = new Date();
        const start = new Date(event.date);
        const end = event.endDate ? new Date(event.endDate) : new Date(start);
        
        if (!event.endDate) end.setHours(23, 59, 59);

        if (now < start) return { label: 'Upcoming', class: 'status-upcoming' };
        if (now > end) return { label: 'Ended', class: 'status-past' };
        return { label: 'Active', class: 'status-live' };
    }

    function formatDate(dateStr, endDateStr) {
        if (!dateStr) return '';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const start = new Date(dateStr).toLocaleDateString('en-US', options);
        return start;
    }

    function renderGrid(container, items, emptyMsg) {
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:2rem;">${emptyMsg}</div>`;
            return;
        }

        items.forEach(item => {
            const node = DOM.template.content.cloneNode(true);
            const status = getStatus(item);

            const img = node.querySelector('.card-img');
            img.src = item.image || '/images/default-event.jpg';
            img.alt = item.title;

            const badge = node.querySelector('.status-badge');
            badge.textContent = status.label;
            badge.classList.add(status.class);

            node.querySelector('.card-type-tag').textContent = item.type === 'mini-event' ? 'Challenge' : 'Talk';
            node.querySelector('.card-title').textContent = item.title;
            node.querySelector('.card-desc').textContent = item.description;
            node.querySelector('.card-date-text').textContent = formatDate(item.date, item.endDate);
            node.querySelector('a').href = item.link || '#';

            container.appendChild(node);
        });

        if (typeof feather !== 'undefined') feather.replace();
    }

    // --- 4. GSAP Animation ---
    function animateCards() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const cards = document.querySelectorAll('.hub-card');
        
        ScrollTrigger.batch(cards, {
            onEnter: batch => gsap.fromTo(batch, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', overwrite: true }
            ),
            start: "top 90%"
        });
    }

    // Start
    initParticles();
    loadData();
});