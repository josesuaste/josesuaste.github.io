'use strict';

/* ════════════════════════════════════════════════════════════
   FORM — auto-resize + contact animations
   GSAP + ScrollTrigger
   ════════════════════════════════════════════════════════════ */

(function initContactForm() {
    function start() {
        const contact = document.querySelector('#contact');
        const form = document.querySelector('.minimal-form');
        const textarea = document.querySelector('.minimal-form textarea');

        /*
          Auto-resize del textarea.
          Esta parte no depende de GSAP.
        */
        if (textarea) {
            const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };

            textarea.addEventListener('input', resizeTextarea);
            resizeTextarea();
        }

        if (!contact || !form) return;

        if (typeof gsap === 'undefined') {
            console.warn('[form] GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[form] ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const label = contact.querySelector('.section-label');
        const title = contact.querySelector('.contact-title');
        const fields = contact.querySelectorAll('.form-field');
        const inputs = contact.querySelectorAll('.form-field input, .form-field textarea');
        const button = contact.querySelector('.submit-btn');

        function isNavOpen() {
            return document.body.classList.contains('nav-open');
        }

        if (reduceMotion) {
            gsap.set([label, title, fields, button].filter(Boolean), {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                scale: 1
            });

            return;
        }

        /*
          Estado inicial
        */
        gsap.set([label, title].filter(Boolean), {
            autoAlpha: 0,
            y: 34
        });

        gsap.set(fields, {
            autoAlpha: 0,
            y: 32
        });

        if (button) {
            gsap.set(button, {
                autoAlpha: 0,
                y: 22,
                scale: 0.98
            });
        }

        /*
          Entrada de la sección
        */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contact,
                start: 'top 72%',
                once: true
            }
        });

        if (label) {
            tl.to(label, {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        }

        if (title) {
            tl.to(title, {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: 'power3.out',
                overwrite: 'auto'
            }, '-=0.28');
        }

        if (fields.length) {
            tl.to(fields, {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power3.out',
                overwrite: 'auto'
            }, '-=0.22');
        }

        if (button) {
            tl.to(button, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                ease: 'back.out(1.6)',
                overwrite: 'auto'
            }, '-=0.18');
        }

        /*
          Focus en campos
        */
        inputs.forEach((input) => {
            const field = input.closest('.form-field');
            const labelEl = field?.querySelector('label');

            input.addEventListener('focus', () => {
                if (!field || isNavOpen()) return;

                gsap.to(field, {
                    y: -3,
                    duration: 0.24,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (labelEl) {
                    gsap.to(labelEl, {
                        x: 2,
                        color: 'rgba(242, 237, 228, 0.85)',
                        duration: 0.24,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });

            input.addEventListener('blur', () => {
                if (!field) return;

                gsap.to(field, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (labelEl) {
                    gsap.to(labelEl, {
                        x: 0,
                        color: 'rgba(242, 237, 228, 0.45)',
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });
        });

        /*
          Hover botón solo desktop
        */
        if (canHover && button) {
            button.addEventListener('mouseenter', () => {
                if (isNavOpen()) return;

                const dot = button.querySelector('.btn-dot');

                gsap.to(button, {
                    y: -4,
                    scale: 1.025,
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (dot) {
                    gsap.to(dot, {
                        scale: 1.45,
                        duration: 0.28,
                        ease: 'back.out(2)',
                        overwrite: 'auto'
                    });
                }
            });

            button.addEventListener('mouseleave', () => {
                const dot = button.querySelector('.btn-dot');

                gsap.to(button, {
                    y: 0,
                    scale: 1,
                    duration: 0.35,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (dot) {
                    gsap.to(dot, {
                        scale: 1,
                        duration: 0.35,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });
        }

        /*
          Feedback visual al enviar
        */
        if (button) {
            form.addEventListener('submit', () => {
                button.disabled = true;
                button.setAttribute('aria-busy', 'true');
                button.innerHTML = '<span class="btn-dot" aria-hidden="true"></span> Enviando…';

                gsap.fromTo(
                    button,
                    { y: 0 },
                    {
                        y: 2,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut',
                        overwrite: 'auto'
                    }
                );

                setTimeout(() => {
                    button.innerHTML = '<span class="btn-dot" aria-hidden="true"></span> Enviar mensaje';
                    button.disabled = false;
                    button.removeAttribute('aria-busy');
                }, 2500);
            });
        }

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