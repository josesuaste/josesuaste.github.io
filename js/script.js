// ═══════════════════════════════════════════════════════════════
//  script.js — ERROR404 / josesuaste.github.io
//  Dependencias: GSAP 3 + ScrollTrigger (CDN en index.html)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
//  GSAP — registro de plugins
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Defaults globales
gsap.defaults({ duration: 0.8, ease: 'power3.out' });


// ─────────────────────────────────────────────────────────────
//  MENÚ MÓVIL
// ─────────────────────────────────────────────────────────────
const menuToggle        = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems     = document.querySelectorAll('.nav-links a');

// FIX: .menu-ready se agrega al body en el primer click —
// las transiciones del menú solo existen cuando esta clase está presente,
// lo que evita que el browser anime el cambio de estado al redimensionar.
menuToggle.addEventListener('click', () => {
    document.body.classList.add('menu-ready');
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
//  SCROLL SUAVE CON OFFSET DE NAVBAR
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
//  NAVBAR GLASSMORPHISM — IntersectionObserver (sentinel)
// ─────────────────────────────────────────────────────────────
const navbar       = document.querySelector('.navbar');
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    aboutSection.insertAdjacentElement('beforebegin', sentinel);

    const navObserver = new IntersectionObserver(
        ([entry]) => navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting),
        { threshold: 0, rootMargin: '0px' }
    );
    navObserver.observe(sentinel);
}


// ─────────────────────────────────────────────────────────────
//  GSAP — matchMedia
//  Todas las animaciones viven aquí.
//  Si el usuario tiene prefers-reduced-motion, duration = 0
//  (los elementos aparecen sin movimiento, sin flash).
// ─────────────────────────────────────────────────────────────
const mm = gsap.matchMedia();

mm.add(
    {
        motion:       '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    (context) => {
        const { motion } = context.conditions;


        // ─────────────────────────────────────────────────
        //  1. HERO — Timeline de entrada al cargar la página
        //
        //  t=0.0  Navbar baja desde arriba
        //  t=0.2  Título "José Suaste" sube con fade
        //  t=0.45 Foto de perfil aparece con scale + fade
        //  t=0.75 Botón SUSCRÍBETE sube con overshoot (back.out)
        //  t=0.85 Párrafos del footer con stagger
        // ─────────────────────────────────────────────────
        gsap.set(['.navbar', '.giant-title', '.profile-img', '.bottom-sub-btn', '.header-corner'], {
            autoAlpha: 0
        });
        gsap.set('.navbar',         { y: -30 });
        gsap.set('.giant-title',    { y: 50 });
        gsap.set('.profile-img',    { y: 30, scale: 0.92 });
        gsap.set('.bottom-sub-btn', { y: 20 });
        gsap.set('.header-corner',  { y: 20 });

        const heroTL = gsap.timeline({
            defaults: {
                ease:     'power3.out',
                duration: motion ? 0.9 : 0
            }
        });

        heroTL
            .to('.navbar',         { autoAlpha: 1, y: 0 },                        0)
            .to('.giant-title',    { autoAlpha: 1, y: 0 },                        0.2)
            .to('.profile-img',    { autoAlpha: 1, y: 0, scale: 1 },              0.45)
            .to('.bottom-sub-btn', { autoAlpha: 1, y: 0, ease: 'back.out(1.4)' }, 0.75)
            .to('.header-corner',  { autoAlpha: 1, y: 0, stagger: 0.15 },         0.85);


        // ─────────────────────────────────────────────────
        //  2. SCROLL REVEAL — Secciones al entrar al viewport
        //
        //  Helper revealOnScroll: recibe un selector o array
        //  de elementos y crea un from() con ScrollTrigger.
        //  once: true → la animación solo ocurre una vez.
        // ─────────────────────────────────────────────────
        function revealOnScroll(selector, delay = 0) {
            const els = gsap.utils.toArray(selector);
            if (!els.length) return;

            gsap.from(els, {
                autoAlpha: 0,
                y:         motion ? 60 : 0,
                duration:  motion ? 0.9 : 0,
                delay,
                ease:      'power3.out',
                stagger:   0.12,
                scrollTrigger: {
                    trigger:       els.closest('section') || els,
                    start:         'top 82%',
                    toggleActions: 'play none none none',
                    once:          true
                }
            });
        }

        revealOnScroll('#about .big-title');
        revealOnScroll('#about .sub-title',          0.1);
        revealOnScroll('#about .section-description', 0.2);

        revealOnScroll('#stats .big-title');

        revealOnScroll('#setup .big-title');
        revealOnScroll('#setup .section-description', 0.1);

        revealOnScroll('#videos .big-title');
        revealOnScroll('#videos .section-description', 0.1);

        revealOnScroll('#contact .big-title');
        revealOnScroll('#contact .about-right',       0.15);


        // ─────────────────────────────────────────────────
        //  3. STATS — Tarjetas + contador animado
        //
        //  Las 4 tarjetas entran en stagger.
        //  Cada stat-number cuenta de 0 hasta su valor real
        //  usando un objeto proxy { val } animado por GSAP.
        //  onUpdate escribe el número formateado al DOM.
        // ─────────────────────────────────────────────────
        const statItems = gsap.utils.toArray('.stat-item');

        if (statItems.length) {
            gsap.from(statItems, {
                autoAlpha: 0,
                y:         motion ? 50 : 0,
                duration:  motion ? 0.7 : 0,
                stagger:   0.15,
                ease:      'power3.out',
                scrollTrigger: {
                    trigger:       '.stats-section',
                    start:         'top 78%',
                    toggleActions: 'play none none none',
                    once:          true
                }
            });

            document.querySelectorAll('.stat-number').forEach(el => {
                const rawText  = el.textContent.trim();
                // Eliminar separadores de miles para parsear el número
                const endValue = parseFloat(rawText.replace(/[,\.\s]/g, '')) || 0;
                const hasComma = rawText.includes(',');
                const proxy    = { val: 0 };

                gsap.to(proxy, {
                    val:      endValue,
                    duration: motion ? 2.0 : 0,
                    ease:     'power2.out',
                    scrollTrigger: {
                        trigger:       '.stats-section',
                        start:         'top 78%',
                        toggleActions: 'play none none none',
                        once:          true
                    },
                    onUpdate() {
                        el.textContent = hasComma
                            ? Math.round(proxy.val).toLocaleString('es-MX')
                            : Math.round(proxy.val).toString();
                    }
                });
            });
        }


        // ─────────────────────────────────────────────────
        //  4. SETUP — Shapes en cascada con rotation alternada
        //
        //  Cada shape entra desde abajo con un leve giro
        //  alternado (par: -6°, impar: +6°) que se resuelve
        //  a 0 al llegar a su posición final.
        // ─────────────────────────────────────────────────
        const setupShapes = gsap.utils.toArray('.setup-shape');

        if (setupShapes.length) {
            gsap.from(setupShapes, {
                autoAlpha: 0,
                y:         motion ? 70 : 0,
                rotation:  motion ? (i) => (i % 2 === 0 ? -6 : 6) : 0,
                duration:  motion ? 0.8 : 0,
                stagger:   { each: 0.1, from: 'start' },
                ease:      'back.out(1.3)',
                scrollTrigger: {
                    trigger:       '.setup-shapes-row',
                    start:         'top 80%',
                    toggleActions: 'play none none none',
                    once:          true
                }
            });
        }


        // ─────────────────────────────────────────────────
        //  5. SETUP — Hover con gsap.quickTo()
        //
        //  quickTo() reutiliza un único tween por propiedad
        //  en lugar de crear uno nuevo en cada evento →
        //  más eficiente que gsap.to() en mouseenter/leave.
        //  Solo activo en dispositivos con puntero fino (mouse).
        // ─────────────────────────────────────────────────
        const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (motion && hasHover) {
            setupShapes.forEach(shape => {
                const toScale    = gsap.quickTo(shape, 'scale',    { duration: 0.3, ease: 'power2.out' });
                const toRotation = gsap.quickTo(shape, 'rotation', { duration: 0.4, ease: 'power2.out' });
                const toY        = gsap.quickTo(shape, 'y',        { duration: 0.3, ease: 'power2.out' });

                shape.addEventListener('mouseenter', () => {
                    toScale(1.1);
                    toRotation(6);
                    toY(-10);
                });
                shape.addEventListener('mouseleave', () => {
                    toScale(1);
                    toRotation(0);
                    toY(0);
                });
            });
        }


        // ─────────────────────────────────────────────────
        //  Cleanup — revert al cambiar condiciones de matchMedia
        // ─────────────────────────────────────────────────
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }
);