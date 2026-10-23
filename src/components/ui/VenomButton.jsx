/*
 * VenomButton: a liquid, glossy CTA whose surface reaches for the cursor with white goo strings
 * that latch onto a hand-shaped cursor, stretch, snap and recoil.
 *
 * Behaviour adapted from "Venom Button" by exteestudio
 * https://github.com/exteestudio/venom-button (live demo: https://exteestudio.github.io/venom-button/)
 * The original is a WebGL2 ray-marched scene; this is a lightweight Canvas 2D re-implementation of
 * its interaction model: Verlet ropes on a fixed timestep, soft-spring sticky tips with lag and
 * overshoot, volume-conserving thinning and necking, pinch-off with droplets, rubber-band recoil and
 * coils wound around the fingers of a hand cursor. Several tuning ideas and constants come from the
 * original, which is distributed under the MIT License:
 *
 *   MIT License
 *   Copyright (c) 2026 exteestudio
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 *   associated documentation files (the "Software"), to deal in the Software without restriction,
 *   including without limitation the rights to use, copy, modify, merge, publish, distribute,
 *   sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all copies or
 *   substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 *   NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * The hand cursor artwork below is drawn from scratch (not the original's Figma cursor SVGs).
 */
import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import styles from './VenomButton.module.css';

// ───────────────────────────── media queries ─────────────────────────────
const Q_FINE = '(hover: hover) and (pointer: fine)';
const Q_REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeMedia = (cb) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const qs = [window.matchMedia(Q_FINE), window.matchMedia(Q_REDUCED)];
  qs.forEach((q) => q.addEventListener('change', cb));
  return () => qs.forEach((q) => q.removeEventListener('change', cb));
};
const getMotionMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'static';
  if (window.matchMedia(Q_REDUCED).matches) return 'static';
  return window.matchMedia(Q_FINE).matches ? 'goo' : 'touch';
};
const getServerMode = () => 'static';

// ───────────────────────────── tuning ─────────────────────────────
const PAD = 270;          // canvas overhang around the button (CSS px): reach radius + stretched strand + hand
const NP = 14;            // points per Verlet rope
const H = 1 / 120;        // fixed physics timestep (accumulator)
const MAX_STEPS = 6;      // per frame; extra time is dropped (no spiral of death after a tab switch)
const POOL = 16;          // preallocated strands
const DROPS = 10;         // preallocated droplets
const SUBS = 3;           // Catmull-Rom samples per rope segment
const NS = (NP - 1) * SUBS + 1;
const P = {
  awareness: 180,         // px from the edge where the surface starts oozing toward the cursor
  reach: 140,             // px from the edge where tendrils lunge and latch
  maxStrands: 6,
  maxLen: 225,            // absolute length that always snaps (randomised per strand)
  gravity: 260,           // slight sag
  damp: 0.955,            // per 120 Hz step: heavy, viscous
  maxStep: 18,            // px per step velocity clamp (no explosions on fast flicks)
};
const HAND_S = 2.0;       // px per hand-icon unit (24-unit frame, ~48 px icon)
const HOT = [8.5, 1.2];   // hotspot: index fingertip

// wrap sites on the hand: index, middle, wrist, ring, thumb, pinky
const FINGERS = [
  { a: [8.5, 3.6], b: [8.5, 9.6], hw: 1.5, turns: 2.4, t0: 0.1, t1: 0.8 },
  { a: [11.9, 9.0], b: [11.9, 12.6], hw: 1.45, turns: 1.6, t0: 0.1, t1: 0.85 },
  { a: [13.4, 19.6], b: [13.4, 22.2], hw: 4.2, turns: 1.4, t0: 0.08, t1: 0.92 },
  { a: [15.0, 9.6], b: [15.0, 12.8], hw: 1.4, turns: 1.6, t0: 0.1, t1: 0.85 },
  { a: [5.2, 12.4], b: [7.6, 15.2], hw: 1.3, turns: 1.7, t0: 0.1, t1: 0.82 },
  { a: [18.0, 10.8], b: [18.0, 13.4], hw: 1.25, turns: 1.4, t0: 0.12, t1: 0.86 },
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rand = (a, b) => a + Math.random() * (b - a);
const ease = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function capsule(p, ax, ay, bx, by, r) {
  const ang = Math.atan2(by - ay, bx - ax);
  p.moveTo(bx + Math.cos(ang - Math.PI / 2) * r, by + Math.sin(ang - Math.PI / 2) * r);
  p.arc(bx, by, r, ang - Math.PI / 2, ang + Math.PI / 2);
  p.arc(ax, ay, r, ang + Math.PI / 2, ang + (3 * Math.PI) / 2);
  p.closePath();
}

function buildHand() {
  const p = new Path2D();
  capsule(p, 8.5, 11, 8.5, 2.6, 1.55);     // index, pointing up
  capsule(p, 11.9, 13.2, 11.9, 8.6, 1.5);  // middle (curled)
  capsule(p, 15.0, 13.4, 15.0, 9.3, 1.45); // ring
  capsule(p, 18.0, 13.8, 18.0, 10.5, 1.3); // pinky
  capsule(p, 4.9, 12.0, 7.9, 15.8, 1.35);  // thumb
  p.roundRect(7, 11.6, 12.4, 8.6, [0, 0, 4.2, 4.2]); // palm
  p.roundRect(9.2, 19, 8.4, 3.8, 1.2);     // wrist cuff
  const lines = new Path2D();              // finger separations
  lines.moveTo(10.2, 12.6); lines.lineTo(10.2, 14.4);
  lines.moveTo(13.45, 12.8); lines.lineTo(13.45, 14.6);
  lines.moveTo(16.5, 13.0); lines.lineTo(16.5, 14.8);
  lines.moveTo(9.6, 19.6); lines.lineTo(17.2, 19.6);
  return { body: p, lines };
}

const makeStrand = () => ({
  active: false, kind: 0, state: 0, pinned: false,
  pos: new Float32Array(NP * 2), prev: new Float32Array(NP * 2), rad: new Float32Array(NP),
  t: 0, lat: 0, rest: 1, vol: 1, stretch: 1, L: 0,
  tipX: 0, tipY: 0, tipVX: 0, tipVY: 0, tx: 0, ty: 0,
  freq: 2.6, zeta: 0.5, stiff: 1, snapAt: 1.7, maxLen: P.maxLen, delay: 0, life: 0, ttl: 1,
  pinch: 0, cap: 0, swell: 0, phase: 0, neckS: 0.5, lenMul: 1,
  wrapF: -1, wrapProg: 0, th0: 0, dir: 1, wrapSet: false, ph: 0,
  pnx: 0, pny: 0, pdist: 0, pdir: 1,
});
// kinds and states
const REACH = 0, MICRO = 1, PROBE = 2;
const WAIT = 0, LUNGE = 1, HELD = 2, RECOIL = 3;

// ───────────────────────────── simulation ─────────────────────────────
function createSim(canvas, button, root) {
  const ctx = canvas.getContext('2d');
  const hand = buildHand();
  const pool = Array.from({ length: POOL }, makeStrand);
  const drops = Array.from({ length: DROPS }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, r: 0, life: 0 }));
  const order = new Int8Array(POOL);           // active strands sorted along the perimeter
  // scratch buffers: rendering and geometry write here, nothing is allocated per frame
  const sx = new Float32Array(NS), sy = new Float32Array(NS), sr = new Float32Array(NS);
  const snx = new Float32Array(NS), sny = new Float32Array(NS);
  const pt = new Float32Array(4);              // perimeter point: x, y, nx, ny (button-local)
  const cp = new Float32Array(3);              // coil point: x, y, over/under
  const hw = new Float32Array(2);              // hand-to-world result

  const g = { w: 200, h: 60, r: 30, a: 70, per: 1, cx: 0, cy: 0, cssW: 0, cssH: 0, dpr: 1 };
  const cur = { cx: -1e5, cy: -1e5, x: -1e5, y: -1e5, present: false };
  const rect = { left: 0, top: 0, k: 1, dirty: true };
  const btn = { ox: 0, oy: 0, energy: 0 };
  const hs = { alpha: 0, ox: 0, oy: 0, ang: 0 };
  let time = 0, acc = 0, spawnCool = 0, inView = false, running = false, raf = 0, last = 0;
  let idleTimer = 0, cursorHidden = false, aware = 0, near = false, dist = 1e5, curT = 0;
  let activeCount = 0, dropCount = 0;

  const layout = () => {
    const w = button.offsetWidth, h = button.offsetHeight;
    g.w = w; g.h = h; g.r = h / 2; g.a = Math.max(0, w / 2 - h / 2);
    g.per = 4 * g.a + 2 * Math.PI * g.r;
    g.cssW = w + PAD * 2; g.cssH = h + PAD * 2;
    g.cx = PAD + w / 2; g.cy = PAD + h / 2;
    g.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(g.cssW * g.dpr);
    canvas.height = Math.round(g.cssH * g.dpr);
    canvas.style.width = `${g.cssW}px`;
    canvas.style.height = `${g.cssH}px`;
    rect.dirty = true;
  };
  const readRect = () => {
    const b = canvas.getBoundingClientRect();
    rect.left = b.left; rect.top = b.top; rect.k = g.cssW ? b.width / g.cssW || 1 : 1; // ancestors may be scaled
    rect.dirty = false;
  };
  const toLocal = () => {
    if (rect.dirty) readRect();
    cur.x = (cur.cx - rect.left) / rect.k;
    cur.y = (cur.cy - rect.top) / rect.k;
  };

  // ── pill perimeter, parameterised by arc length t (clockwise from the top-left of the straight edge)
  const wrapT = (t) => ((t % g.per) + g.per) % g.per;
  const dT = (a, b) => { let d = wrapT(b - a); if (d > g.per / 2) d -= g.per; return d; };
  const perim = (t) => {
    const a = g.a, r = g.r, arc = Math.PI * r;
    t = wrapT(t);
    if (t < 2 * a) { pt[0] = -a + t; pt[1] = -r; pt[2] = 0; pt[3] = -1; return; }
    t -= 2 * a;
    if (t < arc) { const th = -Math.PI / 2 + t / r, c = Math.cos(th), s = Math.sin(th); pt[0] = a + c * r; pt[1] = s * r; pt[2] = c; pt[3] = s; return; }
    t -= arc;
    if (t < 2 * a) { pt[0] = a - t; pt[1] = r; pt[2] = 0; pt[3] = 1; return; }
    t -= 2 * a;
    const th = Math.PI / 2 + t / r, c = Math.cos(th), s = Math.sin(th);
    pt[0] = -a + c * r; pt[1] = s * r; pt[2] = c; pt[3] = s;
  };
  // nearest perimeter parameter and signed distance from the edge for a canvas-space point
  const nearestT = (x, y) => {
    const a = g.a, r = g.r, arc = Math.PI * r;
    const lx = x - (g.cx + btn.ox), ly = y - (g.cy + btn.oy);
    if (lx >= -a && lx <= a) { dist = Math.abs(ly) - r; return ly < 0 ? lx + a : 2 * a + arc + (a - lx); }
    if (lx > a) { const th = Math.atan2(ly, lx - a); dist = Math.hypot(lx - a, ly) - r; return 2 * a + (th + Math.PI / 2) * r; }
    let th = Math.atan2(ly, lx + a); if (th < 0) th += 2 * Math.PI;
    dist = Math.hypot(lx + a, ly) - r;
    return 4 * a + arc + (th - Math.PI / 2) * r;
  };

  const handToWorld = (ix, iy) => {
    const dx = (ix - HOT[0]) * HAND_S, dy = (iy - HOT[1]) * HAND_S;
    const c = Math.cos(hs.ang), s = Math.sin(hs.ang);
    hw[0] = cur.x + hs.ox + c * dx - s * dy; hw[1] = cur.y + hs.oy + s * dx + c * dy;
  };
  const coilPoint = (s, f) => {
    const F = FINGERS[s.wrapF];
    handToWorld(F.a[0], F.a[1]); const ax = hw[0], ay = hw[1];
    handToWorld(F.b[0], F.b[1]);
    let ux = hw[0] - ax, uy = hw[1] - ay;
    const L = Math.hypot(ux, uy) || 1;
    ux /= L; uy /= L;
    const nx = -uy, ny = ux;
    if (!s.wrapSet) {
      const side = (s.pos[0] - (ax + hw[0]) / 2) * nx + (s.pos[1] - (ay + hw[1]) / 2) * ny;
      s.th0 = side > 0 ? 0 : Math.PI; s.dir = side > 0 ? 1 : -1; s.wrapSet = true;
    }
    const phi = f * F.turns * 2 * Math.PI * s.wrapProg;
    const tt = clamp(F.t0 + 0.045 * Math.sin(time * 1.4 + s.ph) + (F.t1 - F.t0) * f * s.wrapProg, 0.02, 0.98);
    const th = s.th0 + s.dir * phi, w = F.hw * HAND_S + 1;
    cp[0] = ax + ux * tt * L + nx * Math.cos(th) * w;
    cp[1] = ay + uy * tt * L + ny * Math.cos(th) * w;
    cp[2] = Math.sin(th);
  };

  // ── pool management
  const rootX = (s) => { perim(s.t); return g.cx + btn.ox + pt[0] - pt[2] * 2; };
  const rootY = () => g.cy + btn.oy + pt[1] - pt[3] * 2; // call right after rootX (shares pt)
  const take = (kind) => {
    for (let i = 0; i < POOL; i++) {
      const s = pool[i];
      if (s.active) continue;
      s.active = true; s.kind = kind; s.state = WAIT; s.pinned = true;
      s.life = 0; s.pinch = 0; s.cap = 0; s.swell = 0; s.stretch = 1; s.L = 0;
      s.phase = rand(0, 6.28); s.neckS = rand(0.35, 0.6); s.ph = rand(0, 6.28);
      s.wrapF = -1; s.wrapProg = 0; s.wrapSet = false;
      s.tipVX = 0; s.tipVY = 0;
      return s;
    }
    return null;
  };
  const place = (s, t) => {
    s.t = wrapT(t);
    const x = rootX(s), y = rootY();
    for (let i = 0; i < NP * 2; i += 2) { s.pos[i] = s.prev[i] = x; s.pos[i + 1] = s.prev[i + 1] = y; }
    s.tipX = x; s.tipY = y; s.rest = 2;
  };
  const countLive = (kind) => {
    let n = 0;
    for (let i = 0; i < POOL; i++) { const s = pool[i]; if (s.active && s.kind === kind && s.state !== RECOIL) n++; }
    return n;
  };

  const spawnReach = () => {
    const k = countLive(REACH);
    const s = take(REACH);
    if (!s) return;
    // roots spread over the facing surface; each claims its own wrap site on the hand
    const spread = Math.min(g.per * 0.16, 70);
    s.lat = (k === 0 ? 0 : (k % 2 ? -1 : 1) * Math.ceil(k / 2) * (spread / 3)) + rand(-7, 7);
    place(s, curT + s.lat);
    s.vol = Math.PI * 3.6 * 3.6 * 110 * rand(0.8, 1.2);
    s.freq = rand(2.0, 3.0); s.zeta = rand(0.42, 0.6); s.stiff = rand(0.75, 1);
    s.snapAt = rand(1.6, 1.95); s.maxLen = P.maxLen * rand(0.88, 1.08); s.delay = rand(0, 0.12);
    let used = 0;
    for (let i = 0; i < POOL; i++) { const o = pool[i]; if (o.active && o !== s && o.wrapF >= 0) used |= 1 << o.wrapF; }
    let f = 0;
    while (used & (1 << f) && f < FINGERS.length - 1) f++;
    s.wrapF = f;
  };
  const spawnMicro = () => {
    const s = take(MICRO);
    if (!s) return;
    s.lat = rand(-80, 80);
    place(s, curT + s.lat);
    s.vol = Math.PI * 1.5 * 1.5 * 30 * rand(0.7, 1.3);
    s.freq = rand(2.5, 3.5); s.zeta = 0.6; s.stiff = rand(0.7, 1); s.delay = 0;
    s.ttl = rand(0.7, 1.5); s.lenMul = rand(0.5, 1);
  };
  const spawnProbes = () => {
    const t0 = rand(0, g.per), n = 2 + (Math.random() < 0.5 ? 1 : 0), dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < n; i++) {
      const s = take(PROBE);
      if (!s) return;
      place(s, t0 + (i - (n - 1) / 2) * 14);
      perim(s.t);
      s.pnx = pt[2]; s.pny = pt[3]; s.pdist = rand(10, 18); s.pdir = dir;
      s.vol = Math.PI * 1.6 * 1.6 * 30; s.freq = 2.2; s.zeta = 0.7; s.stiff = 0.9;
      s.delay = i * 0.07; s.ttl = rand(0.9, 1.2);
    }
  };
  const spawnDrop = (x, y, vx, vy, r) => {
    for (let i = 0; i < DROPS; i++) {
      const d = drops[i];
      if (d.on) continue;
      d.on = true; d.x = x; d.y = y; d.vx = clamp(vx, -400, 400); d.vy = clamp(vy, -400, 400); d.r = r; d.life = 0;
      return;
    }
  };

  // ── one fixed step for one rope
  const stepStrand = (s, h) => {
    s.life += h;
    if (s.state === WAIT) { if (s.life < s.delay) return; s.state = LUNGE; s.life = 0; }
    const pos = s.pos, prev = s.prev, last2 = (NP - 1) * 2;

    // roots ooze along the surface toward the cursor with a sticky lag
    if (s.state !== RECOIL && s.kind !== PROBE) s.t = wrapT(s.t + dT(s.t, curT + s.lat) * (1 - Math.exp(-h * (s.kind === MICRO ? 1.6 : 1.1))));
    const Rx = rootX(s), Ry = rootY(), Nx = pt[2], Ny = pt[3];

    // where the sticky tip wants to be
    let hasT = false;
    if (s.kind === REACH && s.state !== RECOIL) {
      coilPoint(s, 0); s.tx = cp[0]; s.ty = cp[1]; hasT = true;
    } else if (s.kind === MICRO && s.state !== RECOIL) {
      const dx0 = cur.x - Rx, dy0 = cur.y - Ry, dl0 = Math.hypot(dx0, dy0) || 1;
      let dx = Nx * 0.35 + (dx0 / dl0) * 0.65, dy = Ny * 0.35 + (dy0 / dl0) * 0.65;
      const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      const len = (8 + 30 * aware) * s.lenMul, sway = Math.sin(time * 2.2 + s.phase) * 5;
      s.tx = Rx + dx * len - dy * sway; s.ty = Ry + dy * len + dx * sway; hasT = true;
      if (s.life > s.ttl || aware < 0.08) s.state = RECOIL;
    } else if (s.kind === PROBE && s.state !== RECOIL) {
      const f = clamp(s.life / s.ttl, 0, 1), wave = Math.sin(Math.PI * f);
      const glide = s.pdir * (f - 0.3) * 22, out = 2 + s.pdist * wave;
      s.tx = Rx + s.pnx * out - s.pny * glide; s.ty = Ry + s.pny * out + s.pnx * glide; hasT = true;
      if (s.life > s.ttl) s.state = RECOIL;
    }
    if (s.state === RECOIL) { hasT = false; s.pinned = false; }

    if (hasT) {
      // soft spring attachment: lag, a little overshoot, velocity clamped so fast flicks stay sane
      const w = 2 * Math.PI * s.freq * (s.state === LUNGE ? 1.25 : 1), k = w * w, c = 2 * s.zeta * w;
      s.tipVX += (k * (s.tx - s.tipX) - c * s.tipVX) * h;
      s.tipVY += (k * (s.ty - s.tipY) - c * s.tipVY) * h;
      const sp = Math.hypot(s.tipVX, s.tipVY), vmax = 1800;
      if (sp > vmax) { s.tipVX *= vmax / sp; s.tipVY *= vmax / sp; }
      s.tipX += s.tipVX * h; s.tipY += s.tipVY * h;
      const L0 = Math.hypot(s.tipX - Rx, s.tipY - Ry);
      if (s.state === LUNGE) {
        s.rest += (L0 * 1.12 - s.rest) * (1 - Math.exp(-h * 14)); // extrude fast while lunging (with slack to sag)
        if (Math.hypot(s.tx - s.tipX, s.ty - s.tipY) < 8 && s.rest > L0) s.state = HELD;
      } else {
        // viscous: slow pulls feed more goo into the strand, slack is reeled back in
        if (L0 < s.rest * 1.08) s.rest += (L0 * 1.08 - s.rest) * (1 - Math.exp(-h * 2.5));
        else s.rest += (L0 - s.rest) * (1 - Math.exp(-h * 0.3));
      }
      s.stretch = L0 / Math.max(s.rest, 1);
      if (s.kind === REACH && !s.pinch && (s.state === HELD || s.life > 0.6) &&
          (s.stretch > s.snapAt || L0 > s.maxLen || !cur.present)) s.pinch = 1e-4;
    } else if (s.state === RECOIL) {
      // rubber-band return: fast at first, easing in; the chain's inertia gives the wobble
      s.rest = Math.max(0, s.rest * Math.exp(-h * 5.5) - 55 * h);
      s.cap += (1 - s.cap) * (1 - Math.exp(-h * 8));
    }
    if (s.pinch > 0) {
      s.pinch += h / 0.12;
      if (s.pinch >= 1) {
        s.pinch = 0; s.state = RECOIL; s.pinned = false;
        if (s.wrapF >= 0) spawnDrop(pos[last2], pos[last2 + 1], s.tipVX * 0.25, s.tipVY * 0.25 - 40, s.rad[NP - 1] * 1.6 + 1.2);
      }
    }
    if (s.wrapF >= 0) {
      if (s.state === HELD) s.wrapProg += (1 - s.wrapProg) * (1 - Math.exp(-h * 9));
      else if (s.state === RECOIL) s.wrapProg = Math.max(0, s.wrapProg - h * 6);
    }

    // Verlet integration: inertia, heavy damping, slight sag, gentle pull toward the cursor
    const gdt = P.gravity * h * h * (s.kind === PROBE ? 0.15 : 1);
    const mag = s.kind !== PROBE && s.state !== RECOIL && cur.present ? 520 * h * h : 0;
    const damp = s.state === RECOIL ? 0.93 : P.damp, vm = P.maxStep;
    const end = s.pinned ? NP - 1 : NP;
    for (let i = 1; i < end; i++) {
      const o = i * 2, env = Math.sin((Math.PI * i) / (NP - 1)) || 0.3;
      let vx = (pos[o] - prev[o]) * damp, vy = (pos[o + 1] - prev[o + 1]) * damp;
      const v = Math.hypot(vx, vy);
      if (v > vm) { vx *= vm / v; vy *= vm / v; }
      prev[o] = pos[o]; prev[o + 1] = pos[o + 1];
      pos[o] += vx; pos[o + 1] += vy + gdt;
      if (mag) {
        const mx = cur.x - pos[o], my = cur.y - pos[o + 1], ml = Math.hypot(mx, my) || 1;
        pos[o] += (mx / ml) * mag * env; pos[o + 1] += (my / ml) * mag * env;
      }
    }
    // distance constraints (several iterations), root and sticky tip pinned
    const seg = Math.max(s.rest / (NP - 1), 0.05), iters = s.kind === REACH ? 8 : 5, kk = s.stiff;
    for (let it = 0; it < iters; it++) {
      pos[0] = Rx; pos[1] = Ry;
      if (s.pinned) { pos[last2] = s.tipX; pos[last2 + 1] = s.tipY; }
      for (let i = 0; i < NP - 1; i++) {
        const a = i * 2, b = a + 2;
        let dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1];
        const d = Math.hypot(dx, dy) || 1e-6;
        const wa = i === 0 ? 0 : 1, wb = i + 1 === NP - 1 && s.pinned ? 0 : 1, ws = wa + wb;
        if (!ws) continue;
        // ropes resist stretching more than compression (goo bunches up instead of pushing)
        const diff = ((d - seg) / d) * (d > seg ? kk : kk * 0.5);
        dx *= diff; dy *= diff;
        if (wa) { const f = wa / ws; pos[a] += dx * f; pos[a + 1] += dy * f; }
        if (wb) { const f = wb / ws; pos[b] -= dx * f; pos[b + 1] -= dy * f; }
      }
    }
    // keep free points out of the button body
    for (let i = 2; i < NP; i++) {
      const o = i * 2;
      const lx = pos[o] - (g.cx + btn.ox), ly = pos[o + 1] - (g.cy + btn.oy);
      const qx = lx - clamp(lx, -g.a, g.a), d = Math.hypot(qx, ly);
      if (d < g.r - 1 && d > 1e-3) { const f = (g.r - 1) / d; pos[o] = g.cx + btn.ox + clamp(lx, -g.a, g.a) + qx * f; pos[o + 1] = g.cy + btn.oy + ly * f; }
    }

    // thickness: volume conservation (longer = thinner), thick viscous root, necking, sticky tip
    let L = 0;
    for (let i = 0; i < NP - 1; i++) L += Math.hypot(pos[i * 2 + 2] - pos[i * 2], pos[i * 2 + 3] - pos[i * 2 + 1]);
    s.L = L;
    const rMean = clamp(Math.sqrt(s.vol / (Math.PI * Math.max(L, 4))), 0.6, s.kind === REACH ? 4 : 1.7);
    const neck = s.kind === REACH && s.state === HELD ? clamp((s.stretch - 1.2) / 0.9, 0, 0.75) : 0;
    const nk = neck * (1 - s.pinch) + s.pinch * 0.97;
    s.swell += ((s.state === RECOIL ? 1 : 0) - s.swell) * (1 - Math.exp(-h * 6));
    for (let i = 0; i < NP; i++) {
      const sp = i / (NP - 1);
      let r = rMean * (1 + 1.1 * Math.exp(-sp / 0.14) + 0.5 * s.swell * Math.exp(-sp / 0.3));
      r *= 1 - 0.55 * ease(0.45, 1, sp);
      if (s.pinned && s.kind === REACH) r *= 1 + 0.7 * Math.exp(-(1 - sp) / 0.05); // sticky foot on the hand
      if (!s.pinned) r *= 1 + 1.2 * s.cap * Math.exp(-(1 - sp) / 0.12);           // recoil blob
      r *= 1 - nk * Math.exp(-(((sp - s.neckS) / 0.15) ** 2));
      s.rad[i] = Math.max(r, 0.4);
    }
    if (s.state === RECOIL && s.rest < 3) s.active = false;
  };

  const step = (h) => {
    time += h;
    curT = cur.present ? nearestT(cur.x, cur.y) : curT;
    const d = cur.present ? dist : 1e5;
    near = d < P.awareness + 40;
    aware += ((d < P.awareness ? 1 - ease(P.reach * 0.6, P.awareness, d) : 0) - aware) * (1 - Math.exp(-h * 5));

    if (cur.present && d < P.reach) {
      const want = Math.round(2 + (P.maxStrands - 2) * clamp(1 - d / P.reach, 0, 1));
      spawnCool -= h;
      if (spawnCool <= 0 && countLive(REACH) < want) { spawnReach(); spawnCool = rand(0.04, 0.09); }
    }
    if (aware > 0.15 && Math.random() < h * 10 * aware && countLive(MICRO) < 6) spawnMicro();

    activeCount = 0;
    for (let i = 0; i < POOL; i++) { const s = pool[i]; if (s.active) { stepStrand(s, h); if (s.active) activeCount++; } }
    dropCount = 0;
    for (let i = 0; i < DROPS; i++) {
      const dp = drops[i];
      if (!dp.on) continue;
      dp.life += h; dp.vy += 700 * h; dp.vx *= 0.99;
      dp.x += dp.vx * h; dp.y += dp.vy * h;
      if (dp.life > 0.9) dp.on = false; else dropCount++;
    }

    // the body leans toward the cursor and glows with the activity
    perim(curT);
    const k = 1 - Math.exp(-h * 7);
    btn.ox += (aware * pt[2] * 4 - btn.ox) * k; btn.oy += (aware * pt[3] * 3 - btn.oy) * k;
    btn.energy += (aware - btn.energy) * k;

    // the hand: appears once a tendril reaches it, tugged and turned by the web
    let grip = false, gx = 0, gy = 0;
    for (let i = 0; i < POOL; i++) {
      const s = pool[i];
      if (!s.active || s.kind !== REACH || s.state === RECOIL || s.state === WAIT) continue;
      grip = true;
      if (s.state === HELD) {
        const o = (NP - 1) * 2, dx = s.pos[0] - s.pos[o], dy = s.pos[1] - s.pos[o + 1], l = Math.hypot(dx, dy) || 1;
        const t = clamp(s.stretch - 0.6, 0, 1.2) * s.wrapProg;
        gx += (dx / l) * t; gy += (dy / l) * t;
      }
    }
    hs.alpha += ((grip ? 1 : 0) - hs.alpha) * (1 - Math.exp(-h * (grip ? 14 : 10)));
    const sm = Math.hypot(gx, gy), m = Math.min(9, sm * 4);
    const tx = sm > 1e-3 ? (gx / sm) * m : 0, ty = sm > 1e-3 ? (gy / sm) * m : 0;
    const kh = 1 - Math.exp(-h * (sm > 1e-3 ? 6 : 18));
    hs.ox += (tx - hs.ox) * kh; hs.oy += (ty - hs.oy) * kh;
    hs.ang += (clamp(-tx * 0.035, -0.35, 0.35) - hs.ang) * kh;
  };

  // ───────────── rendering ─────────────
  // Catmull-Rom through the rope points into the scratch buffers, with normals
  const sample = (s) => {
    const p = s.pos, r = s.rad;
    let n = 0;
    for (let i = 0; i < NP - 1; i++) {
      const i0 = Math.max(i - 1, 0) * 2, i1 = i * 2, i2 = (i + 1) * 2, i3 = Math.min(i + 2, NP - 1) * 2;
      for (let j = 0; j < SUBS; j++) {
        const t = j / SUBS, t2 = t * t, t3 = t2 * t;
        const b0 = -0.5 * t3 + t2 - 0.5 * t, b1 = 1.5 * t3 - 2.5 * t2 + 1, b2 = -1.5 * t3 + 2 * t2 + 0.5 * t, b3 = 0.5 * t3 - 0.5 * t2;
        sx[n] = b0 * p[i0] + b1 * p[i1] + b2 * p[i2] + b3 * p[i3];
        sy[n] = b0 * p[i0 + 1] + b1 * p[i1 + 1] + b2 * p[i2 + 1] + b3 * p[i3 + 1];
        sr[n] = r[i] + (r[i + 1] - r[i]) * t;
        n++;
      }
    }
    sx[n] = p[(NP - 1) * 2]; sy[n] = p[(NP - 1) * 2 + 1]; sr[n] = r[NP - 1];
    for (let i = 0; i < NS; i++) {
      const a = Math.max(i - 1, 0), b = Math.min(i + 1, NS - 1);
      let tx = sx[b] - sx[a], ty = sy[b] - sy[a];
      const l = Math.hypot(tx, ty);
      if (l > 1e-4) { tx /= l; ty /= l; } else { tx = 1; ty = 0; }
      snx[i] = -ty; sny[i] = tx;
    }
  };
  // tapered, filled goo body: one side out, rounded tip, other side back, rounded root
  const traceBody = () => {
    ctx.moveTo(sx[0] + snx[0] * sr[0], sy[0] + sny[0] * sr[0]);
    for (let i = 1; i < NS; i++) ctx.lineTo(sx[i] + snx[i] * sr[i], sy[i] + sny[i] * sr[i]);
    const e = NS - 1, ae = Math.atan2(sny[e], snx[e]);
    ctx.arc(sx[e], sy[e], sr[e], ae, ae - Math.PI, true);
    for (let i = NS - 2; i >= 0; i--) ctx.lineTo(sx[i] - snx[i] * sr[i], sy[i] - sny[i] * sr[i]);
    const a0 = Math.atan2(sny[0], snx[0]);
    ctx.arc(sx[0], sy[0], sr[0], a0 + Math.PI, a0, true);
    ctx.closePath();
  };
  // gloss: a thin line inside the tube, offset toward the light (top-left)
  const traceGloss = (off, minR) => {
    let pen = false;
    for (let i = 0; i < NS; i++) {
      const r = sr[i];
      if (r < minR) { pen = false; continue; }
      const x = sx[i] + off * r, y = sy[i] + off * r;
      if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; }
    }
  };
  // meniscus where a strand leaves the body; neighbours closer than ~32px merge into one ridge
  const traceMound = (s) => {
    const w = s.rad[0] * 1.7 + 2 + s.swell * 3;
    perim(s.t - w); const x1 = g.cx + btn.ox + pt[0] - pt[2], y1 = g.cy + btn.oy + pt[1] - pt[3];
    perim(s.t + w); const x2 = g.cx + btn.ox + pt[0] - pt[2], y2 = g.cy + btn.oy + pt[1] - pt[3];
    const ai = Math.min(NS - 1, 4);
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(s.pos[0] - (x2 - x1) * 0.12, s.pos[1] - (y2 - y1) * 0.12, sx[ai], sy[ai]);
    ctx.quadraticCurveTo(s.pos[0] + (x2 - x1) * 0.12, s.pos[1] + (y2 - y1) * 0.12, x2, y2);
    ctx.closePath();
  };
  const traceBridge = (a, b) => {
    const gap = dT(a.t, b.t);
    if (gap <= 0 || gap > 32) return;
    const h0 = Math.min(a.rad[0], b.rad[0]) * 0.8 * (1 - gap / 40) + 0.5;
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const f = i / steps, out = h0 * (0.6 + 0.4 * Math.abs(2 * f - 1)); // sags between the blobs
      perim(a.t + gap * f);
      const x = g.cx + btn.ox + pt[0] + pt[2] * out, y = g.cy + btn.oy + pt[1] + pt[3] * out;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      perim(a.t + gap * (i / steps));
      ctx.lineTo(g.cx + btn.ox + pt[0] - pt[2] * 2, g.cy + btn.oy + pt[1] - pt[3] * 2);
    }
    ctx.closePath();
  };
  const traceCoil = (s, over) => {
    const n = Math.ceil(16 * FINGERS[s.wrapF].turns);
    let pen = false;
    for (let i = 0; i <= n; i++) {
      coilPoint(s, i / n);
      if (over ? cp[2] > 0 : cp[2] <= 0) { if (pen) ctx.lineTo(cp[0], cp[1]); else { ctx.moveTo(cp[0], cp[1]); pen = true; } } else pen = false;
    }
  };

  const GOO = '#e8eaee', SHADE = 'rgba(120,126,138,0.55)', SHINE = 'rgba(255,255,255,0.95)';
  const draw = () => {
    ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
    ctx.clearRect(0, 0, g.cssW, g.cssH);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // sort active strands along the perimeter (insertion sort into a preallocated index array)
    let n = 0;
    for (let i = 0; i < POOL; i++) {
      const s = pool[i];
      if (!s.active || s.state === WAIT) continue;
      let j = n++;
      while (j > 0 && pool[order[j - 1]].t > s.t) { order[j] = order[j - 1]; j--; }
      order[j] = i;
    }

    // 1) goo bodies, mounds, bridges and droplets: one fill style, nonzero per shape
    ctx.fillStyle = GOO;
    for (let i = 0; i < n; i++) {
      const s = pool[order[i]];
      sample(s);
      ctx.beginPath(); traceBody(); ctx.fill();
      ctx.beginPath(); traceMound(s); ctx.fill();
    }
    if (n > 1) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) traceBridge(pool[order[i]], pool[order[(i + 1) % n]]);
      ctx.fill();
    }
    if (dropCount) {
      ctx.beginPath();
      for (let i = 0; i < DROPS; i++) {
        const dp = drops[i];
        if (!dp.on) continue;
        const r = dp.r * (1 - dp.life / 0.9);
        ctx.moveTo(dp.x + r, dp.y);
        ctx.ellipse(dp.x, dp.y, r * 0.9, r * 1.15, 0, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    // 2) shading and gloss passes, batched across all strands
    ctx.lineWidth = 1.2; ctx.strokeStyle = SHADE;
    ctx.beginPath();
    for (let i = 0; i < n; i++) { sample(pool[order[i]]); traceGloss(0.5, 1.4); }
    ctx.stroke();
    ctx.lineWidth = 0.9; ctx.strokeStyle = SHINE;
    ctx.beginPath();
    for (let i = 0; i < n; i++) { sample(pool[order[i]]); traceGloss(-0.42, 1.1); }
    ctx.stroke();

    // 3) hand + coils
    if (hs.alpha > 0.01) {
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(200,205,212,0.55)';
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const s = pool[order[i]]; if (s.wrapF >= 0 && s.wrapProg > 0.02) traceCoil(s, false); }
      ctx.stroke();
      ctx.save();
      ctx.globalAlpha = clamp(hs.alpha, 0, 1);
      const sc = HAND_S * (0.85 + 0.15 * hs.alpha);
      ctx.translate(cur.x + hs.ox, cur.y + hs.oy);
      ctx.rotate(hs.ang);
      ctx.scale(sc, sc);
      ctx.translate(-HOT[0], -HOT[1]);
      ctx.lineWidth = 2.4 / sc;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke(hand.body);
      ctx.fillStyle = '#060607';
      ctx.fill(hand.body);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fill(hand.body);
      ctx.lineWidth = 1 / sc;
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.stroke(hand.lines);
      ctx.restore();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = GOO;
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const s = pool[order[i]]; if (s.wrapF >= 0 && s.wrapProg > 0.02) traceCoil(s, true); }
      ctx.stroke();
    }

    root.style.setProperty('--venom-x', `${btn.ox.toFixed(2)}px`);
    root.style.setProperty('--venom-y', `${btn.oy.toFixed(2)}px`);
    root.style.setProperty('--venom-energy', btn.energy.toFixed(3));
    setCursorHidden(hs.alpha > 0.5 && cur.present);
  };

  const setCursorHidden = (v) => {
    if (v === cursorHidden) return;
    cursorHidden = v;
    document.documentElement.classList.toggle(styles.handCursor, v);
  };

  // ───────────── loop control ─────────────
  const settled = () =>
    !near && activeCount === 0 && dropCount === 0 && hs.alpha < 0.01 && btn.energy < 0.005 &&
    Math.abs(btn.ox) + Math.abs(btn.oy) < 0.05;

  const frame = (now) => {
    acc += Math.min(0.1, Math.max(0, (now - last) / 1000)); // clamp big gaps (tab switch)
    last = now;
    toLocal();
    let steps = 0;
    while (acc >= H && steps < MAX_STEPS) { step(H); acc -= H; steps++; }
    if (steps === MAX_STEPS) acc = 0;
    if (steps) draw();
    if (!inView || settled()) {
      running = false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCursorHidden(false);
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running || !inView) return;
    running = true; acc = H;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const scheduleIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (inView && !near && !document.hidden) { spawnProbes(); activeCount = 1; start(); }
      if (inView) scheduleIdle();
    }, rand(2000, 3400));
  };

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    cur.cx = e.clientX; cur.cy = e.clientY; cur.present = true;
    if (!running && inView) {
      toLocal();
      nearestT(cur.x, cur.y);
      if (dist < P.awareness + 40) start();
    }
  };
  const onLeave = () => { cur.present = false; };
  const onOut = (e) => { if (!e.relatedTarget) cur.present = false; };
  const onScroll = () => { rect.dirty = true; };

  layout();
  const ro = new ResizeObserver(() => { layout(); if (running) draw(); });
  ro.observe(button);
  window.addEventListener('resize', layout, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    rect.dirty = true;
    if (inView) { scheduleIdle(); start(); } else clearTimeout(idleTimer);
  }, { rootMargin: '120px' });
  io.observe(root);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('blur', onLeave);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('resize', layout);
    window.removeEventListener('scroll', onScroll, { capture: true });
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerout', onOut);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    document.documentElement.classList.remove(styles.handCursor);
  };
}

// ───────────────────────────── component ─────────────────────────────
const VenomButton = ({ href, children, className = '', ...rest }) => {
  const mode = useSyncExternalStore(subscribeMedia, getMotionMode, getServerMode);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mode !== 'goo') return undefined;
    const canvas = canvasRef.current, button = buttonRef.current, root = rootRef.current;
    if (!canvas || !button || !root || !canvas.getContext || typeof ResizeObserver === 'undefined') return undefined;
    return createSim(canvas, button, root);
  }, [mode]);

  return (
    <span ref={rootRef} className={`${styles.root} ${styles[mode]} ${className}`}>
      {mode === 'goo' && <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />}
      <a ref={buttonRef} href={href} className={styles.button} {...rest}>
        <span className={styles.label}>{children}</span>
      </a>
    </span>
  );
};

export default VenomButton;
