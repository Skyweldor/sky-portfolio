import * as THREE from 'three';

// Capture every node's transform as loaded, before any clip has touched it.
export function captureRest(root) {
  const rest = [];
  root.traverse((o) => rest.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]));
  return rest;
}

export function restoreRest(rest) {
  for (const [o, p, q, s] of rest) { o.position.copy(p); o.quaternion.copy(q); o.scale.copy(s); }
}

// Drives one model's AnimationMixer by hand rather than letting it free-run.
//
// The game loops a SUB-range of many clips (endlessStart..endlessEnd) after playing an
// intro once. AnimationUtils.subclip cannot express that: it works in whole frames, does
// not interpolate at the cut, and throws the intro away. So the time is advanced here,
// written to action.time, and mixer.update(0) re-evaluates the pose at exactly that time
// in the same frame -- no one-frame overshoot at the wrap.
//
// On the rest restore in select(): the asset build drops channels that never leave rest,
// so a clip may not drive every node. Measured on AGUM (43 clip switches), three's own
// stopAllAction() already puts every binding back, because each binding re-saves its
// original state on activation and we always stop before playing. The explicit restore
// is a guard for anything that breaks that assumption -- crossfading, or two actions
// live at once -- not a fix for a drift that happens today.
// Root motion: 1,159 of the 4,843 clips move the root joint more than a metre, and one
// (GREY slot 27) walks 442 m over 226 s. With inPlace on, the root's horizontal
// translation is pinned to where the clip starts, so walks and lunges animate on the
// spot; vertical motion is left alone. The root joint is the child of DW1_FIX, so its
// translation is in raw PS1 units where Y is vertical and X/Z are the ground plane.
export class Player {
  constructor(entry, { onEvent } = {}) {
    this.entry = entry;            // { root, rootJoint, mixer, clips: Map<slot, AnimationClip>, rest, events }
    this.mixer = entry.mixer;
    this.rootJoint = entry.rootJoint || null;
    this.onEvent = onEvent || (() => {});
    this.action = null;
    this.info = null;              // the manifest's clip record: { s, d, l, snd, blk }
    this.timeline = [];
    this.speed = 1;
    this.paused = false;
    this.useLoop = true;           // honour the source loop range when it has one
    this.inPlace = true;
    this.anchor = null;            // root joint position at t=0 of the current clip
    this.prevT = 0;
    this.loops = 0;
    this.travelCache = new Map();
  }

  // Evaluate the pose at action.time, then pin the root if asked to.
  pose() {
    this.mixer.update(0);
    if (this.inPlace && this.anchor && this.rootJoint) {
      this.rootJoint.position.x = this.anchor.x;
      this.rootJoint.position.z = this.anchor.z;
    }
  }

  // Furthest horizontal distance the root gets from where the clip starts, in metres.
  travel(slot) {
    if (this.travelCache.has(slot)) return this.travelCache.get(slot);
    const clip = this.entry.clips.get(slot);
    const name = this.rootJoint ? `${this.rootJoint.name}.position` : null;
    const track = clip && name ? clip.tracks.find((t) => t.name === name) : null;
    let far = 0;
    if (track) {
      const v = track.values;
      for (let i = 0; i < v.length; i += 3) far = Math.max(far, Math.hypot(v[i] - v[0], v[i + 2] - v[2]));
    }
    const metres = far / 256;
    this.travelCache.set(slot, metres);
    return metres;
  }

  get time() { return this.action ? this.action.time : 0; }
  get duration() { return this.action ? this.action.getClip().duration : 0; }

  // The window playback wraps within. With a loop range, the first pass still starts at
  // 0, so an intro before endlessStart plays once and only the tail repeats after that.
  span() {
    const l = this.info && this.info.l;
    if (this.useLoop && l) return { start: l[0], end: Math.min(l[1], this.duration) };
    return { start: 0, end: this.duration };
  }

  select(info) {
    const clip = this.entry.clips.get(info.s);
    if (!clip) return false;
    this.mixer.stopAllAction();
    restoreRest(this.entry.rest);
    this.action = this.mixer.clipAction(clip);
    this.action.setLoop(THREE.LoopRepeat, Infinity);
    this.action.reset().play();
    this.info = info;
    this.timeline = buildTimeline(this.entry.events[info.s]);
    this.restart();
    return true;
  }

  restart() {
    if (!this.action) return;
    this.action.time = 0;
    this.prevT = -1e-6;            // so events stamped at t=0 fire on the first frame
    this.loops = 0;
    this.mixer.update(0);
    this.anchor = this.rootJoint ? this.rootJoint.position.clone() : null;
    this.pose();
  }

  seek(t) {
    if (!this.action) return;
    this.action.time = THREE.MathUtils.clamp(t, 0, Math.max(0, this.duration - 1e-6));
    this.prevT = this.action.time; // a scrub should not replay everything it skipped
    this.pose();
  }

  tick(dt) {
    if (!this.action || this.paused) return;
    const { start, end } = this.span();
    let t = this.action.time + dt * this.speed;
    if (t >= end) {
      this.fire(this.prevT, end);
      const len = Math.max(end - start, 1e-4);
      t = start + ((t - end) % len);
      this.prevT = start - 1e-6;
      this.loops++;
    }
    this.fire(this.prevT, t);
    this.prevT = t;
    this.action.time = t;
    this.pose();
  }

  fire(a, b) {
    for (let i = 0; i < this.timeline.length; i++) {
      const ev = this.timeline[i];
      if (ev.t > a && ev.t <= b) this.onEvent(i, ev);
    }
  }
}

function buildTimeline(ev) {
  if (!ev) return [];
  const out = [];
  for (const s of ev.sounds || []) out.push({ kind: 'sound', ...s });
  for (const b of ev.blinks || []) out.push({ kind: 'blink', ...b });
  return out.sort((x, y) => x.t - y.t || (x.kind < y.kind ? -1 : 1));
}
