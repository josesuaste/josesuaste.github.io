document.addEventListener('mousemove', (e) => {
    const pupils = document.querySelectorAll('.pupil');

    // Movimiento de pupilas (Vigilancia constante)
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        // Calculamos el centro real del ojo respecto a la pantalla
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = 12; // Radio de movimiento de la pupila
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
});