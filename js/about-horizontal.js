'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT HORIZONTAL
   Primer párrafo: escena pinned horizontal + palabras + SVGs
   Versión: solo primeras 13 palabras tienen animación de entrada.
   El resto del texto aparece ya visible.
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

        const about = document.querySelector('#about');
        const scene = document.querySelector('.about-animate-scene');
        const intro = document.querySelector('.about-animate-intro');
        const scrollWrap = document.querySelector('.about-animate-scroll');
        const track = document.querySelector('.about-animate-track');

        const words = gsap.utils.toArray('.about-word');
        const inlineSvgs = gsap.utils.toArray('.about-inline-svg');
        const introSvg = document.querySelector('.about-float-svg--intro');

        if (!about || !scene || !intro || !scrollWrap || !track) {
            console.warn('[about-horizontal] Faltan elementos.');
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            gsap.set([
                about,
                scene,
                intro,
                scrollWrap,
                track,
                words,
                inlineSvgs,
                introSvg
            ], {
                clearProps: 'all',
                autoAlpha: 1
            });
            return;
        }

        ScrollTrigger.saveStyles([
            '.about-animate-scene',
            '.about-animate-intro',
            '.about-animate-scroll',
            '.about-animate-track',
            '.about-word',
            '.about-inline-svg',
            '.about-float-svg'
        ].join(','));

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': function () {
                gsap.set(scene, {
                    display: 'flex',
                    width: 'fit-content'
                });

                gsap.set(scrollWrap, {
                    display: 'flex'
                });

                const getDistance = () => {
                    const sceneWidth = scene.scrollWidth;
                    const viewportWidth = window.innerWidth;
                    return Math.max(sceneWidth - viewportWidth, viewportWidth);
                };

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

                // Texto pequeño de introducción (se mantiene)
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

                // --- NUEVO: Dividir palabras (las primeras 13 tienen animación de entrada) ---
                const allWords = gsap.utils.toArray('.about-word');
                const countToAnimate = 13; // palabras desde "soy" hasta "música"
                const wordsToAnimate = allWords.slice(0, countToAnimate);
                const wordsStatic = allWords.slice(countToAnimate);

                // Animación de entrada solo para las primeras palabras
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

                // El resto de palabras ya visibles desde el inicio
                gsap.set(wordsStatic, {
                    autoAlpha: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: 0
                });

                // Movimiento flotante para TODAS las palabras (como en GSAP)
                allWords.forEach((word, index) => {
                    gsap.to(word, {
                        yPercent: index % 2 === 0 ? -8 : 8,
                        rotate: index % 2 === 0 ? '-=2' : '+=2',
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

                // --- SVGs inline (animaciones originales) ---
                inlineSvgs.forEach((svg, index) => {
                    gsap.from(svg, {
                        x: () => gsap.utils.random(-60, 60),
                        y: () => gsap.utils.random(-70, 70),
                        rotate: index % 2 === 0 ? -28 : 28,
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
                        rotate: index % 2 === 0 ? '+=22' : '-=22',
                        yPercent: index % 2 === 0 ? -12 : 12,
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

                // --- SVG flotante grande (intro) ---
                if (introSvg) {
                    gsap.fromTo(introSvg,
                        {
                            x: 140,
                            y: 80,
                            rotate: -26,
                            scale: 0.6,
                            autoAlpha: 0,
                            filter: 'blur(14px)'
                        },
                        {
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            autoAlpha: 1,
                            filter: 'blur(0px)',
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: scene,
                                start: 'top 70%',
                                once: true
                            }
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

            '(max-width: 768px)': function () {
                gsap.set(scene, {
                    display: 'block',
                    width: '100%'
                });

                gsap.set(track, {
                    clearProps: 'transform'
                });

                gsap.from('.about-animate-small', {
                    y: 36,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: intro,
                        start: 'top 75%',
                        once: true
                    }
                });

                // En móvil también aplicamos la misma lógica: primeras 13 palabras animadas, resto estáticas
                const allWordsMobile = gsap.utils.toArray('.about-word');
                const wordsToAnimateMobile = allWordsMobile.slice(0, 13);
                const wordsStaticMobile = allWordsMobile.slice(13);

                gsap.from(wordsToAnimateMobile, {
                    y: 48,
                    rotate: () => gsap.utils.random(-8, 8),
                    autoAlpha: 0,
                    filter: 'blur(8px)',
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: track,
                        start: 'top 75%',
                        end: 'center center',
                        scrub: 1
                    }
                });

                gsap.set(wordsStaticMobile, {
                    autoAlpha: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    rotate: 0
                });

                gsap.from(inlineSvgs, {
                    scale: 0.55,
                    rotate: () => gsap.utils.random(-18, 18),
                    autoAlpha: 0,
                    filter: 'blur(10px)',
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: track,
                        start: 'top 75%',
                        end: 'center center',
                        scrub: 1
                    }
                });
            }
        });

        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();