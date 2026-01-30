document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Setup & Init ---
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') feather.replace();

    const STATE = {
        allEvents: [],
        displayedEvents: [],
        filters: {
            type: 'all',
            search: ''
        },
        sort: 'newest'
    };

    const DOM = {
        grid: document.getElementById('events-grid'),
        spotlightContainer: document.getElementById('featured-event-container'),
        searchInput: document.getElementById('event-search'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        sortSelect: document.getElementById('sort-select'),
        gridTemplate: document.getElementById('event-card-template'),
        spotlightTemplate: document.getElementById('spotlight-card-template'),
        emptyState: document.getElementById('empty-state'),
        heroParticles: document.getElementById('hero-particles')
    };

    // --- 1. Animation System (Anime.js) ---
    function initParticles() {
        if (!DOM.heroParticles || typeof anime === 'undefined') return;
        
        const count = 30;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(16, 185, 129, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            DOM.heroParticles.appendChild(p);
        }

        anime({
            targets: DOM.heroParticles.children,
            translateY: [
                { value: -20, duration: 2000 },
                { value: 20, duration: 2000 }
            ],
            translateX: [
                { value: -10, duration: 2000 },
                { value: 10, duration: 2000 }
            ],
            opacity: [
                { value: 0.2, duration: 1500 },
                { value: 0.6, duration: 1500 }
            ],
            delay: anime.stagger(200),
            duration: 4000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }

    // --- 2. Data Fetching ---
    async function loadEvents() {
        try {
            // Using relative path to events.json. 
            // Ensure events.json is in the same directory or adjust path to '/data/events.json'
            const response = await fetch('/data/events.json'); 
            if (!response.ok) throw new Error('Failed to load events');
            
            const data = await response.json();
            STATE.allEvents = data;
            
            // Initial render
            processAndRender();
        } catch (error) {
            console.error(error);
            DOM.grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ef4444;">
                    <h3>Oops! Could not load events.</h3>
                    <p>Please check back later.</p>
                </div>
            `;
        }
    }

    // --- 3. Rendering Logic ---

    function getStatus(event) {
        const now = new Date();
        const start = new Date(event.date);
        const end = event.endDate ? new Date(event.endDate) : new Date(start);
        
        // Adjust end date to end of day if it's just a date string
        if (!event.endDate) end.setHours(23, 59, 59);

        if (now < start) return { label: 'Upcoming', class: 'status-upcoming' };
        if (now > end) return { label: 'Past', class: 'status-past' };
        return { label: 'Live Now', class: 'status-live' };
    }

    function formatDate(dateStr, endDateStr) {
        if (!dateStr) return '';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const start = new Date(dateStr).toLocaleDateString('en-US', options);
        
        if (endDateStr) {
            const end = new Date(endDateStr).toLocaleDateString('en-US', options);
            return `${start} - ${end}`;
        }
        return start;
    }

    function renderSpotlight(event) {
        if (!event || !DOM.spotlightContainer) return;

        DOM.spotlightContainer.innerHTML = ''; // Clear
        DOM.spotlightContainer.style.display = 'block';

        const node = DOM.spotlightTemplate.content.cloneNode(true);
        const status = getStatus(event);

        node.querySelector('.spotlight-title').textContent = event.title;
        node.querySelector('.spotlight-desc').textContent = event.description;
        node.querySelector('.sp-date').textContent = formatDate(event.date, event.endDate);
        node.querySelector('.sp-status').textContent = status.label;
        node.querySelector('img').src = event.image || '/images/default-event.jpg';
        
        const btn = node.querySelector('.spotlight-btn');
        btn.href = event.link || '#';
        
        DOM.spotlightContainer.appendChild(node);
        
        // Re-run feather icons for the new content
        if (typeof feather !== 'undefined') feather.replace();

        // Animate in
        gsap.from('.spotlight-card', { 
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' 
        });
    }

    function renderGrid(events) {
        DOM.grid.innerHTML = ''; // Clear loading state or previous items

        if (events.length === 0) {
            DOM.emptyState.classList.remove('hidden');
            return;
        } else {
            DOM.emptyState.classList.add('hidden');
        }

        events.forEach(event => {
            const node = DOM.gridTemplate.content.cloneNode(true);
            const status = getStatus(event);

            // Populate data
            const img = node.querySelector('.card-img');
            img.src = event.image || '/images/default-event.jpg';
            img.alt = event.title;

            const badge = node.querySelector('.status-badge');
            badge.textContent = status.label;
            badge.classList.add(status.class);

            node.querySelector('.card-type-tag').textContent = event.type || 'Event';
            node.querySelector('.card-title').textContent = event.title;
            node.querySelector('.card-desc').textContent = event.description;
            node.querySelector('.card-date-text').textContent = formatDate(event.date, event.endDate);
            node.querySelector('a').href = event.link || '#';

            DOM.grid.appendChild(node);
        });

        // Re-run icons
        if (typeof feather !== 'undefined') feather.replace();

        // Stagger Animation for grid items
        gsap.fromTo('.hub-card', 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
        );
    }

    // --- 4. Filtering & Sorting ---

    function processAndRender() {
        let result = [...STATE.allEvents];

        // 1. Extract Spotlight (if exists and matches generic filters?)
        // Usually spotlight is separate. Let's find the first spotlight item.
        const spotlightItem = result.find(e => e.spotlight === true);
        if (spotlightItem) {
            renderSpotlight(spotlightItem);
            // Optional: Remove spotlight from grid? 
            // result = result.filter(e => e.id !== spotlightItem.id);
        }

        // 2. Filter by Search
        if (STATE.filters.search) {
            const term = STATE.filters.search.toLowerCase();
            result = result.filter(e => 
                e.title.toLowerCase().includes(term) || 
                e.description.toLowerCase().includes(term)
            );
        }

        // 3. Filter by Type
        if (STATE.filters.type !== 'all') {
            result = result.filter(e => e.type === STATE.filters.type);
        }

        // 4. Sort
        result.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            switch (STATE.sort) {
                case 'newest': return dateB - dateA;
                case 'oldest': return dateA - dateB;
                case 'popular': return (b.popularity || 0) - (a.popularity || 0);
                default: return 0;
            }
        });

        renderGrid(result);
    }

    // --- 5. Event Listeners ---

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
        STATE.filters.search = e.target.value;
        processAndRender();
    });

    // Filter Buttons
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Toggle
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Logic
            STATE.filters.type = btn.dataset.filter;
            processAndRender();
        });
    });

    // Sort Select
    DOM.sortSelect.addEventListener('change', (e) => {
        STATE.sort = e.target.value;
        processAndRender();
    });

    // --- 6. Start ---
    initParticles();
    loadEvents();
});