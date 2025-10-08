document.addEventListener('DOMContentLoaded', () => {
    // Check for GSAP and required plugins
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded.");
        return;
    }
    if (typeof Flip === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP Flip or ScrollTrigger plugin not loaded. Please add the script tags.");
        return;
    }

    gsap.registerPlugin(Flip, ScrollTrigger);

    // --- 1. STATE & DOM REFERENCES ---
    let allEvents = [];
    let currentCategoryFilter = 'all';
    let currentSortOrder = 'newest-to-oldest';

    const grid = document.getElementById('events-grid');
    const featuredContainer = document.getElementById('featured-event-container');
    const categoryFilters = document.getElementById('category-filters');
    const sortSelect = document.getElementById('sort-select');
    const cardTemplate = document.getElementById('event-card-template');

    // --- 2. DATA FETCHING ---
    async function fetchEvents() {
        if (grid) grid.innerHTML = `<div class="loading-spinner"></div>`;
        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allEvents = await response.json();
            
            renderFeaturedEvent();
            renderGridEvents(true);
            updateFilterCounts();
            
            // --- THE FIX ---
            // Previously, this was in init(). Now it waits for all data and rendering to complete.
            initScrollTriggers();

        } catch (error) {
            console.error("Could not fetch events data:", error);
            if (grid) grid.innerHTML = `<p class="error-message">Could not load events.</p>`;
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
        card.setAttribute('data-anim', 'fade-up');
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
    }

    function renderGridEvents() {
        if (!grid || !cardTemplate) return;
        const cards = Array.from(grid.children);
        const state = Flip.getState(cards, { props: "opacity, filter" });
        const filteredEvents = allEvents.filter(event => !event.spotlight).filter(event => currentCategoryFilter === 'all' || event.type === currentCategoryFilter);
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
            const card = cardTemplate.content.cloneNode(true).firstElementChild;
            populateCard(card, event);
            grid.appendChild(card);
        });
        feather.replace();
        Flip.from(state, {
            duration: 0.7,
            ease: "power3.inOut",
            stagger: 0.05,
            absolute: true,
            onEnter: elements => gsap.from(elements, { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.1 }),
            onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.5 })
        });
    }

    function populateCard(cardElement, event) {
        cardElement.href = event.link;
        const { image, icon, type, title, description, date, endDate } = event;
        const status = getEventStatus(date, endDate);
        const imageWrapper = cardElement.querySelector('.card-image-wrapper');
        const imageContent = image ? `<img src="${image}" alt="${title}" class="card-image" loading="lazy">` : `<div class="placeholder-icon"><i data-feather="${icon || 'star'}"></i></div>`;
        imageWrapper.innerHTML = `${imageContent}<div class="card-status ${status.class}">${status.text}</div>`;
        cardElement.querySelector('.card-tag').textContent = type.replace('-', ' ');
        cardElement.querySelector('.card-tag').className = `card-tag tag-${type}`;
        cardElement.querySelector('h4').textContent = title;
        cardElement.querySelector('p').textContent = description;
        cardElement.querySelector('.card-date-text').textContent = formatDate(date, endDate);
    }

    // --- 4. HELPER FUNCTIONS ---
    function getEventStatus(startDateString, endDateString) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startDate = new Date(startDateString); startDate.setHours(0, 0, 0, 0);
        if (endDateString) {
            const endDate = new Date(endDateString); endDate.setHours(23, 59, 59, 999);
            if (today >= startDate && today <= endDate) return { text: 'Live', class: 'status-live' };
            if (today < startDate) return { text: 'Upcoming', class: 'status-upcoming' };
            return { text: 'Past', class: 'status-past' };
        } else {
            if (today.getTime() === startDate.getTime()) return { text: 'Live', class: 'status-live' };
            if (today < startDate) return { text: 'Upcoming', class: 'status-upcoming' };
            return { text: 'Past', class: 'status-past' };
        }
    }
    
    function formatDate(startDateString, endDateString) {
        const startDate = new Date(startDateString); const options = { month: 'long', day: 'numeric' };
        if (endDateString) {
            const endDate = new Date(endDateString);
            if (startDate.getFullYear() === endDate.getFullYear()) {
                 if (startDate.getMonth() === endDate.getMonth()) { return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`; }
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
            const count = filter === 'all' ? nonSpotlightEvents.length : nonSpotlightEvents.filter(e => e.type === filter).length;
            let countEl = btn.querySelector('.count');
            if (!countEl) { countEl = document.createElement('span'); countEl.className = 'count'; btn.appendChild(countEl); }
            countEl.textContent = count;
        });
    }

    // --- 5. ANIMATIONS (UPGRADED) ---
    
    function animateHeroCarousel() {
        const carousel = document.querySelector(".text-carousel .carousel-inner");
        const subtitle = document.querySelector(".hero-subtitle");
        if (!carousel) return;

        const originalItems = Array.from(carousel.querySelectorAll(".carousel-item")).slice(0, -1);
        const itemHeight = originalItems[0].clientHeight;
        const cycles = 6;
        const targetWord = "Events";
        
        carousel.innerHTML = '';
        for (let i = 0; i < cycles; i++) {
            originalItems.forEach(item => carousel.appendChild(item.cloneNode(true)));
        }
        originalItems.forEach(item => carousel.appendChild(item.cloneNode(true)));

        const allItems = Array.from(carousel.children);
        const targetIndex = allItems.findIndex((item, index) => 
            index >= cycles * originalItems.length && item.textContent.trim() === targetWord
        );

        const finalY = -targetIndex * itemHeight;
        gsap.set(subtitle, { opacity: 0, y: 20 });

        const tl = gsap.timeline();
        tl.to(carousel, { y: finalY, duration: cycles, ease: "expo.inOut", })
          .to(subtitle, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=0.8");
    }

    function initScrollTriggers() {
        gsap.utils.toArray('[data-anim="fade-up"]').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 50, duration: 1, ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
        gsap.from('.filter-btn', {
            opacity: 0, y: 30, duration: 0.8, ease: 'expo.out', stagger: 0.1,
            scrollTrigger: { trigger: '.filter-controls', start: 'top 85%', toggleActions: 'play none none none' }
        });
    }

    // --- 6. EVENT LISTENERS ---
    function setupEventListeners() {
        categoryFilters?.addEventListener('click', e => {
            const button = e.target.closest('.filter-btn');
            if (!button) return;
            
            if (!button.classList.contains('active')) {
                currentCategoryFilter = button.dataset.filter;
                document.querySelectorAll('#category-filters .filter-btn').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                renderGridEvents();
            }
        });

        sortSelect?.addEventListener('change', e => {
            currentSortOrder = e.target.value;
            renderGridEvents();
        });
    }

    // --- 7. INITIALIZATION ---
    function init() {
        // Run animations that don't depend on fetched data
        animateHeroCarousel();
        // Fetch data, which will then trigger the rest of the animations
        fetchEvents();
        setupEventListeners();
    }

    init();
});

