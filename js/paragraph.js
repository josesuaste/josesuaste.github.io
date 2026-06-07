'use strict';

/* ════════════════════════════════════════════════════════════
   PARAGRAPH — animación de entrada del párrafo + línea decorativa
   Este archivo es el único responsable de animar:
   · .setup-description
   · .setup-scribble__path
   Los .orbit-item y el modelo 3D los maneja setup-3d.js.
   ════════════════════════════════════════════════════════════ */

(function initSetupSection() {
    function start() {
        const section = document.querySelector('#setup');
        const description = document.querySelector('.setup-description');

        if (!section || !description) return;

        const scribblePath = description.querySelector('.setup-scribble__path');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sin GSAP — mostrar todo de golpe
        if (typeof gsap === 'undefined') {
            description.style.opacity = '1';
            description.style.visibility = 'visible';
            description.style.transform = 'none';
            if (scribblePath) scribblePath.style.strokeDashoffset = '0';
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Reduced motion — mostrar sin animación
        if (reduceMotion) {
            gsap.set(description, { autoAlpha: 1, y: 0 });
            if (scribblePath) gsap.set(scribblePath, { strokeDashoffset: 0 });
            return;
        }

        // Estado inicial del párrafo
        // (el CSS ya lo tiene en opacity:0 visibility:hidden, pero
        //  gsap.set lo confirma para que GSAP tome control)
        gsap.set(description, { autoAlpha: 0, y: 24 });

        // Párrafo: fade + translateY al entrar al viewport
        gsap.to(description, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
                ? { trigger: description, start: 'top 82%', once: true }
                : undefined
        });

        // Línea scribble: se dibuja al entrar
        if (scribblePath && typeof ScrollTrigger !== 'undefined') {
            // getTotalLength() da la longitud real del path para que el
            // stroke-dasharray sea exacto y no haya hueco al final
            const pathLength = scribblePath.getTotalLength?.() || 1000;
            scribblePath.style.strokeDasharray = pathLength;
            scribblePath.style.strokeDashoffset = pathLength;

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