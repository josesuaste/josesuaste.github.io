'use strict';

/* ════════════════════════════════════════════════════════════
   FORM — editorial contact + rounded fields + custom tooltip
   GSAP + ScrollTrigger + optional TextPlugin
   ════════════════════════════════════════════════════════════ */

(function initContactForm() {
    function start() {
        const contact = document.querySelector('#contact');
        const form = document.querySelector('.minimal-form');

        if (!contact || !form) return;

        const textarea = form.querySelector('textarea');

        if (textarea) {
            const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };

            textarea.addEventListener('input', resizeTextarea);
            resizeTextarea();
        }

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
        const inputs = form.querySelectorAll('.form-field input, .form-field textarea');
        const button = form.querySelector('.submit-btn');
        const buttonText = form.querySelector('.submit-btn__text');
        const lines = contact.querySelectorAll('.contact-line');

        function isNavOpen() {
            return document.body.classList.contains('nav-open');
        }

        function getFieldMessage(input) {
            const name = input.getAttribute('name');

            if (input.validity.valueMissing) {
                if (name === 'nombre') return 'Escribe tu nombre.';
                if (name === 'email') return 'Escribe tu correo.';
                if (name === 'mensaje') return 'Cuéntame qué debería probar.';
                return 'Completa este campo.';
            }

            if (input.validity.typeMismatch && input.type === 'email') {
                return 'Escribe un correo válido.';
            }

            if (input.validity.tooShort) {
                if (name === 'nombre') return 'El nombre es muy corto.';
                if (name === 'mensaje') return 'La propuesta es muy corta.';
                return 'El texto es muy corto.';
            }

            if (input.validity.tooLong) {
                return 'El texto es demasiado largo.';
            }

            return 'Revisa este campo.';
        }

        function getTooltip(field) {
            let tooltip = field.querySelector('.form-tooltip');

            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'form-tooltip';
                tooltip.setAttribute('role', 'alert');
                field.appendChild(tooltip);
            }

            return tooltip;
        }

        function clearFieldError(input) {
            const field = input.closest('.form-field');
            if (!field) return;

            field.classList.remove('is-invalid');

            const tooltip = field.querySelector('.form-tooltip');

            if (!tooltip) return;

            gsap.to(tooltip, {
                autoAlpha: 0,
                y: 6,
                scale: 0.96,
                duration: 0.22,
                ease: 'power2.in',
                overwrite: 'auto',
                onComplete() {
                    tooltip.textContent = '';
                    gsap.set(tooltip, { y: 8, scale: 0.98, clearProps: 'visibility' });
                }
            });
        }

        function clearAllFieldErrors() {
            inputs.forEach((input) => {
                clearFieldError(input);
            });
        }

        function showFieldError(input) {
            const field = input.closest('.form-field');
            if (!field) return;

            const tooltip = getTooltip(field);

            gsap.killTweensOf(tooltip);

            tooltip.textContent = getFieldMessage(input);
            field.classList.add('is-invalid');

            gsap.fromTo(
                tooltip,
                { autoAlpha: 0, y: 8, scale: 0.98 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.28,
                    ease: 'back.out(1.8)',
                    overwrite: 'auto'
                }
            );
        }

        function isClickInsideFormField(target) {
            return Boolean(target.closest('.form-field'));
        }

        if (reduceMotion) {
            gsap.set([label, title, subtitle, copy, button].filter(Boolean), {
                clearProps: 'transform,opacity,visibility',
                autoAlpha: 1,
                y: 0,
                scale: 1
            });

            gsap.set(fields, {
                clearProps: 'transform,opacity,visibility',
                autoAlpha: 1,
                y: 0
            });

            if (lines.length) {
                gsap.set(lines, {
                    clearProps: 'transform,opacity,visibility',
                    autoAlpha: 1,
                    scale: 1
                });
            }

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

            /*
              Color del label: manejado por CSS (:focus-within en form.css).
              GSAP solo anima `y` del field contenedor — compositor puro.
            */
            input.addEventListener('focus', () => {
                if (!field || isNavOpen()) return;

                inputs.forEach((otherInput) => {
                    if (otherInput !== input) {
                        clearFieldError(otherInput);
                    }
                });

                gsap.to(field, {
                    y: -3,
                    duration: 0.24,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });

            input.addEventListener('input', () => {
                clearFieldError(input);

                if (input === textarea) {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
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

                if (input.value.trim() && !input.checkValidity()) {
                    showFieldError(input);
                }
            });
        });

        document.addEventListener('pointerdown', (event) => {
            if (!form.contains(event.target)) {
                clearAllFieldErrors();
                return;
            }

            if (!isClickInsideFormField(event.target)) {
                clearAllFieldErrors();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                clearAllFieldErrors();
            }
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
            /*
              Timestamp honeypot — antispam sin dependencias.
              Registra cuándo cargó el form y bloquea envíos
              que lleguen en menos de 3 segundos. Los bots
              llenan formularios en milisegundos; los humanos no.
            */
            const formLoadTime = Date.now();
            const MIN_FILL_MS = 3000;

            form.addEventListener('submit', (event) => {
                const invalidInputs = Array.from(inputs).filter((input) => !input.checkValidity());

                /*
                  FIX: invalidInputs en lugar de invalidInputs.
                  Un array vacío [] es truthy — acceder a [0] devuelve
                  undefined cuando no hay errores, que es falsy.
                */
                const firstInvalid = invalidInputs ?? null;

                clearAllFieldErrors();

                if (firstInvalid) {
                    event.preventDefault();

                    showFieldError(firstInvalid);

                    firstInvalid.focus({ preventScroll: true });

                    firstInvalid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    return;
                }

                // Antispam: bloquear si el form se llenó demasiado rápido
                if (Date.now() - formLoadTime < MIN_FILL_MS) {
                    event.preventDefault();
                    return;
                }

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

                    submitTL.to(buttonText, {
                        duration: 0.36,
                        text: {
                            value: 'Enviando...',
                            type: 'diff'
                        },
                        ease: 'sine.in'
                    });
                } else if (buttonText) {
                    buttonText.textContent = 'Enviando.';
                    let dotCount = 1;
                    const dotInterval = window.setInterval(() => {
                        dotCount = (dotCount % 3) + 1;
                        buttonText.textContent = 'Enviando' + '.'.repeat(dotCount);
                    }, 420);
                    button._dotInterval = dotInterval;
                }
            });
        }

        if (canHover && lines.length) {
            gsap.to('.contact-line--one', {
                y: -24,
                ease: 'none',
                scrollTrigger: {
                    trigger: contact,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.contact-line--two', {
                y: 28,
                ease: 'none',
                scrollTrigger: {
                    trigger: contact,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    window.addEventListener('pagehide', () => {
        const btn = document.querySelector('.submit-btn');
        if (btn && btn._dotInterval) {
            window.clearInterval(btn._dotInterval);
        }
    }, { once: true });
})();