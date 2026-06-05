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

    gsap.set(overlayBg, {
        autoAlpha: 0,
        backdropFilter: 'blur(0px)',
        webkitBackdropFilter: 'blur(0px)'
    });

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

        gsap.set(overlay, {
            autoAlpha: 0,
            visibility: 'hidden'
        });

        gsap.set(overlayBg, {
            autoAlpha: 0,
            backdropFilter: 'blur(0px)',
            webkitBackdropFilter: 'blur(0px)'
        });

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

        gsap.set(barTop, {
            y: 0,
            rotate: 0
        });

        gsap.set(barBot, {
            y: 0,
            rotate: 0
        });

        updateNavbarState();
    }

    function openMenu() {
        if (isOpen) return;

        killActiveAnimation();

        isOpen = true;

        document.body.classList.add('nav-open');
        overlay.classList.add('is-active');
        setA11y(true);

        if (reduceMotion) {
            gsap.set(overlay, {
                autoAlpha: 1,
                visibility: 'visible'
            });

            gsap.set(overlayBg, {
                autoAlpha: 1,
                backdropFilter: 'blur(14px)',
                webkitBackdropFilter: 'blur(14px)'
            });

            gsap.set([mainPanel, socialPanel, links, socialLinks], {
                autoAlpha: 1,
                clearProps: 'transform'
            });

            return;
        }

        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            },
            onComplete() {
                activeTimeline = null;
            }
        });

        activeTimeline = tl;

        tl.set(overlay, {
            visibility: 'visible',
            autoAlpha: 1
        })

        /* Blur de fondo */
        .to(overlayBg, {
            autoAlpha: 1,
            backdropFilter: 'blur(14px)',
            webkitBackdropFilter: 'blur(14px)',
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
            y: window.innerHeight * 1.1,
            rotateZ: -8,
            autoAlpha: 0,
            duration: 0.58,
            ease: 'power4.in'
        }, 0.42)

        .to(socialPanel, {
            y: window.innerHeight * 1.08,
            rotateZ: 7,
            autoAlpha: 0,
            duration: 0.54,
            ease: 'power4.in'
        }, 0.44)

        /* Blur desaparece */
        .to(overlayBg, {
            autoAlpha: 0,
            backdropFilter: 'blur(0px)',
            webkitBackdropFilter: 'blur(0px)',
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
       Eventos
       ════════════════════════════════════════════════════════ */

    toggle.addEventListener('click', toggleMenu);

    /*
        Cierra el menú al hacer click fuera de los paneles,
        sobre el fondo con blur.
    */
    overlayBg.addEventListener('click', closeMenu);

    /*
        Evita que clicks dentro de los paneles afecten el fondo.
        No es estrictamente necesario porque escuchamos overlayBg,
        pero lo dejamos como protección.
    */
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
        }
    });
})();

