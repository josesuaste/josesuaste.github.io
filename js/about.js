document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".about-me");
  const aboutInner = document.querySelector(".about-me__inner");
  const paragraphs = document.querySelectorAll(".about-me__paragraph");
  const scribblePath = document.querySelector(".about-scribble__path");

  if (!aboutSection || !aboutInner || !paragraphs.length) return;

  if (typeof gsap === "undefined") {
    console.warn("GSAP no está cargado.");
    aboutInner.style.opacity = "1";
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /*
    Divide cada párrafo en palabras.
    Esto permite animar palabra por palabra sin cambiar tu HTML manualmente.
  */
  paragraphs.forEach((paragraph) => {
    const text = paragraph.textContent.trim();

    paragraph.innerHTML = text
      .split(/\s+/)
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");
  });

  const words = aboutSection.querySelectorAll(".word");

  /*
    Estado inicial
  */
  gsap.set(aboutInner, {
    opacity: 1
  });

  gsap.set(words, {
    opacity: 0,
    y: 18
  });

  /*
    Línea rosa: se prepara para que aparezca dibujándose.
  */
  if (scribblePath) {
    const scribbleLength = scribblePath.getTotalLength();

    gsap.set(scribblePath, {
      strokeDasharray: scribbleLength,
      strokeDashoffset: scribbleLength
    });
  }

  /*
    Animación principal del texto
  */
  const aboutTimeline = gsap.timeline({
    scrollTrigger: typeof ScrollTrigger !== "undefined"
      ? {
          trigger: aboutSection,
          start: "top 70%",
          once: true
        }
      : undefined
  });

  aboutTimeline.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.65,
    stagger: 0.035,
    ease: "power3.out"
  });

  /*
    Animación de la línea debajo del segundo párrafo
  */
  if (scribblePath) {
    aboutTimeline.to(
      scribblePath,
      {
        strokeDashoffset: 0,
        duration: 1.15,
        ease: "power3.out"
      },
      "-=0.15"
    );
  }
});


    