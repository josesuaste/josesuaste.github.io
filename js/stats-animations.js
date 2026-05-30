'use strict';

/* ════════════════════════════════════════════════════════════
   STATS ANIMATIONS
   Sticky stack cards + hover premium + number count
   ════════════════════════════════════════════════════════════ */

(function initStatsAnimations() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('[stats-animations] GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[stats-animations] ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const section = document.querySelector('.stats-section');
        const cards = gsap.utils.toArray('.stat-card');

        if (!section || !cards.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            cards.forEach((card) => {
                const number = card.querySelector('.stat-number');
                const display = card.dataset.display;

                if (number && display) {
                    number.textContent = display;
                }
            });

            return;
        }

        cards.forEach((card, index) => {
            const number = card.querySelector('.stat-number');
            const label = card.querySelector('.stat-label');
            const copy = card.querySelector('.stat-copy');
            const display = card.dataset.display;
            const value = Number(card.dataset.val || 0);

            /*
              Entrada de cada card.
            */
            gsap.from(card, {
                y: 80,
                autoAlpha: 0,
                filter: 'blur(14px)',
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 82%',
                    once: true
                }
            });

            /*
              Efecto stack: cada card se comprime sutilmente al quedar pegada.
            */
            gsap.to(card, {
                scale: 1 - index * 0.025,
                transformOrigin: 'center top',
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 110px',
                    end: 'bottom top',
                    scrub: true
                }
            });

            /*
              Conteo numérico.
            */
            if (number && display) {
                const counter = { value: 0 };

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 75%',
                    once: true,
                    onEnter: () => {
                        gsap.to(counter, {
                            value,
                            duration: 1.4,
                            ease: 'power2.out',
                            onUpdate: () => {
                                if (display.includes('K')) {
                                    number.textContent = display;
                                    return;
                                }

                                number.textContent = Math.round(counter.value).toLocaleString('es-MX');

                                if (display.includes('+')) {
                                    number.textContent += '+';
                                }
                            },
                            onComplete: () => {
                                number.textContent = display;
                            }
                        });
                    }
                });
            }

            /*
              Hover premium solo desktop.
            */
            const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

            if (canHover) {
                card.addEventListener('pointermove', (event) => {
                    const rect = card.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width) * 100;
                    const y = ((event.clientY - rect.top) / rect.height) * 100;

                    card.style.setProperty('--mx', `${x}%`);
                    card.style.setProperty('--my', `${y}%`);
                });

                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        duration: 0.35,
                        ease: 'power3.out'
                    });

                    if (number) {
                        gsap.to(number, {
                            scale: 1.045,
                            transformOrigin: 'left center',
                            duration: 0.35,
                            ease: 'power3.out'
                        });
                    }

                    if (label) {
                        gsap.to(label, {
                            autoAlpha: 0.92,
                            duration: 0.25,
                            ease: 'power2.out'
                        });
                    }

                    if (copy) {
                        gsap.to(copy, {
                            autoAlpha: 0.78,
                            duration: 0.25,
                            ease: 'power2.out'
                        });
                    }
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        duration: 0.35,
                        ease: 'power3.out'
                    });

                    if (number) {
                        gsap.to(number, {
                            scale: 1,
                            duration: 0.35,
                            ease: 'power3.out'
                        });
                    }

                    if (label) {
                        gsap.to(label, {
                            autoAlpha: 1,
                            duration: 0.25,
                            ease: 'power2.out'
                        });
                    }

                    if (copy) {
                        gsap.to(copy, {
                            autoAlpha: 1,
                            duration: 0.25,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });

        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();