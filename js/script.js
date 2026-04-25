// Cacheo de posiciones de los ojos para evitar reflows constantes
let eyesData = [];

function cacheEyes() {
    const pupils = document.querySelectorAll('.pupil');
    eyesData = Array.from(pupils).map(pupil => {
        const rect = pupil.getBoundingClientRect();
        return {
            pupil,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    });
}

function movePupils(clientX, clientY) {
    eyesData.forEach(({ pupil, centerX, centerY }) => {
        const angle = Math.atan2(clientY - centerY, clientX - centerX);
        const distance = 12;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Throttle con requestAnimationFrame para rendimiento suave
let ticking = false;
function updatePupils(clientX, clientY) {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            movePupils(clientX, clientY);
            ticking = false;
        });
        ticking = true;
    }
}

// Movimiento con mouse
document.addEventListener('mousemove', (e) => {
    updatePupils(e.clientX, e.clientY);
});

// Movimiento táctil CORREGIDO para iOS/Android (e.touches)
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        updatePupils(e.touches.clientX, e.touches.clientY);
    }
}, { passive: true });

// Inicialización al cargar la página
window.addEventListener('load', () => {
    cacheEyes();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    movePupils(centerX, centerY);
});

// Recalcular posiciones si la ventana cambia de tamaño (ej. rotación de móvil)
window.addEventListener('resize', () => {
    cacheEyes();
    // Opcional: recentrar pupilas tras el resize
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    movePupils(centerX, centerY);
});