'use strict';

/* ════════════════════════════════════════════════════════════
   HERO — entrada dramática
   SplitText en el título + clip-path circular en la imagen
   + wiggle en el botón de suscripción
   ════════════════════════════════════════════════════════════ */

(function initHero() {
    function start() {
        const title      = document.querySelector('.giant-title');
        const serif      = document.querySelector('.giant-title__serif');
        const sans       = document.querySelector('.giant-title__sans');
        const wrapper    = document.querySelector('.profile-wrapper');
        const img        = document.querySelector('.profile-img');
        const button     = document.querySelector('.bottom-sub-btn');
        const heroFooter = document.querySelector('.hero-footer');

        if (typeof gsap === 'undefined') return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ── Reduced motion: mostrar todo sin animación ── */

        if (reduceMotion) {
            if (wrapper) {
                gsap.set(wrapper, { clipPath: 'circle(50% at 50% 50%)' });
            }
            initWiggle(button);
            return;
        }

        /* ── Registrar SplitText ── */

        if (typeof SplitText === 'undefined') {
            console.warn('[hero] SplitText no está cargado — asegúrate de incluirlo en el HTML.');
            // Fallback: animar título como bloque
            fallbackTitleAnimation(serif, sans, wrapper, button, heroFooter);
            return;
        }

        gsap.registerPlugin(SplitText);

        /* ── SplitText sobre cada span por separado ──────────────
           Dividir por chars dentro de cada span mantiene el layout
           flex del .giant-title y evita que SplitText rompa el gap
           entre "José" y "Suaste".
        ──────────────────────────────────────────────────────── */

        const splitSerif = SplitText.create(serif, {
            type: 'chars',
            charsClass: 'char'
        });

        const splitSans = SplitText.create(sans, {
            type: 'chars',
            charsClass: 'char'
        });

        const allChars = [...splitSerif.chars, ...splitSans.chars];

        /* ── Timeline principal de entrada ── */

        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete() {
                /*
                  Limpiar will-change y props inline de los chars
                  una vez terminada la entrada — libera memoria GPU.
                */
                gsap.set(allChars, { clearProps: 'transform,opacity,filter,willChange' });
                splitSerif.revert();
                splitSans.revert();

                /* Iniciar wiggle del botón ahora que la entrada terminó */
                initWiggle(button);
            }
        });

        /*
          1. Chars del título caen desde arriba con stagger
             "José" primero, luego "Suaste" con un beat de retraso.
             rotation + y dan el efecto dramático llamativo.
        */
        tl.fromTo(splitSerif.chars,
            {
                autoAlpha: 0,
                y: -80,
                rotation: -12,
                filter: 'blur(6px)'
            },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                stagger: 0.055,
                ease: 'power4.out'
            },
            0
        )

        .fromTo(splitSans.chars,
            {
                autoAlpha: 0,
                y: -80,
                rotation: 8,
                filter: 'blur(6px)'
            },
            {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                stagger: 0.055,
                ease: 'power4.out'
            },
            /*
              "Suaste" empieza cuando la segunda letra de "José"
              ya está animando — se sienten como una palabra larga
              que se va revelando de izquierda a derecha.
            */
            0.1
        )

        /*
          2. Imagen: expand desde el centro con clip-path circular.
             Arranca cuando las últimas letras están llegando
             para el efecto de "aterrizaje" sobre el nombre.
        */
        .fromTo(wrapper,
            { clipPath: 'circle(0% at 50% 50%)' },
            {
                clipPath: 'circle(50% at 50% 50%)',
                duration: 0.88,
                ease: 'power3.inOut'
            },
            /*
              Offset calculado para que la imagen empiece a expandirse
              cuando las últimas letras de "Suaste" están llegando.
            */
            0.52
        )

        /*
          3. Botón y footer entran desde abajo al final.
        */
        .fromTo(heroFooter,
            { autoAlpha: 0, y: 20 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.52,
                ease: 'power3.out'
            },
            1.0
        );
    }

    /* ── Fallback si SplitText no carga ──────────────────────
       Anima el título completo como bloque — mantiene el
       efecto de entrada dramática sin depender del plugin.
    ────────────────────────────────────────────────────────── */

    function fallbackTitleAnimation(serif, sans, wrapper, button, heroFooter) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo([serif, sans].filter(Boolean),
            { autoAlpha: 0, y: -60 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
            0
        )
        .fromTo(wrapper,
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(50% at 50% 50%)', duration: 0.88, ease: 'power3.inOut' },
            0.4
        )
        .fromTo(heroFooter,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.52 },
            0.9
        );

        if (wrapper) {
            tl.eventCallback('onComplete', () => initWiggle(button));
        }
    }

    /* ── Wiggle del botón de suscripción ─────────────────────
       Se inicia solo después de que la entrada del hero termina
       para no competir visualmente con la animación principal.
    ────────────────────────────────────────────────────────── */

    function initWiggle(button) {
        if (!button || typeof gsap === 'undefined') return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        const wiggle = gsap.timeline({
            paused: true,
            defaults: { duration: 0.075, ease: 'power1.inOut' }
        });

        wiggle
            .to(button, { x: -2, rotation: -1 })
            .to(button, { x: 2, rotation: 1 })
            .to(button, { x: -1.5, rotation: -0.6 })
            .to(button, { x: 1.5, rotation: 0.6 })
            .to(button, { x: 0, rotation: 0, duration: 0.12 });

        let intervalId = null;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry || !entry.isIntersecting || intervalId) return;

            intervalId = window.setInterval(() => {
                if (!document.body.classList.contains('nav-open')) {
                    wiggle.play(0);
                }
            }, 7000);

            observer.disconnect();
        }, { threshold: 0.6 });

        observer.observe(button);

        window.addEventListener('pagehide', () => {
            if (intervalId) window.clearInterval(intervalId);
            observer.disconnect();
        }, { once: true });
    }

    /* ── Arranque ── */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();