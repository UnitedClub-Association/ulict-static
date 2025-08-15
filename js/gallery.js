document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, shapes;

    const setSize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };

    const createShapes = () => {
        shapes = [];
        const shapeCount = Math.floor((width * height) / 15000);
        for (let i = 0; i < shapeCount; i++) {
            shapes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(122, 162, 247, 0.3)';
        
        shapes.forEach(shape => {
            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;

            // Boundary check
            if (shape.x < 0 || shape.x > width) shape.vx *= -1;
            if (shape.y < 0 || shape.y > height) shape.vy *= -1;

            // Draw shape (simple rotating line)
            ctx.beginPath();
            ctx.moveTo(shape.x + Math.cos(shape.angle) * shape.size * 5, shape.y + Math.sin(shape.angle) * shape.size * 5);
            ctx.lineTo(shape.x - Math.cos(shape.angle) * shape.size * 5, shape.y - Math.sin(shape.angle) * shape.size * 5);
            ctx.lineWidth = shape.size / 2;
            ctx.stroke();
            shape.angle += 0.005;
        });

        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => {
        setSize();
        createShapes();
    });

    setSize();
    createShapes();
    draw();

    // Animate hero text
    if (typeof gsap !== 'undefined') {
        gsap.from('.hero-content > *', {
            opacity: 0,
            y: 20,
            duration: 1,
            stagger: 0.3,
            delay: 0.5
        });
    }
});
