document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    /* ─────────────────────────────────────────────
       STICKER POP
       Cada párrafo dispara su propio sticker
    ───────────────────────────────────────────── */

    const aboutParagraphs = document.querySelectorAll(".about-paragraph");

    aboutParagraphs.forEach((paragraph) => {
        const sticker = paragraph.querySelector(".sticker-pop");

        if (!sticker) return;

        const initialRotate = gsap.utils.random(-18, 18);

        gsap.fromTo(
            sticker,
            {
                scale: 0,
                opacity: 0,
                rotate: initialRotate,
                y: 24
            },
            {
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: 0,
                duration: 0.7,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: paragraph,
                    start: "top 72%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });


    /* ─────────────────────────────────────────────
       LÍNEA ANIMADA DEL ÚLTIMO PÁRRAFO
    ───────────────────────────────────────────── */

    const aboutPath = document.querySelector(".about-scribble__path");
    const lastParagraph = document.querySelector(".about-last");

    if (aboutPath && lastParagraph) {
        const pathLength = aboutPath.getTotalLength();

        gsap.set(aboutPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });

        gsap.to(aboutPath, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: lastParagraph,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    }
});
    