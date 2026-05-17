
// ─────────────────────────────────────────────────────────────
//  Menú móvil
//  La transition se agrega/quita por JS para que el resize
//  nunca dispare la animación accidentalmente
// ─────────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

function openMenu() {
    navLinksContainer.classList.add('is-animating');
    requestAnimationFrame(() => {
        navLinksContainer.classList.add('is-active');
    });
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navLinksContainer.classList.add('is-animating');
    navLinksContainer.classList.remove('is-active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    navLinksContainer.addEventListener('transitionend', () => {
        navLinksContainer.classList.remove('is-animating');
    }, { once: true });
}

function closeMenuInstant() {
    navLinksContainer.classList.remove('is-animating', 'is-active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.contains('is-active');
    isOpen ? closeMenu() : openMenu();
});

navLinksItems.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ─────────────────────────────────────────────────────────────
//  Cerrar menú al redimensionar a desktop — sin animación
// ─────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenuInstant();
    }
});

// ─────────────────────────────────────────────────────────────
//  Scroll suave nativo
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism al hacer scroll
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    aboutSection.insertAdjacentElement('beforebegin', sentinel);
    new IntersectionObserver(
        ([entry]) => {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '0px' }
    ).observe(sentinel);
}

// ─────────────────────────────────────────────────────────────
//  Nav link activo al hacer scroll
// ─────────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

sections.forEach(section => {
    new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        },
        { threshold: 0.2 }
    ).observe(section);
});
