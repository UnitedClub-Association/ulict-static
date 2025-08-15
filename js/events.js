document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error("GSAP not loaded. Animations will not work.");
        return;
    }

    // --- Hero Text Carousel Animation ---
    const carouselInner = document.querySelector('.carousel-inner');
    const items = gsap.utils.toArray('.carousel-item');
    
    if (carouselInner && items.length > 0) {
        // Set the height of the inner container based on the number of items
        const itemHeight = items[0].offsetHeight;
        gsap.set(carouselInner, { height: items.length * itemHeight });

        // The index of the final word "Events"
        const finalItemIndex = items.length - 1;

        // Create a GSAP timeline for the animation
        const tl = gsap.timeline({
            onComplete: () => {
                // Optional: add a class to the body to indicate animation is done
                document.body.classList.add('hero-animation-complete');
            }
        });

        // --- Animation Logic ---
        // 1. Rapidly cycle through the first set of words
        items.slice(0, finalItemIndex).forEach((item, i) => {
            tl.to(carouselInner, {
                y: `-${(i + 1) * itemHeight}px`,
                duration: 0.15, // Very fast transition
                ease: 'power1.in'
            }, `>${i * 0.1}`); // Stagger the start times slightly
        });

        // 2. Settle on the final word "Events"
        tl.to(carouselInner, {
            y: `-${finalItemIndex * itemHeight}px`,
            duration: 1.5, // Slower, more deliberate duration
            ease: 'power4.out' // A nice easing effect to settle
        }, ">0.5"); // Add a slight pause before the final animation

    } else {
        console.warn("Carousel elements not found.");
    }

    // --- Scroll-triggered animations for other sections ---
    gsap.registerPlugin(ScrollTrigger);

    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: index * 0.1 // Stagger the animation
        });
    });
    
    // Animate event cards
    gsap.from('.event-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.events-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animate activity cards
    gsap.from('.activity-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.horizontal-scroll-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});
