/* ==========================================================================
   AJ ASSOCIATES - Helper Utilities & Legacy Compatibility Layer
   ========================================================================== */

// Global window helpers for inline HTML event bindings
window.openCareersModal = function () {
    const modal = document.getElementById('careers-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCareersModal = function () {
    const modal = document.getElementById('careers-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};
