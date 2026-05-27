'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT ANIMATIONS — Curtain reveal
   El About sube como cortina y tapa el Hero
   ════════════════════════════════════════════════════════════ */

(function initAboutAnimations() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('[about-animations] GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[about-animations] ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const hero = document.querySelector('#hero');
        const about = document.querySelector('#about');

        if (!hero || !about) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const label = about.querySelector('.section-label');
        const paragraphs = about.querySelectorAll('.text-giant');
        const cta = about.querySelector('.cta-link');

        if (reduceMotion) {
            gsap.set([hero, about, label, paragraphs, cta], {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                yPercent: 0
            });

            return;
        }

        /*
          El About ya está encima del Hero gracias a margin-top: -100vh,
          pero visualmente arranca abajo del viewport.
        */
        gsap.set(about, {
            yPercent: 100
        });

        gsap.set([label, paragraphs, cta], {
            autoAlpha: 0,
            y: 32
        });

        /*
          Cortina principal:
          pinea el Hero y sube el About encima de él.
        */
        const curtainTl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=100%',
                scrub: 1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        curtainTl.to(about, {
            yPercent: 0,
            ease: 'none'
        });

        /*
          Entrada del contenido interno cuando la cortina ya está llegando.
        */
        curtainTl.to(label, {
            autoAlpha: 1,
            y: 0,
            duration: 0.25,
            ease: 'none'
        }, 0.58);

        curtainTl.to(paragraphs, {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: 'none'
        }, 0.65);

        if (cta) {
            curtainTl.to(cta, {
                autoAlpha: 1,
                y: 0,
                duration: 0.25,
                ease: 'none'
            }, 0.82);
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