// ─────────────────────────────────────────────────────────────
//  Menú móvil
// ─────────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('is-active');
    menuToggle.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';

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
//  Scroll suave (offset del navbar con JS)
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism (IntersectionObserver con sentinel)
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    // Crear sentinel como primer hijo de #about
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    // Aseguramos que #about tenga position: relative (agregado en CSS)
    aboutSection.prepend(sentinel);

    const navObserver = new IntersectionObserver(
        ([entry]) => {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        },
        { threshold: 0 }
    );
    navObserver.observe(sentinel);
}