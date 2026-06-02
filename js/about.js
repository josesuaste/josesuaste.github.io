'use strict';

/* ════════════════════════════════════════════════════════════
   ABOUT — editorial text animation
   ════════════════════════════════════════════════════════════ */

(function initAboutSection() {
    function start() {
        const about = document.querySelector('.about-me');
        const copy = document.querySelector('.about-copy');

        if (!about || !copy) return;

        const sectionLabel = about.querySelector('.section-label');
        const lead = copy.querySelector('.about-copy__lead');
        const body = copy.querySelector('.about-copy__body');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof gsap === 'undefined') {
            if (sectionLabel) {
                sectionLabel.style.opacity = '1';
                sectionLabel.style.transform = 'none';
            }

            copy.style.opacity = '1';
            copy.style.transform = 'none';
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        if (reduceMotion) {
            gsap.set([sectionLabel, copy, lead, body].filter(Boolean), {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0
            });

            return;
        }

        gsap.set([sectionLabel, lead, body].filter(Boolean), {
            autoAlpha: 0,
            y: 20
        });

        gsap.set(copy, {
            autoAlpha: 1,
            y: 0
        });

        const tl = gsap.timeline({
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
                ? {
                    trigger: about,
                    start: 'top 68%',
                    once: true
                }
                : undefined
        });

        if (sectionLabel) {
            tl.to(sectionLabel, {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: 'power3.out'
            }, 0);
        }

        if (lead) {
            tl.to(lead, {
                autoAlpha: 1,
                y: 0,
                duration: 0.78,
                ease: 'power3.out'
            }, 0.16);
        }

        if (body) {
            tl.to(body, {
                autoAlpha: 1,
                y: 0,
                duration: 0.62,
                ease: 'power3.out'
            }, 0.42);
        }

        window.addEventListener('load', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();