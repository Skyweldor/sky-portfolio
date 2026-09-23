// DOM wiring only. Everything that touches three.js lives in main.js and playback.js;
// this module is handed plain data and calls back through `on`.
//
// The data is one entry per Digimon. variants[0] is the main model; any further variant
// is an NPC copy that earned its place (a different mesh, real colour differences, or
// clips of its own). clips[] is the merged list, and each clip's `on` says which variants
// can play it and under which slot -- slot numbers are per file, not universal.

const $ = (id) => document.getElementById(id);
const fmt = (t) => t.toFixed(2);

export class UI {
  constructor(manifest, on) {
    this.on = on;
    this.all = manifest.digimon;                   // already sorted by label
    this.list = this.all;
    this.d = null;
    this.vkey = null;
    this.flashTimers = new Map();

    // Codes that were merged away still find their Digimon: typing EANG shows Angemon.
    this.merged = new Map();
    for (const x of manifest.dropped || []) {
      if (!this.merged.has(x.into)) this.merged.set(x.into, []);
      this.merged.get(x.into).push(x.key);
    }

    $('filter').addEventListener('input', () => this.applyFilter());
    $('prev').addEventListener('click', () => this.step(-1));
    $('next').addEventListener('click', () => this.step(1));
    $('grab').addEventListener('click', () => {
      $('sheet').classList.toggle('collapsed');
      // the band the model is framed into just changed size
      setTimeout(() => on.onLayout(), 200);
    });
    $('play').addEventListener('click', () => on.onPlayPause());
    $('seek').addEventListener('input', (e) => on.onSeek(Number(e.target.value)));

    this.buildTools();
    this.applyFilter();
  }

  // -- Digimon picker ---------------------------------------------------------------

  codesOf(d) {
    return [...d.variants.map((v) => v.key), ...(this.merged.get(d.id) || [])];
  }

  applyFilter() {
    const q = $('filter').value.trim().toLowerCase();
    this.list = this.all.filter((d) => !q || d.label.toLowerCase().includes(q)
      || this.codesOf(d).some((k) => k.toLowerCase().includes(q)));
    const row = $('models');
    row.innerHTML = '';
    for (const d of this.list) {
      const b = document.createElement('button');
      const extra = d.variants.length - 1;
      b.innerHTML = esc(d.label) + (extra ? `<span class="sub">+${extra}</span>` : '');
      b.title = `${d.label} (${this.codesOf(d).join(', ')})`
        + (extra ? ` - ${extra} NPC variant${extra > 1 ? 's' : ''} with something of their own` : '');
      b.dataset.id = d.id;
      if (this.d && d.id === this.d.id) b.classList.add('on');
      b.addEventListener('click', () => this.on.onDigimon(d.id));
      row.appendChild(b);
    }
    $('count').textContent = this.list.length === this.all.length
      ? `${this.all.length}` : `${this.list.length}/${this.all.length}`;
    this.revealActive('models');
  }

  step(dir) {
    if (!this.list.length) return;
    const i = this.list.findIndex((d) => this.d && d.id === this.d.id);
    const j = i < 0 ? 0 : (i + dir + this.list.length) % this.list.length;
    this.on.onDigimon(this.list[j].id);
  }

  // A new Digimon: rebuild the clip strip and the variant row.
  setDigimon(d) {
    this.d = d;
    this.vkey = null;
    for (const b of $('models').children) b.classList.toggle('on', b.dataset.id === d.id);
    this.revealActive('models');

    const clips = $('clips');
    clips.innerHTML = '';
    d.clips.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'clip';
      b.dataset.i = i;
      // Loop markers: the circled arrow is a real intro-then-loop (the rarer, more
      // interesting case), infinity loops from the start, nothing means the source gives
      // no loop range at all.
      const mk = [];
      if (c.l) mk.push(c.l[0] > 0 ? '⟳' : '∞');
      if (c.snd) mk.push(`♪${c.snd}`);
      if (c.blk) mk.push(`◐${c.blk}`);
      b.innerHTML = `${c.v ? `${c.v} ` : ''}#${c.s}<span class="mk">${fmt(c.d)}s${mk.length ? ' ' + mk.join(' ') : ''}</span>`;
      b.title = describeClip(c, d);
      b.addEventListener('click', () => this.on.onClip(c));
      clips.appendChild(b);
    });

    const vrow = $('variants');
    vrow.innerHTML = '';
    if (d.variants.length > 1) {
      d.variants.forEach((v, i) => {
        const b = document.createElement('button');
        b.className = 'ghost';
        b.dataset.key = v.key;
        b.innerHTML = i === 0 ? `${v.key} <span class="sub">main</span>`
          : `${v.key} <span class="sub">${esc(v.why.join(' · '))}</span>`;
        b.title = i === 0 ? `${v.key}: the main model` : `${v.key}: NPC variant - ${v.why.join(', ')}`;
        b.addEventListener('click', () => this.on.onVariant(v.key));
        vrow.appendChild(b);
      });
    }
  }

  // The variant on screen changed (or finished loading).
  setVariant(v, loaded) {
    this.vkey = v.key;
    for (const b of $('variants').children) b.classList.toggle('on', b.dataset.key === v.key);
    for (const b of $('clips').children) {
      const c = this.d.clips[Number(b.dataset.i)];
      b.classList.toggle('other', c.on[v.key] == null);
    }
    const d = this.d;
    const main = d.variants[0].key === v.key;
    const tags = [];
    if (!main) tags.push(`NPC variant · ${v.why.join(' · ')}`);
    if (v.note) tags.push(`README note: "${esc(v.note)}"`);
    if (v.unlit) tags.push('unlit');
    if (v.alphaModes.includes('BLEND')) tags.push(v.alphaModes.length > 1 ? 'part translucent' : 'translucent');
    const here = d.clips.filter((c) => c.on[v.key] != null).length;
    const clipText = here === d.clips.length ? `${d.clips.length} clips` : `${here} of ${d.clips.length} clips`;
    $('modelLine').innerHTML = `<b>${esc(d.label)}</b> <span class="dim">${v.key}</span>`
      + ` · ${v.heightM.toFixed(2)} m · ${clipText} · ${(v.bytes / 1e6).toFixed(2)} MB`
      + (tags.length ? ` <span class="dim">· ${tags.join(' · ')}</span>` : '')
      + (loaded ? '' : ' <span class="dim">· loading…</span>');
  }

  setClip(c, slot, v, timeline, travelM = 0) {
    const i = this.d.clips.indexOf(c);
    for (const b of $('clips').children) b.classList.toggle('on', Number(b.dataset.i) === i);
    this.revealActive('clips');
    // Travel is shown even with "in place" on, so pinning the root never hides the fact
    // that a clip is a walk, a charge or a lunge -- often the best clue to what it is.
    const travel = travelM >= 0.25 ? ` · travels ${travelM < 10 ? travelM.toFixed(1) : Math.round(travelM)} m` : '';
    const main = this.d.variants[0].key === v.key;
    // On a variant, say which slot the file itself uses; for an aliased clip that differs
    // from the main slot the chip shows.
    const where = main ? `slot <b>${slot}</b>`
      : `${v.key} slot <b>${slot}</b>${!c.v && slot !== c.s ? ` <span class="dim">(= ${this.d.variants[0].key} #${c.s})</span>` : ''}`;
    this.clipText = `${where} · ${fmt(c.d)} s · ${describeLoop(c)}${travel}`;
    this.lastLoops = 0;
    $('clipLine').innerHTML = this.clipText;
    this.renderEvents(timeline);
  }

  // -- sheet ----------------------------------------------------------------------

  buildTools() {
    const row = $('tools');
    const add = (label, title, fn, on = false) => {
      const b = document.createElement('button');
      b.className = 'ghost' + (on ? ' on' : '');
      b.textContent = label;
      b.title = title;
      b.addEventListener('click', () => fn(b));
      row.appendChild(b);
      return b;
    };
    this.speedButtons = [0.25, 0.5, 1, 2].map((x) => add(`${x}×`, `playback speed ${x}×`, () => {
      this.speedButtons.forEach((b) => b.classList.toggle('on', b.textContent === `${x}×`));
      this.on.onSpeed(x);
    }, x === 1));
    const toggle = (label, title, name, initial) => add(label, title, (b) => {
      const v = !b.classList.contains('on');
      b.classList.toggle('on', v);
      this.on.onToggle(name, v);
    }, initial);
    toggle('loop range', 'loop only the section the game loops; off plays the whole clip', 'loop', true);
    toggle('in place', 'pin the root so walks and lunges animate on the spot; off lets the model travel and the camera follow', 'inPlace', true);
    toggle('turntable', 'rotate the camera slowly around the model', 'turntable', false);
    toggle('double-sided', 'render back faces too', 'doubleSided', false);
    toggle('depth write', 'translucent faces write depth; fixes some sorting, breaks other', 'depthWrite', false);
    add('reset view', 'reframe the model from the default angle', () => this.on.onResetView());
  }

  renderEvents(timeline) {
    const box = $('events');
    box.innerHTML = '';
    this.eventRows = [];
    if (!timeline.length) {
      box.innerHTML = '<div class="empty">no sound cues or texture events in this clip</div>';
      return;
    }
    for (const ev of timeline) {
      const row = document.createElement('div');
      row.className = 'ev';
      const what = ev.kind === 'sound'
        ? `♪ sound ${ev.soundId} <span class="dim">vab ${ev.vabId}</span>`
        : `◐ blit ${ev.srcX},${ev.srcY} ${ev.w}×${ev.h} → ${ev.destX},${ev.destY}`;
      row.innerHTML = `<span class="t">t=${fmt(ev.t)}</span><span>${what}</span>`;
      box.appendChild(row);
      this.eventRows.push(row);
    }
  }

  flashEvent(i) {
    const row = this.eventRows && this.eventRows[i];
    if (!row) return;
    row.classList.add('fired');
    clearTimeout(this.flashTimers.get(i));
    this.flashTimers.set(i, setTimeout(() => row.classList.remove('fired'), 380));
    // Only chase the list when it overflows; short lists would just jitter.
    const box = $('events');
    if (box.scrollHeight > box.clientHeight) {
      const top = row.offsetTop - box.offsetTop;
      if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - row.offsetHeight) {
        box.scrollTop = top - box.clientHeight / 3;
      }
    }
  }

  setTime(t, d, loops, paused) {
    $('time').textContent = `${fmt(t)} / ${fmt(d)}`;
    const seek = $('seek');
    if (document.activeElement !== seek) seek.value = d > 0 ? String(t / d) : '0';
    if (paused !== this.lastPaused) {
      this.lastPaused = paused;
      $('play').innerHTML = paused ? '&#9654;' : '&#10074;&#10074;';
    }
    // Called every frame: only touch the clip line when the loop count actually moves.
    if (this.clipText && loops !== this.lastLoops) {
      this.lastLoops = loops;
      $('clipLine').innerHTML = this.clipText + (loops ? ` <span class="dim">· loop ${loops}</span>` : '');
    }
  }

  setStatus(text) {
    const s = $('status');
    s.textContent = text || '';
    s.classList.toggle('show', !!text);
  }

  // Centre the active chip in its strip. Synchronous (getBoundingClientRect forces layout)
  // and instant for long jumps: a smooth scroll is driven by animation frames, which a
  // page loading in a background tab does not get, so a deep link's long jump never
  // arrived. Short steps, like the arrows, still glide.
  revealActive(id) {
    const row = $(id);
    const b = row.querySelector('.on');
    if (!b) return;
    const r = row.getBoundingClientRect();
    const c = b.getBoundingClientRect();
    const delta = (c.left + c.width / 2) - (r.left + r.width / 2);
    row.scrollBy({ left: delta, behavior: Math.abs(delta) > r.width ? 'instant' : 'smooth' });
  }

  get topHeight() { return $('top').getBoundingClientRect().height; }
  get sheetHeight() { return $('sheet').getBoundingClientRect().height; }
  get filterFocused() { return document.activeElement === $('filter'); }
}

function describeLoop(c) {
  if (!c.l) return '<span class="dim">no loop range in source</span>';
  if (c.l[0] > 0) return `intro 0.00–${fmt(c.l[0])}, then loops ${fmt(c.l[0])}–${fmt(c.l[1])}`;
  return `loops ${fmt(c.l[0])}–${fmt(c.l[1])}`;
}

function describeClip(c, d) {
  const parts = [c.v ? `${c.v} slot ${c.s} (only in this NPC variant)` : `slot ${c.s}`, `${fmt(c.d)} s`];
  parts.push(!c.l ? 'no loop range in source' : c.l[0] > 0
    ? `intro then loops ${fmt(c.l[0])}–${fmt(c.l[1])}` : `loops ${fmt(c.l[0])}–${fmt(c.l[1])}`);
  if (c.snd) parts.push(`${c.snd} sound cue${c.snd > 1 ? 's' : ''}`);
  if (c.blk) parts.push(`${c.blk} texture event${c.blk > 1 ? 's' : ''}`);
  const main = d.variants[0].key;
  const also = Object.entries(c.on).filter(([k]) => k !== main && k !== c.v)
    .map(([k, s]) => (s === c.s ? k : `${k} as #${s}`));
  if (also.length) parts.push(`also on ${also.join(', ')}`);
  return parts.join(' · ');
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}
