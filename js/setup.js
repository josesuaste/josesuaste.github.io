'use strict';

/* ════════════════════════════════════════════════════════════
   SETUP — animación de entrada del párrafo + línea decorativa
   ════════════════════════════════════════════════════════════ */

(function initSetupSection() {
    function start() {
        const section = document.querySelector('#setup');
        const description = document.querySelector('.setup-description');

        if (!section || !description) return;

        const p = description.querySelector('p');
        const scribblePath = description.querySelector('.setup-scribble__path');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof gsap === 'undefined') {
            description.style.opacity = '1';
            description.style.transform = 'none';
            if (scribblePath) scribblePath.style.strokeDashoffset = '0';
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
            if (scribblePath) {
                gsap.set(scribblePath, { strokeDashoffset: 0 });
            }
            return;
        }

        // Párrafo: fade + translateY
        gsap.set(description, { autoAlpha: 0, y: 24 });

        gsap.to(description, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
                ? { trigger: description, start: 'top 82%', once: true }
                : undefined
        });

        // Línea: se dibuja justo después del párrafo
        if (scribblePath && typeof ScrollTrigger !== 'undefined') {
            gsap.to(scribblePath, {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: description,
                    start: 'top 75%',
                    once: true
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();