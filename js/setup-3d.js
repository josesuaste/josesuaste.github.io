import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

/* ════════════════════════════════════════════════════════════
   SETUP 3D — Mac Mini
   Three.js + GLTFLoader + drag rotation
   ════════════════════════════════════════════════════════════ */

const MODEL_PATH = 'models/Macmini.glb';

const canvas = document.querySelector('#macmini-canvas');
const setupSection = document.querySelector('#setup');
const setupLoader = document.querySelector('#setup-loader');

if (!canvas || !setupSection) {
    console.warn('[setup-3d] Canvas o sección #setup no encontrados.');
} else {
    initSetup3D();
}

function initSetup3D() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

    /*
      Cámara ligeramente baja para ver mejor el modelo editado en Blender.
      Si lo quieres más frontal, sube el segundo valor a 1.0 o 1.15.
    */
    camera.position.set(0, 0.85, 6);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    /* Luces */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(3.2, 4.2, 5.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff2e0, 1.1);
    rimLight.position.set(-2.5, 3.2, -3.5);
    scene.add(rimLight);

    /* Grupo principal */

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let model = null;
    let modelLoaded = false;

    const loader = new GLTFLoader();

    loader.load(
        MODEL_PATH,
        (gltf) => {
            console.log('[setup-3d] Modelo cargado:', gltf.scene);

            model = gltf.scene;

            prepareModel(model);
            centerAndScaleModel(model);

            /*
              El nodo raíz "m4" exporta con rotation xyzw [0.707,0,0,0.707]
              = 90° en X (eje Blender → glTF). Compensamos -PI/2 en X para
              que quede vertical, y PI en Y para que la manzana mire al frente.
              Ajusta el valor de Y si necesitas girar más o menos.
            */
            model.rotation.set(-Math.PI / 2, Math.PI, 0);

            modelGroup.add(model);

            modelLoaded = true;

            if (setupLoader) {
                setupLoader.classList.add('is-hidden');
            }
        },
        undefined,
        (error) => {
            console.error('[setup-3d] Error cargando modelo GLB:', error);

            if (setupLoader) {
                setupLoader.textContent = 'No se pudo cargar el modelo';
            }
        }
    );

    function prepareModel(object) {
        object.traverse((child) => {
            if (!child.isMesh) return;

            child.castShadow = false;
            child.receiveShadow = false;

            if (!child.material) return;

            if (Array.isArray(child.material)) {
                child.material.forEach(enhanceMaterial);
            } else {
                enhanceMaterial(child.material);
            }
        });
    }

    function enhanceMaterial(material) {
        material.needsUpdate = true;

        if ('roughness' in material) {
            material.roughness = Math.min(material.roughness ?? 0.55, 0.74);
        }

        if ('metalness' in material) {
            material.metalness = Math.max(material.metalness ?? 0.2, 0.28);
        }

        if (material.map) {
            material.map.colorSpace = THREE.SRGBColorSpace;
        }

        if (material.emissive) {
            material.emissiveIntensity = Math.min(material.emissiveIntensity || 0, 0.2);
        }
    }

    function centerAndScaleModel(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        box.getSize(size);
        box.getCenter(center);

        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        const maxAxis = Math.max(size.x, size.y, size.z);

        /*
          El nuevo GLB editado puede requerir un poco más de escala.
          Si se ve demasiado grande, baja desktop a 3.0.
        */
        const targetSize = isCoarsePointer ? 2.35 : 2.9;
        const scale = targetSize / maxAxis;

        object.scale.setScalar(scale);

        /*
          Ajuste vertical.
          Si se ve muy abajo, sube a 0.06 o 0.1.
        */
        object.position.y = isCoarsePointer ? 0 : -0.03;
    }

    /* Resize */

    function resizeRenderer() {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();

        renderer.setSize(rect.width, rect.height, false);
    }

    resizeRenderer();

    const resizeObserver = new ResizeObserver(() => {
        resizeRenderer();
    });

    resizeObserver.observe(canvas);

    window.addEventListener('resize', resizeRenderer, { passive: true });

    /* Interacción drag */

    let isDragging = false;
    let lastX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;

    const dragSensitivity = isCoarsePointer ? 0.006 : 0.0045;

    canvas.addEventListener('pointerdown', (event) => {
        if (!modelLoaded || document.body.classList.contains('nav-open')) return;

        isDragging = true;
        lastX = event.clientX;

        canvas.setPointerCapture?.(event.pointerId);
    });

    canvas.addEventListener('pointermove', (event) => {
        if (!isDragging || !modelLoaded) return;

        const deltaX = event.clientX - lastX;
        lastX = event.clientX;

        targetRotationY += deltaX * dragSensitivity;
    });

    canvas.addEventListener('pointerup', (event) => {
        isDragging = false;
        canvas.releasePointerCapture?.(event.pointerId);
    });

    canvas.addEventListener('pointercancel', () => {
        isDragging = false;
    });

    canvas.addEventListener('pointerleave', () => {
        isDragging = false;
    });

    /*
      Evita que el scroll encima del canvas haga zoom.
      No usamos OrbitControls para no activar zoom accidental.
    */
    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
    }, { passive: false });

    /* Scroll progress dentro de Setup */

    function getSetupProgress() {
        const rect = setupSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        const total = rect.height + viewportHeight;
        const raw = (viewportHeight - rect.top) / total;

        return THREE.MathUtils.clamp(raw, 0, 1);
    }

    /* Animación */

    const clock = new THREE.Clock();
    let rafId = null;
    let isVisible = false;

    function animate() {
        rafId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        const progress = getSetupProgress();

        if (model) {
            const idle = reduceMotion ? 0 : Math.sin(elapsed * 0.8) * 0.035;
            const scrollTilt = reduceMotion ? 0 : THREE.MathUtils.lerp(-0.045, 0.055, progress);

            currentRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, 0.08);

            /*
              Rotación base: -PI/2 en X compensa el eje Blender.
              PI en Y es la orientación frontal (manzana hacia cámara).
              El drag del usuario se suma sobre el Y base.
              El scrollTilt se suma sobre el X base.
            */
            model.rotation.x = -Math.PI / 2 + scrollTilt;
            model.rotation.y = Math.PI + currentRotationY;
            model.position.y = (isCoarsePointer ? 0 : -0.03) + idle;
        }

        renderer.render(scene, camera);
    }

    /* Pausar el loop cuando la sección no está visible */

    const visibilityObserver = new IntersectionObserver((entries) => {
        const entry = entries;

        if (entry.isIntersecting && !isVisible) {
            isVisible = true;
            clock.start();
            animate();
        } else if (!entry.isIntersecting && isVisible) {
            isVisible = false;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    }, { threshold: 0 });

    visibilityObserver.observe(setupSection);

    /* Limpieza básica cuando la página se descarga */

    window.addEventListener('pagehide', () => {
        visibilityObserver.disconnect();
        resizeObserver.disconnect();

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        renderer.dispose();

        scene.traverse((object) => {
            if (!object.isMesh) return;

            object.geometry?.dispose?.();

            if (Array.isArray(object.material)) {
                object.material.forEach(disposeMaterial);
            } else {
                disposeMaterial(object.material);
            }
        });
    });

    function disposeMaterial(material) {
        if (!material) return; 

        Object.keys(material).forEach((key) => {
            const value = material[key];

            if (value && typeof value.dispose === 'function') {
                value.dispose();
            }
        });

        material.dispose?.();
    }
}