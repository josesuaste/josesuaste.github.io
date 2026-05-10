/* ===========================
   GLASSMORFISMO EN NAVBAR
   =========================== */
const navbar = document.querySelector('.custom-navbar');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(sentinel);

const navObserver = new IntersectionObserver(
    ([entry]) => {
        navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
);
navObserver.observe(sentinel);

/* ===========================
   CIERRE DEL MENÚ AL HACER CLIC EN UN ENLACE
   =========================== */
const navLinks = document.querySelectorAll('#navbarCollapse .nav-link');
const navbarCollapse = document.getElementById('navbarCollapse');
const bsCollapse = bootstrap.Collipse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }
    });
});

/* ===========================
   SCROLL SUAVE PARA ANCLAS
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 70,
            behavior: 'smooth'
        });
    });
});