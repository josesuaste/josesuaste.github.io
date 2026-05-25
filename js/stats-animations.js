'use strict';

/* ════════════════════════════════════════════════════════════
   STATS ANIMATIONS — GSAP + ScrollTrigger
   150+, 12, 2.5K, 8+
   Cards stagger + glow mouse desktop
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

        const formatCompact = (value) => {
            if (value >= 1000) {
                const compact = value / 1000;
                return `${Number.isInteger(compact) ? compact : compact.toFixed(1)}K`;
            }

            return String(Math.round(value));
        };

        const getFinalDisplay = (item) => {
            return item.dataset.display || formatCompact(Number(item.dataset.val || 0));
        };

        if (reduceMotion) {
            items.forEach((item) => {
                const number = item.querySelector('.stat-number');
                if (number) number.textContent = getFinalDisplay(item);
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
            y: 44,
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
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out'
        }, label ? '-=0.25' : 0);

        items.forEach((item, index) => {
            const number = item.querySelector('.stat-number');
            const finalValue = Number(item.dataset.val || 0);
            const finalDisplay = getFinalDisplay(item);

            if (!number) return;

            const counter = { value: 0 };

            tl.to(counter, {
                value: finalValue,
                duration: 1.25,
                ease: 'power2.out',
                onUpdate: () => {
                    number.textContent = formatCompact(counter.value);
                },
                onComplete: () => {
                    number.textContent = finalDisplay;
                }
            }, 0.25 + index * 0.08);
        });

        if (canHover) {
            items.forEach((item) => {
                item.addEventListener('mousemove', (event) => {
                    const rect = item.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width) * 100;
                    const y = ((event.clientY - rect.top) / rect.height) * 100;

                    item.style.setProperty('--mx', `${x}%`);
                    item.style.setProperty('--my', `${y}%`);
                });

                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        y: -6,
                        scale: 1.025,
                        duration: 0.28,
                        ease: 'power2.out'
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        y: 0,
                        scale: 1,
                        duration: 0.35,
                        ease: 'power2.out'
                    });

                    item.style.setProperty('--mx', '50%');
                    item.style.setProperty('--my', '50%');
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