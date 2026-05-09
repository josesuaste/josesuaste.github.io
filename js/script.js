/* ===========================
   MENÚ HAMBURGUESA (toggle)
   =========================== */
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

function openMenu() {
    navLinksContainer.classList.add('animate', 'is-active');
    menuToggle.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
}

function closeMenu() {
    navLinksContainer.classList.add('animate');
    navLinksContainer.classList.remove('is-active');
    menuToggle.classList.remove('is-active');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');

    navLinksContainer.addEventListener('transitionend', function handler() {
        navLinksContainer.classList.remove('animate');
        navLinksContainer.removeEventListener('transitionend', handler);
    });
}

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.contains('is-active');
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

navLinksItems.forEach(link => {
    link.addEventListener('click', closeMenu);
});

/* ===========================
   SCROLL SUAVE PARA ANCLAS
   =========================== */
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

/* ===========================
   GLASSMORFISMO EN NAVBAR (IntersectionObserver)
   =========================== */
const navbar = document.querySelector('.navbar');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(sentinel);

const navObserver = new IntersectionObserver(
    ([entry]) => {
        navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
);
navObserver.observe(sentinel);