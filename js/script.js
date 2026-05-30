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
        document.body.classList.add('nav-open');
    }

    function closeMenu() {
        isOpen = false;
        enableAnimation();
        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('nav-open');
    }

    function closeInstant() {
        isOpen = false;
        overlay.classList.remove('is-animating', 'is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('nav-open');
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
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]')).filter((link) => {
        const href = link.getAttribute('href');
        return href && href.length > 1;
    });

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map(
        navLinks.map((link) => [link.getAttribute('href').slice(1), link])
    );

    function setActive(id) {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && linkById.has(visible.target.id)) {
            setActive(visible.target.id);
        }
    }, {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6]
    });

    sections.forEach((section) => observer.observe(section));
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