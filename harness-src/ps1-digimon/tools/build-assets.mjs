#!/usr/bin/env node
// Converts DW1ModelConverter's glTF output into what the ps1-digimon harness loads:
//   models/<CODE>.glb      optimised, axis-corrected geometry + animation
//   events/<CODE>.json     per-clip sound cues and texture-swap (blink) events
//   manifest.json          model list, labels, clip slots, durations, loop ranges
//
// Order matters. Animation extras (loop range, sounds, texture events) are harvested
// BEFORE any transform, for two reasons: three.js's GLTFLoader never copies
// animation-level extras onto AnimationClip, so they would be lost at runtime anyway;
// and the resample below rewrites every sampler.
//
// Never run `gltf-transform optimize` over these files. Its defaults join and flatten
// the node hierarchy that IS the rig, simplify the PS1 silhouettes, and recompress the
// indexed-colour atlases. Only the individual functions used below are safe.
//
// Usage:
//   node tools/build-assets.mjs [--only AGUM,GREY] [--dry-run] [--no-hoist]
//                               [--tol-t 0.05] [--tol-r 0.06] [--tol-s 1e-4]
//                               [--src dir] [--names README.md] [--out dir]

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { Logger, NodeIO, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, unpartition } from '@gltf-transform/functions';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DW1 = 'A:/Intentional_Sports/eSports_Academy/Roblox/SynthCity_Interactive/rom_hacks/digimon';

const args = parseArgs(process.argv.slice(2));
const SRC = args.src ?? `${DW1}/converted/output/digimon`;
const NAMES = args.names ?? `${DW1}/DW1ModelConverter-main/README.md`;
const OUT = path.resolve(args.out ?? path.join(HERE, '../../../public/harness/ps1-digimon'));
const ONLY = args.only ? new Set(String(args.only).split(',').map((s) => s.trim().toUpperCase())) : null;
const DRY = !!args['dry-run'];
const HOIST = !args['no-hoist'];

// Per-path tolerances. The units are mixed, so one number cannot serve all three:
// translations are raw PS1 units (magnitudes into the hundreds), rotations are unit
// quaternions, scales hover around 1.
const TOL = {
  translation: num(args['tol-t'], 0.05),                  // raw units; 0.05 = 0.2 mm at 1/256
  rotation: (num(args['tol-r'], 0.06) * Math.PI) / 180,   // given in degrees, used in radians
  scale: num(args['tol-s'], 1e-4),
};

// Raw PS1 units to metres. 256 per metre puts a rookie a little over a metre tall.
const SCALE = 1 / 256;

// WARN, not the default INFO: prune otherwise logs a line per model into the progress bar.
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).setLogger(new Logger(Logger.Verbosity.WARN));

// ---------------------------------------------------------------------------------
// Name table
// ---------------------------------------------------------------------------------

function parseNameMap(md) {
  const at = md.indexOf('### Name Mapping');
  if (at < 0) throw new Error(`no "### Name Mapping" section in ${NAMES}`);
  const fence = md.slice(at).match(/```[^\n]*\n([\s\S]*?)```/);
  if (!fence) throw new Error(`no fenced table after "### Name Mapping" in ${NAMES}`);
  const map = {};
  for (const m of fence[1].matchAll(/^([A-Z0-9_]{3,6})\s*->\s*(.+?)\s*$/gm)) {
    // "(NPC)" is usually last, but not always: the README has
    // `EMTM -> MetalMamemon (NPC) ("MetalGreymon")`. Any other parenthetical is the
    // README author's note -- kept verbatim as `note`, not interpreted.
    let rest = m[2];
    const npc = /\(NPC\)/i.test(rest);
    rest = rest.replace(/\s*\(NPC\)/gi, '');
    const notes = [...rest.matchAll(/\(([^)]*)\)/g)].map((n) => n[1].replace(/^["']|["']$/g, '').trim());
    const label = rest.replace(/\s*\([^)]*\)/g, '').trim();
    map[m[1]] = notes.length ? { label, npc, note: notes.join('; ') } : { label, npc };
  }
  return map;
}

// The README lives on the A: drive next to the converter. A committed copy of the parsed
// table means a re-run on a machine without that drive still produces labels.
function loadNames() {
  const cache = path.join(HERE, 'name-map.json');
  if (fs.existsSync(NAMES)) {
    const map = parseNameMap(fs.readFileSync(NAMES, 'utf8'));
    if (!DRY) fs.writeFileSync(cache, JSON.stringify(map, null, 2) + '\n');
    return map;
  }
  if (fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache, 'utf8'));
  throw new Error(`name table unavailable: neither ${NAMES} nor ${cache} exists`);
}

// ---------------------------------------------------------------------------------
// Small maths
// ---------------------------------------------------------------------------------

const SIZE = { translation: 3, rotation: 4, scale: 3 };
const IDENTITY = { translation: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1] };

function valueAt(values, n, i) {
  const out = new Array(n);
  for (let c = 0; c < n; c++) out[c] = values[i * n + c];
  return out;
}

function lerp(a, b, t) {
  return a.map((v, c) => v + (b[c] - v) * t);
}

// Shortest-path slerp, matching three's Quaternion.slerpFlat, which is what the harness
// will actually use to interpolate between the keys we keep.
function slerp(a, b, t) {
  let [bx, by, bz, bw] = b;
  let dot = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
  if (dot < 0) { dot = -dot; bx = -bx; by = -by; bz = -bz; bw = -bw; }
  let s0 = 1 - t;
  let s1 = t;
  if (dot < 0.9995) {
    const theta = Math.acos(Math.min(1, dot));
    const sin = Math.sin(theta);
    s0 = Math.sin(s0 * theta) / sin;
    s1 = Math.sin(s1 * theta) / sin;
  }
  const q = [a[0] * s0 + bx * s1, a[1] * s0 + by * s1, a[2] * s0 + bz * s1, a[3] * s0 + bw * s1];
  const len = Math.hypot(...q) || 1;
  return q.map((v) => v / len);
}

function quatAngle(a, b) {
  const la = Math.hypot(...a) || 1;
  const lb = Math.hypot(...b) || 1;
  const dot = Math.abs((a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]) / (la * lb));
  return 2 * Math.acos(Math.min(1, dot));
}

function close(pathName, a, b) {
  if (pathName === 'rotation') return quatAngle(a, b) <= TOL.rotation;
  const tol = TOL[pathName];
  for (let c = 0; c < a.length; c++) if (Math.abs(a[c] - b[c]) > tol) return false;
  return true;
}

// ---------------------------------------------------------------------------------
// Keyframe reduction
// ---------------------------------------------------------------------------------

// The value every key of a channel holds, or null if it moves.
function constantValue(channel) {
  const pathName = channel.getTargetPath();
  const n = SIZE[pathName];
  if (!n) return null;
  const out = channel.getSampler().getOutput().getArray();
  const count = out.length / n;
  const first = valueAt(out, n, 0);
  for (let i = 1; i < count; i++) if (!close(pathName, first, valueAt(out, n, i))) return null;
  return first;
}

// Greedy polyline simplification with a guaranteed error bound: a key is dropped only if
// the interpolant between the surviving neighbours reproduces EVERY key it spans within
// tolerance. Checking only the immediate neighbour lets error accumulate across a run of
// dropped keys. Because rotations use shortest-path slerp, any span wide enough for
// slerp to take the wrong way round fails the check and keeps its keys -- so this never
// makes the converter's existing >180 degree limitation worse.
function simplify(times, values, n, pathName, interp) {
  const count = times.length;
  if (count <= 2 || interp === 'CUBICSPLINE') return null;

  const key = (i) => valueAt(values, n, i);
  const interpolate = (a, b, t) => {
    if (interp === 'STEP') return key(a);
    const u = (t - times[a]) / (times[b] - times[a] || 1);
    return pathName === 'rotation' ? slerp(key(a), key(b), u) : lerp(key(a), key(b), u);
  };
  const spanOk = (a, b) => {
    for (let k = a + 1; k < b; k++) if (!close(pathName, interpolate(a, b, times[k]), key(k))) return false;
    return true;
  };

  const keep = [0];
  let a = 0;
  for (let j = 2; j < count; j++) {
    if (!spanOk(a, j)) { keep.push(j - 1); a = j - 1; }
  }
  keep.push(count - 1);
  if (keep.length === count) return null;

  const t = new Float32Array(keep.length);
  const v = new Float32Array(keep.length * n);
  keep.forEach((src, dst) => {
    t[dst] = times[src];
    for (let c = 0; c < n; c++) v[dst * n + c] = values[src * n + c];
  });
  return { times: t, values: v };
}

// ---------------------------------------------------------------------------------
// Per-model conversion
// ---------------------------------------------------------------------------------

const r4 = (x) => Math.round(x * 1e4) / 1e4;
const byT = (a, b) => a.t - b.t;

function clipDuration(anim) {
  let d = 0;
  for (const s of anim.listSamplers()) {
    const t = s.getInput().getArray();
    if (t.length) d = Math.max(d, t[t.length - 1]);
  }
  return d;
}

// Height in metres, posed on the clip the harness opens with. Every node here sits at
// identity until a clip drives it, so measuring the rest pose would measure a heap of
// meshes at the origin, not the model.
function measureHeight(root, anim) {
  const saved = new Map();
  for (const node of root.listNodes()) {
    saved.set(node, [node.getTranslation(), node.getRotation(), node.getScale()]);
  }
  if (anim) {
    for (const ch of anim.listChannels()) {
      const node = ch.getTargetNode();
      const p = ch.getTargetPath();
      const n = SIZE[p];
      if (!node || !n) continue;
      const v = valueAt(ch.getSampler().getOutput().getArray(), n, 0);
      if (p === 'translation') node.setTranslation(v);
      else if (p === 'rotation') node.setRotation(v);
      else node.setScale(v);
    }
  }

  let lo = Infinity;
  let hi = -Infinity;
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const mn = pos.getMin([]);
      const mx = pos.getMax([]);
      for (const x of [mn[0], mx[0]]) for (const y of [mn[1], mx[1]]) for (const z of [mn[2], mx[2]]) {
        const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
        lo = Math.min(lo, wy);
        hi = Math.max(hi, wy);
      }
    }
  }

  for (const [node, [t, r, s]] of saved) node.setTranslation(t).setRotation(r).setScale(s);
  return Number.isFinite(lo) ? r4((hi - lo) * SCALE) : 0;
}

function glbChunks(glb) {
  const dv = new DataView(glb.buffer, glb.byteOffset, glb.byteLength);
  const jsonLen = dv.getUint32(12, true);
  const binLen = glb.byteLength > 20 + jsonLen ? dv.getUint32(20 + jsonLen, true) : 0;
  return { json: jsonLen, bin: binLen };
}

async function convert(file, names, stats) {
  const key = path.basename(file, '.gltf').toUpperCase();
  const name = names[key];
  if (!name || !name.label) throw new Error(`${key}: no label in the name table`);

  const doc = await io.read(file);
  const root = doc.getRoot();
  const anims = root.listAnimations();

  // -- 1. harvest, before anything is rewritten ---------------------------------
  const clips = [];
  const events = {};
  const bySlot = new Map();
  for (const anim of anims) {
    const m = /^anim-(\d+)$/.exec(anim.getName());
    if (!m) { stats.warnings.push(`${key}: animation "${anim.getName()}" is not anim-<slot>`); continue; }
    const s = Number(m[1]);
    bySlot.set(s, anim);
    const ex = anim.getExtras() || {};
    const d = clipDuration(anim);

    let l = null;
    if (ex.endlessStart != null && ex.endlessEnd != null) {
      const a = parseFloat(ex.endlessStart);
      const b = parseFloat(ex.endlessEnd);
      if (Number.isFinite(a) && Number.isFinite(b) && b > a) {
        if (b > d + 1e-4) stats.loopsClamped++;
        l = [r4(a), r4(Math.min(b, d))];
      } else {
        stats.loopsDegenerate++;
      }
    }

    const sounds = (ex.sounds || [])
      .map((e) => ({ t: r4(e.time), soundId: e.soundId, vabId: e.vabId }))
      .sort(byT);
    // The converter spells the source X key 'srxX'. Normalised here and nowhere else.
    const blinks = (ex.textures || [])
      .map((e) => ({ t: r4(e.time), srcX: e.srcX ?? e.srxX, srcY: e.srcY,
                     destX: e.destX, destY: e.destY, w: e.width, h: e.height }))
      .sort(byT);

    clips.push({ s, d: r4(d), l, snd: sounds.length, blk: blinks.length });
    if (sounds.length || blinks.length) events[s] = { sounds, blinks };
  }
  clips.sort((a, b) => a.s - b.s);

  // Fingerprint the untouched source, for merging NPC variants into their Digimon. Taken
  // here because everything after this point rewrites samplers.
  const fp = fingerprint(root, bySlot, clips, events);

  const opener = clips.length ? bySlot.get(clips[0].s) : null;
  const heightM = measureHeight(root, opener);

  for (const node of root.listNodes()) {
    const t = node.getTranslation();
    const r = node.getRotation();
    const s = node.getScale();
    if (!close('translation', t, IDENTITY.translation) || !close('rotation', r, IDENTITY.rotation)
        || !close('scale', s, IDENTITY.scale)) stats.nonIdentityRest++;
  }

  // -- 2. hoist node/paths that are the same constant in every clip -------------
  let channelsBefore = 0;
  let keysBefore = 0;
  for (const anim of anims) {
    for (const ch of anim.listChannels()) {
      channelsBefore++;
      keysBefore += ch.getSampler().getInput().getCount();
      stats.interp[ch.getSampler().getInterpolation()] = (stats.interp[ch.getSampler().getInterpolation()] || 0) + 1;
    }
  }

  let hoisted = 0;
  if (HOIST && anims.length) {
    const groups = new Map();   // "nodeIndex|path" -> [{anim, ch, value}]
    const nodes = root.listNodes();
    for (const anim of anims) {
      for (const ch of anim.listChannels()) {
        const node = ch.getTargetNode();
        if (!node || !SIZE[ch.getTargetPath()]) continue;
        const k = `${nodes.indexOf(node)}|${ch.getTargetPath()}`;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push({ anim, ch, value: constantValue(ch) });
      }
    }
    for (const [k, list] of groups) {
      // Every clip must drive this node/path, or the clips that do not would inherit the
      // hoisted value where they previously saw the original rest.
      if (list.length !== anims.length) continue;
      if (new Set(list.map((e) => e.anim)).size !== anims.length) continue;
      const pathName = k.split('|')[1];
      const v0 = list[0].value;
      if (!v0 || !list.every((e) => e.value && close(pathName, e.value, v0))) continue;

      const node = list[0].ch.getTargetNode();
      if (pathName === 'translation') node.setTranslation(v0);
      else if (pathName === 'rotation') node.setRotation(v0);
      else node.setScale(v0);
      for (const { ch } of list) { const smp = ch.getSampler(); ch.dispose(); smp.dispose(); }
      hoisted += list.length;
    }
  }

  // -- 3. drop channels that never leave rest; simplify the rest ----------------
  let dropped = 0;
  for (const anim of anims) {
    for (const ch of anim.listChannels()) {
      const node = ch.getTargetNode();
      const pathName = ch.getTargetPath();
      const n = SIZE[pathName];
      if (!node || !n) continue;
      const smp = ch.getSampler();

      const cv = constantValue(ch);
      const rest = pathName === 'translation' ? node.getTranslation()
        : pathName === 'rotation' ? node.getRotation() : node.getScale();
      if (cv && close(pathName, cv, rest)) { ch.dispose(); smp.dispose(); dropped++; continue; }

      const input = smp.getInput();
      const output = smp.getOutput();
      const reduced = simplify(input.getArray(), output.getArray(), n, pathName, smp.getInterpolation());
      if (!reduced) continue;
      smp.setInput(doc.createAccessor().setType('SCALAR').setArray(reduced.times).setBuffer(input.getBuffer()));
      smp.setOutput(doc.createAccessor().setType(n === 4 ? 'VEC4' : 'VEC3')
        .setArray(reduced.values).setBuffer(output.getBuffer()));
    }
  }

  // A clip whose every channel was dropped would vanish from GLTFLoader's output and take
  // its slot with it. Keep one no-op track spanning the original duration.
  for (const c of clips) {
    const anim = bySlot.get(c.s);
    if (anim.listChannels().length) continue;
    const node = root.listNodes().find((nd) => !nd.getMesh()) || root.listNodes()[0];
    const buffer = root.listBuffers()[0];
    const smp = doc.createAnimationSampler()
      .setInput(doc.createAccessor().setType('SCALAR').setArray(new Float32Array([0, c.d])).setBuffer(buffer))
      .setOutput(doc.createAccessor().setType('VEC3')
        .setArray(new Float32Array([...node.getScale(), ...node.getScale()])).setBuffer(buffer))
      .setInterpolation('LINEAR');
    anim.addSampler(smp).addChannel(doc.createAnimationChannel()
      .setTargetNode(node).setTargetPath('scale').setSampler(smp));
    stats.emptyClipGuards++;
  }

  let channelsAfter = 0;
  let keysAfter = 0;
  for (const anim of anims) {
    for (const ch of anim.listChannels()) {
      channelsAfter++;
      keysAfter += ch.getSampler().getInput().getCount();
    }
  }

  // -- 4. drop the unused skin, strip harvested extras --------------------------
  // No node references it (skin: null everywhere, no JOINTS_0/WEIGHTS_0, no inverse
  // bind matrices), so three.js would ignore it; it is only weight.
  root.listSkins().forEach((s) => s.dispose());
  for (const anim of anims) anim.setExtras({});
  root.setExtras({});

  // -- 5. bake axis and scale as an inserted root --------------------------------
  // PS1 Y points down. three.js is Y-up like glTF and does no import conversion, so a
  // single 180 degree turn about X lands the model upright. Inserted as a PARENT rather
  // than written onto existing nodes, because every node's transform is animation-
  // driven and would be overwritten at playback. A uniform scale cannot flip normals.
  const scene = root.listScenes()[0];
  const fix = doc.createNode('DW1_FIX').setRotation([1, 0, 0, 0]).setScale([SCALE, SCALE, SCALE]);
  for (const child of scene.listChildren()) { scene.removeChild(child); fix.addChild(child); }
  scene.addChild(fix);

  // -- 6. consolidate and write --------------------------------------------------
  // The source carries one buffer per accessor; GLB can hold exactly one.
  await doc.transform(
    unpartition(),
    dedup({ propertyTypes: [PropertyType.ACCESSOR] }),
    // Nodes are excluded: a node whose channels were all dropped in one clip may still
    // be driven by another, and removing it would change what the channels bind to.
    prune({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.BUFFER, PropertyType.TEXTURE,
                            PropertyType.MATERIAL, PropertyType.SKIN], keepLeaves: true }),
  );
  root.getAsset().generator = 'ps1-digimon harness build-assets.mjs (from DW1ModelConverter v1.2.0)';

  const glb = await io.writeBinary(doc);

  const materials = root.listMaterials();
  const tex = root.listTextures()[0];
  const entry = {
    key,
    label: name.label,
    npc: name.npc,
    ...(name.note ? { note: name.note } : {}),
    glb: `models/${key}.glb`,
    events: Object.keys(events).length ? `events/${key}.json` : null,
    bytes: glb.byteLength,
    heightM,
    nodes: root.listNodes().length - 1,              // excluding DW1_FIX
    meshes: root.listMeshes().length,
    alphaModes: [...new Set(materials.map((m) => m.getAlphaMode()))].sort(),
    blendModes: [...new Set(materials.map((m) => m.getExtras()?.blendMode).filter((v) => v != null))].sort(),
    unlit: materials.some((m) => m.getExtension('KHR_materials_unlit')),
    atlas: tex?.getSize() ?? null,
    clips,
  };

  const chunks = glbChunks(glb);
  stats.rows.push({ key, src: fs.statSync(file).size, glb: glb.byteLength, json: chunks.json, bin: chunks.bin,
                    channelsBefore, channelsAfter, keysBefore, keysAfter, hoisted, dropped, heightM,
                    clips: clips.length });

  return { entry, glb, events: Object.keys(events).length ? { key, clips: events } : null, fp };
}

// ---------------------------------------------------------------------------------
// NPC variants
// ---------------------------------------------------------------------------------

const bytesOf = (arr) => Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);

// What it takes to decide whether an NPC variant adds anything over its main model:
// per-attribute geometry hashes, the decoded atlas, and per clip a hash of the raw
// keyframes plus the metadata the harness shows.
function fingerprint(root, bySlot, clips, events) {
  const attr = {};
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      for (const sem of prim.listSemantics().sort()) {
        (attr[sem] ||= createHash('sha1')).update(bytesOf(prim.getAttribute(sem).getArray()));
      }
      const idx = prim.getIndices();
      if (idx) (attr.indices ||= createHash('sha1')).update(bytesOf(idx.getArray()));
    }
  }
  const geometry = Object.fromEntries(Object.entries(attr).map(([k, h]) => [k, h.digest('hex')]));

  const img = root.listTextures()[0]?.getImage();
  const png = img ? PNG.sync.read(Buffer.from(img)) : null;

  const nodes = root.listNodes();
  const clipFp = new Map();
  for (const c of clips) {
    const chans = bySlot.get(c.s).listChannels()
      .map((ch) => ({ n: nodes.indexOf(ch.getTargetNode()), p: ch.getTargetPath(), s: ch.getSampler() }))
      .sort((a, b) => a.n - b.n || a.p.localeCompare(b.p));
    const h = createHash('sha1');
    for (const ch of chans) {
      h.update(`${ch.n}|${ch.p}|`);
      h.update(bytesOf(ch.s.getInput().getArray()));
      h.update(bytesOf(ch.s.getOutput().getArray()));
    }
    const ev = events[c.s] || { sounds: [], blinks: [] };
    clipFp.set(c.s, { hash: h.digest('hex'), l: JSON.stringify(c.l), sounds: ev.sounds.map((e) => JSON.stringify(e)),
                      blinks: JSON.stringify(ev.blinks) });
  }
  return { geometry, png, clips: clipFp };
}

// Compare one NPC variant against its main model. A variant clip duplicates a main clip
// when the keyframes are byte-identical, the loop range and blink events match, and its
// sound cues are a subset of the main's. The subset case is real: 12 NPC copies lack a
// bank-3 cue the main keeps, and never the reverse, so the main is the fuller version.
function compareVariant(v, main) {
  const why = [];
  const geoDiff = Object.keys({ ...v.fp.geometry, ...main.fp.geometry })
    .filter((k) => v.fp.geometry[k] !== main.fp.geometry[k]);
  if (geoDiff.includes('POSITION')) why.push('different shape');
  else if (geoDiff.includes('TEXCOORD_0')) why.push('different UV mapping');
  else if (geoDiff.length) why.push('different normals');

  // Only pixels drawn in both atlases count. A pixel transparent in one and not the other
  // is a spare blink frame the converter left without a palette because the variant has
  // fewer clips -- the mesh never samples it, so it renders the same.
  let recoloured = 0;
  const a = v.fp.png;
  const b = main.fp.png;
  if (a && b && a.width === b.width && a.height === b.height) {
    for (let i = 0; i < a.data.length; i += 4) {
      if (a.data[i + 3] === 0 || b.data[i + 3] === 0) continue;
      if (a.data[i] !== b.data[i] || a.data[i + 1] !== b.data[i + 1] || a.data[i + 2] !== b.data[i + 2]) recoloured++;
    }
  } else if (a || b) {
    recoloured = -1;
  }
  if (recoloured) why.push('recoloured');

  const byHash = new Map();
  for (const [s, c] of main.fp.clips) {
    if (!byHash.has(c.hash)) byHash.set(c.hash, []);
    byHash.get(c.hash).push(s);
  }
  const alias = new Map();       // variant slot -> main slot
  const own = [];
  let soundSubsets = 0;
  for (const [s, c] of v.fp.clips) {
    const candidates = byHash.get(c.hash) || [];
    const ordered = candidates.includes(s) ? [s, ...candidates.filter((x) => x !== s)] : candidates;
    const match = ordered.find((ms) => {
      const m = main.fp.clips.get(ms);
      return m.l === c.l && m.blinks === c.blinks && c.sounds.every((x) => m.sounds.includes(x));
    });
    if (match == null) { own.push(s); continue; }
    alias.set(s, match);
    if (c.sounds.length < main.fp.clips.get(match).sounds.length) soundSubsets++;
  }
  if (own.length) why.push(`+${own.length} clip${own.length > 1 ? 's' : ''}`);
  return { why, alias, own, soundSubsets, keep: why.length > 0 };
}

// ---------------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------------

async function main() {
  const names = loadNames();
  const codeOf = (f) => path.basename(f, '.gltf').toUpperCase();
  // --only expands to whole Digimon: a variant cannot be judged without its main model.
  const wantedLabels = ONLY ? new Set([...ONLY].map((k) => names[k]?.label).filter(Boolean)) : null;
  const files = fs.readdirSync(SRC)
    .filter((f) => f.toLowerCase().endsWith('.gltf'))
    .filter((f) => !wantedLabels || wantedLabels.has(names[codeOf(f)]?.label))
    .sort();
  if (!files.length) throw new Error(`no .gltf files matched in ${SRC}`);

  const missing = files.map(codeOf).filter((k) => !names[k]);
  if (missing.length) throw new Error(`no label for: ${missing.join(', ')}`);

  const stats = { rows: [], warnings: [], interp: {}, nonIdentityRest: 0, loopsDegenerate: 0,
                  loopsClamped: 0, emptyClipGuards: 0 };
  const results = [];
  const t0 = Date.now();

  for (const [i, f] of files.entries()) {
    results.push(await convert(path.join(SRC, f), names, stats));
    const r = stats.rows[stats.rows.length - 1];
    process.stdout.write(`\r[${i + 1}/${files.length}] ${r.key.padEnd(5)} ${mb(r.src)} -> ${mb(r.glb)}   `);
  }
  process.stdout.write('\n\n');

  // -- one entry per Digimon ------------------------------------------------------
  // The game ships trimmed copies of many models for NPC and enemy appearances. A copy
  // that adds nothing -- same mesh, same colours, every clip a duplicate -- is dropped.
  // One that adds anything becomes a variant of its Digimon, and only its own clips are
  // appended to the Digimon's clip list.
  const groups = new Map();
  for (const r of results) {
    if (!groups.has(r.entry.label)) groups.set(r.entry.label, []);
    groups.get(r.entry.label).push(r);
  }

  const digimon = [];
  const dropped = [];
  const toWrite = [];
  for (const [label, group] of groups) {
    const mains = group.filter((r) => !r.entry.npc);
    if (mains.length !== 1) throw new Error(`${label}: expected exactly one non-NPC model, found ${mains.length}`);
    const main = mains[0];
    const clips = main.entry.clips.map((c) => ({ ...c, on: { [main.entry.key]: c.s } }));
    const bySlot = new Map(clips.map((c) => [c.s, c]));
    const variants = [variantEntry(main.entry, [])];
    toWrite.push(main);

    for (const v of group.filter((r) => r.entry.npc).sort((a, b) => a.entry.key.localeCompare(b.entry.key))) {
      const cmp = compareVariant(v, main);
      if (!cmp.keep) {
        dropped.push({ key: v.entry.key, into: main.entry.key, slots: Object.fromEntries(cmp.alias),
                       ...(cmp.soundSubsets ? { soundCuesMissing: cmp.soundSubsets } : {}) });
        continue;
      }
      variants.push(variantEntry(v.entry, cmp.why));
      toWrite.push(v);
      for (const [vs, ms] of cmp.alias) {
        const c = bySlot.get(ms);
        if (c.on[v.entry.key] == null) c.on[v.entry.key] = vs;
      }
      for (const s of cmp.own) {
        const c = v.entry.clips.find((x) => x.s === s);
        clips.push({ v: v.entry.key, ...c, on: { [v.entry.key]: s } });
      }
    }
    digimon.push({ id: main.entry.key, label, variants, clips });
  }
  digimon.sort((a, b) => a.label.localeCompare(b.label));

  if (!DRY) {
    fs.mkdirSync(path.join(OUT, 'models'), { recursive: true });
    fs.mkdirSync(path.join(OUT, 'events'), { recursive: true });
    const keep = new Set();
    for (const r of toWrite) {
      fs.writeFileSync(path.join(OUT, r.entry.glb), r.glb);
      keep.add(r.entry.glb);
      if (r.events) { fs.writeFileSync(path.join(OUT, r.entry.events), JSON.stringify(r.events)); keep.add(r.entry.events); }
    }
    // Remove files an earlier run wrote for variants that are now dropped. Only on a full
    // run: a partial --only run must not delete everything it did not touch.
    if (!ONLY) {
      for (const dir of ['models', 'events']) {
        for (const f of fs.readdirSync(path.join(OUT, dir))) {
          if (!keep.has(`${dir}/${f}`) && /\.(glb|json)$/.test(f)) fs.unlinkSync(path.join(OUT, dir, f));
        }
      }
    }

    const files = toWrite.length;
    const manifest = {
      generated: new Date().toISOString(),
      generator: 'harness-src/ps1-digimon/tools/build-assets.mjs',
      source: 'DW1ModelConverter v1.2.0 glTF output, Digimon World (USA) SLUS_010.32',
      notes: {
        axis: 'Baked: an inserted root node DW1_FIX applies a 180 degree rotation about X and a uniform 1/256 scale. Models load Y-up in metres with no runtime correction.',
        rig: 'Rigid hierarchy, not skinned. No JOINTS_0/WEIGHTS_0, no inverse bind matrices. Animations drive node TRS.',
        restPose: 'Nodes carry little or no rest transform. Nothing reads correctly until a clip is playing; restore the loaded rest pose on every clip switch.',
        srcX: "The converter spells the texture-event source X 'srxX'. Normalised to 'srcX' here. Do not 'fix' it in the source files.",
        slots: 'Clip names are anim-<slot>, the original game slot. Sparse and PER FILE: an NPC variant can hold the same animation under a different slot, so never carry a slot number across variants -- use clips[].on.',
        loop: 'l is [start, end] of the section the game loops after the intro, or null when the source gives no loop range.',
        variants: 'One entry per Digimon. variants[0] is the main model. An NPC copy is kept as a further variant only if it has a different mesh, real colour differences, or clips of its own (why says which); copies that add nothing are listed in dropped with their slot map. clips[] is the merged list: main clips first (s is the main slot), then variant-only clips (v names the variant). on maps variant key -> slot in that variant.',
      },
      counts: {
        digimon: digimon.length,
        variants: files,
        clips: digimon.reduce((n, d) => n + d.clips.length, 0),
        dropped: dropped.length,
        bytes: toWrite.reduce((n, r) => n + r.entry.bytes, 0),
      },
      digimon,
      dropped,
    };
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest));
    if (ONLY) console.log('NOTE: --only wrote a manifest containing just those Digimon.');
  }

  report(stats, Date.now() - t0);
  const kept = digimon.flatMap((d) => d.variants.slice(1).map((v) => `${v.key} (${d.label}: ${v.why.join(', ')})`));
  console.log(`\nDigimon ${digimon.length}   variant files ${toWrite.length}   clips after merge `
    + `${digimon.reduce((n, d) => n + d.clips.length, 0)}   dropped ${dropped.length}`
    + `   (${dropped.filter((d) => d.soundCuesMissing).length} of them lacked sound cues the main keeps)`);
  console.log(`kept variants:\n  ${kept.join('\n  ') || '(none)'}`);
  console.log(`dropped: ${dropped.map((d) => d.key).join(', ')}`);
}

function variantEntry(e, why) {
  const { clips, label, ...rest } = e;
  return { ...rest, why };
}

function report(stats, ms) {
  const rows = stats.rows;
  const sum = (k) => rows.reduce((n, r) => n + r[k], 0);
  console.log('code   source      glb    json     bin   ch before->after  keys before->after  hoist  drop  height');
  for (const r of rows) {
    console.log(`${r.key.padEnd(5)} ${mb(r.src)} ${mb(r.glb)} ${mb(r.json)} ${mb(r.bin)}   `
      + `${String(r.channelsBefore).padStart(6)} -> ${String(r.channelsAfter).padEnd(6)} `
      + `${String(r.keysBefore).padStart(8)} -> ${String(r.keysAfter).padEnd(8)} `
      + `${String(r.hoisted).padStart(5)} ${String(r.dropped).padStart(5)}  ${r.heightM.toFixed(2)} m`);
  }
  console.log('');
  console.log(`models ${rows.length}   source ${mb(sum('src'))}   glb ${mb(sum('glb'))}   `
    + `(${(100 * sum('glb') / sum('src')).toFixed(1)}% of source)   json ${mb(sum('json'))}  bin ${mb(sum('bin'))}`);
  console.log(`channels ${sum('channelsBefore')} -> ${sum('channelsAfter')}   keys ${sum('keysBefore')} -> ${sum('keysAfter')}   `
    + `hoisted ${sum('hoisted')}  dropped-at-rest ${sum('dropped')}   hoist ${HOIST ? 'on' : 'off'}`);
  console.log(`interpolation ${JSON.stringify(stats.interp)}   non-identity rest nodes ${stats.nonIdentityRest}   `
    + `degenerate loop ranges ${stats.loopsDegenerate}   clamped ${stats.loopsClamped}   empty-clip guards ${stats.emptyClipGuards}`);
  const hs = rows.map((r) => r.heightM).filter((h) => h > 0);
  if (hs.length) console.log(`height range ${Math.min(...hs).toFixed(2)} - ${Math.max(...hs).toFixed(2)} m`);
  if (stats.warnings.length) console.log(`warnings:\n  ${stats.warnings.join('\n  ')}`);
  console.log(`${(ms / 1000).toFixed(1)} s${DRY ? '   (dry run: nothing written)' : `   -> ${OUT}`}`);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2);
    const next = argv[i + 1];
    if (next != null && !next.startsWith('--')) { out[k] = next; i++; } else out[k] = true;
  }
  return out;
}

function num(v, fallback) {
  const n = Number(v);
  return v == null || v === true || !Number.isFinite(n) ? fallback : n;
}

function mb(bytes) {
  return `${(bytes / 1e6).toFixed(2)}MB`.padStart(8);
}

main().catch((err) => { console.error(`\n${err.stack || err}`); process.exit(1); });
