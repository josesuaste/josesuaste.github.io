'use strict';

/* ════════════════════════════════════════════════════════════
   HERO — subscribe button subtle floating wiggle
   GSAP base only
   ════════════════════════════════════════════════════════════ */

(function initHeroSubscribeWiggle() {
    const button = document.querySelector('.bottom-sub-btn');

    if (!button || typeof gsap === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return;

    const wiggle = gsap.timeline({
        paused: true,
        defaults: {
            duration: 0.075,
            ease: 'power1.inOut'
        }
    });

    wiggle
        .to(button, { x: -2, rotation: -1 })
        .to(button, { x: 2, rotation: 1 })
        .to(button, { x: -1.5, rotation: -0.6 })
        .to(button, { x: 1.5, rotation: 0.6 })
        .to(button, { x: 0, rotation: 0, duration: 0.12 });

    let intervalId = null;

    const observer = new IntersectionObserver((entries) => {
        const entry = entries;

        if (!entry || !entry.isIntersecting || intervalId) return;

        intervalId = window.setInterval(() => {
            if (!document.body.classList.contains('nav-open')) {
                wiggle.play(0);
            }
        }, 7000);

        observer.disconnect();
    }, {
        threshold: 0.6
    });

    observer.observe(button);

    window.addEventListener('pagehide', () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }

        observer.disconnect();
    }, { once: true });
})();