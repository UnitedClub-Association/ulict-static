document.addEventListener('DOMContentLoaded', () => {
    
    // --- Config ---
    const METADATA_PATH = '/data/leaderboard/metadata.json';
    
    // --- State ---
    let seasonsMeta = [];
    let currentSeasonId = '';
    let currentSeasonData = [];
    let searchTerm = '';

    // --- DOM ---
    const listEl = document.querySelector('.leaderboard-list');
    const podiumEl = document.getElementById('podium-display');
    const seasonTrack = document.getElementById('season-selector');
    const searchInput = document.getElementById('memberSearch');
    const zeroStateEl = document.getElementById('zero-points-message');
    const seasonDateEl = document.getElementById('season-date-range');
    const activeBadgeEl = document.getElementById('active-season-badge');

    if (!listEl) return;

    // --- 1. Init: Fetch Metadata ---
    fetch(METADATA_PATH)
        .then(res => res.json())
        .then(meta => {
            seasonsMeta = meta.seasons;
            currentSeasonId = meta.current_season; // Default to current
            
            // Build Tabs
            renderSeasonTabs();
            
            // Load Default Season
            loadSeason(currentSeasonId);
        })
        .catch(err => {
            console.error('Meta Load Error', err);
            listEl.innerHTML = '<li style="padding:2rem; text-align:center;">Error initializing database connection.</li>';
        });

    // --- 2. Render Tabs ---
    function renderSeasonTabs() {
        seasonTrack.innerHTML = '';
        seasonsMeta.forEach(season => {
            const btn = document.createElement('button');
            btn.className = `season-btn ${season.id === currentSeasonId ? 'active' : ''}`;
            btn.textContent = season.name;
            btn.dataset.id = season.id;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadSeason(season.id);
            });
            
            seasonTrack.appendChild(btn);
        });
    }

    // --- 3. Load Season Data ---
    function loadSeason(id) {
        currentSeasonId = id;
        const seasonInfo = seasonsMeta.find(s => s.id === id);
        
        // Update UI Text
        seasonDateEl.textContent = seasonInfo.date;
        activeBadgeEl.textContent = seasonInfo.status === 'active' ? '● Live Season' : 'Archived Season';
        activeBadgeEl.style.color = seasonInfo.status === 'active' ? 'var(--lb-secondary)' : 'var(--lb-text-muted)';
        activeBadgeEl.style.borderColor = seasonInfo.status === 'active' ? 'rgba(94, 234, 212, 0.3)' : 'rgba(255,255,255,0.1)';

        // Show loading
        listEl.innerHTML = '<li class="loading-state">Retrieving records...</li>';
        zeroStateEl.style.display = 'none';
        podiumEl.style.display = 'none';

        fetch(seasonInfo.file)
            .then(res => res.json())
            .then(data => {
                currentSeasonData = data;
                renderView({ animate: true });
            })
            .catch(err => {
                console.error(err);
                listEl.innerHTML = '<li style="padding:2rem;">Data not found for this season.</li>';
            });
    }

    // --- 4. Render View ---
    function renderView({ animate = false } = {}) {
        let filtered = currentSeasonData.filter(m => 
            m.name.toLowerCase().includes(searchTerm)
        );

        // Sort: If all points are 0, sort alphabetically. Else sort by points.
        const totalPoints = filtered.reduce((acc, curr) => acc + curr.points, 0);
        const hasPoints = totalPoints > 0;

        if (hasPoints) {
            filtered.sort((a, b) => b.points - a.points);
        } else {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        listEl.innerHTML = '';
        
        // Handle Zero State / Podium Visibility
        if (!hasPoints && searchTerm === '') {
            zeroStateEl.style.display = 'block'; // Show "Season in Progress"
            podiumEl.style.display = 'none';
        } else if (hasPoints && filtered.length >= 3 && searchTerm === '') {
            zeroStateEl.style.display = 'none';
            podiumEl.style.display = 'flex';
            // TODO: Render Podium (Skipping for now as data is 0)
        } else {
            zeroStateEl.style.display = 'none';
            podiumEl.style.display = 'none';
        }

        if (filtered.length === 0) {
            listEl.innerHTML = '<li style="padding:2rem; text-align:center;">No members found.</li>';
            return;
        }

        // Render List
        const fragment = document.createDocumentFragment();
        filtered.forEach((m, idx) => {
            const li = document.createElement('li');
            const rankDisplay = hasPoints ? `#${idx + 1}` : '-'; // Don't show rank 1,2,3 if everyone is 0
            
            li.innerHTML = `
                <div class="rank-num">${rankDisplay}</div>
                <div class="member-info">${m.name}</div>
                <div class="desktop-only">
                    <span class="specialty-badge">${m.specialty}</span>
                </div>
                <div class="points-val">${m.points}</div>
            `;
            fragment.appendChild(li);
        });
        
        listEl.appendChild(fragment);

        // Animation
        if (animate && window.gsap) {
            gsap.from(listEl.children, {
                y: 10, opacity: 0, duration: 0.4, stagger: 0.03, clearProps: 'all'
            });
        }
        
        if (window.feather) feather.replace();
    }

    // --- Search ---
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase().trim();
        renderView({ animate: false });
    });
});