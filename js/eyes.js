document.addEventListener('mousemove', (e) => {
    const pupils = document.querySelectorAll('.pupil');
    
    pupils.forEach(pupil => {
        // Obtenemos la posición del centro del ojo
        const rect = pupil.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;

        // Ángulo entre el cursor y el ojo
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        
        // Radio de movimiento (ajusta este número para que no se salga del ojo)
        const distance = 25; 

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});