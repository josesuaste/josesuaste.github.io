'use strict';

// ════════════════════════════════════════════════════════════
//  FOOTER — año automático + bento hover animation
// ════════════════════════════════════════════════════════════

(function initFooter() {
    const year = document.getElementById('current-year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const cards = document.querySelectorAll('.footer-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!cards.length || reduceMotion || !canHover || typeof gsap === 'undefined') return;

    cards.forEach((card) => {
        const title = card.querySelector('.footer-card__title');
        const arrow = card.querySelector('.footer-card__arrow');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                scale: 1.015,
                duration: 0.28,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            if (title) {
                gsap.to(title, {
                    x: 4,
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }

            if (arrow) {
                gsap.to(arrow, {
                    x: 5,
                    y: -5,
                    rotate: 8,
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.34,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            if (title) {
                gsap.to(title, {
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
