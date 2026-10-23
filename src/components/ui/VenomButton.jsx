/*
 * VenomButton: a liquid, glossy CTA whose surface reaches for the cursor with white goo strings
 * that latch onto a hand-shaped cursor, stretch, snap and recoil.
 *
 * Behaviour adapted from "Venom Button" by exteestudio
 * https://github.com/exteestudio/venom-button (live demo: https://exteestudio.github.io/venom-button/)
 * The original is a WebGL2 ray-marched scene; this is a lightweight Canvas 2D re-implementation of
 * its interaction model (Verlet tendrils, second-order lunge, volume-conserving thinning, pinch-off,
 * rubber-band recoil, coils wound around the fingers of a hand cursor). Several tuning constants and
 * the overall algorithm are taken from the original, which is distributed under the MIT License:
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
const PAD = 300;          // canvas overhang around the button (CSS px), room for stretched strands
const NP = 12;            // points per strand
const SUB = 1 / 240;      // physics substep
const ITER = 3;
const MAXS = 16;
const P = {
  awareness: 200,         // px from the edge where the surface starts fizzing toward the cursor
  reach: 160,             // px from the edge where tendrils lunge and latch
  maxStrands: 6,
  snapStretch: 1.7,
  maxLen: 250,            // absolute length that always snaps
  creep: 0.25,            // viscous flow: slow pulls lengthen instead of snapping
  magnet: 1.6,
  gravity: 140,           // gentle sag so the strings hang like cords
  slither: 1,
};
const HAND_S = 2.3;       // px per hand-icon unit (24-unit frame, ~55 px icon)
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

// ───────────────────────────── simulation ─────────────────────────────
function createSim(canvas, button, root) {
  const ctx = canvas.getContext('2d');
  const hand = buildHand();
  const strands = [];
  const g = { x0: PAD, y0: PAD, w: 200, h: 60, r: 30, cx: 0, cy: 0, cssW: 0, cssH: 0, dpr: 1 };
  const cur = { cx: -1e5, cy: -1e5, x: -1e5, y: -1e5, present: false };
  const btn = { ox: 0, oy: 0, energy: 0 };
  const hs = { alpha: 0, ox: 0, oy: 0, ang: 0 };
  let time = 0, spawnCool = 0, inView = false, running = false, raf = 0, last = 0;
  let idleTimer = 0, cursorHidden = false, aware = 0, near = false;

  const layout = () => {
    const w = button.offsetWidth, h = button.offsetHeight;
    g.w = w; g.h = h; g.r = h / 2;
    g.cssW = w + PAD * 2; g.cssH = h + PAD * 2;
    g.cx = PAD + w / 2; g.cy = PAD + h / 2;
    g.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(g.cssW * g.dpr);
    canvas.height = Math.round(g.cssH * g.dpr);
    canvas.style.width = `${g.cssW}px`;
    canvas.style.height = `${g.cssH}px`;
  };

  // nearest point on the (offset) pill outline
  const edge = (px, py) => {
    const cx = g.cx + btn.ox, cy = g.cy + btn.oy, half = Math.max(0, g.w / 2 - g.r);
    const sx = clamp(px, cx - half, cx + half);
    const dx = px - sx, dy = py - cy, d = Math.hypot(dx, dy);
    const nx = d > 1e-4 ? dx / d : 0, ny = d > 1e-4 ? dy / d : -1;
    return { x: sx + nx * g.r, y: cy + ny * g.r, nx, ny, d: d - g.r, cx, cy };
  };
  const anchorFor = (px, py, lat) => {
    const e = edge(px, py);
    const q = edge(e.x - e.ny * lat, e.y + e.nx * lat);
    return { x: q.x - q.nx - q.cx, y: q.y - q.ny - q.cy }; // relative to button centre, 1px inside
  };

  const handToWorld = (ix, iy) => {
    const dx = (ix - HOT[0]) * HAND_S, dy = (iy - HOT[1]) * HAND_S;
    const c = Math.cos(hs.ang), s = Math.sin(hs.ang);
    return [cur.x + hs.ox + c * dx - s * dy, cur.y + hs.oy + s * dx + c * dy];
  };
  const coilPoint = (s, f) => {
    const w = s.wrap, F = FINGERS[w.f];
    const A = handToWorld(F.a[0], F.a[1]), B = handToWorld(F.b[0], F.b[1]);
    let ux = B[0] - A[0], uy = B[1] - A[1];
    const L = Math.hypot(ux, uy) || 1;
    ux /= L; uy /= L;
    const nx = -uy, ny = ux;
    if (w.th0 === null) {
      const side = (s.pos[0] - (A[0] + B[0]) / 2) * nx + (s.pos[1] - (A[1] + B[1]) / 2) * ny;
      w.th0 = side > 0 ? 0 : Math.PI;
      w.dir = side > 0 ? 1 : -1;
    }
    const phi = f * F.turns * 2 * Math.PI * w.prog;
    const t = clamp(F.t0 + w.slide + (F.t1 - F.t0) * f * w.prog, 0.02, 0.98);
    const th = w.th0 + w.dir * phi;
    const hw = F.hw * HAND_S + 0.9;
    return [A[0] + ux * t * L + nx * Math.cos(th) * hw, A[1] + uy * t * L + ny * Math.cos(th) * hw, Math.sin(th)];
  };

  const newStrand = (kind, a) => {
    const pos = new Float32Array(NP * 2), prev = new Float32Array(NP * 2);
    const R = [g.cx + btn.ox + a.x, g.cy + btn.oy + a.y];
    for (let i = 0; i < NP; i++) { pos[i * 2] = prev[i * 2] = R[0]; pos[i * 2 + 1] = prev[i * 2 + 1] = R[1]; }
    return {
      kind, pos, prev, rad: new Float32Array(NP), ax: a.x, ay: a.y, lat: 0, state: 'grow',
      u: 0, ud: 0, kick: true, rest: 0.5, len: 0, stretch: 1, pinch: 0, life: 0, ttl: 1,
      side: Math.random() < 0.5 ? -1 : 1, wig: rand(0.4, 1), phase: rand(0, 6.28),
      neckS: rand(0.35, 0.6), vol: 0, wrap: null, probe: null, free: false,
    };
  };

  const spawnReach = () => {
    const k = strands.filter((s) => s.kind === 'reach' && s.state !== 'recoil').length;
    const lat = [0, 30, -30, 58, -58, 82, -82][k % 7] + rand(-6, 6);
    const s = newStrand('reach', anchorFor(cur.x, cur.y, lat));
    s.lat = lat;
    s.vol = Math.PI * 1.25 * 1.25 * 170;
    const taken = new Set(strands.filter((o) => o.wrap).map((o) => o.wrap.f));
    let f = 0;
    while (taken.has(f) && f < FINGERS.length - 1) f++;
    s.wrap = { f, prog: 0, th0: null, dir: 1, ph: rand(0, 6.28), slide: 0 };
    strands.push(s);
  };
  const spawnMicro = () => {
    const lat = rand(-95, 95);
    const s = newStrand('micro', anchorFor(cur.x, cur.y, lat));
    s.lat = lat; s.state = 'attached'; s.ttl = rand(0.5, 1.3);
    s.vol = Math.PI * 0.7 * 0.7 * 40;
    s.probe = { len: rand(0.5, 1), ph: rand(0, 6.28) };
    strands.push(s);
  };
  const spawnProbes = () => {
    const ang = rand(0, Math.PI * 2), n = 2 + (Math.random() < 0.5 ? 1 : 0);
    const far = [g.cx + Math.cos(ang) * 1000, g.cy + Math.sin(ang) * 1000];
    const dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < n; i++) {
      const a = anchorFor(far[0], far[1], (i - (n - 1) / 2) * 13);
      const s = newStrand('probe', a);
      s.state = 'attached'; s.ttl = rand(0.85, 1.15);
      s.vol = Math.PI * 0.8 * 0.8 * 40;
      const e = edge(g.cx + a.x, g.cy + a.y);
      s.probe = { nx: e.nx, ny: e.ny, dist: rand(11, 20), dir, delay: i * 0.06 };
      strands.push(s);
    }
  };

  const stepStrand = (s, dt) => {
    s.life += dt;
    const w = s.wrap;
    if (w) {
      w.slide = 0.045 * Math.sin(time * 1.4 + w.ph);
      if (s.state === 'attached') w.prog += (1 - w.prog) * (1 - Math.exp(-dt * 10));
      else if (s.state === 'recoil') { w.prog -= dt * 5; if (w.prog <= 0) s.wrap = null; }
    }
    if (s.state === 'attached' && (s.kind === 'reach' || s.kind === 'micro')) {
      // sticky feet: the root peels along the surface toward the cursor
      const an = anchorFor(cur.x, cur.y, s.lat), k = 1 - Math.exp(-dt * (s.kind === 'micro' ? 2 : 1.4));
      s.ax += (an.x - s.ax) * k; s.ay += (an.y - s.ay) * k;
    }
    const R = [g.cx + btn.ox + s.ax, g.cy + btn.oy + s.ay];

    let T = null;
    if (s.kind === 'reach' && (s.state === 'grow' || s.state === 'attached')) {
      T = coilPoint(s, 0);
    } else if (s.kind === 'micro' && s.state !== 'recoil') {
      const e = edge(R[0], R[1]);
      const tx = cur.x - R[0], ty = cur.y - R[1], tl = Math.hypot(tx, ty) || 1;
      let dx = e.nx * 0.3 + (tx / tl) * 0.7, dy = e.ny * 0.3 + (ty / tl) * 0.7;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl; dy /= dl;
      const len = (6 + 26 * aware) * s.probe.len, sway = Math.sin(time * 3 + s.probe.ph) * 4;
      T = [R[0] + dx * len - dy * sway, R[1] + dy * len + dx * sway];
      if (s.life > s.ttl || aware < 0.08) s.state = 'recoil';
    } else if (s.kind === 'probe' && s.state !== 'recoil') {
      const pr = s.probe, f = clamp((s.life - pr.delay) / s.ttl, 0, 1), wave = Math.sin(Math.PI * f);
      const glide = pr.dir * (f - 0.3) * 24, out = 2 + pr.dist * wave;
      T = [R[0] + pr.nx * out - pr.ny * glide, R[1] + pr.ny * out + pr.nx * glide];
      if (s.life > s.ttl + pr.delay) s.state = 'recoil';
    }
    if (s.state === 'recoil') T = null;

    let tip = null;
    if (T) {
      const L0 = Math.hypot(T[0] - R[0], T[1] - R[1]);
      if (s.state === 'grow') {
        // second-order spring lunge: slight wind-up, fast strike, small overshoot
        const f = 3.8 * (0.75 + 0.25 * P.magnet), z = 0.5, r = -0.2;
        const k1 = z / (Math.PI * f), k2 = 1 / ((2 * Math.PI * f) ** 2), k3 = (r * z) / (2 * Math.PI * f);
        const xd = s.kick ? 1 / dt : 0; s.kick = false;
        const k2s = Math.max(k2, (dt * dt) / 2 + (dt * k1) / 2, dt * k1);
        s.u += dt * s.ud;
        s.ud += (dt * (1 + k3 * xd - s.u - k1 * s.ud)) / k2s;
        const u = s.u, uc = clamp(u, 0, 1);
        const L2 = L0 || 1, nx = -(T[1] - R[1]) / L2, ny = (T[0] - R[0]) / L2;
        const lat = s.side * s.wig * Math.sin(Math.PI * uc) * Math.min(L2 * 0.3, 38);
        tip = [R[0] + (T[0] - R[0]) * u + nx * lat, R[1] + (T[1] - R[1]) * u + ny * lat];
        s.rest = (Math.max(4, L0 * Math.max(u, 0.03)) * 1.05) / (NP - 1);
        if (u > 0.85 && Math.abs(s.ud) < 1.6) s.state = 'attached';
      } else {
        tip = T;
        let Lr = s.rest * (NP - 1);
        if (L0 < Lr * 1.03) Lr += (L0 * 1.03 - Lr) * (1 - Math.exp(-dt * 3.5));
        else Lr += (L0 - Lr) * (1 - Math.exp(-dt * P.creep));
        s.rest = Lr / (NP - 1);
        s.stretch = L0 / Math.max(Lr, 1);
        if (s.kind === 'reach' && !s.pinch && (s.stretch > P.snapStretch || L0 > P.maxLen || !cur.present)) s.pinch = 1e-4;
      }
    } else if (s.state === 'recoil') {
      // rubber-band return along its own path: fast, then easing in, no overshoot
      const Ln = Math.max(0, s.len * Math.exp(-dt * 9) - 110 * dt);
      s.rest = Ln / (NP - 1);
    }

    if (s.pinch > 0) {
      s.pinch += dt / 0.1;
      if (s.pinch >= 1) { s.pinch = 0; s.state = 'recoil'; s.snapped = true; }
    }

    // verlet integration
    const pos = s.pos, prev = s.prev, last2 = (NP - 1) * 2;
    const damp = s.state === 'recoil' ? 0.94 : 0.975;
    const ex = pos[last2] - R[0], ey = pos[last2 + 1] - R[1], el = Math.hypot(ex, ey) || 1;
    const px = -ey / el, py = ex / el;
    const slack = clamp(1.35 - s.stretch, 0.15, 1);
    const amp = (s.state === 'recoil' ? 0 : 700) * P.slither * slack * (s.state === 'grow' ? 0.4 : 1);
    const gdt = P.gravity * dt * dt * (s.kind === 'probe' ? 0.2 : 1);
    const mag = (s.kind === 'reach' || s.kind === 'micro') && s.state !== 'recoil' && cur.present ? P.magnet * 900 * dt * dt : 0;
    for (let i = 1; i < NP; i++) {
      const o = i * 2, sp = i / (NP - 1);
      const vx = (pos[o] - prev[o]) * damp, vy = (pos[o + 1] - prev[o + 1]) * damp;
      prev[o] = pos[o]; prev[o + 1] = pos[o + 1];
      const env = Math.sin(Math.PI * sp);
      const wave = Math.sin(sp * 8.5 - time * 7.5 + s.phase) * env * amp * dt * dt;
      pos[o] += vx + px * wave;
      pos[o + 1] += vy + py * wave + gdt * env;
      if (mag) {
        const mx = cur.x - pos[o], my = cur.y - pos[o + 1], ml = Math.hypot(mx, my) || 1;
        pos[o] += (mx / ml) * mag * env; pos[o + 1] += (my / ml) * mag * env;
      }
    }
    const rest = Math.max(s.rest, 0.05);
    for (let it = 0; it < ITER; it++) {
      pos[0] = R[0]; pos[1] = R[1];
      if (tip) { pos[last2] = tip[0]; pos[last2 + 1] = tip[1]; }
      for (let i = 0; i < NP - 1; i++) {
        const a = i * 2, b = a + 2;
        let dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1];
        const d = Math.hypot(dx, dy) || 1e-6;
        const wa = i === 0 ? 0 : 1, wb = i + 1 === NP - 1 && tip ? 0 : 1, ws = wa + wb;
        if (!ws) continue;
        const diff = ((d - rest) / d) * 0.95;
        dx *= diff; dy *= diff;
        if (wa) { const f = wa / ws; pos[a] += dx * f; pos[a + 1] += dy * f; }
        if (wb) { const f = wb / ws; pos[b] -= dx * f; pos[b + 1] -= dy * f; }
      }
      for (let i = 0; i < NP - 2; i++) { // resist kinking
        const a = i * 2, b = a + 4;
        let dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1];
        const d = Math.hypot(dx, dy) || 1e-6, min = rest * 1.55;
        if (d >= min) continue;
        const wa = i === 0 ? 0 : 1, wb = i + 2 === NP - 1 && tip ? 0 : 1, ws = wa + wb;
        if (!ws) continue;
        const diff = ((d - min) / d) * 0.25;
        dx *= diff; dy *= diff;
        if (wa) { const f = wa / ws; pos[a] += dx * f; pos[a + 1] += dy * f; }
        if (wb) { const f = wb / ws; pos[b] -= dx * f; pos[b + 1] -= dy * f; }
      }
    }

    // thickness: volume conservation, necking, beads
    let L = 0;
    for (let i = 0; i < NP - 1; i++) L += Math.hypot(pos[i * 2 + 2] - pos[i * 2], pos[i * 2 + 3] - pos[i * 2 + 1]);
    s.len = L;
    const rMean = clamp(Math.sqrt(s.vol / (Math.PI * Math.max(L, 2))), 0.45, s.state === 'recoil' ? 4 : 6);
    const held = s.state === 'attached' && s.kind === 'reach';
    const neck = held ? clamp((s.stretch - 1.15) / 1.2, 0, 0.7) : 0;
    const nk = neck * (1 - s.pinch) + s.pinch * 0.96;
    const bead = held ? clamp((s.stretch - 1.5) / 0.8, 0, 1) : 0;
    const beadFreq = L / (9 * Math.max(rMean, 0.6));
    for (let i = 0; i < NP; i++) {
      const sp = i / (NP - 1);
      let r = rMean * (1 + 0.55 * Math.exp(-sp / 0.08));
      if (s.wrap || s.kind !== 'reach') r *= 1 - 0.62 * ease(0.5, 1, sp);
      else r *= 1 + 0.5 * Math.exp(-(1 - sp) / 0.07);
      r *= 1 - nk * Math.exp(-(((sp - s.neckS) / 0.16) ** 2));
      r *= 1 + bead * 0.3 * Math.sin(sp * Math.PI * 2 * beadFreq + s.phase);
      s.rad[i] = Math.max(r, 0.35);
    }
    if (s.state === 'recoil' && (s.rest * (NP - 1) < 3 || L < 2)) s.dead = true;
  };

  const step = (dt) => {
    time += dt;
    const e = edge(cur.x, cur.y);
    const d = cur.present ? e.d : 1e5;
    near = d < P.awareness + 40;
    aware += ((d < P.awareness ? 1 - ease(P.reach * 0.6, P.awareness, d) : 0) - aware) * (1 - Math.exp(-dt * 6));

    if (cur.present && d < P.reach) {
      const want = Math.round(2 + (P.maxStrands - 2) * clamp(1 - d / P.reach, 0, 1));
      const live = strands.filter((s) => s.kind === 'reach' && s.state !== 'recoil').length;
      spawnCool -= dt;
      if (live < want && spawnCool <= 0 && strands.length < MAXS) { spawnReach(); spawnCool = rand(0.03, 0.06); }
    }
    if (aware > 0.15 && Math.random() < dt * 14 * aware) {
      const micro = strands.filter((s) => s.kind === 'micro' && s.state !== 'recoil').length;
      if (micro < 7 && strands.length < MAXS) spawnMicro();
    }
    for (const s of strands) stepStrand(s, dt);
    for (let i = strands.length - 1; i >= 0; i--) if (strands[i].dead) strands.splice(i, 1);

    // the body leans toward the cursor (magnetism) and glows with the activity
    const tox = aware * e.nx * 6, toy = aware * e.ny * 5;
    const k = 1 - Math.exp(-dt * 9);
    btn.ox += (tox - btn.ox) * k; btn.oy += (toy - btn.oy) * k;
    btn.energy += (aware - btn.energy) * k;

    // the hand: appears once a tendril reaches it, gets tugged and turned by the web
    let gripping = false, sx = 0, sy = 0;
    for (const s of strands) {
      if (s.kind !== 'reach' || s.state === 'recoil') continue;
      if (s.state === 'attached' || s.u > 0.5) gripping = true;
      if (s.state === 'attached' && s.wrap) {
        const o = (NP - 1) * 2, dx = s.pos[0] - s.pos[o], dy = s.pos[1] - s.pos[o + 1], l = Math.hypot(dx, dy) || 1;
        const t = clamp(s.stretch - 0.6, 0, 1.2) * s.wrap.prog;
        sx += (dx / l) * t; sy += (dy / l) * t;
      }
    }
    hs.alpha += ((gripping ? 1 : 0) - hs.alpha) * (1 - Math.exp(-dt * (gripping ? 14 : 10)));
    const sm = Math.hypot(sx, sy), mag = Math.min(10, sm * 4);
    const tx = sm > 1e-3 ? (sx / sm) * mag : 0, ty = sm > 1e-3 ? (sy / sm) * mag : 0;
    const kh = 1 - Math.exp(-dt * (sm > 1e-3 ? 6 : 18));
    hs.ox += (tx - hs.ox) * kh; hs.oy += (ty - hs.oy) * kh;
    hs.ang += (clamp(-tx * 0.035, -0.35, 0.35) - hs.ang) * kh;
  };

  // ───────────── rendering ─────────────
  const strokeStrand = (s, widthAdd, color, offset) => {
    const pos = s.pos, rad = s.rad;
    ctx.strokeStyle = color;
    for (let i = 0; i < NP - 1; i++) {
      const a = i * 2;
      ctx.lineWidth = Math.max(0.4, (rad[i] + rad[i + 1]) * (offset ? 0.28 : 1) + widthAdd);
      ctx.beginPath();
      ctx.moveTo(pos[a] - offset, pos[a + 1] - offset);
      ctx.lineTo(pos[a + 2] - offset, pos[a + 3] - offset);
      ctx.stroke();
    }
  };
  const drawCoil = (s, over) => {
    const F = FINGERS[s.wrap.f], n = Math.ceil(20 * F.turns);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = over ? 'rgba(255,255,255,0.95)' : 'rgba(200,205,212,0.6)';
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const p = coilPoint(s, i / n), vis = over ? p[2] > 0 : p[2] <= 0;
      if (vis) { if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); pen = true; } else pen = false;
    }
    ctx.stroke();
  };

  const draw = () => {
    ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
    ctx.clearRect(0, 0, g.cssW, g.cssH);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // silk webs between neighbouring held tendrils
    const held = strands.filter((s) => s.kind === 'reach' && s.state === 'attached').sort((a, b) => a.lat - b.lat);
    ctx.lineWidth = 0.6;
    for (let i = 0; i < held.length - 1; i++) {
      const a = held[i], b = held[i + 1], ia = 5 * 2, ib = 6 * 2;
      const mx = (a.pos[ia] + b.pos[ib]) / 2, my = (a.pos[ia + 1] + b.pos[ib + 1]) / 2 + 6;
      ctx.strokeStyle = `rgba(255,255,255,${0.5 * clamp(2 - Math.max(a.stretch, b.stretch), 0, 1)})`;
      ctx.beginPath();
      ctx.moveTo(a.pos[ia], a.pos[ia + 1]);
      ctx.quadraticCurveTo(mx, my, b.pos[ib], b.pos[ib + 1]);
      ctx.stroke();
    }

    for (const s of strands) {
      // goo foot: a concave meniscus drawn up out of the surface along the pull
      const e = edge(s.pos[0], s.pos[1]);
      const tx = -e.ny, ty = e.nx, bw = s.rad[0] * (s.kind === 'reach' ? 3.2 : 2.2);
      const ai = s.kind === 'reach' ? 2 : 1, apx = s.pos[ai * 2], apy = s.pos[ai * 2 + 1];
      const bx = s.pos[0] - e.nx * 1.5, by = s.pos[1] - e.ny * 1.5;
      ctx.fillStyle = 'rgba(226,230,236,0.95)';
      ctx.beginPath();
      ctx.moveTo(bx + tx * bw, by + ty * bw);
      ctx.quadraticCurveTo(s.pos[0] + tx * s.rad[0] * 0.6, s.pos[1] + ty * s.rad[0] * 0.6, apx, apy);
      ctx.quadraticCurveTo(s.pos[0] - tx * s.rad[0] * 0.6, s.pos[1] - ty * s.rad[0] * 0.6, bx - tx * bw, by - ty * bw);
      ctx.closePath();
      ctx.fill();
      strokeStrand(s, 3, 'rgba(255,255,255,0.10)', 0);   // soft halo
      strokeStrand(s, 0, 'rgba(222,226,232,0.96)', 0);   // body
      strokeStrand(s, 0, 'rgba(255,255,255,1)', 0.35);   // glossy highlight
    }

    if (hs.alpha > 0.01) {
      const coiled = strands.filter((s) => s.wrap && s.wrap.prog > 0.02);
      for (const s of coiled) drawCoil(s, false);
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
      const gl = ctx.createLinearGradient(6, 2, 18, 22);
      gl.addColorStop(0, 'rgba(255,255,255,0.28)');
      gl.addColorStop(0.45, 'rgba(255,255,255,0.04)');
      gl.addColorStop(1, 'rgba(255,255,255,0.12)');
      ctx.fillStyle = gl;
      ctx.fill(hand.body);
      ctx.lineWidth = 1 / sc;
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.stroke(hand.lines);
      ctx.restore();
      for (const s of coiled) drawCoil(s, true);
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
  const updateCursorLocal = () => {
    const rect = canvas.getBoundingClientRect();
    const k = g.cssW ? rect.width / g.cssW : 1; // ancestors may be scaled (framer-motion)
    cur.x = (cur.cx - rect.left) / (k || 1);
    cur.y = (cur.cy - rect.top) / (k || 1);
  };
  const idle = () =>
    !near && strands.length === 0 && hs.alpha < 0.01 && btn.energy < 0.005 && Math.abs(btn.ox) + Math.abs(btn.oy) < 0.05;

  const frame = (now) => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    updateCursorLocal();
    const n = Math.min(8, Math.max(1, Math.round(dt / SUB)));
    for (let i = 0; i < n; i++) step(dt / n);
    draw();
    if (!inView || idle()) {
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
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const scheduleIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (inView && !near && !document.hidden) { spawnProbes(); start(); }
      if (inView) scheduleIdle();
    }, rand(1800, 3200));
  };

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    cur.cx = e.clientX; cur.cy = e.clientY; cur.present = true;
    if (!running && inView) {
      updateCursorLocal();
      if (edge(cur.x, cur.y).d < P.awareness + 40) start();
    }
  };
  const onLeave = () => { cur.present = false; };
  const onOut = (e) => { if (!e.relatedTarget) cur.present = false; };

  layout();
  const ro = new ResizeObserver(() => { layout(); if (running) draw(); });
  ro.observe(button);
  const onDpr = () => layout();
  window.addEventListener('resize', onDpr);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) { scheduleIdle(); start(); } else clearTimeout(idleTimer);
  }, { rootMargin: '120px' });
  io.observe(root);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onOut);
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('resize', onDpr);
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
