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
renderer.toneMapping = THREE.NoToneMapping;
renderer.outputEncoding = THREE.LinearEncoding;
container.appendChild(renderer.domElement);

// Criar Cena
const scene = new THREE.Scene();

// Criar um plano (chão)
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.2,
    emissive: 0x000000,  // Ensure no self-emission
    emissiveIntensity: 0 
});const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Ajustar posição e rotação
plane.rotation.x = -Math.PI / 3.8; // Deixar plano na horizontal
plane.position.y = -5; // Ajuste a altura conforme necessário
plane.receiveShadow = true; // Permitir que sombras sejam projetadas nele

// Adicionar plano à cena
scene.add(plane);

// Criar Luzes
const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
topLight.position.set(-3, 5, 5);
topLight.castShadow = true;
topLight.shadow.mapSize.set(2048, 2048);
topLight.shadow.radius = 6;
scene.add(topLight);
scene.add(new THREE.AmbientLight(0xffffff, 10)); // Luz ambiente

// Criar uma luz pontual acima do objeto
const pointLight = new THREE.PointLight(0xffffff, 40, 15); // Cor, Intensidade, Distância
pointLight.position.set(0, 6, 10); // Posição acima do objeto
pointLight.castShadow = true; // Habilita sombras
pointLight.shadow.mapSize.set(2048, 2048);
pointLight.shadow.radius = 100;
scene.add(pointLight);


const rectLight = new THREE.RectAreaLight(0xffffff, 20 ,5, 5);
rectLight.position.set(2,3,5);
scene.add(rectLight);

// Criar Câmera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(-4, 0, 7.5);

// Carregar Modelo GLTF
const loader = new GLTFLoader();
loader.load('src/modelos/t_shirt_hoodie_3d_model/scene.gltf', (gltf) => {
    state.gltfModel = gltf.scene;

    // Ativar sombras no modelo
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    state.gltfModel.rotation.y = Math.PI * -0.07;
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

        texture.repeat.set(1, 1); // textura se repete apenas 1 vez

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
// Eventos de resize
window.addEventListener('resize', updateSize);

animate();
window.changeTextureB64 = changeTextureB64;