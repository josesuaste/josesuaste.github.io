'use strict';

/* ════════════════════════════════════════════════════════════
   CONTACT ANIMATIONS — GSAP + ScrollTrigger
   Entrada stagger + focus fields + hover desktop + submit feedback
   ════════════════════════════════════════════════════════════ */

(function initContactAnimations() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const contact = document.querySelector('#contact');
        if (!contact) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const label = contact.querySelector('.section-label');
        const title = contact.querySelector('.contact-title');
        const fields = contact.querySelectorAll('.form-field');
        const inputs = contact.querySelectorAll('.form-field input, .form-field textarea');
        const form = contact.querySelector('.minimal-form');
        const button = contact.querySelector('.submit-btn');

        if (reduceMotion) {
            gsap.set([label, title, fields, button], {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                scale: 1
            });

            return;
        }

        gsap.set([label, title], {
            autoAlpha: 0,
            y: 34
        });

        gsap.set(fields, {
            autoAlpha: 0,
            y: 32
        });

        gsap.set(button, {
            autoAlpha: 0,
            y: 22,
            scale: 0.98
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contact,
                start: 'top 72%',
                once: true
            }
        });

        tl.to(label, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out'
        });

        tl.to(title, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out'
        }, '-=0.28');

        tl.to(fields, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out'
        }, '-=0.22');

        tl.to(button, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'back.out(1.6)'
        }, '-=0.18');

        inputs.forEach((input) => {
            const field = input.closest('.form-field');
            const labelEl = field ? field.querySelector('label') : null;

            input.addEventListener('focus', () => {
                if (!field) return;

                gsap.to(field, {
                    y: -4,
                    duration: 0.24,
                    ease: 'power2.out'
                });

                if (labelEl) {
                    gsap.to(labelEl, {
                        x: 2,
                        color: 'rgba(242, 237, 228, 0.85)',
                        duration: 0.24,
                        ease: 'power2.out'
                    });
                }
            });

            input.addEventListener('blur', () => {
                if (!field) return;

                gsap.to(field, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                if (labelEl) {
                    gsap.to(labelEl, {
                        x: 0,
                        color: 'rgba(242, 237, 228, 0.45)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        if (canHover && button) {
            const dot = button.querySelector('.btn-dot');

            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    y: -4,
                    scale: 1.025,
                    duration: 0.28,
                    ease: 'power2.out'
                });

                if (dot) {
                    gsap.to(dot, {
                        scale: 1.45,
                        duration: 0.28,
                        ease: 'back.out(2)'
                    });
                }
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    y: 0,
                    scale: 1,
                    duration: 0.35,
                    ease: 'power2.out'
                });

                if (dot) {
                    gsap.to(dot, {
                        scale: 1,
                        duration: 0.35,
                        ease: 'power2.out'
                    });
                }
            });
        }

        if (form && button) {
            form.addEventListener('submit', () => {
                const originalHTML = button.innerHTML;

                button.disabled = true;
                button.setAttribute('aria-busy', 'true');
                button.innerHTML = '<span class="btn-dot"></span> Enviando…';

                gsap.fromTo(button,
                    { scale: 1 },
                    {
                        scale: 0.96,
                        duration: 0.12,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    }
                );

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                    button.removeAttribute('aria-busy');
                }, 2500);
            });
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