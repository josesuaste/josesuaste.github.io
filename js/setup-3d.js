import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#setup-canvas');

if (canvas) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        35,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 1.2, 6);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8fb7ff, 1.2);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const loader = new GLTFLoader();

    let macMini = null;

    loader.load(
        './models/Macmini.glb',

        function (gltf) {
            macMini = gltf.scene;

            macMini.position.set(0, 0, 0);
            macMini.rotation.set(0.18, -0.45, 0);
            macMini.scale.set(1.8, 1.8, 1.8);

            scene.add(macMini);
        },

        function (xhr) {
            console.log(`Mac Mini cargando: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
        },

        function (error) {
            console.error('Error cargando Macmini.glb:', error);
        }
    );

    function resizeRenderer() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    window.addEventListener('resize', resizeRenderer);

    function animate() {
        requestAnimationFrame(animate);

        if (macMini) {
            macMini.rotation.y += 0.004;
            macMini.position.y = Math.sin(Date.now() * 0.001) * 0.05;
        }

        renderer.render(scene, camera);
    }

    animate();
}