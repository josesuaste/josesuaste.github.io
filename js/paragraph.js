'use strict';

/* ═══════════════════════════════════════════════════════════════
   SEGUNDO PÁRRAFO — Efectos específicos como en GSAP
   - Palabras normales: entrada simple (fade, y, blur)
   - coleccionando (--flower): letras aparecen con giro 3D + verde
   - jugando (--spin): rotación 360° sobre Y + verde
   - ilustrando (--letters): letras suben desde abajo + verde
   - SVG flor: aparece con escala + rotación
   ═══════════════════════════════════════════════════════════════ */

(function initSecondParagraph() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof SplitText === 'undefined') {
        console.warn('[second-paragraph] Faltan dependencias (GSAP, ScrollTrigger, SplitText)');
        return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const track = document.querySelector('.about-scramble-track');
    if (!track) return;

    // ----- 1. PALABRAS NORMALES (entrada simple) -----
    const normalWords = gsap.utils.toArray('.about-scramble-track .about-word:not(.about-word--flower):not(.about-word--spin):not(.about-word--letters)');
    if (normalWords.length) {
        gsap.set(normalWords, { opacity: 0, y: 30, filter: 'blur(5px)' });
        gsap.to(normalWords, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: track,
                start: 'top 80%',
                once: true
            }
        });
    }

    // ----- 3. EFECTO "DAR VUELTAS" (jugando) - rotación 360° sobre Y + verde -----
    const spinWord = document.querySelector('.about-word--spin');
    if (spinWord) {
        gsap.set(spinWord, { opacity: 0, rotationY: 0, color: '#f4f1ea' });
        gsap.to(spinWord, {
            duration: 1,
            opacity: 1,
            rotationY: 360,
            color: '#0ae448',
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(spinWord, {
                    duration: 0.4,
                    color: '#f4f1ea'
                });
            },
            scrollTrigger: {
                trigger: track,
                start: 'top 80%',
                once: true
            }
        });
    }

    // ----- 4. EFECTO "ENTRA DESDE ABAJO LETRA POR LETRA" (ilustrando) -----
    const lettersWord = document.querySelector('.about-word--letters');
    if (lettersWord) {
        const splitLetters = new SplitText(lettersWord, { type: 'chars' });
        const chars = splitLetters.chars;
        gsap.set(chars, { opacity: 0, y: 40, filter: 'blur(6px)', color: '#f4f1ea' });
        gsap.to(chars, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.04,
            ease: 'power3.out',
            color: '#0ae448',
            onComplete: () => {
                gsap.to(chars, {
                    duration: 0.4,
                    color: '#f4f1ea',
                    stagger: 0.02
                });
            },
            scrollTrigger: {
                trigger: track,
                start: 'top 80%',
                once: true
            }
        });
    }
})();