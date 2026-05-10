// ─────────────────────────────────────────────────────────────
//  Menú móvil
//  FIX: agregado aria-expanded y aria-label dinámico
// ─────────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('is-active');
    menuToggle.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // FIX: actualizar aria-expanded para screen readers
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

// Cerrar menú al hacer clic en un enlace
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('is-active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    });
});

// ─────────────────────────────────────────────────────────────
//  Scroll suave para enlaces internos
//  El CSS ya maneja scroll-behavior: smooth en html {}.
//  Este bloque JS añade el offset del navbar sticky.
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
        });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism al hacer scroll
//  Usamos un sentinel de 1px al inicio del about-section.
//  Cuando ese punto sale del viewport → navbar activa glassmorphism.
//  Más preciso y eficiente que un scroll listener por frames.
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');

// Crear un sentinel invisible justo al inicio del about-section
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    aboutSection.insertAdjacentElement('beforebegin', sentinel);

    const navObserver = new IntersectionObserver(
        ([entry]) => {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '0px' }
    );
    navObserver.observe(sentinel);
}