import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#macmini-canvas');
const setupSection = document.querySelector('#setup');
const setupLoader = document.querySelector('#setup-loader');

if (canvas && setupSection) {
    gsap.registerPlugin(ScrollTrigger);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.65, 5.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9fbfff, 1.4);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let macMini = null;
    let idle = true;

    function resizeRenderer() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }

    function centerAndScaleModel(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        box.getSize(size);
        box.getCenter(center);

        object.position.sub(center);

        const maxAxis = Math.max(size.x, size.y, size.z);
        const targetSize = window.innerWidth < 700 ? 1.75 : 2.15;
        const scale = targetSize / maxAxis;

        object.scale.setScalar(scale);
    }

    const loader = new GLTFLoader();

    loader.load(
        './models/Macmini.glb',
        (gltf) => {
            macMini = gltf.scene;

            centerAndScaleModel(macMini);

            macMini.rotation.set(0.25, -0.65, 0);
            macMini.position.set(0.35, -0.05, 0);

            macMini.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.side = THREE.DoubleSide;

                    if ('metalness' in child.material) {
                        child.material.metalness = Math.min(child.material.metalness ?? 0.4, 0.65);
                    }

                    if ('roughness' in child.material) {
                        child.material.roughness = Math.max(child.material.roughness ?? 0.35, 0.35);
                    }
                }
            });

            modelGroup.add(macMini);

            if (setupLoader) {
                setupLoader.classList.add('is-hidden');
            }

            initScrollAnimation();
        },
        undefined,
        (error) => {
            console.error('Error cargando Macmini.glb:', error);
            if (setupLoader) setupLoader.textContent = 'No se pudo cargar el modelo 3D';
        }
    );

    function initScrollAnimation() {
        if (!macMini) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: setupSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2
            }
        });

        tl.to(modelGroup.rotation, {
            y: Math.PI * 0.75,
            x: 0.12,
            ease: 'none'
        }, 0);

        tl.to(modelGroup.position, {
            x: -0.55,
            y: 0.05,
            z: 0,
            ease: 'none'
        }, 0);

        tl.to(camera.position, {
            z: 4.35,
            y: 0.35,
            ease: 'none',
            onUpdate: () => camera.lookAt(0, 0, 0)
        }, 0);

        tl.to('.setup-copy-main', {
            autoAlpha: 0,
            y: -40,
            ease: 'none'
        }, 0.16);

        tl.fromTo('.setup-story-left',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, ease: 'none' },
            0.18
        );

        tl.to('.setup-story-left', {
            autoAlpha: 0,
            y: -30,
            ease: 'none'
        }, 0.48);

        tl.fromTo('.setup-story-right',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, ease: 'none' },
            0.42
        );

        tl.to('.setup-story-right', {
            autoAlpha: 0,
            y: -30,
            ease: 'none'
        }, 0.72);

        tl.fromTo('.setup-final-note',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, ease: 'none' },
            0.72
        );
    }

    function animate() {
        requestAnimationFrame(animate);

        if (macMini && idle) {
            modelGroup.rotation.y += 0.0012;
            modelGroup.position.y += Math.sin(Date.now() * 0.001) * 0.0008;
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        resizeRenderer();

        if (macMini) {
            macMini.scale.set(1, 1, 1);
            centerAndScaleModel(macMini);
        }
    });

    resizeRenderer();
    animate();
}