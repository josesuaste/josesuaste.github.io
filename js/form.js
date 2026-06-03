'use strict';

/* ════════════════════════════════════════════════════════════
   FORM — inbox curado + rounded fields + submit animation
   GSAP + ScrollTrigger + optional TextPlugin
   ════════════════════════════════════════════════════════════ */

(function initContactForm() {
    function start() {
        const contact = document.querySelector('#contact');
        const form = document.querySelector('.minimal-form');
        const textarea = document.querySelector('.minimal-form textarea');

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

        if (typeof TextPlugin !== 'undefined') {
            gsap.registerPlugin(TextPlugin);
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const label = contact.querySelector('.section-label');
        const title = contact.querySelector('.contact-title');
        const subtitle = contact.querySelector('.contact-subtitle');
        const copy = contact.querySelector('.contact-copy');
        const fields = contact.querySelectorAll('.form-field');
        const inputs = contact.querySelectorAll('.form-field input, .form-field textarea, .form-field select');
        const button = contact.querySelector('.submit-btn');
        const buttonText = contact.querySelector('.submit-btn__text');
        const lines = contact.querySelectorAll('.contact-line');

        function isNavOpen() {
            return document.body.classList.contains('nav-open');
        }

        if (reduceMotion) {
            gsap.set([label, title, subtitle, copy, fields, button, lines].filter(Boolean), {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                scale: 1
            });

            return;
        }

        gsap.set([label, title, subtitle, copy].filter(Boolean), {
            autoAlpha: 0,
            y: 28
        });

        gsap.set(fields, {
            autoAlpha: 0,
            y: 28
        });

        if (button) {
            gsap.set(button, {
                autoAlpha: 0,
                y: 22,
                scale: 0.98
            });
        }

        if (lines.length) {
            gsap.set(lines, {
                autoAlpha: 0,
                scale: 0.96
            });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contact,
                start: 'top 72%',
                once: true
            }
        });

        if (lines.length) {
            tl.to(lines, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out'
            }, 0);
        }

        if (label) {
            tl.to(label, {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.12);
        }

        if (title) {
            tl.to(title, {
                autoAlpha: 1,
                y: 0,
                duration: 0.78,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.22);
        }

        if (subtitle) {
            tl.to(subtitle, {
                autoAlpha: 1,
                y: 0,
                duration: 0.58,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.42);
        }

        if (copy) {
            tl.to(copy, {
                autoAlpha: 1,
                y: 0,
                duration: 0.56,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.54);
        }

        if (fields.length) {
            tl.to(fields, {
                autoAlpha: 1,
                y: 0,
                duration: 0.58,
                stagger: 0.07,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.68);
        }

        if (button) {
            tl.to(button, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.6)',
                overwrite: 'auto'
            }, 0.92);
        }

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
                        color: 'rgba(244, 241, 234, 0.9)',
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
                        color: 'rgba(244, 241, 234, 0.62)',
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });
        });

        if (canHover && button) {
            button.addEventListener('mouseenter', () => {
                if (isNavOpen() || button.disabled) return;

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
                if (button.disabled) return;

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

        if (button) {
            form.addEventListener('submit', () => {
                button.disabled = true;
                button.setAttribute('aria-busy', 'true');

                const dot = button.querySelector('.btn-dot');

                if (dot) {
                    gsap.to(dot, {
                        scale: 1.35,
                        duration: 0.24,
                        ease: 'back.out(2)',
                        overwrite: 'auto'
                    });
                }

                gsap.to(button, {
                    y: 0,
                    scale: 0.99,
                    duration: 0.18,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (buttonText && typeof TextPlugin !== 'undefined') {
                    const submitTL = gsap.timeline();

                    submitTL
                        .to(buttonText, {
                            duration: 0.36,
                            text: {
                                value: 'Enviando...',
                                type: 'diff'
                            },
                            ease: 'sine.in'
                        })
                        .to(buttonText, {
                            duration: 0.5,
                            text: {
                                value: 'Enviando',
                                type: 'diff'
                            },
                            ease: 'sine.inOut',
                            repeat: -1,
                            yoyo: true
                        });
                } else if (buttonText) {
                    buttonText.textContent = 'Enviando...';
                }
            });
        }

        if (canHover && lines.length && typeof ScrollTrigger !== 'undefined') {
            gsap.to('.contact-line--one', {
                y: -34,
                ease: 'none',
                scrollTrigger: {
                    trigger: contact,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.contact-line--two', {
                y: 42,
                ease: 'none',
                scrollTrigger: {
                    trigger: contact,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
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