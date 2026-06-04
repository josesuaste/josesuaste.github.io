import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

'use strict';

/* ════════════════════════════════════════════════════════════
   SETUP 3D — Mac Mini
   Three.js + GLTFLoader + drag rotation
   ════════════════════════════════════════════════════════════ */

const MODEL_PATH = 'models/mac-mini.glb';

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
    camera.position.set(0, 1.15, 6);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    /* Luces */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.2, 4.2, 5.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
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
            model = gltf.scene;

            prepareModel(model);
            centerAndScaleModel(model);

            /*
              Rotación inicial:
              Ajusta este valor si tu nuevo GLB no queda con la manzanita/frente correcto.
              Math.PI = gira 180 grados.
            */
            model.rotation.set(0, Math.PI, 0);

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
            material.roughness = Math.min(material.roughness ?? 0.55, 0.7);
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
        const targetSize = isCoarsePointer ? 2.35 : 2.75;
        const scale = targetSize / maxAxis;

        object.scale.setScalar(scale);

        /*
          Baja/sube el modelo dentro del card.
          Si lo quieres más arriba, sube este valor.
        */
        object.position.y = isCoarsePointer ? -0.05 : -0.08;
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

    function animate() {
        const elapsed = clock.getElapsedTime();
        const progress = getSetupProgress();

        if (model) {
            const idle = reduceMotion ? 0 : Math.sin(elapsed * 0.8) * 0.035;
            const scrollTilt = reduceMotion ? 0 : THREE.MathUtils.lerp(-0.08, 0.08, progress);

            currentRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, 0.08);

            model.rotation.y = Math.PI + currentRotationY;
            model.rotation.x = scrollTilt;
            model.position.y = (isCoarsePointer ? -0.05 : -0.08) + idle;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    /* Limpieza básica cuando la página se descarga */

    window.addEventListener('pagehide', () => {
        resizeObserver.disconnect();

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
