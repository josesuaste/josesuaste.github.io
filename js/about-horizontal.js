'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT HORIZONTAL
   Desktop: escena pinned + scroll horizontal
   Mobile: animaciones verticales con ScrollTrigger
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

        /* ── Elementos ───────────────────────────────────── */

        const about     = document.querySelector('#about');
        const scene     = document.querySelector('.about-animate-scene');
        const intro     = document.querySelector('.about-animate-intro');
        const scrollWrap = document.querySelector('.about-animate-scroll');
        const track     = document.querySelector('.about-animate-track');
        const introSvg  = document.querySelector('.about-float-svg--intro');

        const words     = gsap.utils.toArray('.about-word');
        const inlineSvgs = gsap.utils.toArray('.about-inline-svg');

        if (!about || !scene || !intro || !scrollWrap || !track) {
            console.warn('[about-horizontal] Faltan elementos del DOM.');
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ── Sin animación (prefers-reduced-motion) ──────── */

        if (reduceMotion) {
            gsap.set([about, scene, intro, scrollWrap, track, words, inlineSvgs, introSvg], {
                clearProps: 'all',
                autoAlpha: 1
            });
            return;
        }


        /* ── Guardar estilos antes de matchMedia ─────────── */
        /* FIX 5: ScrollTrigger.saveStyles garantiza que al
           cambiar breakpoint (resize) los estilos del DOM
           se restauran antes de recalcular, evitando que
           la escena quede con width: fit-content en móvil
           o display: block en desktop. */

        ScrollTrigger.saveStyles([
            '.about-animate-scene',
            '.about-animate-intro',
            '.about-animate-scroll',
            '.about-animate-track',
            '.about-word',
            '.about-inline-svg',
            '.about-float-svg'
        ].join(','));


        /* ════════════════════════════════════════════════════
           DESKTOP ≥ 769px
           ════════════════════════════════════════════════════ */

        ScrollTrigger.matchMedia({

            '(min-width: 769px)': function () {

                gsap.set(scene,      { display: 'flex', width: 'fit-content' });
                gsap.set(scrollWrap, { display: 'flex' });

                /* Distancia total a desplazar */
                const getDistance = () => {
                    const sceneWidth = scene.scrollWidth;
                    const vw = window.innerWidth;
                    return Math.max(sceneWidth - vw, vw);
                };

                /* ── Timeline horizontal pinned ────────────── */

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

                /* ── Intro: texto pequeño ──────────────────── */

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

                /* ── Palabras: primeras 13 animadas, resto visibles ── */

                const countToAnimate = 13;
                const wordsToAnimate = words.slice(0, countToAnimate);
                const wordsStatic    = words.slice(countToAnimate);

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
                    x: 0,
                    y: 0,
                    rotate: 0
                });

                /* ── Movimiento flotante en todas las palabras ─ */

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

                /* ── SVGs inline ─────────────────────────────── */

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

                /* ── SVG flotante grande (intro) ─────────────── */

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

            },


            /* ══════════════════════════════════════════════════
               MÓVIL ≤ 768px
               ══════════════════════════════════════════════════ */

            '(max-width: 768px)': function () {

                gsap.set(scene, { display: 'block', width: '100%' });
                gsap.set(track, { clearProps: 'transform' });

                /* Intro */
                gsap.from('.about-animate-small', {
                    y: 36,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: intro, start: 'top 75%', once: true }
                });

                /* Palabras */
                const countToAnimate = 13;
                const wordsToAnimateMobile = words.slice(0, countToAnimate);
                const wordsStaticMobile    = words.slice(countToAnimate);

                /* FIX 6: En móvil el trigger debe ser el track completo,
                   no palabra por palabra. Las palabras son pequeñas y
                   su threshold puede no activarse si están fuera del
                   viewport antes de que el usuario llegue. */
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
                    y: 0,
                    rotate: 0
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

            }

        });


        /* ── Refresh al cargar todos los assets ──────────── */

        window.addEventListener('load', () => ScrollTrigger.refresh());

    }


    /* ── Punto de entrada ────────────────────────────────── */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();