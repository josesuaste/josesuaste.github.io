// ============================================================
//  script.js — José Suaste | ERROR 404
//  GSAP 3 + ScrollTrigger — Vanilla JS
//  v2 — Correcciones aplicadas:
//    1. gsap.defaults() globales para eliminar repetición
//    2. Float de píldoras lanzado desde onComplete (sin race condition)
//    3. ScrollTrigger del float eliminado (era redundante y conflictivo)
//    4. gsap.matchMedia() con prefers-reduced-motion en todas las animaciones
// ============================================================

// ── 0. REGISTRO DE PLUGINS ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── 0.1 DEFAULTS GLOBALES ───────────────────────────────────
// Evita repetir ease y duration en cada tween.
// Cualquier tween que no declare estos valores los hereda.
gsap.defaults({
    ease: "expo.out",
    duration: 1
});


// ============================================================
//  1. SETUP REDUCIDO-MOTION
//  gsap.matchMedia() crea un contexto que se revierte solo
//  cuando la media query deja de coincidir.
//  Todos los tweens y ScrollTriggers van DENTRO de mm.add().
// ============================================================
const mm = gsap.matchMedia();

mm.add(
    {
        // Dos condiciones: animación normal vs. reducida
        motion:      "(prefers-reduced-motion: no-preference)",
        reducedMotion: "(prefers-reduced-motion: reduce)"
    },
    (ctx) => {
        const { motion } = ctx.conditions;

        // Si el usuario prefiere movimiento reducido, saltamos todas
        // las animaciones de entrada y dejamos el contenido visible.
        if (!motion) {
            // Solo aseguramos visibilidad en elementos que GSAP
            // podría haber puesto en opacity:0 por el from().
            gsap.set([
                ".logo", ".nav-links a", ".giant-title",
                ".profile-img", ".header-corner.left",
                ".header-corner.right", ".bottom-sub-btn", ".blue-arc"
            ], { clearProps: "all" });
            return;
        }

        // ========================================================
        //  2. HERO — Entrada orquestada al cargar la página
        // ========================================================
        const heroTL = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1 }
        });

        heroTL
            .from(".logo", { y: -30, autoAlpha: 0, duration: 0.8 })
            .from(".nav-links a", {
                y: -20, autoAlpha: 0,
                stagger: 0.08, duration: 0.6
            }, "<0.1")
            .from(".giant-title", {
                y: 120, autoAlpha: 0,
                ease: "expo.out", duration: 1.4
            }, "-=0.4")
            // autoAlpha en lugar de opacity para evitar conflicto con
            // "transition: filter" del CSS en .profile-img
            .from(".profile-img", {
                scale: 0.85, autoAlpha: 0,
                duration: 1.2, ease: "back.out(1.4)"
            }, "-=0.8")
            .from(".header-corner.left, .header-corner.right", {
                autoAlpha: 0, stagger: 0.1, duration: 0.8
            }, "-=0.6")
            // Solo autoAlpha: el botón usa translateX(-50%) en CSS para
            // centrarse. Animar y/x sobreescribiría ese transform.
            .from(".bottom-sub-btn", { autoAlpha: 0, duration: 0.8 }, "<")
            .from(".blue-arc", {
                y: 200, duration: 1.4, ease: "expo.out"
            }, "-=1.8");


        // ========================================================
        //  3. NAVBAR — Cambio de estilo al hacer scroll
        // ========================================================
        const navbar = document.querySelector(".navbar");

        ScrollTrigger.create({
            start: "top -60px",
            onEnter:     () => navbar.classList.add("navbar--scrolled"),
            onLeaveBack: () => navbar.classList.remove("navbar--scrolled")
        });


        // ========================================================
        //  4. SECCIÓN "ACERCA DE MÍ" — Reveal al hacer scroll
        // ========================================================

        // Agrupamos los tres tweens de about en un timeline con
        // ScrollTrigger en el nivel superior (best practice).
        const aboutTL = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 75%"
            }
        });

        aboutTL
            .from(".big-title",         { x: -100, autoAlpha: 0, duration: 1.2 })
            .from(".sub-title",         { y: 40,   autoAlpha: 0, duration: 1   }, "<0.2")
            .from(".about-description", { y: 30,   autoAlpha: 0, duration: 1   }, "<0.15");


        // ========================================================
        //  5. ESTADÍSTICAS — Contadores animados con ScrollTrigger
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

        // Stats: items y título en un timeline con un solo ScrollTrigger
        const statsTL = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".stats-section", start: "top 80%" }
        });

        statsTL
            .from(".stat-item",       { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9 })
            .from(".stats-big-title", { x: 80, autoAlpha: 0, duration: 1.2 }, "<0.1");


        // ========================================================
        //  6. SETUP / PÍLDORAS — Animación de entrada + float
        //  FIX: el float se lanza desde onComplete del from(),
        //  no desde un ScrollTrigger separado, eliminando el
        //  race condition en scroll rápido.
        // ========================================================
        const pills = gsap.utils.toArray(".pill-gear");

        gsap.from(pills, {
            scrollTrigger: {
                trigger: ".pile-container",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            x:        () => gsap.utils.random(-300, 300),
            y:        () => gsap.utils.random(-250, 250),
            rotation: () => gsap.utils.random(-35, 35),
            autoAlpha: 0,
            scale: 0.6,
            duration: 1.4,
            stagger: { each: 0.07, from: "random" },
            ease: "expo.out",
            onComplete() {
                // 1. Limpiamos los inline styles que GSAP añadió durante
                //    la entrada para devolver el control de transform al CSS.
                gsap.set(pills, { clearProps: "x,y,rotation,scale,opacity,visibility" });

                // 2. Lanzamos el float AQUÍ, cuando la entrada ya terminó.
                //    Sin race condition posible.
                pills.forEach((pill, i) => {
                    gsap.to(pill, {
                        y: "+=10",
                        duration: 1.8 + i * 0.15,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                        delay: i * 0.4
                    });
                });
            }
        });


        // ========================================================
        //  7. SECCIÓN DE VIDEOS — Tarjetas con reveal en stagger
        // ========================================================
        function animateVideoCards() {
            const cards = document.querySelectorAll(".video-card");
            if (!cards.length) return;

            gsap.from(cards, {
                scrollTrigger: { trigger: ".videos-grid", start: "top 80%" },
                x: 60, autoAlpha: 0,
                stagger: 0.12, duration: 0.9
            });
        }

        animateVideoCards();

        gsap.from(".videos-section .section-title, .videos-section .section-subtitle", {
            scrollTrigger: { trigger: ".videos-section", start: "top 80%" },
            y: 30, autoAlpha: 0,
            stagger: 0.15, duration: 0.9
        });


        // ========================================================
        //  8. SECCIÓN CONTACTO — Reveal del título y formulario
        // ========================================================
        const contactTL = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".contact-section-minimal", start: "top 75%" }
        });

        contactTL
            .from(".contact-big-title", { x: -80, autoAlpha: 0, duration: 1.2 })
            .from(
                ".contact-intro, .form-field, .minimal-submit, .contact-footer",
                { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 },
                "<0.2"
            );


        // ========================================================
        //  9. FOOTER — Fade in de columnas
        // ========================================================
        gsap.from(".footer-col", {
            scrollTrigger: { trigger: ".massive-footer", start: "top 90%" },
            y: 20, autoAlpha: 0,
            stagger: 0.12, duration: 0.8
        });


        // ========================================================
        //  10. MICRO-INTERACCIONES — Hover en el logo
        // ========================================================
        const logo = document.querySelector(".logo");

        logo.addEventListener("mouseenter", () => {
            gsap.to(logo, { scale: 1.08, duration: 0.3, ease: "back.out(2)" });
        });
        logo.addEventListener("mouseleave", () => {
            gsap.to(logo, { scale: 1, duration: 0.3, ease: "power2.out" });
        });

    } // fin de mm.add callback
);


// ============================================================
//  11. SMOOTH SCROLL — Navegación interna
//  Va FUERA de mm.add: el scroll suave no depende de motion.
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const offsetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
});


// ============================================================
//  NOTA PARA EL DESARROLLADOR
// ============================================================
// Para videos cargados dinámicamente (YouTube Data API):
//
//   fetch(ytApiUrl)
//     .then(res => res.json())
//     .then(data => {
//       renderVideoCards(data);   // tu función que inserta las cards
//       animateVideoCards();      // activa las animaciones GSAP
//       ScrollTrigger.refresh();  // recalcula posiciones
//     });
//
// Para añadir nuevas secciones animadas, crea siempre un
// gsap.timeline() con scrollTrigger en el nivel superior,
// no en tweens hijos individuales.
// ============================================================