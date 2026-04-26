// 1. Seleccionamos las pupilas una sola vez fuera del evento
const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    // 2. Usamos requestAnimationFrame para optimizar el rendimiento visual
    requestAnimationFrame(() => {
        pupils.forEach(pupil => {
            const rect = pupil.getBoundingClientRect();
            const pupilCenterX = rect.left + rect.width / 2;
            const pupilCenterY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - pupilCenterX;
            const deltaY = e.clientY - pupilCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            
            // El límite de 15px mantiene las pupilas dentro del área blanca
            const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 10, 15);
            
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});
 