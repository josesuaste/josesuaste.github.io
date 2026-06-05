'use strict';

// ════════════════════════════════════════════════════════════
//  NAVBAR — MENÚ GSAP + LINK ACTIVO POR SECCIÓN
//  Versión estable: timeline nueva por acción
// ════════════════════════════════════════════════════════════

(function initNavbarMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.nav-overlay');
    const overlayBg = document.querySelector('.nav-overlay-bg');
    const panels = gsap?.utils?.toArray ? gsap.utils.toArray('.nav-panel') : Array.from(document.querySelectorAll('.nav-panel'));
    const navItems = gsap?.utils?.toArray ? gsap.utils.toArray('.nav-overlay-links li') : Array.from(document.querySelectorAll('.nav-overlay-links li'));
    const socialItems = gsap?.utils?.toArray ? gsap.utils.toArray('.nav-socials li') : Array.from(document.querySelectorAll('.nav-socials li'));
    const allLinks = document.querySelectorAll('.nav-overlay a');
    const barTop = document.querySelector('.bar-top');
    const barBot = document.querySelector('.bar-bot');

    if (!toggle || !overlay) return;

    let isOpen = false;
    let menuTl = null;

    /*
      Fallback:
      Si GSAP no carga, el menú sigue funcionando con clases.
    */
    if (typeof gsap === 'undefined') {
        function openMenuFallback() {
            isOpen = true;

            overlay.classList.add('is-active');
            toggle.classList.add('is-active');
            document.body.classList.add('nav-open');

            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Cerrar menú');
            overlay.setAttribute('aria-hidden', 'false');

            allLinks.forEach(link => {
                link.setAttribute('tabindex', '0');
            });
        }

        function closeMenuFallback() {
            isOpen = false;

            overlay.classList.remove('is-active');
            toggle.classList.remove('is-active');
            document.body.classList.remove('nav-open');

            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menú');
            overlay.setAttribute('aria-hidden', 'true');

            allLinks.forEach(link => {
                link.setAttribute('tabindex', '-1');
            });
        }

        function isFallbackOpen() {
            return (
                isOpen ||
                overlay.classList.contains('is-active') ||
                document.body.classList.contains('nav-open') ||
                toggle.getAttribute('aria-expanded') === 'true'
            );
        }

        toggle.addEventListener('click', () => {
            if (isFallbackOpen()) {
                closeMenuFallback();
            } else {
                openMenuFallback();
            }
        });

        overlay.addEventListener('click', event => {
            const clickedPanel = event.target.closest('.nav-panel');
            const clickedToggle = event.target.closest('.menu-toggle');

            if (!clickedPanel && !clickedToggle && isFallbackOpen()) {
                closeMenuFallback();
            }
        });

        allLinks.forEach(link => {
            link.addEventListener('click', closeMenuFallback);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && isFallbackOpen()) {
                closeMenuFallback();
                toggle.focus();
            }
        });

        return;
    }

    function setA11y(open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        overlay.setAttribute('aria-hidden', String(!open));

        allLinks.forEach(link => {
            link.setAttribute('tabindex', open ? '0' : '-1');
        });
    }

    function resetBars() {
        if (!barTop || !barBot) return;

        gsap.set(barTop, {
            attr: {
                x1: 6,
                y1: 10,
                x2: 22,
                y2: 10
            }
        });

        gsap.set(barBot, {
            attr: {
                x1: 6,
                y1: 18,
                x2: 22,
                y2: 18
            }
        });
    }

    function isMenuVisuallyOpen() {
        const overlayAutoAlpha = Number(gsap.getProperty(overlay, 'autoAlpha')) || 0;
        const overlayOpacity = Number(gsap.getProperty(overlay, 'opacity')) || 0;
        const overlayPointerEvents = gsap.getProperty(overlay, 'pointerEvents');

        return (
            isOpen ||
            overlay.classList.contains('is-active') ||
            document.body.classList.contains('nav-open') ||
            toggle.getAttribute('aria-expanded') === 'true' ||
            overlayAutoAlpha > 0 ||
            overlayOpacity > 0 ||
            overlayPointerEvents === 'auto'
        );
    }

    function killMenuAnimation() {
        if (menuTl) {
            menuTl.kill();
            menuTl = null;
        }

        gsap.killTweensOf([
            overlay,
            overlayBg,
            ...panels,
            ...navItems,
            ...socialItems,
            barTop,
            barBot
        ].filter(Boolean));
    }

    function setInitialState() {
        killMenuAnimation();

        isOpen = false;

        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        document.body.classList.remove('nav-open');

        gsap.set(overlay, {
            autoAlpha: 0,
            pointerEvents: 'none'
        });

        if (overlayBg) {
            gsap.set(overlayBg, {
                opacity: 0
            });
        }

        gsap.set(panels, {
            xPercent: 104,
            y: 0,
            rotate: 0
        });

        gsap.set([...navItems, ...socialItems], {
            opacity: 0,
            y: 24
        });

        resetBars();
        setA11y(false);
    }

    function openMenu() {
        if (isMenuVisuallyOpen()) return;

        killMenuAnimation();

        isOpen = true;

        overlay.classList.add('is-active');
        toggle.classList.add('is-active');
        document.body.classList.add('nav-open');
        setA11y(true);

        menuTl = gsap.timeline({
            defaults: {
                ease: 'power3.out',
                overwrite: 'auto'
            },
            onComplete: () => {
                menuTl = null;
            }
        });

        menuTl.set(overlay, {
            autoAlpha: 1,
            pointerEvents: 'auto'
        });

        if (overlayBg) {
            menuTl.to(overlayBg, {
                opacity: 1,
                duration: 0.28
            }, 0);
        }

        menuTl.fromTo(
            panels,
            {
                xPercent: 104,
                y: 0,
                rotate: 0
            },
            {
                xPercent: 0,
                y: 0,
                rotate: 0,
                duration: 0.72,
                stagger: 0.09,
                ease: 'expo.out'
            },
            0.02
        );

        menuTl.fromTo(
            navItems,
            {
                opacity: 0,
                y: 32
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.72,
                stagger: 0.045,
                ease: 'expo.out'
            },
            0.2
        );

        menuTl.fromTo(
            socialItems,
            {
                opacity: 0,
                y: 18
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.045
            },
            0.38
        );

        if (barTop && barBot) {
            menuTl.to(barTop, {
                attr: {
                    x1: 8,
                    y1: 8,
                    x2: 20,
                    y2: 20
                },
                duration: 0.28,
                ease: 'power3.out'
            }, 0.05);

            menuTl.to(barBot, {
                attr: {
                    x1: 20,
                    y1: 8,
                    x2: 8,
                    y2: 20
                },
                duration: 0.28,
                ease: 'power3.out'
            }, 0.05);
        }
    }

    function closeMenu() {
        if (!isMenuVisuallyOpen()) return;

        killMenuAnimation();

        isOpen = false;
        setA11y(false);

        menuTl = gsap.timeline({
            defaults: {
                ease: 'power3.out',
                overwrite: 'auto'
            },
            onComplete: () => {
                overlay.classList.remove('is-active');
                toggle.classList.remove('is-active');
                document.body.classList.remove('nav-open');

                gsap.set(overlay, {
                    autoAlpha: 0,
                    pointerEvents: 'none'
                });

                gsap.set(panels, {
                    xPercent: 104,
                    y: 0,
                    rotate: 0
                });

                gsap.set([...navItems, ...socialItems], {
                    opacity: 0,
                    y: 24
                });

                resetBars();
                menuTl = null;
            }
        });

        if (barTop && barBot) {
            menuTl.to(barTop, {
                attr: {
                    x1: 6,
                    y1: 10,
                    x2: 22,
                    y2: 10
                },
                duration: 0.18,
                ease: 'power3.inOut'
            }, 0);

            menuTl.to(barBot, {
                attr: {
                    x1: 6,
                    y1: 18,
                    x2: 22,
                    y2: 18
                },
                duration: 0.18,
                ease: 'power3.inOut'
            }, 0);
        }

        menuTl.to([...navItems, ...socialItems], {
            opacity: 0,
            y: 18,
            duration: 0.12,
            stagger: {
                each: 0.01,
                from: 'end'
            },
            ease: 'power2.in'
        }, 0);

        menuTl.to(panels, {
            y: '115vh',
            rotate: () => gsap.utils.random(-8, 8),
            duration: 0.42,
            stagger: {
                each: 0.025,
                from: 'end'
            },
            ease: 'power3.in'
        }, 0.04);

        if (overlayBg) {
            menuTl.to(overlayBg, {
                opacity: 0,
                duration: 0.18,
                ease: 'power2.in'
            }, 0.2);
        }

        menuTl.set(overlay, {
            autoAlpha: 0,
            pointerEvents: 'none'
        });
    }

    function closeInstant() {
        killMenuAnimation();
        setInitialState();
    }

    function toggleMenu() {
        if (isMenuVisuallyOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    setInitialState();

    toggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
    });

    /*
      Cierra al hacer click en cualquier espacio fuera de los paneles.
      Esto cubre overlayBg y también zonas vacías del overlay.
    */
    overlay.addEventListener('click', event => {
        const clickedPanel = event.target.closest('.nav-panel');

        if (!clickedPanel && isMenuVisuallyOpen()) {
            closeMenu();
        }
    });

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuVisuallyOpen()) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (isMenuVisuallyOpen()) {
            closeInstant();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isMenuVisuallyOpen()) {
            closeMenu();
            toggle.focus();
        }
    });
})();


// ════════════════════════════════════════════════════════════
//  NAV LINK ACTIVO POR SECCIÓN
// ════════════════════════════════════════════════════════════

(function initActiveLinks() {
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));

    const navLinks = Array.from(
        document.querySelectorAll('.nav-overlay-links a[href^="#"]')
    ).filter(link => {
        const href = link.getAttribute('href');
        return href && href.length > 1;
    });

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map(
        navLinks.map(link => [link.getAttribute('href').slice(1), link])
    );

    function setActive(id) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;

            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    const observer = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length && linkById.has(visible[0].target.id)) {
            setActive(visible[0].target.id);
        }
    }, {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6]
    });

    sections.forEach(section => observer.observe(section));
})();

