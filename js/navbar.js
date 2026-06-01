'use strict';

// ════════════════════════════════════════════════════════════
//  NAVBAR — MENÚ GSAP + LINK ACTIVO POR SECCIÓN
// ════════════════════════════════════════════════════════════

(function initNavbarMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.nav-overlay');
    const overlayBg = document.querySelector('.nav-overlay-bg');
    const allLinks = document.querySelectorAll('.nav-overlay a');
    const barTop = document.querySelector('.bar-top');
    const barBot = document.querySelector('.bar-bot');

    if (!toggle || !overlay) return;

    let isOpen = false;
    let isAnimating = false;

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

        toggle.addEventListener('click', () => {
            isOpen ? closeMenuFallback() : openMenuFallback();
        });

        if (overlayBg) {
            overlayBg.addEventListener('click', () => {
                if (isOpen) closeMenuFallback();
            });
        }

        allLinks.forEach(link => {
            link.addEventListener('click', closeMenuFallback);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && isOpen) {
                closeMenuFallback();
                toggle.focus();
            }
        });

        return;
    }

    const panels = gsap.utils.toArray('.nav-panel');
    const navItems = gsap.utils.toArray('.nav-overlay-links li');
    const socialItems = gsap.utils.toArray('.nav-socials li');

    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.out'
        }
    });

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

    function setInitialState() {
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

    function killMenuTweens() {
        tl.clear();

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

    function openMenu() {
        if (isOpen) return;

        isAnimating = true;
        isOpen = true;

        killMenuTweens();

        overlay.classList.add('is-active');
        toggle.classList.add('is-active');
        document.body.classList.add('nav-open');
        setA11y(true);

        tl.set(overlay, {
            autoAlpha: 1,
            pointerEvents: 'auto'
        });

        if (overlayBg) {
            tl.to(overlayBg, {
                opacity: 1,
                duration: 0.28,
                overwrite: 'auto'
            }, 0);
        }

        tl.fromTo(
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
                ease: 'expo.out',
                overwrite: 'auto'
            },
            0.02
        );

        tl.fromTo(
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
                ease: 'expo.out',
                overwrite: 'auto'
            },
            0.2
        );

        tl.fromTo(
            socialItems,
            {
                opacity: 0,
                y: 18
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.045,
                overwrite: 'auto'
            },
            0.38
        );

        if (barTop && barBot) {
            tl.to(barTop, {
                attr: {
                    x1: 8,
                    y1: 8,
                    x2: 20,
                    y2: 20
                },
                duration: 0.28,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.05);

            tl.to(barBot, {
                attr: {
                    x1: 20,
                    y1: 8,
                    x2: 8,
                    y2: 20
                },
                duration: 0.28,
                ease: 'power3.out',
                overwrite: 'auto'
            }, 0.05);
        }

        tl.call(() => {
            isAnimating = false;
        });
    }

    function closeMenu() {
        if (!isOpen) return;

        isAnimating = true;
        isOpen = false;

        setA11y(false);

        killMenuTweens();

        if (barTop && barBot) {
            tl.to(barTop, {
                attr: {
                    x1: 6,
                    y1: 10,
                    x2: 22,
                    y2: 10
                },
                duration: 0.18,
                ease: 'power3.inOut',
                overwrite: 'auto'
            }, 0);

            tl.to(barBot, {
                attr: {
                    x1: 6,
                    y1: 18,
                    x2: 22,
                    y2: 18
                },
                duration: 0.18,
                ease: 'power3.inOut',
                overwrite: 'auto'
            }, 0);
        }

        tl.to([...navItems, ...socialItems], {
            opacity: 0,
            y: 18,
            duration: 0.12,
            stagger: {
                each: 0.01,
                from: 'end'
            },
            ease: 'power2.in',
            overwrite: 'auto'
        }, 0);

        tl.to(panels, {
            y: '115vh',
            rotate: () => gsap.utils.random(-8, 8),
            duration: 0.42,
            stagger: {
                each: 0.025,
                from: 'end'
            },
            ease: 'power3.in',
            overwrite: 'auto'
        }, 0.04);

        if (overlayBg) {
            tl.to(overlayBg, {
                opacity: 0,
                duration: 0.18,
                ease: 'power2.in',
                overwrite: 'auto'
            }, 0.2);
        }

        tl.set(overlay, {
            autoAlpha: 0,
            pointerEvents: 'none'
        });

        tl.call(() => {
            overlay.classList.remove('is-active');
            toggle.classList.remove('is-active');
            document.body.classList.remove('nav-open');

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

            isAnimating = false;
        });
    }

    function closeInstant() {
        killMenuTweens();

        isOpen = false;
        isAnimating = false;

        overlay.classList.remove('is-active');
        toggle.classList.remove('is-active');
        document.body.classList.remove('nav-open');
        setA11y(false);

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
    }

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    setInitialState();

    toggle.addEventListener('click', toggleMenu);

    if (overlayBg) {
        overlayBg.addEventListener('click', () => {
            if (isOpen) {
                closeMenu();
            }
        });
    }

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!isOpen) return;

            closeMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (isOpen || isAnimating) {
            closeInstant();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isOpen) {
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