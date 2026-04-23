const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    pupils.forEach(pupil => {
        // Usamos getBoundingClientRect del círculo para mayor precisión
        const rect = pupil.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        
        const angle = Math.atan2(dy, dx);
        
        // Limite de movimiento (ajusta según el tamaño de tu SVG)
        const maxDistance = 20; 
        
        // El divisor (20) controla qué tan "rápido" sigue la mirada
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy) / 20, maxDistance);
        
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        // Usamos requestAnimationFrame implícitamente con transiciones CSS
        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});