'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT ANIMATIONS — Curtain reveal + Hero depth limpio
   Profundidad sin lavar colores
   ════════════════════════════════════════════════════════════ */

(function initAboutAnimations() {
    function start() {
        if (typeof gsap === 'undefined') {
            console.warn('[about-animations] GSAP no está cargado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('[about-animations] ScrollTrigger no está cargado.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const hero = document.querySelector('#hero');
        const about = document.querySelector('#about');

        if (!hero || !about) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const heroTitle = hero.querySelector('.giant-title');
        const heroImage = hero.querySelector('.profile-img');
        const heroCorners = hero.querySelectorAll('.header-corner');

        const label = about.querySelector('.section-label');
        const paragraphs = about.querySelectorAll('.text-giant');
        const cta = about.querySelector('.cta-link');
        const aboutLinks = document.querySelectorAll('a[href="#about"]');

        if (reduceMotion) {
            gsap.set([
                hero,
                about,
                heroTitle,
                heroImage,
                heroCorners,
                label,
                paragraphs,
                cta
            ], {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                yPercent: 0,
                scale: 1,
                rotationX: 0,
                z: 0,
                filter: 'none'
            });

            gsap.set(hero, {
                '--hero-dim': 0
            });

            return;
        }

        gsap.set(about, {
            yPercent: 100
        });

        gsap.set([label, paragraphs, cta], {
            autoAlpha: 1,
            y: 0
        });

        gsap.set([heroTitle, heroCorners], {
            autoAlpha: 1,
            filter: 'none',
            transformOrigin: '50% 50%',
            transformPerspective: 1200
        });

        if (heroImage) {
            gsap.set(heroImage, {
                autoAlpha: 1,
                filter: 'grayscale(100%)',
                transformOrigin: '50% 50%',
                transformPerspective: 1200
            });
        }

        const curtainTl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=100%',
                scrub: 1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        curtainTl.to(about, {
            yPercent: 0,
            ease: 'none'
        }, 0);

        curtainTl.to(hero, {
            '--hero-dim': 1,
            ease: 'none'
        }, 0);

        if (heroTitle) {
            curtainTl.to(heroTitle, {
                scale: 0.94,
                y: -14,
                z: -140,
                rotationX: 5,
                autoAlpha: 0.88,
                ease: 'none'
            }, 0);
        }

        if (heroImage) {
            curtainTl.to(heroImage, {
                scale: 0.96,
                z: -110,
                autoAlpha: 0.9,
                filter: 'grayscale(100%)',
                ease: 'none'
            }, 0);
        }

        if (heroCorners.length) {
            curtainTl.to(heroCorners, {
                y: 10,
                z: -80,
                scale: 0.98,
                autoAlpha: 0.78,
                ease: 'none'
            }, 0);
        }

        aboutLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                const st = curtainTl.scrollTrigger;
                if (!st) return;

                window.scrollTo({
                    top: st.end - 2,
                    behavior: 'smooth'
                });

                history.replaceState(null, '', '#about');
            });
        });

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