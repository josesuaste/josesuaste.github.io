/* ════════════════════════════════════════════════════════════
   SETUP 3D — Mac Mini
   Three.js + GLTFLoader + GSAP intro + OrbitControls
   ════════════════════════════════════════════════════════════ */

import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';


/* ───────────────────────────────────────────────────────────
   ELEMENTOS DEL DOM
   ─────────────────────────────────────────────────────────── */

const canvas = document.querySelector('#macmini-canvas');
const setupSection = document.querySelector('#setup');
const setupLoader = document.querySelector('#setup-loader');


/* ───────────────────────────────────────────────────────────
   INIT
   ─────────────────────────────────────────────────────────── */

if (canvas && setupSection) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.3, 4.9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;


    /* ─────────────────────────────────────────────────────────
       CONTROLES DEL MOUSE
       ───────────────────────────────────────────────────────── */

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.065;

    /*
       Click / drag: rota el modelo.
       Scroll encima del canvas: NO hace zoom.
       Esto permite que la página siga scrolleando normal.
    */

    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    controls.rotateSpeed = 0.75;

    /*
       Límites verticales suaves.
       Evita que el usuario lo voltee completamente por debajo.
    */

    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.82;

    controls.target.set(0, 0, 0);
    controls.enabled = true;
    controls.update();


    /* ─────────────────────────────────────────────────────────
       LUCES
       ───────────────────────────────────────────────────────── */

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);


    /* ─────────────────────────────────────────────────────────
       GRUPO DEL MODELO
       ───────────────────────────────────────────────────────── */

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let macMini = null;
    let introStarted = false;
    let introComplete = false;
    let rafResize = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ─────────────────────────────────────────────────────────
       HELPERS
       ───────────────────────────────────────────────────────── */

    function isNavOpen() {
        return document.body.classList.contains('nav-open');
    }

    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    function setControlsEnabled() {
        // Desktop: siempre activo salvo nav abierto.
        // Mobile: lo maneja el listener de touch, aquí solo forzamos off con nav.
        if (!isTouchDevice()) {
            controls.enabled = !isNavOpen();
        } else {
            if (isNavOpen()) controls.enabled = false;
        }
    }


    /* ─────────────────────────────────────────────────────────
       RESIZE DEL CANVAS
       ───────────────────────────────────────────────────────── */

    function resizeRenderer() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
    }


    /* ─────────────────────────────────────────────────────────
       CENTRAR Y ESCALAR MODELO
       ───────────────────────────────────────────────────────── */

    function centerAndScaleModel(object) {
        object.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        box.getSize(size);
        box.getCenter(center);

        object.position.sub(center);

        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetSize = window.innerWidth < 700 ? 1.65 : 2.05;
        const scale = targetSize / maxAxis;

        object.scale.setScalar(scale);
    }


    /* ─────────────────────────────────────────────────────────
       ANIMACIÓN DE ENTRADA
       ───────────────────────────────────────────────────────── */

    function playIntro() {
        if (introStarted || !macMini) return;

        introStarted = true;

        if (!window.gsap || prefersReducedMotion) {
            modelGroup.position.y = 0;
            introComplete = true;
            return;
        }

        /*
           Cae de frente.
           El modelo ya queda orientado antes de iniciar la caída.
        */

        gsap.fromTo(
            modelGroup.position,
            { y: 3.2 },
            {
                y: 0,
                duration: 1.25,
                ease: 'power4.out',
                onComplete: () => {
                    introComplete = true;
                }
            }
        );

        gsap.fromTo(
            '.orbit-item',
            { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
            {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                stagger: 0.07,
                delay: 0.35,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility,filter'
            }
        );

        gsap.fromTo(
            '.setup-description',
            { autoAlpha: 0, y: 18 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                delay: 0.55,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility'
            }
        );
    }


    /* ─────────────────────────────────────────────────────────
       CARGA DEL MODELO GLB
       ───────────────────────────────────────────────────────── */

    new GLTFLoader().load(
        './models/Macmini.glb',

        (gltf) => {
            macMini = gltf.scene;

            centerAndScaleModel(macMini);

            /*
               Modelo exportado limpio desde Blender con +Y Up.
               No necesita correcciones de rotación.
            */

            macMini.rotation.set(0, 0, 0);
            macMini.position.set(0, 0, 0);

            macMini.traverse((child) => {
                if (!child.isMesh || !child.material) return;

                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material.map) {
                    child.material.map.colorSpace = THREE.SRGBColorSpace;
                }

                child.material.needsUpdate = true;
            });

            modelGroup.add(macMini);

            /*
               El grupo cae recto.
               No tiene rotación lateral para que no entre chueco.
            */

            modelGroup.position.set(0, 3.2, 0);
            modelGroup.scale.set(0.72, 0.72, 0.72);
            modelGroup.rotation.set(0, 0, 0);

            if (setupLoader) {
                setupLoader.classList.add('is-hidden');
            }

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        playIntro();
                        observer.disconnect();
                    }
                },
                { threshold: 0.15 }
            );

            observer.observe(setupSection);
        },

        undefined,

        (error) => {
            console.error('Error cargando Macmini.glb:', error);

            if (setupLoader) {
                setupLoader.textContent = 'No se pudo cargar el modelo 3D';
            }
        }
    );


    /* ─────────────────────────────────────────────────────────
       LOOP DE ANIMACIÓN
       ───────────────────────────────────────────────────────── */

    function animate() {
        requestAnimationFrame(animate);

        setControlsEnabled();
        controls.update();

        if (macMini) {
            /*
               Flotación sutil después de caer.
               No toca la rotación, así que no pelea contra el mouse.
            */

            if (introComplete && !prefersReducedMotion && !isNavOpen()) {
                modelGroup.position.y = Math.sin(Date.now() * 0.001) * 0.025;
            }
        }

        renderer.render(scene, camera);
    }


    /* ─────────────────────────────────────────────────────────
       EVENTOS GLOBALES
       ───────────────────────────────────────────────────────── */

    const ro = typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (rafResize) cancelAnimationFrame(rafResize);

            rafResize = requestAnimationFrame(() => {
                resizeRenderer();
            });
        })
        : null;

    if (ro && canvas.parentElement) {
        ro.observe(canvas.parentElement);
    } else {
        window.addEventListener('resize', resizeRenderer, { passive: true });
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            controls.update();
        }
    });

    /* ─────────────────────────────────────────────────────────
       TOUCH — solo rota si el gesto es horizontal.
       Si es vertical, desactiva controles y deja pasar el scroll.
       ───────────────────────────────────────────────────────── */

    let touchStartX = 0;
    let touchStartY = 0;
    // null = sin decidir, 'rotate' = horizontal, 'scroll' = vertical
    let touchIntent = null;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchIntent = null;
        // Arranca desactivado — se activa solo si el gesto es horizontal
        controls.enabled = false;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        // Si ya decidimos la intención, no la cambiamos
        if (touchIntent !== null) return;

        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);

        // Esperamos al menos 6px para decidir
        if (dx < 6 && dy < 6) return;

        if (dx > dy * 1.4) {
            // Claramente horizontal → rotar modelo
            touchIntent = 'rotate';
            controls.enabled = true;
        } else {
            // Vertical o diagonal → scroll, no rotar
            touchIntent = 'scroll';
            controls.enabled = false;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        touchIntent = null;
        // Desactiva hasta el próximo touchstart
        // setControlsEnabled lo reactiva en desktop vía el loop
        if (isTouchDevice()) controls.enabled = false;
    }, { passive: true });

    canvas.addEventListener('touchcancel', () => {
        touchIntent = null;
        if (isTouchDevice()) controls.enabled = false;
    }, { passive: true });

    resizeRenderer();
    animate();
}