// PS1 Digimon animation harness.
//
// Browses the Digimon DW1ModelConverter pulled off the Digimon World (USA) disc -- 125 of
// them, with the game's NPC copies folded in -- and every distinct animation they carry. The clips have no names -- only the slot number the
// game stores them under -- so the harness doubles as the tool for working out what each
// slot is: loop range, sound cues and texture swaps are the best evidence for that.
//
// Assets are produced by tools/build-assets.mjs. The GLBs already have the PS1 axis and
// scale baked in (a DW1_FIX root node), so nothing here corrects orientation.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Player, captureRest } from './playback.js';
import { UI } from './ui.js';

// Every asset URL is built from the deploy base, never a bare leading slash. The site's
// SPA fallback answers a wrong path with its own index.html and a 200, and GLTFLoader
// then fails on HTML -- the failure the animation harness README documents.
const BASE = import.meta.env.BASE_URL;
const CACHE_SIZE = 4;
// Front three-quarter view. After the DW1_FIX rotation the models face +Z.
const DEFAULT_DIR = new THREE.Vector3(0.55, 0.32, 1).normalize();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10121a);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.02, 400);
camera.position.copy(DEFAULT_DIR).multiplyScalar(4);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotateSpeed = 1.4;

// Flat, bright light: these are PS1 textures meant to read at a glance, not to be
// relit. The hemisphere carries most of it; the key only gives the forms some shape.
scene.add(new THREE.HemisphereLight(0xe4ecff, 0x3a3630, 2.6));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
keyLight.position.set(3, 6, 5);
scene.add(keyLight);

const grid = new THREE.GridHelper(24, 48, 0x39ff88, 0x2a3145);   // 0.5 m cells
scene.add(grid);

// A 1 m cube beside every model, so the baked 1/256 scale can be judged by eye.
const refCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x39ff88, wireframe: true, transparent: true, opacity: 0.35 }),
);
scene.add(refCube);

const loader = new GLTFLoader();
const settings = { speed: 1, loop: true, inPlace: true, turntable: false, doubleSided: false, depthWrite: false };
const cache = new Map();          // variant key -> loaded entry, oldest first
let byId = new Map();             // Digimon id (its main model's code) -> manifest entry
let byVariant = new Map();        // variant key -> { d, v }
let droppedMap = new Map();       // code merged away -> { into, slots }
let ui = null;
let currentD = null;              // the Digimon on screen
let current = null;               // the loaded variant on screen
let currentClip = null;           // the merged clip playing
let reqToken = 0;
let framedOnce = false;

// The merged clip with the lowest slot on a variant: what it opens with, and the pose the
// asset build measured its height on.
function firstOn(d, vkey) {
  let best = null;
  for (const c of d.clips) {
    const s = c.on[vkey];
    if (s != null && (!best || s < best.s)) best = { c, s };
  }
  return best ? best.c : null;
}

// ---------------------------------------------------------------------------------

async function fetchJSON(url) {
  const r = await fetch(url);
  const type = r.headers.get('content-type') || '';
  if (!r.ok || type.includes('text/html')) {
    throw new Error(`${url} -> ${r.status} ${type || 'no content-type'} (a wrong path gets the site's index.html)`);
  }
  return r.json();
}

function loadGLB(url, onProgress) {
  return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
}

async function loadModel(d, meta, token) {
  if (cache.has(meta.key)) {
    const hit = cache.get(meta.key);
    cache.delete(meta.key);
    cache.set(meta.key, hit);
    return hit;
  }
  const mb = (n) => (n / 1e6).toFixed(2);
  const [gltf, events] = await Promise.all([
    loadGLB(`${BASE}${meta.glb}`, (ev) => {
      if (token === reqToken) ui.setStatus(`loading ${meta.key}.glb  ${mb(ev.loaded)} / ${mb(meta.bytes)} MB`);
    }),
    meta.events ? fetchJSON(`${BASE}${meta.events}`) : Promise.resolve({ clips: {} }),
  ]);

  const root = gltf.scene;
  prepareMaterials(root);
  const holder = new THREE.Group();     // centres the model and stands it on the grid
  holder.add(root);

  const clips = new Map();
  for (const c of gltf.animations) {
    const m = /^anim-(\d+)$/.exec(c.name);
    if (m) clips.set(Number(m[1]), c);
  }
  // The root joint is the one child of the DW1_FIX node the asset build inserts; it is the
  // node that carries each clip's root motion.
  const fix = root.getObjectByName('DW1_FIX');
  const entry = { key: meta.key, v: meta, d, holder, root, clips, events: events.clips || {},
                  rootJoint: fix && fix.children[0] ? fix.children[0] : null,
                  mixer: new THREE.AnimationMixer(root), rest: captureRest(root), placed: false };
  entry.player = new Player(entry, { onEvent: (i) => { if (current === entry) ui.flashEvent(i); } });

  cache.set(meta.key, entry);
  while (cache.size > CACHE_SIZE) {
    const [k, e] = cache.entries().next().value;
    cache.delete(k);
    if (e === current || e === entry) { cache.set(k, e); continue; }
    dispose(e);
  }
  return entry;
}

function dispose(e) {
  e.mixer.stopAllAction();
  e.mixer.uncacheRoot(e.root);
  e.root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    for (const m of [].concat(o.material)) {
      for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
      m.dispose();
    }
  });
}

// PS1 atlases are tiny and indexed. Any filtering smears the palette, so pin nearest on
// both filters and skip mipmaps entirely -- a mipmapped minFilter still blurs at distance.
function prepareMaterials(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material)) {
      if (m.map) {
        m.map.magFilter = THREE.NearestFilter;
        m.map.minFilter = THREE.NearestFilter;
        m.map.generateMipmaps = false;
        m.map.anisotropy = 1;
        m.map.needsUpdate = true;
      }
      m.userData.baseSide = m.side;
      m.userData.baseDepthWrite = m.depthWrite;
    }
  });
}

function applyMaterialToggles(entry) {
  entry.root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material)) {
      m.side = settings.doubleSided ? THREE.DoubleSide : m.userData.baseSide;
      m.depthWrite = m.transparent && settings.depthWrite ? true : m.userData.baseDepthWrite;
      m.needsUpdate = true;
    }
  });
}

// Centre the model over the origin and stand it on the grid, measured once, on the clip
// it opens with at t=0 -- the same pose the build measured heightM on. Measuring per clip
// would make the model hop sideways every time the clip changed.
function place(entry) {
  const first = firstOn(entry.d, entry.key);
  if (first) entry.player.select({ ...first, s: first.on[entry.key] });
  entry.holder.position.set(0, 0, 0);
  entry.holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(entry.root);
  if (box.isEmpty()) return;
  const c = box.getCenter(new THREE.Vector3());
  entry.holder.position.set(-c.x, -box.min.y, -c.z);
  entry.holder.updateMatrixWorld(true);
  entry.box = new THREE.Box3().setFromObject(entry.root);
  entry.placed = true;
}

// Fit the model and the reference cube into the band the chrome leaves free, keeping
// whatever orbit angle the user has chosen unless asked to reset it.
function frame(entry, resetDir) {
  if (!entry || !entry.box) return;
  const box = entry.box.clone().union(new THREE.Box3().setFromObject(refCube));
  const sphere = box.getBoundingSphere(new THREE.Sphere());

  const dir = resetDir ? DEFAULT_DIR.clone()
    : camera.position.clone().sub(controls.target).normalize();
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const topPx = ui.topHeight;
  const botPx = ui.sheetHeight;
  const bandPx = Math.max(innerHeight * 0.3, innerHeight - topPx - botPx);
  const halfV = Math.atan(Math.tan(vFov / 2) * (bandPx / innerHeight));
  const halfH = Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const d = (sphere.radius / Math.sin(Math.min(halfV, halfH))) * 1.02;

  // Aim off-centre so the model sits in the middle of the free band, not behind the rows.
  const right = new THREE.Vector3().crossVectors(camera.up, dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();
  const dyPx = (topPx + bandPx / 2) - innerHeight / 2;
  const worldPerPx = (2 * d * Math.tan(vFov / 2)) / innerHeight;
  const aim = sphere.center.clone().addScaledVector(up, dyPx * worldPerPx);

  camera.position.copy(aim).addScaledVector(dir, d);
  controls.target.copy(aim);
  controls.update();
}

// With "in place" off, carry the camera along with the root joint on the ground plane so a
// travelling clip stays in frame and the grid slides underneath to show the distance.
// The reference cube is deliberately left behind as a fixed landmark.
let followPrev = null;
const followNow = new THREE.Vector3();
function followRoot() {
  if (settings.inPlace || !current || !current.rootJoint) { followPrev = null; return; }
  current.rootJoint.getWorldPosition(followNow);
  if (followPrev) {
    const dx = followNow.x - followPrev.x;
    const dz = followNow.z - followPrev.z;
    camera.position.x += dx; camera.position.z += dz;
    controls.target.x += dx; controls.target.z += dz;
  } else {
    followPrev = new THREE.Vector3();
  }
  followPrev.copy(followNow);
}

function positionRefCube(entry) {
  const box = entry.box;
  refCube.position.set(box ? box.min.x - 0.85 : -1.5, 0.5, 0);
}

// ---------------------------------------------------------------------------------

// Open a Digimon. Without a variant it opens on the main model, unless the requested clip
// only exists on an NPC variant.
async function show(id, { variant, clip } = {}) {
  const d = byId.get(id);
  if (!d) return;
  if (d !== currentD) { currentD = d; currentClip = null; ui.setDigimon(d); }
  const main = d.variants[0].key;
  let vkey = main;
  if (variant && d.variants.some((v) => v.key === variant)) vkey = variant;
  else if (clip && clip.on[main] == null) vkey = clip.v || Object.keys(clip.on)[0];
  await useVariant(vkey, clip);
}

// Put one of the current Digimon's variants on screen, then play `clip` on it (or the
// variant's first clip when it cannot play that one).
async function useVariant(vkey, clip) {
  const d = currentD;
  const v = d.variants.find((x) => x.key === vkey);
  if (!v) return;
  const token = ++reqToken;
  ui.setVariant(v, false);

  let entry;
  try {
    entry = await loadModel(d, v, token);
  } catch (err) {
    if (token === reqToken) ui.setStatus(`failed to load ${v.glb}: ${err.message || err}`);
    console.error(err);
    return;
  }
  if (token !== reqToken) return;          // the user has already moved on
  ui.setStatus('');

  if (current && current !== entry) scene.remove(current.holder);
  current = entry;
  scene.add(entry.holder);
  applyMaterialToggles(entry);
  if (!entry.placed) place(entry);
  positionRefCube(entry);

  const p = entry.player;
  p.speed = settings.speed;
  p.useLoop = settings.loop;
  p.inPlace = settings.inPlace;
  p.paused = false;

  ui.setVariant(v, true);
  playClip(clip && clip.on[vkey] != null ? clip : firstOn(d, vkey));

  frame(entry, !framedOnce);
  framedOnce = true;
}

// Play a merged clip. If the variant on screen cannot play it, switch to one that can:
// the clip's own variant for NPC-only clips, otherwise the main model.
function playClip(clip) {
  if (!clip || !current || !currentD) return;
  const slot = clip.on[current.key];
  if (slot == null) {
    const main = currentD.variants[0].key;
    useVariant(clip.v || (clip.on[main] != null ? main : Object.keys(clip.on)[0]), clip);
    return;
  }
  if (!current.player.select({ ...clip, s: slot })) return;
  currentClip = clip;
  ui.setClip(clip, slot, current.v, current.player.timeline, current.player.travel(slot));
  history.replaceState(null, '', `#${current.key}/${slot}`);
  followPrev = null;
}

function stepClip(dir) {
  if (!currentD) return;
  const clips = currentD.clips;
  const i = clips.indexOf(currentClip);
  playClip(clips[(Math.max(i, 0) + dir + clips.length) % clips.length]);
}

function togglePlay() {
  if (!current) return;
  current.player.paused = !current.player.paused;
}

// ---------------------------------------------------------------------------------

async function boot() {
  let manifest;
  try {
    manifest = await fetchJSON(`${BASE}manifest.json`);
  } catch (err) {
    document.getElementById('modelLine').textContent = `manifest failed: ${err.message}`;
    throw err;
  }
  byId = new Map(manifest.digimon.map((d) => [d.id, d]));
  byVariant = new Map(manifest.digimon.flatMap((d) => d.variants.map((v) => [v.key, { d, v }])));
  droppedMap = new Map((manifest.dropped || []).map((x) => [x.key, x]));

  ui = new UI(manifest, {
    onDigimon: (id) => show(id),
    onClip: (c) => playClip(c),
    onVariant: (k) => useVariant(k, currentClip && currentClip.on[k] != null ? currentClip : null),
    onPlayPause: togglePlay,
    onSeek: (f) => current && current.player.seek(f * current.player.duration),
    onSpeed: (x) => { settings.speed = x; if (current) current.player.speed = x; },
    onToggle: (name, v) => {
      settings[name] = v;
      if (name === 'loop' && current) current.player.useLoop = v;
      if (name === 'inPlace' && current) {
        current.player.inPlace = v;
        current.player.pose();
        followPrev = null;
        if (v) frame(current, false);    // coming back from travel: re-centre on the model
      }
      if (name === 'turntable') controls.autoRotate = v;
      if ((name === 'doubleSided' || name === 'depthWrite') && current) applyMaterialToggles(current);
    },
    onResetView: () => frame(current, true),
    onLayout: () => frame(current, false),
  });

  if (!(await openHash())) await show(byId.has('AGUM') ? 'AGUM' : manifest.digimon[0].id);

  // A hash-only navigation does not reload the page, so a link pasted into an open
  // harness would otherwise be ignored.
  addEventListener('hashchange', () => { openHash(); });
}

// Deep links: #GREY/27 opens straight onto a clip, which is how a slot gets shared while
// working out what it is. The code names a variant and the slot is that file's own slot,
// so a link never has to know how clips were merged. A code that was merged away (#EANG/0)
// still resolves, through its slot map, to the matching clip on the main model.
function parseHash() {
  const [k, s] = decodeURIComponent(location.hash.slice(1)).split('/');
  const key = (k || '').toUpperCase();
  const slot = s != null && s !== '' && Number.isFinite(Number(s)) ? Number(s) : null;
  const hit = byVariant.get(key);
  if (hit) return { d: hit.d, variant: key, slot };
  const gone = droppedMap.get(key);
  if (!gone || !byVariant.has(gone.into)) return null;
  const mapped = slot != null && gone.slots[slot] != null ? gone.slots[slot] : null;
  return { d: byVariant.get(gone.into).d, variant: gone.into, slot: mapped };
}

async function openHash() {
  const h = parseHash();
  if (!h) return false;
  const clip = h.slot != null ? h.d.clips.find((c) => c.on[h.variant] === h.slot) || null : null;
  if (h.d !== currentD) await show(h.d.id, { variant: h.variant, clip });
  else if (!current || current.key !== h.variant) await useVariant(h.variant, clip);
  else if (clip && clip !== currentClip) playClip(clip);
  return true;
}

addEventListener('keydown', (e) => {
  if (!ui || ui.filterFocused) return;
  if (e.key === ' ') { togglePlay(); e.preventDefault(); }
  else if (e.key === 'ArrowRight') ui.step(1);
  else if (e.key === 'ArrowLeft') ui.step(-1);
  else if (e.key === 'ArrowDown') { stepClip(1); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { stepClip(-1); e.preventDefault(); }
  else if (e.key === 'r' || e.key === 'R') frame(current, true);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  frame(current, false);
});

// THREE.Timer replaces the deprecated Clock in r184. connect() pauses it while the page
// is hidden, so a backgrounded tab does not come back with one enormous delta.
const timer = new THREE.Timer();
timer.connect(document);
renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  // Clamped too, for the frame after a long stall.
  const dt = Math.min(timer.getDelta(), 0.1);
  if (current) {
    const p = current.player;
    p.tick(dt);
    ui.setTime(p.time, p.duration, p.loops, p.paused);
    followRoot();
  }
  controls.update();
  renderer.render(scene, camera);
});

// Debug handle for driving the harness from the console.
window.__t = {
  THREE, scene, camera, controls, refCube, settings, cache,
  get current() { return current; },
  get player() { return current && current.player; },
  get digimon() { return currentD; },
  get clip() { return currentClip; },
  show, useVariant, playClip, frame: (reset) => frame(current, reset),
};

boot();
