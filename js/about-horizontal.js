'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT HORIZONTAL
   Desktop: escena pinned + scroll horizontal (gsap.matchMedia)
   Mobile:  animaciones verticales

   FIX PRINCIPAL: ScrollTrigger.matchMedia está deprecado en
   GSAP 3.12+ y no limpia correctamente los ScrollTriggers al
   hacer resize — quedan dos instancias del pin activas, el DOM
   retiene el transform X del pin anterior y la sección aparece
   duplicada. gsap.matchMedia() maneja el cleanup automáticamente.
   ════════════════════════════════════════════════════════════ */

(function initAboutHorizontal() {

    function start() {

        if (typeof gsap === 'undefined') {
            console.warn('[about-horizontal] GSAP no está cargado.');
            return;
        }
        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[about-horizontal] ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        /* ── Elementos ──────────────────────────────────────── */

        const about      = document.querySelector('#about');
        const scene      = document.querySelector('.about-animate-scene');
        const intro      = document.querySelector('.about-animate-intro');
        const scrollWrap = document.querySelector('.about-animate-scroll');
        const track      = document.querySelector('.about-animate-track');
        const introSvg   = document.querySelector('.about-float-svg--intro');

        const words      = gsap.utils.toArray('.about-word');
        const inlineSvgs = gsap.utils.toArray('.about-inline-svg');

        if (!about || !scene || !intro || !scrollWrap || !track) {
            console.warn('[about-horizontal] Faltan elementos del DOM.');
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ── Sin animación (prefers-reduced-motion) ─────────── */

        if (reduceMotion) {
            gsap.set([about, scene, intro, scrollWrap, track, words, inlineSvgs, introSvg], {
                clearProps: 'all',
                autoAlpha: 1
            });
            return;
        }


        /* ════════════════════════════════════════════════════════
           gsap.matchMedia() — reemplaza ScrollTrigger.matchMedia
           Cada breakpoint recibe una función de cleanup (return)
           que GSAP ejecuta automáticamente al salir del breakpoint.
           Esto destruye los ScrollTriggers, limpia los tweens y
           restaura los estilos inline — sin duplicados ni doble pin.
           ════════════════════════════════════════════════════════ */

        const mm = gsap.matchMedia();


        /* ── DESKTOP ≥ 769px ─────────────────────────────────── */

        mm.add('(min-width: 769px)', (context) => {

            /* Estilos iniciales para el layout horizontal */
            gsap.set(scene,      { display: 'flex', width: 'fit-content', x: 0 });
            gsap.set(scrollWrap, { display: 'flex' });
            gsap.set(track,      { clearProps: 'transform' });

            /* Distancia total a desplazar — se recalcula en cada refresh */
            const getDistance = () => {
                const sceneWidth = scene.scrollWidth;
                const vw = window.innerWidth;
                return Math.max(sceneWidth - vw, vw);
            };

            /* ── Timeline horizontal pinned ──────────────────── */

            const horizontalTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scene,
                    start: 'top top',
                    end: () => '+=' + getDistance(),
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            horizontalTl.to(scene, {
                x: () => -getDistance(),
                ease: 'none',
                duration: 1
            }, 0);

            /* ── Intro: texto ────────────────────────────────── */

            gsap.from('.about-animate-small', {
                y: 36,
                autoAlpha: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: scene,
                    start: 'top 75%',
                    once: true
                }
            });

            /* ── Palabras animadas (primeras 13) ─────────────── */

            const wordsToAnimate = words.slice(0, 13);
            const wordsStatic    = words.slice(13);

            wordsToAnimate.forEach((word) => {
                gsap.from(word, {
                    x: () => gsap.utils.random(-80, 80),
                    y: () => gsap.utils.random(-90, 90),
                    rotate: () => gsap.utils.random(-14, 14),
                    scale: () => gsap.utils.random(0.82, 1.12),
                    autoAlpha: 0,
                    filter: 'blur(10px)',
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: word,
                        containerAnimation: horizontalTl,
                        start: 'left 82%',
                        end: 'left 45%',
                        scrub: 1
                    }
                });
            });

            gsap.set(wordsStatic, {
                autoAlpha: 1,
                filter: 'blur(0px)',
                scale: 1,
                x: 0, y: 0, rotate: 0
            });

            /* ── Flotación de todas las palabras ─────────────── */

            words.forEach((word, i) => {
                gsap.to(word, {
                    yPercent: i % 2 === 0 ? -8 : 8,
                    rotate: i % 2 === 0 ? '-=2' : '+=2',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: word,
                        containerAnimation: horizontalTl,
                        start: 'left right',
                        end: 'right left',
                        scrub: true
                    }
                });
            });

            /* ── SVGs inline ─────────────────────────────────── */

            inlineSvgs.forEach((svg, i) => {
                gsap.from(svg, {
                    x: () => gsap.utils.random(-60, 60),
                    y: () => gsap.utils.random(-70, 70),
                    rotate: i % 2 === 0 ? -28 : 28,
                    scale: 0.45,
                    autoAlpha: 0,
                    filter: 'blur(12px)',
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: svg,
                        containerAnimation: horizontalTl,
                        start: 'left 84%',
                        end: 'left 48%',
                        scrub: 1
                    }
                });

                gsap.to(svg, {
                    rotate: i % 2 === 0 ? '+=22' : '-=22',
                    yPercent: i % 2 === 0 ? -12 : 12,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: svg,
                        containerAnimation: horizontalTl,
                        start: 'left right',
                        end: 'right left',
                        scrub: true
                    }
                });
            });

            /* ── SVG flotante intro ──────────────────────────── */

            if (introSvg) {
                gsap.fromTo(introSvg,
                    { x: 140, y: 80, rotate: -26, scale: 0.6, autoAlpha: 0, filter: 'blur(14px)' },
                    {
                        x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: scene, start: 'top 70%', once: true }
                    }
                );

                gsap.to(introSvg, {
                    xPercent: -28,
                    yPercent: -10,
                    rotate: '+=18',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top top',
                        end: () => '+=' + getDistance(),
                        scrub: true
                    }
                });
            }

            /* ── Cleanup: GSAP lo llama al salir del breakpoint ──
               Restaura el DOM al estado neutral para que el
               layout móvil tome el control limpiamente. */
            return () => {
                gsap.set(scene, { clearProps: 'all' });
                gsap.set(scrollWrap, { clearProps: 'all' });
                gsap.set(track, { clearProps: 'all' });
                gsap.set(words, { clearProps: 'all' });
                gsap.set(inlineSvgs, { clearProps: 'all' });
                if (introSvg) gsap.set(introSvg, { clearProps: 'all' });
            };

        });


        /* ── MÓVIL ≤ 768px ───────────────────────────────────── */

        mm.add('(max-width: 768px)', (context) => {

            gsap.set(scene,  { display: 'block', width: '100%', x: 0 });
            gsap.set(track,  { clearProps: 'transform' });

            /* Intro */
            gsap.from('.about-animate-small', {
                y: 36,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: intro, start: 'top 75%', once: true }
            });

            /* Palabras */
            const wordsToAnimateMobile = words.slice(0, 13);
            const wordsStaticMobile    = words.slice(13);

            gsap.from(wordsToAnimateMobile, {
                y: 48,
                rotate: () => gsap.utils.random(-8, 8),
                autoAlpha: 0,
                filter: 'blur(8px)',
                stagger: 0.06,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: track,
                    start: 'top 80%',
                    end: 'center center',
                    scrub: 0.8
                }
            });

            gsap.set(wordsStaticMobile, {
                autoAlpha: 1,
                filter: 'blur(0px)',
                y: 0, rotate: 0
            });

            /* SVGs inline */
            gsap.from(inlineSvgs, {
                scale: 0.55,
                rotate: () => gsap.utils.random(-18, 18),
                autoAlpha: 0,
                filter: 'blur(10px)',
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: track,
                    start: 'top 80%',
                    end: 'center center',
                    scrub: 0.8
                }
            });

            /* Cleanup al salir del breakpoint */
            return () => {
                gsap.set(scene,      { clearProps: 'all' });
                gsap.set(track,      { clearProps: 'all' });
                gsap.set(words,      { clearProps: 'all' });
                gsap.set(inlineSvgs, { clearProps: 'all' });
            };

        });


        /* ── Refresh al cargar todos los assets ──────────────── */
        window.addEventListener('load', () => ScrollTrigger.refresh());

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();