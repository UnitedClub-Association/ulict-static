// /executives-js/2024-25.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Interactive Spotlight Effect ---
    // This replaces the old 3D tilt effect with something more fitting for the new dossier design.
    const dossiers = document.querySelectorAll('.executive-dossier');

    dossiers.forEach(dossier => {
        dossier.addEventListener('mousemove', (e) => {
            const rect = dossier.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            dossier.style.setProperty('--mouse-x', `${x}px`);
            dossier.style.setProperty('--mouse-y', `${y}px`);
        });

        dossier.addEventListener('mouseleave', () => {
            // Optional: Reset if you want the glow to disappear completely on mouse leave
        });
    });

    // --- Feather Icons ---
    // Make sure feather icons are replaced after the DOM is loaded.
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
