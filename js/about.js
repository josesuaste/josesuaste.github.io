'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT — editorial note + SVG line animation
   ════════════════════════════════════════════════════════════ */

(function initAboutSection() {
    function start() {
        const about = document.querySelector('.about-me');
        const note = document.querySelector('.about-note');

        if (!about || !note) return;

        const lines = about.querySelectorAll('.about-me__line');
        const textBlocks = note.querySelectorAll('.about-note__text');
        const button = note.querySelector('.about-note__btn');
        const drawLines = about.querySelectorAll('.about-draw-line');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof gsap === 'undefined') {
            note.style.opacity = '1';
            note.style.transform = 'none';

            lines.forEach((line) => {
                line.style.opacity = '1';
            });

            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        /*
          Prepara líneas tipo stroke para animación de dibujo.
          Solo funciona en SVGs con <path class="about-draw-line" ...>.
        */
        drawLines.forEach((line) => {
            if (typeof line.getTotalLength !== 'function') return;

            const length = line.getTotalLength();

            gsap.set(line, {
                strokeDasharray: length,
                strokeDashoffset: length
            });
        });

        if (reduceMotion) {
            gsap.set([note, lines, textBlocks, button].filter(Boolean), {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotate: 0
            });

            gsap.set(drawLines, {
                strokeDashoffset: 0
            });

            return;
        }

        /*
          Estado inicial
        */
        gsap.set(note, {
            autoAlpha: 0,
            y: 26,
            scale: 0.992
        });

        gsap.set(textBlocks, {
            autoAlpha: 0,
            y: 16
        });

        if (button) {
            gsap.set(button, {
                autoAlpha: 0,
                y: 12
            });
        }

        gsap.set(lines, {
            autoAlpha: 0,
            scale: 0.98
        });

        /*
          Entrada principal
        */
        const tl = gsap.timeline({
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
                ? {
                    trigger: about,
                    start: 'top 68%',
                    once: true
                }
                : undefined
        });

        tl.to(lines, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out'
        }, 0);

        if (drawLines.length) {
            tl.to(drawLines, {
                strokeDashoffset: 0,
                duration: 1.35,
                stagger: 0.12,
                ease: 'power3.out'
            }, 0.05);
        }

        tl.to(note, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.82,
            ease: 'power3.out'
        }, 0.18);

        tl.to(textBlocks, {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.12,
            ease: 'power3.out'
        }, 0.42);

        if (button) {
            tl.to(button, {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: 'power3.out'
            }, 0.74);
        }

        /*
          Parallax sutil solo en desktop.
          No se aplica en touch para mantenerlo ligero.
        */
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (canHover && typeof ScrollTrigger !== 'undefined' && lines.length) {
            gsap.to('.about-me__line--one', {
                y: -38,
                rotate: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: about,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.about-me__line--two', {
                y: 46,
                rotate: 132,
                ease: 'none',
                scrollTrigger: {
                    trigger: about,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.about-me__line--three', {
                y: -24,
                rotate: 28,
                ease: 'none',
                scrollTrigger: {
                    trigger: about,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        window.addEventListener('load', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

    


    