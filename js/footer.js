'use strict';

// ════════════════════════════════════════════════════════════
//  FOOTER — año automático
// ════════════════════════════════════════════════════════════

(function initCurrentYear() {
    const year = document.getElementById('current-year');

    if (!year) return;

    year.textContent = new Date().getFullYear();
})();