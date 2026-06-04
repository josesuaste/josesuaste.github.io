'use strict';

// ════════════════════════════════════════════════════════════
//  FOOTER — año automático + pills animation
// ════════════════════════════════════════════════════════════

(function initFooter() {
    const year = document.getElementById('current-year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const pills = document.querySelectorAll('.footer-pill');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!pills.length || reduceMotion || !canHover || typeof gsap === 'undefined') return;

    pills.forEach((pill) => {
        const text = pill.querySelector('.footer-pill__text');
        const arrow = pill.querySelector('.footer-pill__arrow');

        pill.addEventListener('mouseenter', () => {
            gsap.to(pill, {
                y: -4,
                scaleX: 1.035,
                duration: 0.28,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            if (text) {
                gsap.to(text, {
                    x: 3,
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }

            if (arrow) {
                gsap.to(arrow, {
                    x: 4,
                    y: -4,
                    rotate: 8,
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });

        pill.addEventListener('mouseleave', () => {
            gsap.to(pill, {
                y: 0,
                scaleX: 1,
                duration: 0.34,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            if (text) {
                gsap.to(text, {
                    x: 0,
                    duration: 0.34,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }

            if (arrow) {
                gsap.to(arrow, {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    duration: 0.34,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });
    });
})();
