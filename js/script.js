// ─────────────────────────────────────────────────────────────
//  Menú móvil
// ─────────────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('is-active');
    menuToggle.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('is-active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    });
});

// ─────────────────────────────────────────────────────────────
//  Scroll suave con offset del navbar
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
        });
    });
});

// ─────────────────────────────────────────────────────────────
//  Navbar glassmorphism al hacer scroll
// ─────────────────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
const aboutSection = document.querySelector('#about');

if (aboutSection && navbar) {
    aboutSection.insertAdjacentElement('beforebegin', sentinel);
    const navObserver = new IntersectionObserver(
        ([entry]) => {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '0px' }
    );
    navObserver.observe(sentinel);
}

// ─────────────────────────────────────────────────────────────
//  Deshabilitar transiciones CSS durante resize
// ─────────────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('no-transition');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 200);
});

// ─────────────────────────────────────────────────────────────
//  Nav link activo al hacer scroll
// ─────────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));

// ─────────────────────────────────────────────────────────────
//  Formulario: spinner + redirección a gracias.html
// ─────────────────────────────────────────────────────────────
const contactForm = document.querySelector('.minimal-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = contactForm.querySelector('.minimal-submit');
        const redirectInput = contactForm.querySelector('[name="redirect"]');
        const redirectUrl = redirectInput
            ? redirectInput.value
            : 'https://josesuaste.github.io/gracias.html';

        // Estado "Enviando..."
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Enviando...';
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.innerHTML = '<span class="btn-dot"></span> ✓ Enviado';
                btn.style.background = 'var(--orange)';
                btn.style.color = 'var(--white)';

                // Trackear en Umami si está disponible
                if (typeof umami !== 'undefined' && umami.track) {
                    umami.track('Envio-Formulario-Contacto');
                }

                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
            } else {
                btn.innerHTML = '<span class="btn-dot"></span> Error. Intenta de nuevo';
                btn.disabled = false;
            }
        } catch (error) {
            btn.innerHTML = '<span class="btn-dot"></span> Error de conexión';
            btn.disabled = false;
        }
    });
}