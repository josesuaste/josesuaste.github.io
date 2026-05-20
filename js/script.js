'use strict';

// ════════════════════════════════════════════════════════════
//  MENÚ HAMBURGUESA
//  Regla de oro: el overlay (.nav-links) va a z-index 550
//  El toggle (.menu-toggle) va a z-index 600 → siempre encima
//  La X la forman las dos .bar → sin ningún ::before ni elemento extra
// ════════════════════════════════════════════════════════════
(function initMenu() {
    const toggle    = document.querySelector('.menu-toggle');
    const overlay   = document.querySelector('.nav-links');
    const allLinks  = document.querySelectorAll('.nav-links a');
    if (!toggle || !overlay) return;

    let isOpen = false;

    function enableAnimation() {
        overlay.classList.add('is-animating');
    }

    function openMenu() {
        isOpen = true;
        enableAnimation();
        overlay.classList.add('is-active');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        isOpen = false;
        enableAnimation();
        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }

    function closeInstant() {
        isOpen = false;
        overlay.classList.remove('is-animating', 'is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }

    // Quita la clase de transición al terminar, para evitar animaciones raras al cambiar de viewport
    overlay.addEventListener('transitionend', event => {
        if (event.propertyName === 'transform') {
            overlay.classList.remove('is-animating');
        }
    });

    // Click en el botón
    toggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

    // Click en cualquier link del overlay → cerrar
    allLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Resize a desktop → cerrar sin animación
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeInstant();
    });

    // Escape → cerrar
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });
})();


// ════════════════════════════════════════════════════════════
//  NAVBAR GLASSMORPHISM — desde el primer pixel de scroll
// ════════════════════════════════════════════════════════════
(function initNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function update() {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 0);
    }
    update(); // estado inicial
    window.addEventListener('scroll', update, { passive: true });
})();


// ════════════════════════════════════════════════════════════
//  NAV LINK ACTIVO (IntersectionObserver)
// ════════════════════════════════════════════════════════════
(function initActiveLinks() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    sections.forEach(section => {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        }, { threshold: 0.25 }).observe(section);
    });
})();

// ════════════════════════════════════════════════════════════
//  AUTO-RESIZE TEXTAREA
// ════════════════════════════════════════════════════════════
(function initTextareaAutoResize() {
    const textarea = document.querySelector('.minimal-form textarea');
    if (!textarea) return;

    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
})();

// ════════════════════════════════════════════════════════════
//  AÑO AUTOMÁTICO EN FOOTER
// ════════════════════════════════════════════════════════════
(function initCurrentYear() {
    const year = document.getElementById('current-year');
    if (!year) return;

    year.textContent = new Date().getFullYear();
})();

