import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('three-container');
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();


const loader = new GLTFLoader();

//Load the file
loader.load('../modelos/t_shirt_hoodie_3d_model/scene.gltf',(gltfScene)=>{
  scene.add(gltfScene.scene);
});
 
const topLight = new THREE.DirectionalLight(0xffffff, 10); // (color, intensity)
topLight.position.set(0, 0, 100) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const light2 = new THREE.DirectionalLight(0xffffff,10);
light2.position.set(0, 0, -10);
light2.castShadow = true;
scene.add(light2);

const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
camera.position.set(0,0,7);

function animate(time) {
  scene.rotation.y = time/10000;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
window.addEventListener('resize', updateSize);
updateSize();
function updateSize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
animate();
