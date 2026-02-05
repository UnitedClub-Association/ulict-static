/**
 * ULIC RECRUITMENT PORTAL
 * Features: Audio Synth, Smooth Intro, 2D Particles, Anime.js Transitions
 */

// --- 1. AUDIO SYNTHESIZER (No external files needed) ---
let audioCtx;

const initAudio = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (freq, type, duration, vol = 0.1) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type; // sine, square, triangle, sawtooth
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

// SFX Library
const sfx = {
    hover: () => playTone(300, 'sine', 0.1, 0.05),
    click: () => playTone(600, 'square', 0.1, 0.05),
    type: () => playTone(800 + Math.random() * 200, 'triangle', 0.05, 0.02),
    introStart: () => playTone(200, 'sawtooth', 0.5, 0.1),
    reveal: () => playTone(400, 'sine', 0.8, 0.1)
};

// Bind to DOM
document.addEventListener('DOMContentLoaded', () => {
    // Bind hover/click globally for efficiency
    document.body.addEventListener('mouseenter', (e) => {
        if(e.target.closest('.role-card') || e.target.closest('button')) {
            initAudio(); // Ensure context is ready
            sfx.hover();
        }
    }, true);

    document.body.addEventListener('click', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) {
            initAudio();
            sfx.click();
        }
    }, true);
});

// --- 2. 2D CANVAS BACKGROUND ---
const initCanvas = () => {
    const canvas = document.getElementById('canvas-container');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    };
    window.addEventListener('resize', resize);
    resize();

    class P {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.s = Math.random() * 2;
            this.a = Math.random() * 0.5;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if(this.x<0||this.x>w||this.y<0||this.y>h) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255,255,255,${this.a})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.s, 0, Math.PI*2);
            ctx.fill();
        }
    }

    for(let i=0; i<50; i++) particles.push(new P());

    const loop = () => {
        ctx.clearRect(0,0,w,h);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    };
    loop();
};

// --- 3. INTRO SEQUENCE ---
const runIntro = () => {
    const textEl = document.getElementById('intro-text');
    const overlay = document.getElementById('intro-overlay');
    const btnWrap = document.getElementById('intro-btn-wrapper');
    const grid = document.getElementById('role-grid');

    if (!textEl || !overlay) return;

    // Check localStorage
    if (localStorage.getItem('ulic_intro_seen')) {
        overlay.style.display = 'none';
        if (grid) {
            grid.classList.remove('hidden');
            grid.style.opacity = 1;
            
            // Immediate reveal without heavy stagger animation
            const titles = grid.querySelectorAll('#grid-title, #grid-line, #grid-sub');
            titles.forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
            const cards = grid.querySelectorAll('.role-card');
            cards.forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
        }
        return;
    }

    // --- PLAY INTRO IF NOT SEEN ---
    
    gsap.registerPlugin(TextPlugin);

    const timeline = gsap.timeline({
        onStart: () => {
            // Try to start audio if allowed, otherwise wait for click
            initAudio();
        }
    });

    const lines = [
        "Hello.",
        "Welcome to ULIC.",
        "We cultivate uniqueness.",
        "To be an executive, you must be skilled."
    ];

    // Build Timeline
    lines.forEach(line => {
        // Type In
        timeline.to(textEl, {
            duration: line.length * 0.06,
            text: line,
            ease: "none",
            onUpdate: () => {
                // Random typing sounds
                if(Math.random() > 0.8) sfx.type(); 
            }
        });
        // Wait
        timeline.to(textEl, { duration: 0.8 });
        // Clear
        timeline.to(textEl, { duration: 0.3, opacity: 0, onComplete: () => {
            textEl.innerText = "";
            textEl.style.opacity = 1;
        }});
    });

    // Reveal Button
    timeline.to(btnWrap, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

    // Interaction
    const btn = document.getElementById('enter-btn');
    if(btn) {
        btn.addEventListener('click', () => {
            sfx.reveal();
            
            // Set flag in localStorage
            localStorage.setItem('ulic_intro_seen', 'true');

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    overlay.style.display = 'none';
                    if(grid) {
                        grid.classList.remove('hidden');
                        revealGrid();
                    }
                }
            });
        });
    }
};

const revealGrid = () => {
    const grid = document.getElementById('role-grid');
    grid.style.opacity = 1;

    // Anime.js Stagger
    anime({
        targets: ['#grid-title', '#grid-line', '#grid-sub'],
        opacity: [0, 1],
        translateY: [-20, 0],
        delay: anime.stagger(200),
        duration: 1000,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '.role-card',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(100, {start: 600}),
        duration: 800,
        easing: 'easeOutBack'
    });
};

// --- INIT ---
window.addEventListener('load', () => {
    initCanvas();
    const main = document.querySelector('main');
    if(main && main.dataset.namespace === 'home') {
        runIntro();
    } else {
        if(typeof barba !== 'undefined') barba.init();
    }
});