'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT ANIMATIONS — GSAP + ScrollTrigger
   Texto: fade + subida suave
   Stickers: pop con back.out
   SVG óvalos: dibujo con strokeDashoffset
   Decoración: flotación lenta y random
   Hover: solo desktop/mouse real
   ════════════════════════════════════════════════════════════ */

(function initAboutAnimations() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const about = document.querySelector('#about');
        if (!about) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const label = about.querySelector('.section-label');
        const paragraphs = about.querySelectorAll('.text-giant');
        const stickers = about.querySelectorAll('.inline-media');
        const stickerImages = about.querySelectorAll('.inline-media img');
        const ovalEllipses = about.querySelectorAll('.mark-oval-svg ellipse');

        if (reduceMotion) {
            gsap.set([label, paragraphs, stickers, stickerImages, ovalEllipses], {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotation: 0
            });

            return;
        }

        /* Estado inicial */
        gsap.set([label, paragraphs], {
            autoAlpha: 0,
            y: 48
        });

        gsap.set(stickers, {
            autoAlpha: 0,
            scale: 0,
            rotation: -10,
            transformOrigin: '50% 50%'
        });

        /* Label */
        if (label) {
            gsap.to(label, {
                scrollTrigger: {
                    trigger: about,
                    start: 'top 75%',
                    once: true
                },
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out'
            });
        }

        /* Texto gigante */
        paragraphs.forEach((paragraph, index) => {
            gsap.to(paragraph, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 82%',
                    once: true
                },
                autoAlpha: 1,
                y: 0,
                duration: 1,
                delay: index * 0.08,
                ease: 'power3.out'
            });
        });

        /* Stickers pop */
        stickers.forEach((sticker) => {
            gsap.to(sticker, {
                scrollTrigger: {
                    trigger: sticker,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => {
                        const img = sticker.querySelector('img');
                        if (img) startFloating(img);
                    }
                },
                autoAlpha: 1,
                scale: 1,
                rotation: gsap.utils.random(-7, 7),
                duration: 0.65,
                ease: 'back.out(1.8)'
            });
        });

        /* Óvalos SVG */
        ovalEllipses.forEach((ellipse) => {
            const length = ellipse.getTotalLength();

            gsap.set(ellipse, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            gsap.to(ellipse, {
                scrollTrigger: {
                    trigger: ellipse.closest('.mark-oval') || ellipse,
                    start: 'top 86%',
                    once: true
                },
                strokeDashoffset: 0,
                duration: 1,
                ease: 'power2.out'
            });
        });

        /* Flotación decorativa */
        function startFloating(img) {
            gsap.killTweensOf(img);

            gsap.to(img, {
                y: gsap.utils.random(-7, 7),
                rotation: gsap.utils.random(-4, 4),
                duration: gsap.utils.random(2.2, 4),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: gsap.utils.random(0, 0.5)
            });
        }

        /*
          Si quieres que TODOS empiecen a flotar desde el inicio,
          descomenta este bloque y elimina el onEnter de arriba.

          stickerImages.forEach((img) => {
              startFloating(img);
          });
        */

        /* Hover stickers — solo desktop/mouse */
        if (canHover) {
            stickers.forEach((sticker) => {
                const img = sticker.querySelector('img');
                if (!img) return;

                sticker.addEventListener('mouseenter', () => {
                    gsap.killTweensOf(img);

                    gsap.to(img, {
                        scale: 1.28,
                        y: -8,
                        rotation: gsap.utils.random(-14, 14),
                        duration: 0.28,
                        ease: 'back.out(2.4)'
                    });
                });

                sticker.addEventListener('mouseleave', () => {
                    gsap.killTweensOf(img);

                    gsap.to(img, {
                        scale: 1,
                        y: 0,
                        rotation: gsap.utils.random(-4, 4),
                        duration: 0.45,
                        ease: 'elastic.out(1, 0.45)',
                        onComplete: () => startFloating(img)
                    });
                });
            });
        }

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