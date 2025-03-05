import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
let gltfModel = null;
let zoomSpeed = 0.2; // A velocidade do zoom

// Configuração do Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true; // Ativa sombras
renderer.shadowMap.type = THREE.VSMShadowMap; // Melhora a qualidade da sombra

const container = document.getElementById('three-container');
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Criar Cena
const scene = new THREE.Scene();

// Criar Luz Direcional
const topLight = new THREE.DirectionalLight(0xffffff, 6);
topLight.position.set(5, 5, 5);
topLight.castShadow = true;
topLight.shadow.mapSize.width = 4096;
topLight.shadow.mapSize.height = 4096;
topLight.shadow.radius = 6;
scene.add(topLight);

// Criar Luz Ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Criar Câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6.5);

// Carregar Modelo GLTF
const loader = new GLTFLoader();
loader.load(
  '../modelos/t_shirt_hoodie_3d_model/scene.gltf',
  (gltfScene) => {
    gltfModel = gltfScene.scene;

    // Ativar sombras para o modelo
    gltfModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    scene.add(gltfModel);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar o modelo GLTF:", error);
  }
);

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

// Função para rotação do modelo com click and drag
container.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

container.addEventListener("mousemove", (e) => {
  if (isMouseDown && gltfModel) {
    let deltaX = e.clientX - lastMouseX;
    let deltaY = e.clientY - lastMouseY;

    gltfModel.rotation.y += deltaX * 0.005; // Rotação no eixo Y
    gltfModel.rotation.x += deltaY * 0.005; // Rotação no eixo X

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

container.addEventListener("mouseup", () => {
  isMouseDown = false;
});

container.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

// Função para fazer zoom in/out
container.addEventListener("wheel", (e) => {
  e.preventDefault();  // Impede a rolagem da página

  // Verifica a direção da rolagem (para cima ou para baixo)
  if (e.deltaY < 0) {
    camera.position.z -= zoomSpeed; // Zoom In
  } else {
    camera.position.z += zoomSpeed; // Zoom Out
  }

  // Limitar o zoom para que a câmera não ultrapasse limites
  camera.position.z = Math.max(Math.min(camera.position.z, 20), 2);
});

// Eventos de resize
window.addEventListener('resize', updateSize);
updateSize();
animate();
