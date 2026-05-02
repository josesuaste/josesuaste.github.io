// ============================================================
//  script.js — José Suaste | ERROR 404
//  GSAP 3 + ScrollTrigger — Vanilla JS
// ============================================================

// ── 0. REGISTRO DE PLUGINS ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger);


// ============================================================
//  1. HERO — Entrada orquestada al cargar la página
// ============================================================
// Usamos un timeline para que todo entre en secuencia limpia

const heroTL = gsap.timeline({
    defaults: { ease: "expo.out", duration: 1 }
});

heroTL
    // Navbar: logo y links bajan desde arriba
    .from(".logo", {
        y: -30,
        opacity: 0,
        duration: 0.8
    })
    .from(".nav-links a", {
        y: -20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6
    }, "<0.1")

    // Título gigante "ERROR 404": sube desde abajo con overshoot
    .from(".giant-title", {
        y: 120,
        opacity: 0,
        ease: "expo.out",
        duration: 1.4
    }, "-=0.4")

    // Foto de perfil: aparece con scale desde 0.8
    // Usamos autoAlpha en lugar de opacity para evitar conflicto con
    // "transition: all" del CSS que también anima opacity.
    .from(".profile-img", {
        scale: 0.85,
        autoAlpha: 0,
        duration: 1.2,
        ease: "back.out(1.4)"
    }, "-=0.8")

    // Corners: solo opacity (sin y) para no afectar su layout
    .from(".header-corner.left, .header-corner.right", {
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8
    }, "-=0.6")

    // Botón suscríbete: tiene transform: translateX(-50%) en CSS para centrarse.
    // Si animamos "y" GSAP sobreescribe ese transform y el botón se desplaza.
    // Solo animamos autoAlpha para no romper el posicionamiento CSS.
    .from(".bottom-sub-btn", {
        autoAlpha: 0,
        duration: 0.8
    }, "<")

    // Arco azul: sube desde abajo
    .from(".blue-arc", {
        y: 200,
        duration: 1.4,
        ease: "expo.out"
    }, "-=1.8");


// ============================================================
//  2. NAVBAR — Cambio de estilo al hacer scroll
// ============================================================
const navbar = document.querySelector(".navbar");

ScrollTrigger.create({
    start: "top -60px",      // 60px después del tope
    onEnter:     () => navbar.classList.add("navbar--scrolled"),
    onLeaveBack: () => navbar.classList.remove("navbar--scrolled")
});


// ============================================================
//  3. SECCIÓN "ACERCA DE MÍ" — Reveal al hacer scroll
// ============================================================

// Título gigante: entra desde la izquierda
gsap.from(".big-title", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 75%"
    },
    x: -100,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});

// Columna derecha: subtítulo y descripción
gsap.from(".sub-title", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 70%"
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    delay: 0.2
});

gsap.from(".about-description", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 65%"
    },
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    delay: 0.35
});


// ============================================================
//  4. ESTADÍSTICAS — Contadores animados con ScrollTrigger
//     BUG CORREGIDO: innerText como número real, sin race condition
// ============================================================
document.querySelectorAll(".stat-number").forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"), 10);

    // Objeto proxy: GSAP anima "val" y nosotros actualizamos el DOM
    const proxy = { val: 0 };

    gsap.to(proxy, {
        scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            once: true  // solo se ejecuta una vez
        },
        val: target,
        duration: 2.2,
        ease: "power2.out",
        onUpdate() {
            // toLocaleString da formato regional (1,500 → "1,500" en es-MX)
            stat.textContent = Math.floor(proxy.val).toLocaleString("es-MX");
        },
        onComplete() {
            // Asegura que termine exactamente en el target
            stat.textContent = target.toLocaleString("es-MX");
        }
    });
});

// Labels de estadísticas: entrada con stagger
gsap.from(".stat-item", {
    scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%"
    },
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "expo.out"
});

// Título "estadísticas": entra desde la derecha
gsap.from(".stats-big-title", {
    scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%"
    },
    x: 80,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});


// ============================================================
//  5. SETUP / PÍLDORAS — Efecto caos corregido
//     BUG CORREGIDO: respeta las variables CSS --x, --y, --r
//     en lugar de sobreescribirlas con gsap x/y/rotation.
//     Animamos desde una posición dispersa usando la propiedad
//     "transform" vía gsap.set + clearProps al finalizar.
// ============================================================

// Leemos las variables CSS de cada píldora para saber su posición final
const pills = gsap.utils.toArray(".pill-gear");

// Posición inicial: cada píldora aparece desde un punto aleatorio
// fuera de la pantalla y cae en su lugar (definido por --x, --y, --r)
gsap.from(pills, {
    scrollTrigger: {
        trigger: ".pile-container",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    // Animamos desde offsets adicionales sobre la posición final
    // usando función que devuelve valor por elemento
    x: () => gsap.utils.random(-300, 300),
    y: () => gsap.utils.random(-250, 250),
    rotation: () => gsap.utils.random(-35, 35),
    opacity: 0,
    scale: 0.6,
    duration: 1.4,
    stagger: {
        each: 0.07,
        from: "random"
    },
    ease: "expo.out",
    // Importante: después de que GSAP termina, limpiamos solo
    // x, y, rotation que añadimos (scale y opacity también)
    // para que el CSS --x/--y/--r vuelva a ser el dueño del transform.
    // Como GSAP en vanilla usa inline style "transform", necesitamos
    // animarlo hasta 0 adicional y luego clearProps.
    onComplete() {
        // Al terminar, limpiamos el inline style de transform
        // para que el CSS con variables CSS tome el control de nuevo
        gsap.set(pills, { clearProps: "x,y,rotation,scale,opacity" });
    }
});

// Efecto "respiración flotante" con GSAP (reemplaza el @keyframes CSS)
// Se activa después de que la animación de entrada termina
ScrollTrigger.create({
    trigger: ".pile-container",
    start: "top 85%",
    once: true,
    onEnter() {
        // Delay para que arranque después de la entrada (1.4s + stagger ~0.5s)
        gsap.delayedCall(2, () => {
            pills.forEach((pill, i) => {
                gsap.to(pill, {
                    y: "+=10",            // sube 10px sobre su posición actual
                    duration: 1.8 + i * 0.15,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.4        // cada píldora en distinto momento
                });
            });
        });
    }
});


// ============================================================
//  6. SECCIÓN DE VIDEOS — Tarjetas con reveal en stagger
// ============================================================
// Se ejecuta cuando las tarjetas existen en el DOM
// (pueden cargarse dinámicamente, por eso usamos un observer)

function animateVideoCards() {
    const cards = document.querySelectorAll(".video-card");
    if (!cards.length) return;

    gsap.from(cards, {
        scrollTrigger: {
            trigger: ".videos-grid",
            start: "top 80%"
        },
        x: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "expo.out"
    });
}

// Si los videos se cargan de forma asíncrona (ej. YouTube API),
// llamar a animateVideoCards() después de insertarlos en el DOM.
// Si ya están en el HTML al cargar, esto los anima de inmediato.
animateVideoCards();

// Título de la sección de videos
gsap.from(".videos-section .section-title, .videos-section .section-subtitle", {
    scrollTrigger: {
        trigger: ".videos-section",
        start: "top 80%"
    },
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: "expo.out"
});


// ============================================================
//  7. SECCIÓN CONTACTO — Reveal del título y formulario
// ============================================================

// Título "colabora conmigo" desde la izquierda
gsap.from(".contact-big-title", {
    scrollTrigger: {
        trigger: ".contact-section-minimal",
        start: "top 75%"
    },
    x: -80,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});

// Intro + campos del formulario: stagger vertical
gsap.from(".contact-intro, .form-field, .minimal-submit, .contact-footer", {
    scrollTrigger: {
        trigger: ".contact-right",
        start: "top 80%"
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "expo.out"
});


// ============================================================
//  8. FOOTER — Fade in de columnas
// ============================================================
gsap.from(".footer-col", {
    scrollTrigger: {
        trigger: ".massive-footer",
        start: "top 90%"
    },
    y: 20,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: "expo.out"
});


// ============================================================
//  9. SMOOTH SCROLL — Navegación interna
//     (Mantenemos la lógica original, corregida y limpia)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        const headerOffset = 80;
        const offsetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
});


// ============================================================
//  10. MICRO-INTERACCIONES — Hover en el logo (cursor play)
// ============================================================
const logo = document.querySelector(".logo");

logo.addEventListener("mouseenter", () => {
    gsap.to(logo, { scale: 1.08, duration: 0.3, ease: "back.out(2)" });
});
logo.addEventListener("mouseleave", () => {
    gsap.to(logo, { scale: 1, duration: 0.3, ease: "power2.out" });
});


// ============================================================
//  NOTA PARA EL DESARROLLADOR
// ============================================================
// Para añadir animaciones a videos cargados dinámicamente
// (ej. YouTube Data API), llama a animateVideoCards() después
// de insertar las tarjetas en .videos-grid:
//
//   fetch(ytApiUrl)
//     .then(res => res.json())
//     .then(data => {
//       renderVideoCards(data);   // tu función que inserta las cards
//       animateVideoCards();      // activa las animaciones GSAP
//       ScrollTrigger.refresh();  // recalcula posiciones
//     });
// ============================================================