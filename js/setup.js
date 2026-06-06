'use strict';

/* ════════════════════════════════════════════════════════════
   SETUP — animación de entrada del texto descriptivo
   ════════════════════════════════════════════════════════════ */

(function initSetupSection() {
    function start() {
        const section = document.querySelector('#setup');
        const description = document.querySelector('.setup-description');

        if (!section || !description) return;

        const p = description.querySelector('p');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof gsap === 'undefined') {
            if (description) {
                description.style.opacity = '1';
                description.style.transform = 'none';
            }
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        if (reduceMotion) {
            gsap.set([description, p].filter(Boolean), {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0
            });
            return;
        }

        gsap.set(description, {
            autoAlpha: 0,
            y: 24
        });

        gsap.to(description, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
                ? {
                    trigger: description,
                    start: 'top 82%',
                    once: true
                }
                : undefined
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
