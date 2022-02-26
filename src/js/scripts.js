import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const monkeyUrl = new URL('../../assets/arc_glb.glb', import.meta.url)

console.log(monkeyUrl)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

renderer.setClearColor(0xE1A3A1)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(2, 2, 1)
orbit.update();

const grid = new THREE.GridHelper(20, 20)
scene.add(grid)

const assetLoader = new GLTFLoader()

let mixer;

assetLoader.load(monkeyUrl.href, function (gltf) {
  const model = gltf.scene
  scene.add(model)
  mixer = new THREE.AnimationMixer(model)
  const clips = gltf.animations;
  console.log('clips', clips)
  const clip = THREE.AnimationClip.findByName(clips, 'Armature')
  const action = mixer.clipAction(clip)
  action.play()
}, undefined, function (err) {
  console.error(err)
})

const clock = new THREE.Clock()
function animate() {
  if (mixer)
    mixer.update(clock.getDelta())
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})