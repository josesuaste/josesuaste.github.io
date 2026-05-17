// ─────────────────────────────────────────────────────────────
//  Registrar plugins
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: "power3.out" });

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
//  Scroll suave con offset del navbar
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
        });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism al hacer scroll
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
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

// ─────────────────────────────────────────────────────────────
//  Deshabilitar transiciones CSS durante resize
// ─────────────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('no-transition');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 200);
});

// ─────────────────────────────────────────────────────────────
//  Nav link activo al hacer scroll
// ─────────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    { threshold: 0.2 }
);

sections.forEach(section => sectionObserver.observe(section));

// ─────────────────────────────────────────────────────────────
//  GSAP — Hero
//  Corre una sola vez al cargar, no se repite al hacer resize
// ─────────────────────────────────────────────────────────────
(function heroEntrance() {
    if (document.querySelector('.navbar')?.dataset.animated) return;

    const heroTl = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.out" },
        onComplete() {
            ['.navbar', '.giant-title', '.profile-img',
             '.bottom-sub-btn', '.header-corner'
            ].forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.dataset.animated = 'true';
                });
            });
        }
    });

    heroTl
        .from('.navbar',         { autoAlpha: 0, y: -20, duration: 0.6 })
        .from('.giant-title',    { autoAlpha: 0, y: 60, duration: 1, ease: "power4.out" }, "-=0.3")
        .from('.profile-img',    { autoAlpha: 0, scale: 0.92, duration: 1 }, "-=0.6")
        .from('.bottom-sub-btn', { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.header-corner',  { autoAlpha: 0, y: 15, stagger: 0.15, duration: 0.6 }, "-=0.4");
})();

// ─────────────────────────────────────────────────────────────
//  GSAP — Contador de estadísticas
//  Fuera de matchMedia — corre una sola vez en cualquier dispositivo
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('.stat-number').forEach(el => {
    const raw = el.textContent.trim().replace(/,/g, '');
    const target = parseFloat(raw);
    const hasComma = el.textContent.includes(',');
    if (isNaN(target)) return;

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const proxy = { value: 0 };
            gsap.to(proxy, {
                value: target,
                duration: 1.8,
                ease: "power2.out",
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

// ─────────────────────────────────────────────────────────────
//  GSAP — Animaciones de scroll (solo desktop)
//
//  Estrategia: fromTo() + clearProps: "all" en toVars
//  Cuando matchMedia revierte el bloque al cruzar a móvil,
//  clearProps garantiza que los estilos inline se limpien
//  y los elementos queden en su estado CSS natural — visibles.
// ─────────────────────────────────────────────────────────────
const mm = gsap.matchMedia();

mm.add(
    {
        isDesktop: "(min-width: 769px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        if (!isDesktop || reduceMotion) return;

        // Helper: construye un timeline de sección con fromTo + clearProps
        function buildTimeline(trigger, start, items) {
            const tl = gsap.timeline({
                scrollTrigger: { trigger, start, once: true },
                defaults: { ease: "power3.out" }
            });

            items.forEach(({ selector, fromVars, toVars, position }) => {
                const els = document.querySelectorAll(selector);
                if (!els.length) return;
                tl.fromTo(
                    els,
                    fromVars,
                    { ...toVars, clearProps: "all" },
                    position
                );
            });

            return tl;
        }

        // ── Sobre mí ──────────────────────────────────────────
        buildTimeline('#about', 'top 80%', [
            {
                selector: '#about .big-title',
                fromVars: { autoAlpha: 0, x: -60 },
                toVars:   { autoAlpha: 1, x: 0, duration: 1 }
            },
            {
                selector: '#about .sub-title',
                fromVars: { autoAlpha: 0, y: 30 },
                toVars:   { autoAlpha: 1, y: 0, duration: 0.7 },
                position: "-=0.5"
            },
            {
                selector: '#about .section-description',
                fromVars: { autoAlpha: 0, y: 20 },
                toVars:   { autoAlpha: 1, y: 0, duration: 0.7 },
                position: "-=0.4"
            }
        ]);

        // ── Estadísticas ──────────────────────────────────────
        buildTimeline('#stats', 'top 75%', [
            {
                selector: '#stats .big-title',
                fromVars: { autoAlpha: 0, x: 60 },
                toVars:   { autoAlpha: 1, x: 0, duration: 1 }
            },
            {
                selector: '#stats .stat-item',
                fromVars: { autoAlpha: 0, y: 40 },
                toVars:   { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7 },
                position: "-=0.5"
            }
        ]);

        // ── Setup ─────────────────────────────────────────────
        buildTimeline('#setup', 'top 80%', [
            {
                selector: '.setup-header .big-title',
                fromVars: { autoAlpha: 0, y: 50 },
                toVars:   { autoAlpha: 1, y: 0, duration: 1 }
            },
            {
                selector: '.setup-header .section-description',
                fromVars: { autoAlpha: 0, y: 30 },
                toVars:   { autoAlpha: 1, y: 0, duration: 0.8 },
                position: "-=0.5"
            }
        ]);

        ScrollTrigger.batch('.setup-shape', {
            start: 'top 88%',
            once: true,
            onEnter: (elements) => {
                gsap.fromTo(
                    elements,
                    { autoAlpha: 0, y: 50, scale: 0.88 },
                    {
                        autoAlpha: 1, y: 0, scale: 1,
                        stagger: 0.1, duration: 0.8,
                        ease: "back.out(1.4)",
                        clearProps: "all"
                    }
                );
            }
        });

        // ── Videos ────────────────────────────────────────────
        buildTimeline('#videos', 'top 80%', [
            {
                selector: '#videos .big-title',
                fromVars: { autoAlpha: 0, x: 60 },
                toVars:   { autoAlpha: 1, x: 0, duration: 1 }
            },
            {
                selector: '#videos .section-description',
                fromVars: { autoAlpha: 0, y: 25 },
                toVars:   { autoAlpha: 1, y: 0, duration: 0.7 },
                position: "-=0.5"
            }
        ]);

        // Tarjetas de video insertadas dinámicamente
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid && !videosGrid.dataset.observed) {
            videosGrid.dataset.observed = 'true';
            const cardObserver = new MutationObserver(() => {
                const cards = videosGrid.querySelectorAll('.video-card:not(.gsap-animated)');
                if (cards.length) {
                    gsap.fromTo(
                        cards,
                        { autoAlpha: 0, y: 40 },
                        {
                            autoAlpha: 1, y: 0,
                            stagger: 0.12, duration: 0.7,
                            clearProps: "all",
                            onComplete() {
                                cards.forEach(c => c.classList.add('gsap-animated'));
                            }
                        }
                    );
                }
            });
            cardObserver.observe(videosGrid, { childList: true });
        }

        // ── Colaboraciones ────────────────────────────────────
        buildTimeline('#contact', 'top 80%', [
            {
                selector: '#contact .big-title',
                fromVars: { autoAlpha: 0, x: -60 },
                toVars:   { autoAlpha: 1, x: 0, duration: 1 }
            },
            {
                selector: '#contact .form-field',
                fromVars: { autoAlpha: 0, y: 25 },
                toVars:   { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 },
                position: "-=0.5"
            },
            {
                selector: '#contact .minimal-submit',
                fromVars: { autoAlpha: 0, y: 15 },
                toVars:   { autoAlpha: 1, y: 0, duration: 0.5 },
                position: "-=0.2"
            }
        ]);

        // ── Footer ────────────────────────────────────────────
        buildTimeline('.massive-footer', 'top 90%', [
            {
                selector: '.footer-col',
                fromVars: { autoAlpha: 0, y: 30 },
                toVars:   { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.7 }
            }
        ]);
    }
);