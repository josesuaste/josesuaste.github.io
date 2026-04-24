// 1. Seguimiento de pupilas (Vigilancia constante)
document.addEventListener('mousemove', (e) => {
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = 12; 
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// 2. Bloqueo Maestro (Evita ese primer parpadeo)
const fixDesign = () => {
    const elements = document.querySelectorAll('.hero-center, .eyes-layer, .corner-nav, .site-footer');
    elements.forEach(el => {
        // Bloqueamos la animación y forzamos la opacidad final
        el.style.setProperty('animation', 'none', 'important');
        if(el.classList.contains('eyes-layer')) {
            el.style.setProperty('opacity', '0.3', 'important');
        } else {
            el.style.setProperty('opacity', '1', 'important');
        }
    });
};

// Si el usuario mueve la ventana, bloqueamos INSTANTÁNEAMENTE
window.addEventListener('resize', fixDesign);

// También bloqueamos automáticamente después de que termine la intro
window.addEventListener('load', () => {
    setTimeout(fixDesign, 3500); 
});