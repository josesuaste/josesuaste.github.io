'use strict';

// ════════════════════════════════════════════════════════════
//  FOOTER — AÑO AUTOMÁTICO
// ════════════════════════════════════════════════════════════

(function initCurrentYear() {
    const year = document.getElementById('current-year');

    if (!year) return;

    year.textContent = new Date().getFullYear();
})();
