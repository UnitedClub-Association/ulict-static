document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded.");
        return;
    }

    // --- 1. STATE & DOM REFERENCES ---
    let allEvents = [];
    let currentCategoryFilter = 'all';
    let currentSortOrder = 'newest-to-oldest';

    const grid = document.getElementById('events-grid');
    const featuredContainer = document.getElementById('featured-event-container');
    const categoryFilters = document.getElementById('category-filters');
    const sortSelect = document.getElementById('sort-select');

    // --- 2. DATA FETCHING ---
    async function fetchEvents() {
        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allEvents = await response.json();
            renderFeaturedEvent();
            renderGridEvents();
            updateFilterCounts();
        } catch (error) {
            console.error("Could not fetch events data:", error);
            grid.innerHTML = `<p class="error-message">Could not load events.</p>`;
        }
    }

    // --- 3. RENDERING LOGIC ---

    function renderFeaturedEvent() {
        if (!featuredContainer) return;
        const featuredEvent = allEvents.find(event => event.spotlight);
        if (!featuredEvent) {
            featuredContainer.style.display = 'none';
            return;
        }

        const { link, image, title, description, date, endDate } = featuredEvent;
        const status = getEventStatus(date, endDate);

        const card = document.createElement('a');
        card.href = link;
        card.className = 'featured-card';
        card.innerHTML = `
            <div class="featured-image-wrapper">
                <img src="${image}" alt="${title}" class="featured-image" loading="lazy">
                <div class="card-status ${status.class}">${status.text}</div>
            </div>
            <div class="featured-content">
                <div>
                    <span class="card-tag tag-main-event">Spotlight Event</span>
                    <h3>${title}</h3>
                </div>
                <p>${description}</p>
                <div class="featured-footer">
                    <div class="featured-date">
                        <i data-feather="calendar"></i>
                        <span>${formatDate(date, endDate)}</span>
                    </div>
                    <span class="featured-cta">View Details</span>
                </div>
            </div>
        `;
        featuredContainer.innerHTML = '';
        featuredContainer.appendChild(card);
        gsap.from(card, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
    }

    function renderGridEvents() {
        if (!grid) return;

        const filteredEvents = allEvents
            .filter(event => !event.spotlight)
            .filter(event => currentCategoryFilter === 'all' || event.type === currentCategoryFilter);

        const sortedEvents = filteredEvents.sort((a, b) => {
            switch (currentSortOrder) {
                case 'oldest-to-newest': return new Date(a.date) - new Date(b.date);
                case 'most-popular': return b.popularity - a.popularity;
                case 'least-popular': return a.popularity - b.popularity;
                default: return new Date(b.date) - new Date(a.date);
            }
        });

        grid.innerHTML = '';
        if (sortedEvents.length === 0) {
            grid.innerHTML = `<p class="no-results-message">No events found.</p>`;
            return;
        }

        sortedEvents.forEach(event => {
            const card = document.createElement(event.isPlaceholder ? 'div' : 'a');
            card.className = 'hub-card';
            if (!event.isPlaceholder) card.href = event.link;

            const { image, icon, type, title, description, date, endDate } = event;
            const status = getEventStatus(date, endDate);
            const imageContent = image ? `<img src="${image}" alt="${title}" class="card-image" loading="lazy">` : `<div class="placeholder-icon"><i data-feather="${icon || 'star'}"></i></div>`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${imageContent}
                    <div class="card-status ${status.class}">${status.text}</div>
                </div>
                <div class="card-content">
                    <span class="card-tag tag-${type}">${type.replace('-', ' ')}</span>
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <div class="card-footer">
                        <i data-feather="calendar"></i>
                        <span>${formatDate(date, endDate)}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        feather.replace();
        gsap.from(".hub-card", { opacity: 0, y: 30, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
    }

    // --- 4. HELPER FUNCTIONS (UPGRADED) ---

    function getEventStatus(startDateString, endDateString) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(startDateString);
        startDate.setHours(0, 0, 0, 0);

        if (endDateString) { // Multi-day event logic
            const endDate = new Date(endDateString);
            endDate.setHours(0, 0, 0, 0);
            if (today >= startDate && today <= endDate) return { text: 'Live', class: 'status-live' };
            if (today < startDate) return { text: 'Upcoming', class: 'status-upcoming' };
            return { text: 'Past', class: 'status-past' };
        } else { // Single-day event logic
            if (today.getTime() === startDate.getTime()) return { text: 'Live', class: 'status-live' };
            if (today < startDate) return { text: 'Upcoming', class: 'status-upcoming' };
            return { text: 'Past', class: 'status-past' };
        }
    }
    
    function formatDate(startDateString, endDateString) {
        const startDate = new Date(startDateString);
        const options = { month: 'long', day: 'numeric' };
        if (endDateString) {
            const endDate = new Date(endDateString);
            if (startDate.getFullYear() === endDate.getFullYear()) {
                return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', {...options, year: 'numeric'})}`;
            }
            return `${startDate.toLocaleDateString('en-US', {...options, year: 'numeric'})} - ${endDate.toLocaleDateString('en-US', {...options, year: 'numeric'})}`;
        }
        return startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function updateFilterCounts() {
        const nonSpotlightEvents = allEvents.filter(event => !event.spotlight);
        document.querySelectorAll('#category-filters .filter-btn').forEach(btn => {
            const filter = btn.dataset.filter;
            const count = filter === 'all' 
                ? nonSpotlightEvents.length 
                : nonSpotlightEvents.filter(e => e.type === filter).length;
            
            let countEl = btn.querySelector('.count');
            if (!countEl) {
                countEl = document.createElement('span');
                countEl.className = 'count';
                btn.appendChild(countEl);
            }
            countEl.textContent = count;
        });
    }

    // --- 5. EVENT LISTENERS ---
    function setupEventListeners() {
        categoryFilters?.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                currentCategoryFilter = e.target.dataset.filter;
                document.querySelectorAll('#category-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderGridEvents();
            }
        });

        sortSelect?.addEventListener('change', e => {
            currentSortOrder = e.target.value;
            renderGridEvents();
        });
    }

    // --- 6. INITIALIZATION ---
    function init() {
        fetchEvents();
        setupEventListeners();
    }

    init();
});

