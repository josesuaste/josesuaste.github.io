/* ============================================
   JOSÉ SUASTE — Pupila siguiendo el mouse
   - Throttle real con requestAnimationFrame
   - Respeta prefers-reduced-motion
   - Desactivado en dispositivos táctiles puros
   ============================================ */

(function () {
    "use strict";

    const pupils = document.querySelectorAll(".pupil");
    if (!pupils.length) return;

    // Respeta accesibilidad y dispositivos táctiles
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return;

    let lastEvent = null;
    let rafId = null;

    function update() {
        rafId = null;
        const e = lastEvent;
        if (!e) return;

        for (const pupil of pupils) {
            const rect = pupil.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const angle = Math.atan2(dy, dx);

            // Límite de 15px mantiene la pupila dentro del ojo
            const distance = Math.min(Math.hypot(dx, dy) / 10, 15);

            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    document.addEventListener(
        "mousemove",
        function (e) {
            lastEvent = e;
            if (rafId == null) {
                rafId = requestAnimationFrame(update);
            }
        },
        { passive: true }
    );
})();