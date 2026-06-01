/* ════════════════════════════════════════════════════════════
   SETUP 3D — Mac Mini
   Three.js + GLTFLoader + GSAP intro + drag horizontal
   ════════════════════════════════════════════════════════════ */

import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


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
    camera.position.set(0, 0.55, 4.8);
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
    renderer.toneMappingExposure = 1.15;


    /* ─────────────────────────────────────────────────────────
       LUCES
       ───────────────────────────────────────────────────────── */

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9fbfff, 1.4);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
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
    let isDragging = false;

    let previousX = 0;
    let previousY = 0;

    let targetRotationY = -0.55;
    let currentRotationY = -0.55;

    let targetRotationX = 0;
    let currentRotationX = 0;

    let dragMode = null;
    let activePointerId = null;
    let rafResize = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ─────────────────────────────────────────────────────────
       HELPERS
       ───────────────────────────────────────────────────────── */

    function isNavOpen() {
        return document.body.classList.contains('nav-open');
    }

    function releaseCanvasPointer() {
        if (activePointerId === null) return;

        try {
            if (canvas.hasPointerCapture(activePointerId)) {
                canvas.releasePointerCapture(activePointerId);
            }
        } catch (error) {
            // El puntero pudo haber sido cancelado por el navegador.
        }

        activePointerId = null;
    }

    function stopDragging() {
        isDragging = false;
        dragMode = null;
        releaseCanvasPointer();
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
            modelGroup.position.y = 0.02;
            introComplete = true;
            return;
        }

        gsap.fromTo(
            modelGroup.position,
            { y: 3.2 },
            {
                y: 0.02,
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

            macMini.rotation.set(0.24, -0.7, 0);
            macMini.position.set(0, -0.08, 0);

            macMini.traverse((child) => {
                if (!child.isMesh || !child.material) return;

                child.material.side = THREE.DoubleSide;

                if ('metalness' in child.material) {
                    child.material.metalness = 0.42;
                }

                if ('roughness' in child.material) {
                    child.material.roughness = 0.46;
                }
            });

            modelGroup.add(macMini);

            modelGroup.position.set(0, 3.2, 0);
            modelGroup.scale.set(0.72, 0.72, 0.72);
            modelGroup.rotation.set(0, -0.55, 0);

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
       INTERACCIÓN DRAG
       - Arrastre horizontal = rota la Mac
       - Arrastre vertical = permite scroll en móvil/tablet
       - Si el nav está abierto, el canvas no captura interacción
       ───────────────────────────────────────────────────────── */

    canvas.addEventListener('pointerdown', (event) => {
        if (!macMini || isNavOpen()) return;

        isDragging = true;
        dragMode = null;
        activePointerId = event.pointerId;

        previousX = event.clientX;
        previousY = event.clientY;

        try {
            canvas.setPointerCapture(event.pointerId);
        } catch (error) {
            activePointerId = null;
        }
    });

    canvas.addEventListener('pointermove', (event) => {
        if (!isDragging || isNavOpen()) {
            stopDragging();
            return;
        }

        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;

        if (!dragMode && Math.abs(deltaX) + Math.abs(deltaY) > 6) {
            dragMode = Math.abs(deltaX) > Math.abs(deltaY) ? 'rotate' : 'scroll';
        }

        if (dragMode === 'scroll') {
            stopDragging();
            return;
        }

        if (dragMode !== 'rotate') return;

        event.preventDefault();

        previousX = event.clientX;
        previousY = event.clientY;

        targetRotationY += deltaX * 0.012;
        targetRotationX += deltaY * 0.006;
        targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));
    }, { passive: false });

    canvas.addEventListener('pointerup', () => {
        stopDragging();
    });

    canvas.addEventListener('pointercancel', () => {
        stopDragging();
    });

    canvas.addEventListener('lostpointercapture', () => {
        stopDragging();
    });


    /* ─────────────────────────────────────────────────────────
       LOOP DE ANIMACIÓN
       ───────────────────────────────────────────────────────── */

    function animate() {
        requestAnimationFrame(animate);

        if (macMini) {
            if (isNavOpen()) {
                stopDragging();
            }

            if (!isDragging && !prefersReducedMotion && !isNavOpen()) {
                targetRotationY += 0.002;
            }

            currentRotationY += (targetRotationY - currentRotationY) * 0.08;
            currentRotationX += (targetRotationX - currentRotationX) * 0.08;

            modelGroup.rotation.y = currentRotationY;
            modelGroup.rotation.x = currentRotationX;

            if (introComplete && !isDragging && !prefersReducedMotion && !isNavOpen()) {
                modelGroup.position.y = 0.02 + Math.sin(Date.now() * 0.001) * 0.025;
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

    window.addEventListener('blur', () => {
        stopDragging();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopDragging();
        }
    });

    resizeRenderer();
    animate();
}