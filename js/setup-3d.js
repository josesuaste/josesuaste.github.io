import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

console.log('setup-3d.js cargado');

const canvas = document.querySelector('#macmini-canvas');
const setupLoader = document.querySelector('#setup-loader');

if (!canvas) {
    console.warn('No se encontró el canvas #macmini-canvas');
} else {
    console.log('Canvas encontrado:', canvas);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        35,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0.7, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9fbfff, 1.5);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    const loader = new GLTFLoader();

    let macMini = null;
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

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
        const targetSize = 2.6;
        const scale = targetSize / maxAxis;

        object.scale.setScalar(scale);

        console.log('Modelo centrado:', {
            size: size.toArray(),
            center: center.toArray(),
            scale
        });
    }

    loader.load(
        './models/Macmini.glb',

        function (gltf) {
            macMini = gltf.scene;

            centerAndScaleModel(macMini);

            macMini.rotation.set(0.22, -0.45, 0);
            macMini.position.set(0, 0, 0);

            macMini.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {
                        child.material.side = THREE.DoubleSide;

                        if ('metalness' in child.material) {
                            child.material.metalness = Math.min(child.material.metalness ?? 0.4, 0.65);
                        }

                        if ('roughness' in child.material) {
                            child.material.roughness = Math.max(child.material.roughness ?? 0.35, 0.35);
                        }
                    }
                }
            });

            modelGroup.add(macMini);

            if (setupLoader) {
                setupLoader.classList.add('is-hidden');
            }

            console.log('Macmini.glb cargado correctamente');
        },

        function (xhr) {
            if (xhr.total) {
                const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
                console.log(`Mac Mini cargando: ${progress}%`);
            }
        },

        function (error) {
            console.error('Error cargando Macmini.glb:', error);

            if (setupLoader) {
                setupLoader.textContent = 'No se pudo cargar el modelo 3D';
            }
        }
    );

    window.addEventListener('resize', resizeRenderer);

    function animate() {
        requestAnimationFrame(animate);

        if (macMini) {
            modelGroup.rotation.y += 0.0035;
            modelGroup.position.y = Math.sin(Date.now() * 0.001) * 0.055;
        }

        renderer.render(scene, camera);
    }

    resizeRenderer();
    animate();
}
