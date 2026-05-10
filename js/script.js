// ─────────────────────────────────────────────────────────────
//  Registrar plugins
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
//  Defaults globales
// ─────────────────────────────────────────────────────────────
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
            top: target.getBoundingClientRect().top + window.pageYOffset - 80,
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
//  GSAP
//
//  Estrategia anti-resize:
//  - Las animaciones de scroll usan toggleActions "play none none none"
//    (no reverse) y marcan cada elemento con data-animated="true" al
//    completarse. Si matchMedia re-ejecuta el bloque al cruzar un
//    breakpoint, los elementos ya marcados se saltan — nunca
//    desaparecen ni vuelven a animarse.
//  - La animación del hero corre UNA sola vez al cargar la página,
//    fuera de matchMedia, para que el resize nunca la reescriba.
// ─────────────────────────────────────────────────────────────

// Helper: devuelve solo los elementos que no han sido animados aún
function unAnimated(selector) {
    return [...document.querySelectorAll(selector)].filter(
        el => !el.dataset.animated
    );
}

// Helper: marca elementos como animados al completar
function markDone(elements) {
    const els = elements instanceof Element ? [elements] : [...elements];
    els.forEach(el => (el.dataset.animated = 'true'));
}

// ── Hero: corre una sola vez al cargar, independiente del breakpoint ──
(function heroEntrance() {
    // Si ya corrió (recarga con bfcache), salir
    if (document.querySelector('.navbar')?.dataset.animated) return;

    const heroTl = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.out" },
        onComplete() {
            // Marcar todos para que el resize no los resetee
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
        .from('.navbar', { autoAlpha: 0, y: -20, duration: 0.6 })
        .from('.giant-title', { autoAlpha: 0, y: 60, duration: 1, ease: "power4.out" }, "-=0.3")
        .from('.profile-img', { autoAlpha: 0, scale: 0.92, duration: 1 }, "-=0.6")
        .from('.bottom-sub-btn', { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from('.header-corner', { autoAlpha: 0, y: 15, stagger: 0.15, duration: 0.6 }, "-=0.4");
})();

// ── Animaciones de scroll ─────────────────────────────────────
gsap.matchMedia().add(
    {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        isDesktop: "(min-width: 769px)"
    },
    (context) => {
        const { reduceMotion, isDesktop } = context.conditions;
        if (reduceMotion) return;

        // ── Helper interno: from() solo si el elemento no fue animado ──
        function animateIfNew(selector, vars, position) {
            const els = unAnimated(selector);
            if (!els.length) return null;
            return { els, vars, position };
        }

        // ── Función para construir timeline de sección ──
        function sectionTimeline(trigger, start, items) {
            // Filtrar items cuyos elementos ya fueron animados
            const pending = items.filter(item => {
                if (!item) return false;
                return unAnimated(item.selector).length > 0;
            });
            if (!pending.length) return;

            const tl = gsap.timeline({
                scrollTrigger: { trigger, start, once: true },
                defaults: { ease: "power3.out" }
            });

            pending.forEach(({ selector, vars, position }) => {
                const els = unAnimated(selector);
                tl.from(els, {
                    ...vars,
                    onComplete() { markDone(els); }
                }, position);
            });
        }

        // ── 2. SOBRE MÍ ──────────────────────────────────────────
        sectionTimeline('#about', 'top 80%', [
            { selector: '#about .big-title',
              vars: { autoAlpha: 0, x: isDesktop ? -60 : 0, y: isDesktop ? 0 : 40, duration: 1 } },
            { selector: '#about .sub-title',
              vars: { autoAlpha: 0, y: 30, duration: 0.7 }, position: "-=0.5" },
            { selector: '#about .section-description',
              vars: { autoAlpha: 0, y: 20, duration: 0.7 }, position: "-=0.4" }
        ]);

        // ── 3. ESTADÍSTICAS ───────────────────────────────────────
        sectionTimeline('#stats', 'top 75%', [
            { selector: '#stats .big-title',
              vars: { autoAlpha: 0, x: isDesktop ? 60 : 0, y: isDesktop ? 0 : 40, duration: 1 } },
            { selector: '#stats .stat-item',
              vars: { autoAlpha: 0, y: 40, stagger: 0.12, duration: 0.7 }, position: "-=0.5" }
        ]);

        // Contador animado — proxy object, seguro contra NaN
        document.querySelectorAll('.stat-number').forEach(el => {
            if (el.dataset.counted) return; // ya contó, no repetir
            const raw = el.textContent.trim().replace(/,/g, '');
            const target = parseFloat(raw);
            const hasComma = el.textContent.includes(',');
            if (isNaN(target)) return;

            el.dataset.counted = 'true'; // marcar antes de crear el trigger

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

        // ── 4. SETUP ──────────────────────────────────────────────
        sectionTimeline('#setup', 'top 80%', [
            { selector: '.setup-header .big-title',
              vars: { autoAlpha: 0, y: 50, duration: 1 } },
            { selector: '.setup-header .section-description',
              vars: { autoAlpha: 0, y: 30, duration: 0.8 }, position: "-=0.5" }
        ]);

        const newShapes = unAnimated('.setup-shape');
        if (newShapes.length) {
            ScrollTrigger.batch(newShapes, {
                start: 'top 88%',
                once: true,
                onEnter: (elements) => {
                    gsap.from(elements, {
                        autoAlpha: 0, y: 50, scale: 0.88,
                        stagger: 0.1, duration: 0.8, ease: "back.out(1.4)",
                        onComplete() { markDone(elements); }
                    });
                }
            });
        }

        // ── 5. VIDEOS ─────────────────────────────────────────────
        sectionTimeline('#videos', 'top 80%', [
            { selector: '#videos .big-title',
              vars: { autoAlpha: 0, x: isDesktop ? 60 : 0, y: isDesktop ? 0 : 40, duration: 1 } },
            { selector: '#videos .section-description',
              vars: { autoAlpha: 0, y: 25, duration: 0.7 }, position: "-=0.5" }
        ]);

        // Tarjetas de video insertadas dinámicamente
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid && !videosGrid.dataset.observed) {
            videosGrid.dataset.observed = 'true';
            const cardObserver = new MutationObserver(() => {
                const cards = videosGrid.querySelectorAll('.video-card:not(.gsap-animated)');
                if (cards.length) {
                    gsap.from(cards, {
                        autoAlpha: 0, y: 40, stagger: 0.12, duration: 0.7,
                        onComplete() { cards.forEach(c => c.classList.add('gsap-animated')); }
                    });
                }
            });
            cardObserver.observe(videosGrid, { childList: true });
        }

        // ── 6. COLABORACIONES ─────────────────────────────────────
        sectionTimeline('#contact', 'top 80%', [
            { selector: '#contact .big-title',
              vars: { autoAlpha: 0, x: isDesktop ? -60 : 0, y: isDesktop ? 0 : 40, duration: 1 } },
            { selector: '#contact .form-field',
              vars: { autoAlpha: 0, y: 25, stagger: 0.1, duration: 0.6 }, position: "-=0.5" },
            { selector: '#contact .minimal-submit',
              vars: { autoAlpha: 0, y: 15, duration: 0.5 }, position: "-=0.2" }
        ]);

        // ── 7. FOOTER ─────────────────────────────────────────────
        sectionTimeline('.massive-footer', 'top 90%', [
            { selector: '.footer-col',
              vars: { autoAlpha: 0, y: 30, stagger: 0.15, duration: 0.7 } }
        ]);
    }
);