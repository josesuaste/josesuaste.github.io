document.addEventListener('mousemove', (e) => {
    const eyesContainer = document.querySelector('.eyes-layer');
    const pupils = document.querySelectorAll('.pupil');

    // Abrir párpados al primer movimiento
    if (!eyesContainer.classList.contains('eyes-open')) {
        eyesContainer.classList.add('eyes-open');
    }

    // Movimiento de pupilas
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = 12; // Qué tanto se mueve la pupila
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
});