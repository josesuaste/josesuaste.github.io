'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT SCRAMBLE
   Segundo párrafo: ScrambleText + SVG + CTA
   ════════════════════════════════════════════════════════════ */

(function initAboutScramble() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('[about-scramble] GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[about-scramble] ScrollTrigger no está cargado.');
            return;
        }

        if (typeof ScrambleTextPlugin === 'undefined') {
            console.warn('[about-scramble] ScrambleTextPlugin no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

        const section = document.querySelector('.about-scramble-section');
        const block = document.querySelector('.about-scramble-block');
        const text = document.querySelector('#text-about-2');
        const svg = document.querySelector('.about-scramble-block .about-svg');
        const cta = document.querySelector('.about-cta');

        if (!section || !block || !text) {
            console.warn('[about-scramble] Faltan elementos.');
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            gsap.set([section, block, text, svg, cta], {
                clearProps: 'all',
                autoAlpha: 1
            });

            return;
        }

        ScrollTrigger.saveStyles([
            '.about-scramble-section',
            '.about-scramble-block',
            '#text-about-2',
            '.about-scramble-block .about-svg',
            '.about-cta'
        ].join(','));

        const finalText = text.textContent.trim();

        gsap.set(text, {
            textContent: '',
            autoAlpha: 1
        });

        ScrollTrigger.create({
            trigger: section,
            start: 'top 65%',
            once: true,
            onEnter: () => {
                gsap.to(text, {
                    duration: 2,
                    ease: 'power2.out',
                    scrambleText: {
                        text: finalText,
                        chars: 'lowerCase',
                        speed: 0.45,
                        revealDelay: 0.12
                    }
                });
            }
        });

        if (svg) {
            gsap.fromTo(svg,
                {
                    y: 90,
                    x: 80,
                    rotate: -24,
                    scale: 0.65,
                    autoAlpha: 0,
                    filter: 'blur(12px)'
                },
                {
                    y: 0,
                    x: 0,
                    rotate: 0,
                    scale: 1,
                    autoAlpha: 1,
                    filter: 'blur(0px)',
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                        end: 'center center',
                        scrub: 1
                    }
                }
            );

            gsap.to(svg, {
                yPercent: -10,
                rotate: '+=14',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        if (cta) {
            gsap.from(cta, {
                y: 24,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 42%',
                    once: true
                }
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