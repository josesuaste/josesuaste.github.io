// Función unificada para mover las pupilas
function movePupils(clientX, clientY) {
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(clientY - eyeY, clientX - eyeX);
        const distance = 12; 
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Escuchar Mouse
document.addEventListener('mousemove', (e) => {
    movePupils(e.clientX, e.clientY);
});

// Escuchar Touch (Para celulares y iPads)
// ✅ CORREGIDO: e.touches es un array, necesitamos acceder al primer elemento [0]
document.addEventListener('touchmove', (e) => {
    movePupils(e.touches.clientX, e.touches.clientY);
}, { passive: true });

// Inicializar pupilas centradas al cargar la página
window.addEventListener('load', () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    movePupils(centerX, centerY);
});
