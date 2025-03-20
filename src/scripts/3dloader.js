import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('three-container');

// Estado global para interações
const state = {
    isInteracting: false,
    lastX: 0,
    lastY: 0,
    initialPinchDistance: null,
    gltfModel: null,
    zoomSpeed: 0.2,
};

// Configuração do Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Criar Cena
const scene = new THREE.Scene();

// Criar Luzes
const topLight = new THREE.DirectionalLight(0xffffff, 4);
topLight.position.set(5, 5, 5);
topLight.castShadow = true;
topLight.shadow.mapSize.set(2048, 2048);
topLight.shadow.radius = 6;
scene.add(topLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.5)); // Luz ambiente

// Criar Câmera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 6.5);

// Carregar Modelo GLTF
const loader = new GLTFLoader();
loader.load('../modelos/shirt_baked.glb', (gltf) => {
    state.gltfModel = gltf.scene;

    // Ativar sombras no modelo
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(gltf.scene);
    updateSize();
}, undefined, (error) => console.error("Erro ao carregar modelo:", error));

function changeTextureB64(base64) {
    if (!state.gltfModel) return;

    const image = new Image();
    image.src = base64;
    image.onload = () => {
        const texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        texture.flipY = false;

        //texture.repeat.set(1, 1); // textura se repete apenas 1 vez

        state.gltfModel.traverse((child) => {
            if (child.isMesh) {
                if (child.material.map) {
                    child.material.map.dispose(); // discarta a textura antiga
                }

                const newMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                });

                child.material = newMaterial;
                child.material.needsUpdate = true;
            }
        });

        console.log('textura alterada');
    };
}

// Função de Animação
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Atualiza o tamanho da tela
function updateSize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Eventos de mouse (Desktop)
container.addEventListener("mousedown", (e) => {
    state.isInteracting = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
});

container.addEventListener("mousemove", (e) => {
    if (!state.isInteracting || !state.gltfModel) return;

    state.gltfModel.rotation.y += (e.clientX - state.lastX) * 0.005;
    state.gltfModel.rotation.x += (e.clientY - state.lastY) * 0.005;

    state.lastX = e.clientX;
    state.lastY = e.clientY;
});

["mouseup", "mouseleave"].forEach(event =>
    container.addEventListener(event, () => state.isInteracting = false)
);

// Eventos de toque (Mobile)
container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        // Início do toque único (rotação)
        state.isInteracting = true;
        state.lastX = e.touches[0].clientX;
        state.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // Início do gesto de pinça (zoom)
        state.isInteracting = false;
        state.initialPinchDistance = getPinchDistance(e.touches);
    }
});

container.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Impede rolagem da página

    if (e.touches.length === 1 && state.isInteracting && state.gltfModel) {
        // Rotação com um dedo
        state.gltfModel.rotation.y += (e.touches[0].clientX - state.lastX) * 0.005;
        state.gltfModel.rotation.x += (e.touches[0].clientY - state.lastY) * 0.005;

        state.lastX = e.touches[0].clientX;
        state.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2 && state.initialPinchDistance) {
        // Zoom com dois dedos (pinça)
        const newDistance = getPinchDistance(e.touches);
        const zoomFactor = newDistance / state.initialPinchDistance;
        camera.position.z = Math.max(2, Math.min(20, camera.position.z / zoomFactor));

        state.initialPinchDistance = newDistance;
    }
});

container.addEventListener("touchend", () => {
    state.isInteracting = false;
    state.initialPinchDistance = null;
});

// Função para calcular a distância entre dois toques (para zoom)
function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Função para fazer zoom in/out no scroll do mouse
container.addEventListener("wheel", (e) => {
    e.preventDefault(); // Impede a rolagem da página
    camera.position.z = Math.max(0, Math.min(20, camera.position.z + (e.deltaY > 0 ? state.zoomSpeed : -state.zoomSpeed)));
});

// Eventos de resize
window.addEventListener('resize', updateSize);

animate();
window.changeTextureB64 = changeTextureB64;