// ─────────────────────────────────────────────────────────────
//  Registrar plugins
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
//  Defaults globales
// ─────────────────────────────────────────────────────────────
gsap.defaults({ ease: "power3.out" });

// ─────────────────────────────────────────────────────────────
//  Menú móvil
// ─────────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('is-active');
    menuToggle.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('is-active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    });
});

// ─────────────────────────────────────────────────────────────
//  Scroll suave con offset del navbar
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
        });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism al hacer scroll
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    aboutSection.insertAdjacentElement('beforebegin', sentinel);
    const navObserver = new IntersectionObserver(
        ([entry]) => {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '0px' }
    );
    navObserver.observe(sentinel);
}

// ─────────────────────────────────────────────────────────────
//  Deshabilitar transiciones durante resize y refrescar ScrollTrigger
// ─────────────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('no-transition');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('no-transition');
        ScrollTrigger.refresh();
    }, 200);
});

// ─────────────────────────────────────────────────────────────
//  GSAP — matchMedia para prefers-reduced-motion y breakpoints
// ─────────────────────────────────────────────────────────────
const mm = gsap.matchMedia();

mm.add(
    {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
    },
    (context) => {
        const { reduceMotion, isDesktop } = context.conditions;

        // Si el usuario prefiere movimiento reducido, no se anima nada
        if (reduceMotion) return;

        // ── 1. HERO — entrada al cargar ───────────────────────────
        const heroTl = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });

        heroTl
            .from('.navbar', {
                autoAlpha: 0,
                y: -20,
                duration: 0.6
            })
            .from('.giant-title', {
                autoAlpha: 0,
                y: 60,
                duration: 1,
                ease: "power4.out"
            }, "-=0.3")
            .from('.profile-img', {
                autoAlpha: 0,
                scale: 0.92,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6")
            .from('.bottom-sub-btn', {
                autoAlpha: 0,
                y: 20,
                duration: 0.6
            }, "-=0.4")
            .from('.header-corner', {
                autoAlpha: 0,
                y: 15,
                stagger: 0.15,
                duration: 0.6
            }, "-=0.4");

        // ── 2. SOBRE MÍ ──────────────────────────────────────────
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                once: true
            }
        });

        aboutTl
            .from('#about .big-title', {
                autoAlpha: 0,
                x: isDesktop ? -60 : 0,
                y: isDesktop ? 0 : 40,
                duration: 1
            })
            .from('#about .sub-title', {
                autoAlpha: 0,
                y: 30,
                duration: 0.7
            }, "-=0.5")
            .from('#about .section-description', {
                autoAlpha: 0,
                y: 20,
                duration: 0.7
            }, "-=0.4");

        // ── 3. ESTADÍSTICAS — números contando ───────────────────
        const statsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#stats',
                start: 'top 75%',
                once: true
            }
        });

        statsTl
            .from('#stats .big-title', {
                autoAlpha: 0,
                x: isDesktop ? 60 : 0,
                y: isDesktop ? 0 : 40,
                duration: 1
            })
            .from('#stats .stat-item', {
                autoAlpha: 0,
                y: 40,
                stagger: 0.12,
                duration: 0.7
            }, "-=0.5");

        // Contador animado — usa objeto proxy para evitar NaN con innerText
        document.querySelectorAll('.stat-number').forEach(el => {
            const raw = el.textContent.trim().replace(/,/g, '');
            const target = parseFloat(raw);
            const hasComma = el.textContent.includes(',');

            if (isNaN(target)) return; // salida segura si el HTML no tiene número

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    const proxy = { value: 0 };
                    gsap.to(proxy, {
                        value: target,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate() {
                            const val = Math.round(proxy.value);
                            el.textContent = hasComma
                                ? val.toLocaleString('es-MX')
                                : val.toString();
                        },
                        onComplete() {
                            // Valor final exacto
                            el.textContent = hasComma
                                ? target.toLocaleString('es-MX')
                                : target.toString();
                        }
                    });
                }
            });
        });

        // ── 4. SETUP — shapes en stagger ─────────────────────────
        gsap.from('.setup-header .big-title', {
            autoAlpha: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '#setup',
                start: 'top 80%',
                once: true
            }
        });

        gsap.from('.setup-header .section-description', {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            delay: 0.3,
            scrollTrigger: {
                trigger: '#setup',
                start: 'top 80%',
                once: true
            }
        });

        ScrollTrigger.batch('.setup-shape', {
            start: 'top 88%',
            once: true,
            onEnter: (elements) => {
                gsap.from(elements, {
                    autoAlpha: 0,
                    y: 50,
                    scale: 0.88,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "back.out(1.4)"
                });
            }
        });

        // ── 5. VIDEOS ─────────────────────────────────────────────
        const videosTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#videos',
                start: 'top 80%',
                once: true
            }
        });

        videosTl
            .from('#videos .big-title', {
                autoAlpha: 0,
                x: isDesktop ? 60 : 0,
                y: isDesktop ? 0 : 40,
                duration: 1
            })
            .from('#videos .section-description', {
                autoAlpha: 0,
                y: 25,
                duration: 0.7
            }, "-=0.5");

        // Tarjetas de video: se animan cuando el JS las inserta en el DOM
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid) {
            const cardObserver = new MutationObserver(() => {
                const cards = videosGrid.querySelectorAll('.video-card:not(.gsap-animated)');
                if (cards.length) {
                    gsap.from(cards, {
                        autoAlpha: 0,
                        y: 40,
                        stagger: 0.12,
                        duration: 0.7,
                        ease: "power3.out"
                    });
                    cards.forEach(c => c.classList.add('gsap-animated'));
                }
            });
            cardObserver.observe(videosGrid, { childList: true });
        }

        // ── 6. COLABORACIONES / CONTACTO ─────────────────────────
        const contactTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
                once: true
            }
        });

        contactTl
            .from('#contact .big-title', {
                autoAlpha: 0,
                x: isDesktop ? -60 : 0,
                y: isDesktop ? 0 : 40,
                duration: 1
            })
            .from('#contact .form-field', {
                autoAlpha: 0,
                y: 25,
                stagger: 0.1,
                duration: 0.6
            }, "-=0.5")
            .from('#contact .minimal-submit', {
                autoAlpha: 0,
                y: 15,
                duration: 0.5
            }, "-=0.2");

        // ── 7. FOOTER ─────────────────────────────────────────────
        gsap.from('.footer-col', {
            autoAlpha: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.7,
            scrollTrigger: {
                trigger: '.massive-footer',
                start: 'top 90%',
                once: true
            }
        });
    }
);