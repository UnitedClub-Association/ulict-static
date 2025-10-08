document.addEventListener('DOMContentLoaded', () => {
    // Check for GSAP and required plugins
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger plugin not loaded.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. HERO ANIMATION ---
    function animateHero() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroTitle || !heroSubtitle) return;

        gsap.set(heroSubtitle, { opacity: 0, y: 20 });
        
        const tl = gsap.timeline({ delay: 0.5 });
        // Animate the custom properties for the CSS glitch effect
        tl.to(heroTitle, {
            '--glitch-opacity1': 1,
            '--glitch-opacity2': 1,
            duration: 0.8,
            ease: "power2.inOut",
        }).to(heroTitle, {
            '--glitch-opacity1': 0,
            '--glitch-opacity2': 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, ">0.2")
        .to(heroSubtitle, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, "-=1");
    }

    // --- 2. DATA FETCHING & PROCESSING ---
    async function fetchAndRenderEvents() {
        const categories = {
            workshop: document.getElementById('workshops-grid'),
            challenge: document.getElementById('challenges-grid'),
            talk: document.getElementById('talks-grid')
        };

        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const allEvents = await response.json();

            const miniEvents = allEvents.filter(event => event.type === 'mini-event');

            const categorizedEvents = {
                workshop: miniEvents.filter(e => e.subType === 'workshop').sort((a, b) => new Date(b.date) - new Date(a.date)),
                challenge: miniEvents.filter(e => e.subType === 'challenge').sort((a, b) => new Date(b.date) - new Date(a.date)),
                talk: miniEvents.filter(e => e.subType === 'talk').sort((a, b) => new Date(b.date) - new Date(a.date)),
            };

            // Render each category
            for (const category in categories) {
                renderCategoryGrid(categorizedEvents[category], categories[category]);
            }

            feather.replace();
            initScrollTriggers();

        } catch (error) {
            console.error("Could not fetch events data:", error);
            // Show error in all grids
            for (const key in categories) {
                if(categories[key]) categories[key].innerHTML = `<p class="error-message">Could not load mini events.</p>`;
            }
        }
    }

    // --- 3. DYNAMIC RENDERING LOGIC ---
    function renderCategoryGrid(events, gridElement) {
        if (!gridElement) return;
        const cardTemplate = document.getElementById('event-card-template');
        if (!cardTemplate) return;

        gridElement.innerHTML = ''; // Clear spinner

        // If a category has no events, hide the entire section for a cleaner UI
        if (events.length === 0) {
            gridElement.parentElement.style.display = 'none';
            return;
        }

        events.forEach(event => {
            const card = cardTemplate.content.cloneNode(true).firstElementChild;
            
            card.href = event.link || '#';
            card.dataset.category = event.subType;

            const banner = card.querySelector('.card-banner');
            banner.querySelector('img').src = event.image || 'https://placehold.co/600x400/162C46/FF9800?text=ULIC';
            banner.querySelector('img').alt = event.title;

            // Inject status badge
            const status = getEventStatus(event.date, event.endDate);
            banner.insertAdjacentHTML('beforeend', `<div class="card-status ${status.class}">${status.text}</div>`);

            const tag = card.querySelector('.card-tag');
            tag.textContent = event.subType;
            tag.className = `card-tag tag-${event.subType}`;

            card.querySelector('.card-title').textContent = event.title;
            card.querySelector('.card-desc').textContent = event.description;
            card.querySelector('.card-date').textContent = new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            if (!event.link || event.link === '#') {
                card.classList.add('disabled');
                card.removeAttribute('href');
            }

            gridElement.appendChild(card);
        });
    }

    // --- 4. SCROLL ANIMATIONS ---
    function initScrollTriggers() {
        gsap.utils.toArray('.event-category-section').forEach(section => {
            // Only animate sections that are visible (i.e., not hidden due to no events)
            if (getComputedStyle(section).display !== 'none') {
                const title = section.querySelector('.category-title');
                const cards = section.querySelectorAll('.event-card');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
                
                tl.from(title, { opacity: 0, x: -50, duration: 0.8, ease: 'expo.out' })
                  .from(cards, { opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, "-=0.5");
            }
        });
    }

    // --- 5. HELPER FUNCTIONS ---
    function getEventStatus(startDateString, endDateString) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startDate = new Date(startDateString); startDate.setHours(0, 0, 0, 0);
        
        if (endDateString) {
            const endDate = new Date(endDateString); endDate.setHours(23, 59, 59, 999);
            if (today >= startDate && today <= endDate) return { text: 'Live', class: 'status-live' };
        } else {
            if (today.getTime() === startDate.getTime()) return { text: 'Today', class: 'status-live' };
        }

        if (today < startDate) return { text: 'Upcoming', class: 'status-upcoming' };
        return { text: 'Past', class: 'status-past' };
    }

    // --- 6. INITIALIZATION ---
    function init() {
        animateHero();
        fetchAndRenderEvents();
    }

    init();
});