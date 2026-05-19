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

    function openMenu() {
        isOpen = true;
        overlay.classList.add('is-animating');
        // Necesita un frame para que la transition arranque desde el estado inicial
        requestAnimationFrame(() => overlay.classList.add('is-active'));
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        isOpen = false;
        overlay.classList.add('is-animating');
        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
        // Quitar is-animating cuando termina la transition
        overlay.addEventListener('transitionend', () => {
            overlay.classList.remove('is-animating');
        }, { once: true });
    }

    function closeInstant() {
        isOpen = false;
        overlay.classList.remove('is-animating', 'is-active');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }

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
//  SCROLL SUAVE (anchor links)
// ════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


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
//  GSAP ANIMATIONS
// ════════════════════════════════════════════════════════════
window.addEventListener('load', function () {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Reducción de movimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── 1. HERO: reveal escalonado ────────────────────────────
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', clearProps: 'all' } });
    heroTl
        .fromTo('.giant-title',
            { autoAlpha: 0, y: 60, skewY: 2 },
            { autoAlpha: 1, y: 0, skewY: 0, duration: 1 })
        .fromTo('.profile-img',
            { autoAlpha: 0, scale: 0.94 },
            { autoAlpha: 1, scale: 1, duration: 1 }, '-=0.6')
        .fromTo('.bottom-sub-btn',
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('.header-corner',
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.4');


    // ── 2. TEXTO EDITORIAL con SplitText ─────────────────────
    // SplitText parte el texto en palabras para animarlas de golpe
    // Respeta los spans .inline-shape y .inline-pill intactos
    if (typeof SplitText !== 'undefined') {

        function animateEditorialText(sectionId) {
            const el = document.getElementById(sectionId);
            if (!el) return;

            // Guardar los spans especiales para protegerlos
            const specialSpans = el.querySelectorAll('.inline-shape, .inline-pill');

            const split = new SplitText(el, {
                type: 'words',
                wordsClass: 'word'
            });

            gsap.fromTo(split.words,
                { autoAlpha: 0, y: 28, skewY: 1.5 },
                {
                    autoAlpha: 1,
                    y: 0,
                    skewY: 0,
                    duration: 0.7,
                    stagger: 0.018,
                    ease: 'power3.out',
                    clearProps: 'all',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 78%',
                        once: true
                    },
                    onComplete() {
                        // Revert después de animar para mantener el DOM limpio
                        split.revert();
                    }
                }
            );
        }

        animateEditorialText('text-about');
        animateEditorialText('text-setup');

    } else {
        // Fallback si SplitText no cargó: fade simple de los párrafos
        ['#text-about', '#text-setup'].forEach(sel => {
            const el = document.querySelector(sel);
            if (!el) return;
            gsap.fromTo(el,
                { autoAlpha: 0, y: 30 },
                {
                    autoAlpha: 1, y: 0,
                    duration: 1, ease: 'power3.out', clearProps: 'all',
                    scrollTrigger: { trigger: el, start: 'top 78%', once: true }
                }
            );
        });
    }

    // ── 3. SECTION LABELS ────────────────────────────────────
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.fromTo(el,
            { autoAlpha: 0, x: -16 },
            {
                autoAlpha: 1, x: 0,
                duration: 0.6, ease: 'power3.out', clearProps: 'all',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true }
            }
        );
    });

    // ── 4. CTA LINKS ─────────────────────────────────────────
    gsap.utils.toArray('.cta-link').forEach(el => {
        gsap.fromTo(el,
            { autoAlpha: 0, y: 16 },
            {
                autoAlpha: 1, y: 0,
                duration: 0.6, ease: 'power3.out', clearProps: 'all',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            }
        );
    });

    // ── 5. STATS: contador animado ───────────────────────────
    document.querySelectorAll('.stat-item').forEach(item => {
        const numEl    = item.querySelector('.stat-number');
        const val      = parseFloat(item.dataset.val);
        const hasComma = item.dataset.comma === 'true';
        if (!numEl || isNaN(val)) return;

        ScrollTrigger.create({
            trigger: item,
            start: 'top 88%',
            once: true,
            onEnter() {
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

    // ── 6. STAT ITEMS: entrada escalonada ────────────────────
    gsap.fromTo('.stat-item',
        { autoAlpha: 0, y: 30 },
        {
            autoAlpha: 1, y: 0,
            duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: '.stats-grid', start: 'top 82%', once: true }
        }
    );

    // ── 7. FORM FIELDS ───────────────────────────────────────
    gsap.fromTo('.form-field',
        { autoAlpha: 0, y: 20 },
        {
            autoAlpha: 1, y: 0,
            duration: 0.6, stagger: 0.08, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: '.minimal-form', start: 'top 82%', once: true }
        }
    );

    // ── 8. CONTACT TITLE ─────────────────────────────────────
    gsap.fromTo('.contact-title',
        { autoAlpha: 0, x: -40 },
        {
            autoAlpha: 1, x: 0,
            duration: 0.9, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: '.contact-title', start: 'top 82%', once: true }
        }
    );

    // ── 9. FOOTER COLS ───────────────────────────────────────
    gsap.fromTo('.footer-col',
        { autoAlpha: 0, y: 20 },
        {
            autoAlpha: 1, y: 0,
            duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: '.footer-inner', start: 'top 88%', once: true }
        }
    );

    // ── 10. Auto-resize textarea ─────────────────────────────
    const textarea = document.querySelector('.minimal-form textarea');
    if (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

}); // end load
