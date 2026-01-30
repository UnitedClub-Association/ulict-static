document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dependencies Check ---
    if (typeof anime === 'undefined') {
        console.error("Anime.js not loaded.");
        return;
    }

    // --- 2. Animations ---
    function playAnimations() {
        const timeline = anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        });

        // Icon Pop
        timeline.add({
            targets: '.icon-wrapper',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 800
        })
        // Text Reveal
        .add({
            targets: '.glitch-text .letters',
            opacity: [0, 1],
            translateY: ["1.1em", 0],
            translateZ: 0,
            duration: 750,
            delay: (el, i) => 50 * i
        }, '-=400')
        // Card Slide Up
        .add({
            targets: '.message-card',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000
        }, '-=600')
        // Button Fade In
        .add({
            targets: '.cta-button',
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 800
        }, '-=800');
    }

    // --- 3. Text Wrapping for Animation ---
    const textWrapper = document.querySelector('.glitch-text .letters');
    if (textWrapper) {
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        // Hide letters initially to prevent flash
        document.querySelectorAll('.glitch-text .letter').forEach(el => el.style.opacity = 0);
    }

    // --- Init ---
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Slight delay to ensure fonts load
    setTimeout(playAnimations, 300);
});