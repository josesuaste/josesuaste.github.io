'use strict';
// ════════════════════════════════════════════════════════════
//  MENÚ HAMBURGUESA
//  overlay → .nav-overlay  |  z-index 550
//  toggle  → .menu-toggle  |  z-index 600 → siempre encima
//  close   → .nav-overlay-close (#navClose) — tache dedicado
//  La X del toggle la forman las dos .bar → sin elemento extra
// ════════════════════════════════════════════════════════════
(function initMenu() {
    const toggle   = document.querySelector('.menu-toggle');
    const overlay  = document.querySelector('.nav-overlay');
    const closeBtn = document.getElementById('navClose');
    const allLinks = document.querySelectorAll('.nav-overlay a');

    if (!toggle || !overlay) return;

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        overlay.classList.add('is-active');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.classList.add('nav-open');
    }

    function closeMenu() {
        isOpen = false;
        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('nav-open');
    }

    function closeInstant() {
        isOpen = false;
        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('nav-open');
    }

    // Hambúrger
    toggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

    // Tache dedicado dentro del overlay
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

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
    const navLinks = Array.from(document.querySelectorAll('.nav-overlay-links a[href^="#"]')).filter(link => {
        const href = link.getAttribute('href');
        return href && href.length > 1;
    });

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map(
        navLinks.map(link => [link.getAttribute('href').slice(1), link])
    );

    function setActive(id) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    const observer = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible && linkById.has(visible.target.id)) {
            setActive(visible.target.id);
        }
    }, {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6]
    });

    sections.forEach(section => observer.observe(section));
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
