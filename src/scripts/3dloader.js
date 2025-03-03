import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({alpha:true});

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const loader = new GLTFLoader();

//Load the file
loader.load('../modelos/t_shirt_hoodie_3d_model/scene.gltf',(gltfScene)=>{
  scene.add(gltfScene.scene);
});
  

const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

camera.position.set(0,0,7);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
//scene.add(box);

function animate(time) {
  scene.rotation.y = time/2000;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();