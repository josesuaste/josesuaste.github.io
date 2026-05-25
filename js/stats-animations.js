'use strict';

/* ════════════════════════════════════════════════════════════
   STATS ANIMATIONS — GSAP + ScrollTrigger
   Cards stagger + contador numérico + hover desktop
   ════════════════════════════════════════════════════════════ */

(function initStatsAnimations() {
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

        const statsSection = document.querySelector('#stats');
        if (!statsSection) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        const label = statsSection.querySelector('.section-label');
        const items = statsSection.querySelectorAll('.stat-item');

        if (!items.length) return;

        const formatNumber = (value, useComma) => {
            const rounded = Math.round(value);

            return useComma
                ? rounded.toLocaleString('en-US')
                : String(rounded);
        };

        if (reduceMotion) {
            items.forEach((item) => {
                const number = item.querySelector('.stat-number');
                const finalValue = Number(item.dataset.val || 0);
                const useComma = item.dataset.comma === 'true';

                if (number) {
                    number.textContent = formatNumber(finalValue, useComma);
                }
            });

            gsap.set([label, items], {
                clearProps: 'all',
                autoAlpha: 1,
                y: 0,
                scale: 1
            });

            return;
        }

        gsap.set(label, {
            autoAlpha: 0,
            y: 24
        });

        gsap.set(items, {
            autoAlpha: 0,
            y: 42,
            scale: 0.96,
            transformOrigin: '50% 50%'
        });

        items.forEach((item) => {
            const number = item.querySelector('.stat-number');
            if (number) number.textContent = '0';
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: statsSection,
                start: 'top 72%',
                once: true
            }
        });

        if (label) {
            tl.to(label, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        }

        tl.to(items, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power3.out'
        }, label ? '-=0.25' : 0);

        items.forEach((item, index) => {
            const number = item.querySelector('.stat-number');
            const finalValue = Number(item.dataset.val || 0);
            const useComma = item.dataset.comma === 'true';

            if (!number) return;

            const counter = { value: 0 };

            tl.to(counter, {
                value: finalValue,
                duration: 1.35,
                ease: 'power2.out',
                onUpdate: () => {
                    number.textContent = formatNumber(counter.value, useComma);
                }
            }, 0.25 + index * 0.08);
        });

        if (canHover) {
            items.forEach((item) => {
                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        y: -6,
                        scale: 1.025,
                        borderColor: 'rgba(242,237,228,0.35)',
                        duration: 0.28,
                        ease: 'power2.out'
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        y: 0,
                        scale: 1,
                        borderColor: 'rgba(242,237,228,0.12)',
                        duration: 0.35,
                        ease: 'power2.out'
                    });
                });
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