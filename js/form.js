'use strict';

// ════════════════════════════════════════════════════════════
//  FORMULARIO — AUTO-RESIZE TEXTAREA
// ════════════════════════════════════════════════════════════

(function initTextareaAutoResize() {
    const textarea = document.querySelector('.minimal-form textarea');

    if (!textarea) return;

    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
    });
})();