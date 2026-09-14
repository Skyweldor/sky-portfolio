// Standalone harness for the rigged-FBX -> animated-GLB pilot.
// Not part of the app; served by vite at /anim-test.html. Delete with
// anim-test.html and public/models/_animtest/ once the question is settled.
//
// It answers three things the Blender-side checks can't:
//   1. does three.js render the animated GLB at the same size as the shipped
//      static one (i.e. is it a drop-in swap)
//   2. do the baked clips actually play through AnimationMixer
//   3. what does Box3.setFromObject -- the call MonModel.computeLocalBounds
//      makes -- report for a SkinnedMesh, versus the true deformed extent
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MONS = [
  'Agumon', 'BlackAgumon', 'Gabumon', 'BlackGabumon', 'ToyAgumon', 'Betamon',
  'Veemon', 'Patamon', 'Salamon', 'Palmon', 'Gomamon', 'Tentomon',
  'Hagurumon', 'Goblimon', 'Otamamon', 'Terriermon', 'Mushroomon',
  // No Digimon Masters counterpart, so the right-hand comparison slot stays
  // empty for these -- they are here to review the animation only.
  'Biyomon', 'DemiDevimon', 'Lopmon',

  // Champions. Only Guardromon has a shipped static counterpart, so the
  // right-hand slot is empty for nearly all of them -- what matters here is the
  // LEFT one against the 1 m reference cube, because these heights are DERIVED
  // (source height x 1.22) rather than art-directed. Garurumon/BlackGarurumon
  // and Raremon are the two whose footprints read long for their height.
  'Angemon', 'Birdramon', 'Devimon', 'IceDevimon', 'Gargomon',
  'Garurumon', 'BlackGarurumon', 'Gatomon', 'BlackGatomon',
  'Greymon', 'BlackGreymon', 'Guardromon', 'GuardromonGold',
  'Ikkakumon', 'Kabuterimon', 'Ogremon', 'Raremon', 'Togemon',
  'Turuiemon', 'Veedramon',
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10121a);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.05, 100);
camera.position.set(2.6, 1.6, 3.4);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.6, 0);

scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x30302a, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(3, 5, 4);
scene.add(key);

// Ground + a 1 m cube so scale errors are obvious by eye, not just in numbers.
const grid = new THREE.GridHelper(8, 16, 0x39ff88, 0x2a3145);
scene.add(grid);
const refCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x39ff88, wireframe: true, transparent: true, opacity: 0.35 }),
);
refCube.position.set(-2.2, 0.5, 0);
scene.add(refCube);

const loader = new GLTFLoader();
const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));

// Model paths resolve against the deploy base. The original harness ran at the site
// root, where a leading-slash path was correct; the portfolio serves this copy from
// /harness/animation/, and vite's `base` does not rewrite runtime string literals.
const MODELS = `${import.meta.env.BASE_URL}models/digimon`;

let mixer = null;
let clips = [];
let current = null;         // { root, skinned }
let staticRoot = null;
const monsBar = document.getElementById('mons');
const clipsBar = document.getElementById('clips');
const readout = document.getElementById('readout');

// True world-space extent of a skinned mesh: walk the deformed vertices via
// computeBoundingBox on a CPU-skinned copy is expensive, so instead sample the
// skeleton's bone world positions plus the bind-pose radius. Good enough to
// compare against what Box3 claims.
function trueSkinnedBox(root) {
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  let found = false;
  root.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    found = true;
    const pos = o.geometry.attributes.position;
    const skinIndex = o.geometry.attributes.skinIndex;
    const skinWeight = o.geometry.attributes.skinWeight;
    if (!skinIndex || !skinWeight) return;
    const step = Math.max(1, Math.floor(pos.count / 900)); // sample for speed
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos, i);
      o.applyBoneTransform(i, v);      // three's own CPU skinning for one vert
      o.localToWorld(v);
      box.expandByPoint(v);
    }
  });
  return found ? box : null;
}

// Frame the whole comparison -- reference cube, animated, and the shipped static model
// when the mon has one -- inside the band the chrome leaves free.
//
// The authored camera above was written for a wide viewport. On a portrait phone the three
// objects span 2.28x the viewport width: the cube lands at screen x -248 and the shipped
// model runs to 608, so the comparison the harness exists for is mostly off-screen. Desktop
// is left exactly as it was; this only runs when the viewport is taller than it is wide.
function fitScene() {
  if (camera.aspect >= 1) return;

  const box = new THREE.Box3().setFromObject(refCube);
  if (current) box.expandByObject(current.root);
  if (staticRoot) box.expandByObject(staticRoot);   // 18 of 40 mons have no counterpart
  if (box.isEmpty()) return;

  const c = box.getCenter(new THREE.Vector3());

  // Project the corners onto the camera basis and fit the real silhouette. A bounding
  // sphere overshoots badly on an arrangement this wide and flat.
  const dir = camera.position.clone().sub(controls.target).normalize();
  const right = new THREE.Vector3().crossVectors(camera.up, dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();
  let halfW = 0;
  let halfH = 0;
  for (const sx of ['min', 'max']) {
    for (const sy of ['min', 'max']) {
      for (const sz of ['min', 'max']) {
        const p = new THREE.Vector3(box[sx].x, box[sy].y, box[sz].z).sub(c);
        halfW = Math.max(halfW, Math.abs(p.dot(right)));
        halfH = Math.max(halfH, Math.abs(p.dot(up)));
      }
    }
  }

  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const uiPx = document.getElementById('ui').getBoundingClientRect().height;
  const roPx = document.getElementById('readout').getBoundingClientRect().height;
  const bandPx = Math.max(innerHeight * 0.4, innerHeight - uiPx - roPx);

  // Height is what the chrome constrains; width has the whole viewport. Dividing both by
  // the band fraction is what inflated the sibling harness's distance by 2.9x.
  const dH = (halfH / Math.tan(vFov / 2)) * (innerHeight / bandPx);
  const dW = halfW / (Math.tan(vFov / 2) * camera.aspect);
  const d = Math.max(dH, dW) * 1.08;

  // Aim off-centre so the scene sits in the free band rather than behind the rows.
  const dyPx = (uiPx + bandPx / 2) - innerHeight / 2;
  const worldPerPx = (2 * d * Math.tan(vFov / 2)) / innerHeight;
  const aim = new THREE.Vector3(c.x, c.y + dyPx * worldPerPx, c.z);

  camera.position.copy(aim).addScaledVector(dir, d);
  controls.target.copy(aim);
  controls.update();

  // Perspective compresses the far side, so the box centre does not project to the screen
  // centre and the fit above can still clip an edge by a few pixels. Measure the actual
  // projected span once and correct. Cheap, and it holds across mons as different as
  // Patamon and Veedramon rather than relying on a hand-tuned margin.
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  let minX = Infinity;
  let maxX = -Infinity;
  for (const sx of ['min', 'max']) {
    for (const sy of ['min', 'max']) {
      for (const sz of ['min', 'max']) {
        const v = new THREE.Vector3(box[sx].x, box[sy].y, box[sz].z).project(camera);
        const px = (v.x * 0.5 + 0.5) * innerWidth;
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
      }
    }
  }
  const safePx = innerWidth * 0.94;
  const spanPx = maxX - minX;
  const errPx = (minX + maxX) / 2 - innerWidth / 2;
  const scale = spanPx > safePx ? spanPx / safePx : 1;
  if (scale > 1 || Math.abs(errPx) > 1) {
    aim.addScaledVector(right, errPx * worldPerPx);
    camera.position.copy(aim).addScaledVector(dir, d * scale);
    controls.target.copy(aim);
    controls.update();
  }
}

function clearCurrent() {
  if (current) scene.remove(current.root);
  if (staticRoot) scene.remove(staticRoot);
  current = null; staticRoot = null; mixer = null; clips = [];
  clipsBar.innerHTML = '';
}

async function show(name) {
  clearCurrent();
  [...monsBar.children].forEach((b) => b.classList.toggle('on', b.textContent === name));

  // left: the new animated export
  const animGltf = await load(`${MODELS}/animated/${name}.glb`);
  const root = animGltf.scene;
  root.position.x = -0.9;
  scene.add(root);
  clips = animGltf.animations;
  mixer = new THREE.AnimationMixer(root);
  current = { root };

  // right: whatever the game ships today, untouched
  try {
    const staticGltf = await load(`${MODELS}/${name}.glb`);
    staticRoot = staticGltf.scene;
    staticRoot.position.x = 0.9;
    scene.add(staticRoot);
  } catch { staticRoot = null; }

  fitScene();

  clipsBar.innerHTML = '';
  clips.forEach((c) => {
    const b = document.createElement('button');
    b.textContent = `${c.name} (${c.duration.toFixed(2)}s)`;
    b.onclick = () => play(c);
    clipsBar.appendChild(b);
  });
  // 'idle' is the Digimon Links name; Cyber Sleuth calls its battle-neutral
  // clip 'bn01'. Without this the harness opens on clips[0] = 'ba01', an
  // attack mid-leap, which looks like a broken rest pose.
  const idle = clips.find((c) => c.name === 'idle' || c.name === 'bn01') || clips[0];
  if (idle) play(idle);
  report(name);
}

function play(clip) {
  mixer.stopAllAction();
  mixer.clipAction(clip).reset().play();
  [...clipsBar.children].forEach((b) => b.classList.toggle('on', b.textContent.startsWith(clip.name + ' ')));
}

function report(name) {
  const lines = [];
  const animBox = new THREE.Box3().setFromObject(current.root);
  const animSize = animBox.getSize(new THREE.Vector3());
  lines.push(`${name}`);
  lines.push(`  animated  Box3.setFromObject : ${fmt(animSize)}   minY=${animBox.min.y.toFixed(3)}`);
  const t = trueSkinnedBox(current.root);
  if (t) {
    const ts = t.getSize(new THREE.Vector3());
    lines.push(`  animated  true skinned bbox : ${fmt(ts)}   minY=${t.min.y.toFixed(3)}`);
  }
  if (staticRoot) {
    const sb = new THREE.Box3().setFromObject(staticRoot);
    const ss = sb.getSize(new THREE.Vector3());
    lines.push(`  shipped   Box3.setFromObject : ${fmt(ss)}   minY=${sb.min.y.toFixed(3)}`);
  }
  lines.push(`  clips: ${clips.map((c) => c.name).join(', ')}`);
  readout.textContent = lines.join('\n');
}

const fmt = (v) => `(${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)})`;

MONS.forEach((n) => {
  const b = document.createElement('button');
  b.textContent = n;
  b.onclick = () => show(n);
  monsBar.appendChild(b);
});

// Debug handle for driving this harness from the console.
window.__t = { THREE, scene, camera, controls, refCube,
               get current() { return current; }, get staticRoot() { return staticRoot; },
               get mixer() { return mixer; }, get clips() { return clips; }, show, play };

const clock = new THREE.Clock();
let frames = 0;
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt);
  controls.update();
  renderer.render(scene, camera);
  // refresh the true-bbox readout occasionally so deformation shows up live
  if (current && ++frames % 30 === 0) report(document.querySelector('#mons .on')?.textContent || '');
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  fitScene();
});

show('Agumon');
