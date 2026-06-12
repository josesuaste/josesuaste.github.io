'use strict';

/* ════════════════════════════════════════════════════════════
   NAVBAR — GSAP overlay + blur activo + choque al cerrar
   Permite cerrar inmediatamente aunque la apertura siga animando
   ════════════════════════════════════════════════════════════ */

(function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('#navOverlay');
    const overlayBg = document.querySelector('.nav-overlay-bg');

    const mainPanel = document.querySelector('.nav-panel-main');
    const socialPanel = document.querySelector('.nav-panel-social');

    const barTop = document.querySelector('.bar-top');
    const barBot = document.querySelector('.bar-bot');

    if (!navbar || !toggle || !overlay || !overlayBg || !mainPanel || !socialPanel) return;

    if (typeof gsap === 'undefined') {
        console.warn('[navbar] GSAP no está cargado.');
        return;
    }

    const links = gsap.utils.toArray('.nav-overlay-links a');
    const socialLinks = gsap.utils.toArray('.nav-socials a');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isOpen = false;
    let activeTimeline = null;
    // Altura de ventana capturada en el momento de abrir el menú.
    // Se usa en closeMenu para que la animación de caída sea correcta
    // aunque el usuario haya rotado el dispositivo entre apertura y cierre.
    let snapshotHeight = window.innerHeight;

    function killActiveAnimation() {
        if (activeTimeline) {
            activeTimeline.kill();
            activeTimeline = null;
        }

        gsap.killTweensOf([
            overlay,
            overlayBg,
            mainPanel,
            socialPanel,
            barTop,
            barBot,
            ...links,
            ...socialLinks
        ]);
    }

    /* ════════════════════════════════════════════════════════
       Navbar limpio: solo cambia colores al bajar
       ════════════════════════════════════════════════════════ */

    function updateNavbarState() {
        const shouldInvert = window.scrollY > 40;

        navbar.classList.toggle('is-scrolled', shouldInvert);
    }

    updateNavbarState();

    window.addEventListener('scroll', updateNavbarState, {
        passive: true
    });

    /* ════════════════════════════════════════════════════════
       Estados iniciales
       ════════════════════════════════════════════════════════ */

    gsap.set(overlay, {
        autoAlpha: 0,
        visibility: 'hidden'
    });

    // backdrop-filter lo gestiona CSS via .is-blurred — aquí solo opacity
    gsap.set(overlayBg, { autoAlpha: 0 });

    gsap.set(mainPanel, {
        y: -56,
        rotateZ: -1.8,
        autoAlpha: 0,
        transformOrigin: 'top center'
    });

    gsap.set(socialPanel, {
        y: -34,
        rotateZ: 1.4,
        autoAlpha: 0,
        transformOrigin: 'top center'
    });

    gsap.set(links, {
        yPercent: 110,
        autoAlpha: 0
    });

    gsap.set(socialLinks, {
        y: 18,
        autoAlpha: 0
    });

    /* ════════════════════════════════════════════════════════
       Helpers
       ════════════════════════════════════════════════════════ */

    function setA11y(open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        overlay.setAttribute('aria-hidden', String(!open));
    }

    function resetClosedState() {
        overlay.classList.remove('is-active');
        document.body.classList.remove('nav-open');

        // Quitar el blur CSS
        overlayBg.classList.remove('is-blurred');

        gsap.set(overlay, {
            autoAlpha: 0,
            visibility: 'hidden'
        });

        gsap.set(overlayBg, { autoAlpha: 0 });

        gsap.set(mainPanel, {
            y: -56,
            rotateZ: -1.8,
            autoAlpha: 0
        });

        gsap.set(socialPanel, {
            y: -34,
            rotateZ: 1.4,
            autoAlpha: 0
        });

        gsap.set(links, {
            yPercent: 110,
            autoAlpha: 0
        });

        gsap.set(socialLinks, {
            y: 18,
            autoAlpha: 0
        });

        gsap.set(barTop, { y: 0, rotate: 0 });
        gsap.set(barBot, { y: 0, rotate: 0 });

        updateNavbarState();
    }

    function openMenu() {
        if (isOpen) return;

        killActiveAnimation();

        isOpen = true;
        snapshotHeight = window.innerHeight;

        document.body.classList.add('nav-open');
        overlay.classList.add('is-active');
        setA11y(true);

        if (reduceMotion) {
            gsap.set(overlay, { autoAlpha: 1, visibility: 'visible' });
            gsap.set(overlayBg, { autoAlpha: 1 });
            overlayBg.classList.add('is-blurred');

            gsap.set([mainPanel, socialPanel, links, socialLinks], {
                autoAlpha: 1,
                clearProps: 'transform'
            });

            return;
        }

        // Activar blur CSS antes de que empiece la animación.
        // La transition de backdrop-filter en CSS corre en paralelo
        // con los tweens de GSAP — no bloquea el hilo principal.
        overlayBg.classList.add('is-blurred');

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete() {
                activeTimeline = null;
            }
        });

        activeTimeline = tl;

        tl.set(overlay, { visibility: 'visible', autoAlpha: 1 })

        /* Fondo: solo opacity — blur lo hace CSS */
        .to(overlayBg, {
            autoAlpha: 1,
            duration: 0.42,
            ease: 'power2.out'
        }, 0)

        /* Panel crema entra */
        .fromTo(mainPanel, {
            y: -64,
            rotateZ: -1.8,
            autoAlpha: 0
        }, {
            y: 0,
            rotateZ: 0,
            autoAlpha: 1,
            duration: 0.72,
            ease: 'power4.out'
        }, 0.08)

        /* Panel negro entra */
        .fromTo(socialPanel, {
            y: -44,
            rotateZ: 1.4,
            autoAlpha: 0
        }, {
            y: 0,
            rotateZ: 0,
            autoAlpha: 1,
            duration: 0.68,
            ease: 'power4.out'
        }, 0.18)

        /* Links principales */
        .to(links, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.68,
            stagger: 0.06,
            ease: 'power4.out'
        }, 0.24)

        /* Links sociales */
        .to(socialLinks, {
            y: 0,
            autoAlpha: 1,
            duration: 0.44,
            stagger: 0.045,
            ease: 'power3.out'
        }, 0.48)

        /* Hamburguesa a X */
        .to(barTop, {
            y: 4,
            rotate: 45,
            transformOrigin: '50% 50%',
            duration: 0.32,
            ease: 'power3.out'
        }, 0)

        .to(barBot, {
            y: -4,
            rotate: -45,
            transformOrigin: '50% 50%',
            duration: 0.32,
            ease: 'power3.out'
        }, 0);
    }

    function closeMenu() {
        if (!isOpen) return;

        killActiveAnimation();

        isOpen = false;
        setA11y(false);

        if (reduceMotion) {
            resetClosedState();
            return;
        }

        const tl = gsap.timeline({
            onComplete() {
                activeTimeline = null;
                resetClosedState();
            }
        });

        activeTimeline = tl;

        /*
            Cierre:
            1. Links salen.
            2. Panel crema baja primero.
            3. Panel crema choca con panel negro.
            4. Ambos caen.
            5. Blur CSS se quita al completar (en resetClosedState).
        */

        tl.to(links, {
            yPercent: -105,
            autoAlpha: 0,
            duration: 0.22,
            stagger: 0.025,
            ease: 'power2.in'
        }, 0)

        .to(socialLinks, {
            y: -12,
            autoAlpha: 0,
            duration: 0.18,
            stagger: 0.02,
            ease: 'power2.in'
        }, 0)

        .to(barTop, {
            y: 0,
            rotate: 0,
            duration: 0.22,
            ease: 'power3.out'
        }, 0)

        .to(barBot, {
            y: 0,
            rotate: 0,
            duration: 0.22,
            ease: 'power3.out'
        }, 0)

        /* Panel crema cae hacia el panel negro */
        .to(mainPanel, {
            y: 44,
            rotateZ: 2.4,
            duration: 0.24,
            ease: 'power2.in'
        }, 0.1)

        /*
            Choque:
            el panel negro baja un poco por el impacto,
            y el crema rebota ligeramente.
        */
        .to(socialPanel, {
            y: 18,
            rotateZ: -1.8,
            duration: 0.14,
            ease: 'power1.out'
        }, 0.28)

        .to(mainPanel, {
            y: 26,
            rotateZ: -1.2,
            duration: 0.14,
            ease: 'power2.out'
        }, 0.28)

        /* Ambos se desploman */
        .to(mainPanel, {
            y: snapshotHeight * 1.1,
            rotateZ: -8,
            autoAlpha: 0,
            duration: 0.58,
            ease: 'power4.in'
        }, 0.42)

        .to(socialPanel, {
            y: snapshotHeight * 1.08,
            rotateZ: 7,
            autoAlpha: 0,
            duration: 0.54,
            ease: 'power4.in'
        }, 0.44)

        /* Fondo desaparece — blur CSS se limpia en resetClosedState al onComplete */
        .to(overlayBg, {
            autoAlpha: 0,
            duration: 0.36,
            ease: 'power2.out'
        }, 0.48);
    }

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /* ════════════════════════════════════════════════════════
       Focus trap — mantiene el foco dentro del overlay
       cuando el menú está abierto (accesibilidad teclado)
       ════════════════════════════════════════════════════════ */

    function getFocusableElements() {
        return Array.from(
            overlay.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((el) => !el.closest('[aria-hidden="true"]'));
    }

    function trapFocus(event) {
        if (!isOpen || event.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (!focusable.length) return;

        // FIX: focusable en lugar de focusable (el array entero era siempre truthy)
        const first = focusable;
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    /* ════════════════════════════════════════════════════════
       Eventos
       ════════════════════════════════════════════════════════ */

    toggle.addEventListener('click', toggleMenu);

    overlayBg.addEventListener('click', closeMenu);

    mainPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    socialPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    links.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeMenu();
            toggle.focus();
            return;
        }

        trapFocus(event);
    });

    // Cleanup al salir de página (back/forward cache incluido)
    window.addEventListener('pagehide', () => {
        window.removeEventListener('scroll', updateNavbarState);
        killActiveAnimation();
    }, { once: true });
})();


