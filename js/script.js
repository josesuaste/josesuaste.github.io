/**
 * ERROR404 — script.js
 * Animaciones GSAP + microinteracciones + utilidades
 */

'use strict';

// ─────────────────────────────────────────────────────────────
//  CURSOR PERSONALIZADO
// ─────────────────────────────────────────────────────────────
(function initCursor() {
    // Solo en dispositivos con hover real (no touch)
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor      = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');
    if (!cursor || !cursorTrail) return;

    let mouseX = -100, mouseY = -100;
    let trailX  = -100, trailY  = -100;
    let rafId;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    // Trail suavizado con lerp
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateTrail() {
        trailX = lerp(trailX, mouseX, 0.12);
        trailY = lerp(trailY, mouseY, 0.12);
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top  = trailY + 'px';
        rafId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Estados hover / click
    const interactiveEls = 'a, button, [role="button"], input, textarea, .tag, .setup-shape';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactiveEls)) {
            document.body.classList.add('cursor-hover');
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(interactiveEls)) {
            document.body.classList.remove('cursor-hover');
        }
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
})();


// ─────────────────────────────────────────────────────────────
//  MENÚ MÓVIL
// ─────────────────────────────────────────────────────────────
(function initMobileMenu() {
    const menuToggle        = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksItems     = document.querySelectorAll('.nav-links a');
    if (!menuToggle || !navLinksContainer) return;

    function openMenu() {
        navLinksContainer.classList.add('is-animating');
        requestAnimationFrame(() => navLinksContainer.classList.add('is-active'));
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
        navLinksContainer.classList.contains('is-active') ? closeMenu() : openMenu();
    });
    navLinksItems.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenuInstant(); });
})();


// ─────────────────────────────────────────────────────────────
//  SCROLL SUAVE NATIVO
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


// ─────────────────────────────────────────────────────────────
//  NAVBAR GLASSMORPHISM — activa desde el primer px de scroll
// ─────────────────────────────────────────────────────────────
(function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function update() {
        // Se activa con cualquier scroll > 0
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 0);
    }

    // Comprobar estado inicial (por si se carga con scroll)
    update();

    // Escuchar scroll — passive para no bloquear el hilo principal
    window.addEventListener('scroll', update, { passive: true });
})();


// ─────────────────────────────────────────────────────────────
//  NAV LINK ACTIVO AL SCROLL
// ─────────────────────────────────────────────────────────────
(function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    sections.forEach(section => {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        }, { threshold: 0.25 }).observe(section);
    });
})();


// ─────────────────────────────────────────────────────────────
//  GSAP — carga después de que todos los scripts estén listos
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', function() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Respetar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Asegurar visibilidad si se saltaron animaciones
        document.querySelector('.scroll-indicator')?.style.setProperty('opacity', '1');
        return;
    }

    gsap.defaults({ ease: 'power3.out' });

    // ── 1. HERO REVEAL ────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', clearProps: 'all' } });

    tl.fromTo('.hero-deco-tag',
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 })
      .fromTo('.hero-eyebrow',
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.4')
      .fromTo('.gt-jose',
            { autoAlpha: 0, y: 60, skewY: 3 },
            { autoAlpha: 1, y: 0, skewY: 0, duration: 1 }, '-=0.5')
      .fromTo('.gt-suaste',
            { autoAlpha: 0, y: 60, skewY: -3 },
            { autoAlpha: 1, y: 0, skewY: 0, duration: 1 }, '-=0.75')
      .fromTo('.profile-wrapper',
            { autoAlpha: 0, scale: 0.94, y: 30 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1.1 }, '-=0.7')
      .fromTo('.bottom-sub-btn',
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo('.header-corner',
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.5')
      .fromTo('.scroll-indicator',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1 }, '-=0.3');


    // ── 2. CONTADORES ─────────────────────────────────────────
    document.querySelectorAll('.stat-item').forEach(item => {
        const numEl   = item.querySelector('.stat-number');
        const val     = parseFloat(item.dataset.val);
        const hasComma = item.dataset.comma === 'true';
        if (!numEl || isNaN(val)) return;

        ScrollTrigger.create({
            trigger: item,
            start: 'top 88%',
            once: true,
            onEnter() {
                item.classList.add('animated'); // activa la barra CSS
                const proxy = { v: 0 };
                gsap.to(proxy, {
                    v: val,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate() {
                        numEl.textContent = hasComma
                            ? Math.round(proxy.v).toLocaleString('es-MX')
                            : Math.round(proxy.v).toString();
                    },
                    onComplete() {
                        numEl.textContent = hasComma
                            ? val.toLocaleString('es-MX')
                            : val.toString();
                    }
                });
            }
        });
    });


    // ── 3. SCROLL ANIMATIONS (desktop + mobile) ───────────────
    //  Función helper para fromTo + ScrollTrigger
    function scrollReveal(selector, fromVars, toVars, triggerEl) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const trigger = triggerEl
            || els.closest('section')
            || els.closest('footer')
            || els;

        gsap.fromTo(els,
            { autoAlpha: 0, ...fromVars },
            {
                autoAlpha: 1,
                x: 0, y: 0, scale: 1, skewY: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: toVars.stagger || 0,
                clearProps: 'all',
                scrollTrigger: {
                    trigger,
                    start: 'top 82%',
                    once: true
                },
                ...toVars
            }
        );
    }

    // About
    scrollReveal('#about .big-title',             { x: -50 },         {});
    scrollReveal('#about .sub-title',             { y: 24 },          { duration: 0.7 });
    scrollReveal('#about .section-description',   { y: 18 },          { stagger: 0.12 });
    scrollReveal('#about .tag',                   { y: 12, scale: 0.9 }, { stagger: 0.06 });

    // Stats
    scrollReveal('#stats .big-title',             { x: 50 },          {});
    scrollReveal('.stats-caption',                { y: 20 },          {});
    scrollReveal('.stat-item',                    { y: 40 },          { stagger: 0.1 });

    // Setup
    scrollReveal('#setup .big-title',             { y: 40 },          {});
    scrollReveal('#setup .section-description',   { y: 20 },          {});

    // Videos
    scrollReveal('#videos .big-title',            { x: 40 },          {});
    scrollReveal('#videos .section-description',  { y: 20 },          {});
    scrollReveal('.video-card',                   { y: 30 },          { stagger: 0.1 });

    // Contact
    scrollReveal('#contact .big-title',           { x: -50 },         {});
    scrollReveal('.contact-tagline',              { y: 20 },          {});
    scrollReveal('.form-field',                   { y: 20 },          { stagger: 0.08 });
    scrollReveal('.form-actions',                 { y: 16 },          {});

    // Footer
    scrollReveal('.footer-brand',                 { y: 24 },          {});
    scrollReveal('.footer-col',                   { y: 20 },          { stagger: 0.1 });


    // ── 4. PARALLAX SUAVE en el héroe ─────────────────────────
    gsap.to('.breath-ring', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    gsap.to('.profile-img', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    // ── 5. SETUP MARQUEE — pausa al hover (CSS ya lo hace, esto refuerza) ─
    const setupTrack = document.querySelector('.setup-track');
    if (setupTrack) {
        setupTrack.addEventListener('mouseenter', () => {
            setupTrack.style.animationPlayState = 'paused';
        });
        setupTrack.addEventListener('mouseleave', () => {
            setupTrack.style.animationPlayState = 'running';
        });
    }

    // ── 6. FORM — auto-resize del textarea ────────────────────
    const textarea = document.querySelector('.minimal-form textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

}); // end window.load
