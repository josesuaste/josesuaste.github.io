// ===========================
// CONTADOR ANIMADO (Optimizado)
// ===========================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    const increment = target / totalFrames;
    let current = 0;
    let frame = 0;

    const animate = () => {
        frame++;
        current += increment;
        
        if (frame < totalFrames) {
            element.textContent = Math.floor(current).toLocaleString('es-MX');
            requestAnimationFrame(animate);
        } else {
            element.textContent = target.toLocaleString('es-MX');
        }
    };
    
    animate();
}

// Intersection Observer para las estadísticas
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
            statsObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

// Observar todos los contadores
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-number').forEach(el => {
        statsObserver.observe(el);
    });
});

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// LAZY LOADING MEJORADO
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// ANIMACIÓN DEL NAVBAR ON SCROLL
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        navbar.style.padding = '15px 50px';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '0 50px';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// FORMULARIO DE CONTACTO
// ===========================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'ENVIANDO...';
        submitBtn.disabled = true;
        
        // Aquí irá tu lógica de envío (Formspree, EmailJS, etc.)
        // Ejemplo simulado:
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        submitBtn.textContent = '✓ ENVIADO';
        submitBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });
}

// ===========================
// CONSOLE EASTER EGG
// ===========================
console.log('%c🎬 fndr — Creado por José Suaste', 
    'font-size: 16px; font-weight: bold; color: #3b59ff;');
console.log('%cSi estás viendo esto, ¡probablemente te gusten las cosas bien hechas! 👨💻', 
    'font-size: 12px; color: #666;');