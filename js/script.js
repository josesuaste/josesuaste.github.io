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

// ─────────────────────────────────────────────────────────────
//  GSAP — se ejecuta solo cuando los scripts están cargados
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    // Respetar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── 1. HERO — todos los dispositivos ─────────────────────
    // Corre una sola vez al cargar, sin ScrollTrigger
    gsap.fromTo('.giant-title',
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out',
          clearProps: 'all' }
    );
    gsap.fromTo('.profile-img',
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 1, delay: 0.3,
          clearProps: 'all' }
    );
    gsap.fromTo('.bottom-sub-btn',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.6,
          clearProps: 'all' }
    );
    gsap.fromTo('.header-corner',
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.7,
          stagger: 0.15, clearProps: 'all' }
    );

    // ── 2. CONTADOR — todos los dispositivos ─────────────────
    document.querySelectorAll('.stat-number').forEach(el => {
        const raw = el.textContent.trim().replace(/,/g, '');
        const target = parseFloat(raw);
        const hasComma = el.textContent.includes(',');
        if (isNaN(target)) return;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                const proxy = { value: 0 };
                gsap.to(proxy, {
                    value: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate() {
                        el.textContent = hasComma
                            ? Math.round(proxy.value).toLocaleString('es-MX')
                            : Math.round(proxy.value).toString();
                    },
                    onComplete() {
                        el.textContent = hasComma
                            ? target.toLocaleString('es-MX')
                            : target.toString();
                    }
                });
            }
        });
    });

    // ── 3. SCROLL ANIMATIONS — solo desktop ──────────────────
    if (window.innerWidth <= 768) return;

    const scrollItems = [
        { selector: '#about .big-title',       vars: { x: -60 } },
        { selector: '#about .sub-title',        vars: { y: 30 }, pos: '-=0.4' },
        { selector: '#about .section-description', vars: { y: 20 }, pos: '-=0.3' },
        { selector: '#stats .big-title',        vars: { x: 60 } },
        { selector: '#stats .stat-item',        vars: { y: 40, stagger: 0.1 }, pos: '-=0.4' },
        { selector: '#setup .big-title',        vars: { y: 50 } },
        { selector: '.setup-shape',             vars: { y: 50, scale: 0.9, stagger: 0.08 }, pos: '-=0.3' },
        { selector: '#videos .big-title',       vars: { x: 60 } },
        { selector: '#videos .section-description', vars: { y: 20 }, pos: '-=0.4' },
        { selector: '#contact .big-title',      vars: { x: -60 } },
        { selector: '#contact .form-field',     vars: { y: 25, stagger: 0.08 }, pos: '-=0.4' },
        { selector: '.footer-col',              vars: { y: 30, stagger: 0.12 } },
    ];

    scrollItems.forEach(({ selector, vars, pos }) => {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        // Determinar trigger — el primer elemento del grupo
        const trigger = els.closest('section') || els.closest('footer') || els;

        gsap.fromTo(els,
            { autoAlpha: 0, ...vars },
            {
                autoAlpha: 1,
                x: 0, y: 0, scale: 1,
                duration: 0.9,
                stagger: vars.stagger || 0,
                ease: 'power3.out',
                clearProps: 'all',
                scrollTrigger: {
                    trigger,
                    start: 'top 80%',
                    once: true
                }
            }
        );
    });
});
