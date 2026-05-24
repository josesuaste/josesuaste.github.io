/* ════════════════════════════════════════════════════════════
   ABOUT ANIMATIONS — GSAP + ScrollTrigger
   Texto: fade + subida suave
   Stickers: pop con back.out
   SVG óvalos: dibujo con strokeDashoffset
   Decoración: flotación lenta y random
   ════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP no está cargado.");
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    console.warn("ScrollTrigger no está cargado.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const about = document.querySelector("#about");

  if (!about) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const label = about.querySelector(".section-label");
  const paragraphs = about.querySelectorAll(".text-giant");
  const stickers = about.querySelectorAll(".inline-media");
  const stickerImages = about.querySelectorAll(".inline-media img");
  const ovalEllipses = about.querySelectorAll(".mark-oval-svg ellipse");

  /**
   * Accesibilidad:
   * Si el usuario prefiere menos movimiento, dejamos todo visible
   * y evitamos animaciones infinitas.
   */
  if (reduceMotion) {
    gsap.set([label, paragraphs, stickers, stickerImages, ovalEllipses], {
      clearProps: "all",
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotation: 0
    });

    return;
  }

  /**
   * Estado inicial seguro.
   * Esto evita parpadeos visuales al cargar.
   */
  gsap.set([label, paragraphs], {
    autoAlpha: 0,
    y: 48
  });

  gsap.set(stickers, {
    autoAlpha: 0,
    scale: 0,
    rotation: -10,
    transformOrigin: "50% 50%"
  });

  /**
   * 1. Label — fade + subida suave
   */
  if (label) {
    gsap.to(label, {
      scrollTrigger: {
        trigger: about,
        start: "top 75%",
        once: true
      },
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out"
    });
  }

  /**
   * 2. Texto gigante — fade + subida suave
   */
  paragraphs.forEach((paragraph, index) => {
    gsap.to(paragraph, {
      scrollTrigger: {
        trigger: paragraph,
        start: "top 82%",
        once: true
      },
      autoAlpha: 1,
      y: 0,
      duration: 1,
      delay: index * 0.08,
      ease: "power3.out"
    });
  });

  /**
   * 3. Stickers inline — pop con back.out
   */
  stickers.forEach((sticker) => {
    gsap.to(sticker, {
      scrollTrigger: {
        trigger: sticker,
        start: "top 88%",
        once: true
      },
      autoAlpha: 1,
      scale: 1,
      rotation: gsap.utils.random(-7, 7),
      duration: 0.65,
      ease: "back.out(1.8)"
    });
  });

  /**
   * 4. SVG óvalos — dibujo con strokeDashoffset
   */
  ovalEllipses.forEach((ellipse) => {
    const length = ellipse.getTotalLength();

    gsap.set(ellipse, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    gsap.to(ellipse, {
      scrollTrigger: {
        trigger: ellipse.closest(".mark-oval") || ellipse,
        start: "top 86%",
        once: true
      },
      strokeDashoffset: 0,
      duration: 1,
      ease: "power2.out"
    });
  });

  /**
   * 5. Decoración — flotación lenta y random
   * Se aplica después del pop para que los stickers queden vivos.
   */
  stickerImages.forEach((img) => {
    const floatY = gsap.utils.random(-7, 7);
    const floatRotation = gsap.utils.random(-4, 4);
    const floatDuration = gsap.utils.random(2.2, 4);

    gsap.to(img, {
      y: floatY,
      rotation: floatRotation,
      duration: floatDuration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: gsap.utils.random(0, 1)
    });
  });

  /**
   * Refresh por si las imágenes cargan después
   * y cambian un poco el alto del layout.
   */
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});