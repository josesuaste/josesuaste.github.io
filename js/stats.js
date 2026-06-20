'use strict';

/* ════════════════════════════════════════════════════════════
   STATS ANIMATIONS
   Sticky stack cards + hover premium + number count + tilt 3D
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
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        function isNavOpen() {
            return document.body.classList.contains('nav-open');
        }

        /*
          Formatea un número al mismo estilo que data-display.
          Detecta si el display final usa "K" o "+" para aplicar
          el mismo formato durante la animación del contador.
        */
        function formatCount(value, display) {
            if (display.includes('K')) {
                const k = value / 1000;
                const formatted = Number.isInteger(k) ? k.toString() : k.toFixed(1);
                return formatted + 'K';
            }

            const rounded = Math.round(value).toLocaleString('es-MX');

            if (display.includes('+')) {
                return rounded + '+';
            }

            return rounded;
        }

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

        /*
          gsap.matchMedia() para separar la entrada según breakpoint.
          En desktop: y + autoAlpha + filter:blur (visualmente rico,
          la GPU puede manejarlo en pocos elementos grandes).
          En mobile: solo y + autoAlpha — filter:blur es caro en
          dispositivos mid-range y el efecto apenas se percibe en scroll.
        */
        const mm = gsap.matchMedia();

        cards.forEach((card, index) => {
            const number = card.querySelector('.stat-number');
            const label = card.querySelector('.stat-label');
            const copy = card.querySelector('.stat-copy');
            const display = card.dataset.display;
            const value = Number(card.dataset.val || 0);

            /* ── Animación de entrada — breakpoint-aware ── */

            mm.add('(min-width: 900px)', () => {
                gsap.from(card, {
                    y: 80,
                    autoAlpha: 0,
                    filter: 'blur(14px)',
                    duration: 0.9,
                    ease: 'power3.out',
                    overwrite: 'auto',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 82%',
                        once: true
                    }
                });
            });

            mm.add('(max-width: 899px)', () => {
                gsap.from(card, {
                    y: 60,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    overwrite: 'auto',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        once: true
                    }
                });
            });

            /* ── Efecto stack: compresión sutil al quedar pegada ── */

            gsap.to(card, {
                scale: 1 - index * 0.025,
                transformOrigin: 'center top',
                ease: 'none',
                overwrite: 'auto',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 110px',
                    end: 'bottom top',
                    scrub: true
                }
            });

            /* ── Conteo numérico ── */

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
                            overwrite: 'auto',
                            onUpdate() {
                                number.textContent = formatCount(counter.value, display);
                            },
                            onComplete() {
                                number.textContent = display;
                            }
                        });
                    }
                });
            }

            /* ── Tilt 3D + hover — solo desktop ── */

            if (canHover) {
                /*
                  gsap.quickTo() crea un setter optimizado que interpola
                  hacia el valor objetivo sin crear un tween nuevo por cada
                  pointermove. El duration controla qué tan rápido sigue
                  al cursor — 0.55s es suave y elegante.
                */
                const quickRotX = gsap.quickTo(card, 'rotateX', {
                    duration: 0.55,
                    ease: 'power3.out'
                });

                const quickRotY = gsap.quickTo(card, 'rotateY', {
                    duration: 0.55,
                    ease: 'power3.out'
                });

                /*
                  Intensidad máxima del tilt en grados.
                  8° es sutil pero perceptible — suficiente para dar
                  profundidad sin marear ni competir con el sticky.
                */
                const TILT_MAX = 8;

                card.addEventListener('pointermove', (event) => {
                    if (isNavOpen()) return;

                    const rect = card.getBoundingClientRect();

                    // Posición normalizada: -1 a 1 dentro de la card
                    const nx = (event.clientX - rect.left) / rect.width * 2 - 1;
                    const ny = (event.clientY - rect.top) / rect.height * 2 - 1;

                    // rotateX: cursor arriba → card inclina hacia atrás (negativo)
                    // rotateY: cursor derecha → card gira hacia la derecha
                    quickRotY(nx * TILT_MAX);
                    quickRotX(-ny * TILT_MAX);

                    // Actualizar el gradiente de fondo con la posición del cursor
                    const px = ((event.clientX - rect.left) / rect.width) * 100;
                    const py = ((event.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--mx', `${px}%`);
                    card.style.setProperty('--my', `${py}%`);
                });

                card.addEventListener('mouseenter', () => {
                    if (isNavOpen()) return;

                    gsap.to(card, {
                        y: -10,
                        duration: 0.35,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });

                    if (number) {
                        gsap.to(number, {
                            scale: 1.045,
                            transformOrigin: 'left center',
                            duration: 0.35,
                            ease: 'power3.out',
                            overwrite: 'auto'
                        });
                    }

                    if (label) {
                        gsap.to(label, {
                            autoAlpha: 0.92,
                            duration: 0.25,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }

                    if (copy) {
                        gsap.to(copy, {
                            autoAlpha: 0.78,
                            duration: 0.25,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }
                });

                card.addEventListener('mouseleave', () => {
                    if (isNavOpen()) return;

                    // Resetear tilt y hover juntos en un solo tween
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        y: 0,
                        duration: 0.55,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });

                    if (number) {
                        gsap.to(number, {
                            scale: 1,
                            duration: 0.35,
                            ease: 'power3.out',
                            overwrite: 'auto'
                        });
                    }

                    if (label) {
                        gsap.to(label, {
                            autoAlpha: 1,
                            duration: 0.25,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }

                    if (copy) {
                        gsap.to(copy, {
                            autoAlpha: 1,
                            duration: 0.25,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
