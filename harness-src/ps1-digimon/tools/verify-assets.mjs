#!/usr/bin/env node
// Cross-checks public/harness/ps1-digimon/ after a build-assets run: the manifest against
// the GLBs and event sidecars actually on disk. Exits non-zero on any mismatch.
//
//   node tools/verify-assets.mjs [--out dir]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--out');
const OUT = path.resolve(i > 0 ? process.argv[i + 1] : path.join(HERE, '../../../public/harness/ps1-digimon'));

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).setLogger(new Logger(Logger.Verbosity.ERROR));
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
const problems = [];
const bad = (msg) => problems.push(msg);

const referenced = new Set();
const animsOf = new Map();       // variant key -> Set of anim names in its GLB
const eventsOf = new Map();      // variant key -> sidecar clips

for (const d of manifest.digimon) {
  if (!d.label) bad(`${d.id}: empty label`);
  if (!d.variants.length || d.variants[0].key !== d.id) bad(`${d.id}: variants[0] is not the main model`);

  for (const v of d.variants) {
    if (!(v.heightM >= 0.3 && v.heightM <= 6)) bad(`${v.key}: heightM ${v.heightM} outside 0.3-6 m`);
    const glbPath = path.join(OUT, v.glb);
    if (!fs.existsSync(glbPath)) { bad(`${v.key}: missing ${v.glb}`); continue; }
    referenced.add(v.glb);
    const size = fs.statSync(glbPath).size;
    if (size !== v.bytes) bad(`${v.key}: manifest bytes ${v.bytes} != file ${size}`);
    const root = (await io.read(glbPath)).getRoot();
    if (!root.listNodes().some((n) => n.getName() === 'DW1_FIX')) bad(`${v.key}: no DW1_FIX root`);
    animsOf.set(v.key, new Set(root.listAnimations().map((a) => a.getName())));
    if (v.events) {
      referenced.add(v.events);
      const ep = path.join(OUT, v.events);
      if (!fs.existsSync(ep)) bad(`${v.key}: missing ${v.events}`);
      else eventsOf.set(v.key, JSON.parse(fs.readFileSync(ep, 'utf8')).clips);
    }
    if (v !== d.variants[0] && !(v.why && v.why.length)) bad(`${v.key}: kept variant with no reason`);
  }

  const keys = new Set(d.variants.map((v) => v.key));
  const reachable = new Map([...keys].map((k) => [k, 0]));
  for (const c of d.clips) {
    const own = c.v || d.id;
    if (c.v && !keys.has(c.v)) bad(`${d.id}: clip names unknown variant ${c.v}`);
    if (c.on[own] !== c.s) bad(`${d.id}: clip ${own} #${c.s} is not on its own variant at its own slot`);
    for (const [k, s] of Object.entries(c.on)) {
      if (!keys.has(k)) { bad(`${d.id}: clip on unknown variant ${k}`); continue; }
      reachable.set(k, reachable.get(k) + 1);
      if (!animsOf.get(k)?.has(`anim-${s}`)) bad(`${d.id}: ${k} has no anim-${s}`);
    }
    // Badges come from the clip's own file; they must agree with that file's sidecar.
    const ev = (eventsOf.get(own) || {})[c.s] || { sounds: [], blinks: [] };
    if ((ev.sounds || []).length !== c.snd) bad(`${own} #${c.s}: ${c.snd} sounds in manifest, ${(ev.sounds || []).length} in sidecar`);
    if ((ev.blinks || []).length !== c.blk) bad(`${own} #${c.s}: ${c.blk} blinks in manifest, ${(ev.blinks || []).length} in sidecar`);
    for (const b of ev.blinks || []) if (b.srcX == null) bad(`${own} #${c.s}: blink without srcX`);
  }
  for (const [k, n] of reachable) if (!n) bad(`${d.id}: variant ${k} plays no clip`);
  for (const [k, names] of animsOf) {
    if (!keys.has(k)) continue;
    const listed = d.clips.filter((c) => c.on[k] != null).length;
    if (listed !== names.size) bad(`${k}: GLB has ${names.size} clips, ${listed} reachable from the merged list`);
  }
}

for (const x of manifest.dropped || []) {
  if (fs.existsSync(path.join(OUT, `models/${x.key}.glb`))) bad(`${x.key}: dropped but models/${x.key}.glb still ships`);
  if (!manifest.digimon.some((d) => d.id === x.into)) bad(`${x.key}: dropped into unknown ${x.into}`);
}
for (const dir of ['models', 'events']) {
  for (const f of fs.readdirSync(path.join(OUT, dir))) {
    if (!referenced.has(`${dir}/${f}`)) bad(`stale file ${dir}/${f} is not in the manifest`);
  }
}

const variants = manifest.digimon.reduce((n, d) => n + d.variants.length, 0);
const clips = manifest.digimon.reduce((n, d) => n + d.clips.length, 0);
const bytes = manifest.digimon.reduce((n, d) => n + d.variants.reduce((m, v) => m + v.bytes, 0), 0);
console.log(`digimon ${manifest.digimon.length}  variants ${variants}  merged clips ${clips}  `
  + `dropped ${(manifest.dropped || []).length}  glb total ${(bytes / 1e6).toFixed(2)} MB`);
if (manifest.digimon.length !== manifest.counts.digimon) bad('counts.digimon disagrees');
if (variants !== manifest.counts.variants) bad('counts.variants disagrees');
if (clips !== manifest.counts.clips) bad('counts.clips disagrees');

if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n  ${problems.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log('OK: every Digimon, variant and merged clip matches the files on disk; nothing stale ships');
