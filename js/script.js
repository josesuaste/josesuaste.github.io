// ============================================================
//  script.js — José Suaste | ERROR 404
//  GSAP 3.12.5 + ScrollTrigger — Vanilla JS
//  v3 — Setup: parallax diferencial con data-speed por figura
// ============================================================

// ── 0. REGISTRO Y DEFAULTS ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    ease: "expo.out",
    duration: 1
});


// ============================================================
//  gsap.matchMedia() — respeta prefers-reduced-motion
//  Todos los tweens y ScrollTriggers van DENTRO de mm.add()
//  para que se reviertan solos si la preferencia cambia.
// ============================================================
const mm = gsap.matchMedia();

mm.add(
    {
        motion:        "(prefers-reduced-motion: no-preference)",
        reducedMotion: "(prefers-reduced-motion: reduce)"
    },
    (ctx) => {
        const { motion } = ctx.conditions;

        // Movimiento reducido: hacemos todo visible directamente
        if (!motion) {
            gsap.set([
                ".logo", ".nav-links a", ".giant-title", ".profile-img",
                ".header-corner.left", ".header-corner.right",
                ".bottom-sub-btn", ".blue-arc",
                ".setup-big-title", ".setup-subtitle",
                ".setup-shape", ".shape-label"
            ], { clearProps: "all" });
            gsap.set(".shape-label", { opacity: 1 });
            return;
        }


        // ========================================================
        //  1. HERO — Entrada orquestada
        // ========================================================
        gsap.timeline({ defaults: { ease: "expo.out", duration: 1 } })
            .from(".logo",          { y: -30, autoAlpha: 0, duration: 0.8 })
            .from(".nav-links a",   { y: -20, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "<0.1")
            .from(".giant-title",   { y: 120, autoAlpha: 0, duration: 1.4 }, "-=0.4")
            .from(".profile-img",   { scale: 0.85, autoAlpha: 0, duration: 1.2, ease: "back.out(1.4)" }, "-=0.8")
            .from(".header-corner.left, .header-corner.right",
                                    { autoAlpha: 0, stagger: 0.1, duration: 0.8 }, "-=0.6")
            // Solo autoAlpha: este botón usa translateX(-50%) en CSS
            // para centrarse; animar x/y rompería ese posicionamiento.
            .from(".bottom-sub-btn",{ autoAlpha: 0, duration: 0.8 }, "<")
            .from(".blue-arc",      { y: 200, duration: 1.4, ease: "expo.out" }, "-=1.8");


        // ========================================================
        //  2. NAVBAR — Clase al hacer scroll
        // ========================================================
        const navbar = document.querySelector(".navbar");

        ScrollTrigger.create({
            start: "top -60px",
            onEnter:     () => navbar.classList.add("navbar--scrolled"),
            onLeaveBack: () => navbar.classList.remove("navbar--scrolled")
        });


        // ========================================================
        //  3. ACERCA DE MÍ — Timeline con un solo ScrollTrigger
        // ========================================================
        gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".about-section", start: "top 75%" }
        })
        .from(".big-title",         { x: -100, autoAlpha: 0, duration: 1.2 })
        .from(".sub-title",         { y: 40,   autoAlpha: 0, duration: 1   }, "<0.2")
        .from(".about-description", { y: 30,   autoAlpha: 0, duration: 1   }, "<0.15");


        // ========================================================
        //  4. ESTADÍSTICAS — Contadores proxy + reveal
        // ========================================================
        document.querySelectorAll(".stat-number").forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const proxy  = { val: 0 };

            gsap.to(proxy, {
                scrollTrigger: { trigger: stat, start: "top 90%", once: true },
                val: target,
                duration: 2.2,
                ease: "power2.out",
                onUpdate()  { stat.textContent = Math.floor(proxy.val).toLocaleString("es-MX"); },
                onComplete(){ stat.textContent = target.toLocaleString("es-MX"); }
            });
        });

        gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".stats-section", start: "top 80%" }
        })
        .from(".stat-item",       { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9 })
        .from(".stats-big-title", { x: 80, autoAlpha: 0, duration: 1.2 }, "<0.1");


        // ========================================================
        //  5. SETUP — Parallax diferencial con data-speed
        //
        //  Contexto:
        //  El ejemplo de GreenSock usa ScrollSmoother (Club GSAP,
        //  no disponible en CDN público). Aquí replicamos el mismo
        //  efecto visual con ScrollTrigger scrub puro.
        //
        //  Cómo funciona:
        //  La sección tiene height: 200vh en CSS. El wrapper interno
        //  es sticky a 100vh, así que el usuario ve las figuras
        //  mientras hace scroll 100vh adicionales.
        //  En ese recorrido de 100vh, cada figura se desplaza en Y
        //  una cantidad proporcional a su delta de velocidad:
        //
        //    delta  = speed - 1
        //    yFinal = -(delta * RANGE)
        //
        //  speed > 1 → delta positivo → yFinal negativo → sube (adelante)
        //  speed < 1 → delta negativo → yFinal positivo → baja (atrás)
        //  speed = 1 → sin movimiento adicional
        //
        //  "clamp(x)" en data-speed: extraemos solo el número.
        //  El clamping real lo da el RANGE conservador (120px) que
        //  evita que las figuras salgan del contenedor sticky.
        //
        //  CRÍTICO: ease: "none" en scrub — sin esto la posición
        //  y el progreso de scroll no son 1:1 y se siente raro.
        // ========================================================

        const PARALLAX_RANGE = 120; // px máximo de desplazamiento vertical

        // ── 5a. Título y subtítulo: entran al hacer scroll ──────
        gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".setup-section", start: "top 80%" }
        })
        .from(".setup-big-title", { y: 50, autoAlpha: 0, duration: 1.2 })
        .from(".setup-subtitle",  { y: 25, autoAlpha: 0, duration: 0.9 }, "<0.2");

        // ── 5b. Figuras: entrada en stagger desde el centro ─────
        const shapes = gsap.utils.toArray(".setup-shape");

        gsap.from(shapes, {
            scrollTrigger: {
                trigger: ".setup-shapes-row",
                start: "top 85%"
            },
            y: 70,
            autoAlpha: 0,
            scale: 0.75,
            stagger: { each: 0.07, from: "center" }, // las del centro primero
            duration: 1.1,
            ease: "expo.out",
            onComplete() {
                // Los labels aparecen después de que las figuras aterrizan
                gsap.to(".shape-label", {
                    autoAlpha: 1,
                    stagger: { each: 0.05, from: "center" },
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        // ── 5c. Parallax por figura ──────────────────────────────
        shapes.forEach((shape) => {
            const raw   = shape.dataset.speed || "1";
            // Extrae el número: "clamp(1.25)" → 1.25 | "0.8" → 0.8
            const speed = parseFloat(raw.replace(/[^0-9.]/g, ""));
            const delta = speed - 1;

            // Speed = 1 exacto: sin tween, ahorramos recursos
            if (Math.abs(delta) < 0.01) return;

            gsap.to(shape, {
                y: -(delta * PARALLAX_RANGE),
                ease: "none", // CRÍTICO con scrub: directo 1:1 al scroll
                scrollTrigger: {
                    trigger: ".setup-section",
                    start:   "top bottom",  // cuando la sección entra al viewport
                    end:     "bottom top",  // cuando la sección sale
                    scrub:   true           // ligado directamente al scroll
                }
            });
        });


        // ========================================================
        //  6. VIDEOS — Reveal en stagger
        // ========================================================
        function animateVideoCards() {
            const cards = document.querySelectorAll(".video-card");
            if (!cards.length) return;
            gsap.from(cards, {
                scrollTrigger: { trigger: ".videos-grid", start: "top 80%" },
                x: 60, autoAlpha: 0, stagger: 0.12, duration: 0.9
            });
        }

        animateVideoCards();

        gsap.from(".videos-section .section-title, .videos-section .section-subtitle", {
            scrollTrigger: { trigger: ".videos-section", start: "top 80%" },
            y: 30, autoAlpha: 0, stagger: 0.15, duration: 0.9
        });


        // ========================================================
        //  7. CONTACTO
        // ========================================================
        gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".contact-section-minimal", start: "top 75%" }
        })
        .from(".contact-big-title", { x: -80, autoAlpha: 0, duration: 1.2 })
        .from(
            ".contact-intro, .form-field, .minimal-submit, .contact-footer",
            { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 },
            "<0.2"
        );


        // ========================================================
        //  8. FOOTER
        // ========================================================
        gsap.from(".footer-col", {
            scrollTrigger: { trigger: ".massive-footer", start: "top 90%" },
            y: 20, autoAlpha: 0, stagger: 0.12, duration: 0.8
        });


        // ========================================================
        //  9. MICRO-INTERACCIONES — Hover logo
        // ========================================================
        const logo = document.querySelector(".logo");

        logo.addEventListener("mouseenter", () =>
            gsap.to(logo, { scale: 1.08, duration: 0.3, ease: "back.out(2)" })
        );
        logo.addEventListener("mouseleave", () =>
            gsap.to(logo, { scale: 1,    duration: 0.3, ease: "power2.out" })
        );

    } // fin mm.add
);


// ============================================================
//  SMOOTH SCROLL — Fuera de matchMedia (no depende de motion)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: "smooth"
        });
    });
});


// ============================================================
//  NOTA — Videos dinámicos (YouTube Data API)
//  fetch(ytApiUrl)
//    .then(r => r.json())
//    .then(data => {
//      renderVideoCards(data);
//      animateVideoCards();
//      ScrollTrigger.refresh(); // recalcula posiciones con nuevo contenido
//    });
// ============================================================
