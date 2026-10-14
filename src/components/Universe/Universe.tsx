"use client";
import { useEffect, useRef } from "react";

export default function Universe({ paused, zoom, reset, color }: { paused: boolean; zoom: number; reset: number; color: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ paused, zoom, color });
  const rotation = useRef({ x: -.32, y: 0 });
  useEffect(() => { settings.current = { paused, zoom, color }; }, [paused, zoom, color]);
  useEffect(() => { rotation.current = { x: -.32, y: 0 }; }, [reset]);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, frame = 0, time = 0, last = 0;
    let dragging = false, px = 0, py = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = new ResizeObserver(() => {
      w = el.clientWidth; h = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(el);
    const down = (e: PointerEvent) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (dragging) { rotation.current.y += (e.clientX - px) * .006; rotation.current.x += (e.clientY - py) * .006; px = e.clientX; py = e.clientY; } };
    const up = () => { dragging = false; };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(now - last, 40); last = now;
      if (!settings.current.paused && !reduced.matches && !dragging) time += dt * .00015;
      ctx.clearRect(0, 0, w, h);
      const cx = w * .5, cy = h * .49, size = Math.min(w * .26, h * .34) * settings.current.zoom;
      for (let i = 0; i < 160; i++) {
        const x = ((Math.sin(i * 127.1) * 43758.54) % 1 + 1) % 1 * w;
        const y = ((Math.sin(i * 311.7) * 19758.54) % 1 + 1) % 1 * h;
        ctx.fillStyle = `rgba(182,189,220,${.12 + (i % 5) * .07})`; ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
      }
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.8);
      glow.addColorStop(0, settings.current.color + "20"); glow.addColorStop(.5, "#7054ff0a"); glow.addColorStop(1, "#00000000");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
      const project = (x: number, y: number, z: number) => {
        const ry = rotation.current.y + time * .3;
        const xx = x * Math.cos(ry) + z * Math.sin(ry), zz = -x * Math.sin(ry) + z * Math.cos(ry);
        const rx = rotation.current.x;
        const yy = y * Math.cos(rx) - zz * Math.sin(rx), depth = y * Math.sin(rx) + zz * Math.cos(rx);
        const p = 4 / (4 + depth);
        return [cx + xx * size * p, cy + yy * size * p, depth];
      };
      // A twisted toroidal field, projected from 3D and lit by depth.
      for (let strand = 0; strand < 84; strand++) {
        const v = strand / 84 * Math.PI * 2;
        ctx.beginPath();
        let depth = 0;
        for (let i = 0; i <= 220; i++) {
          const u = i / 220 * Math.PI * 2;
          const twist = v + 3 * u + time;
          const r = .72 + .27 * Math.cos(twist);
          const [x, y, z] = project(r * Math.cos(u), r * Math.sin(u), .3 * Math.sin(twist));
          depth += z;
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const light = .23 + (Math.sin(v + time) + 1) * .2;
        ctx.strokeStyle = `hsla(${245 + Math.sin(v + time) * 35}, ${70 + Math.cos(v) * 20}%, ${64 + Math.sin(v) * 20}%, ${light + depth / 220 * .1})`;
        ctx.lineWidth = strand % 7 === 0 ? 1.3 : .65; ctx.stroke();
      }
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const t = i / 180 * Math.PI * 2;
          const [x, y] = project(Math.cos(t) * (1.38 + ring * .14), Math.sin(t) * (.95 + ring * .14), Math.sin(t + ring) * .6);
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = ring === 0 ? "#aaa0e32c" : "#aaa0e313"; ctx.lineWidth = .7; ctx.stroke();
      }

      // A few depth-sorted particles make the field read as a volume instead
      // of a flat wireframe, while staying subtle behind the portfolio nodes.
      const particles = Array.from({ length: 34 }, (_, index) => {
        const angle = index * 2.399 + time * (index % 2 ? .7 : -.45);
        const radius = 1.05 + (index % 7) * .085;
        const [x, y, depth] = project(
          Math.cos(angle) * radius,
          Math.sin(angle * .83) * radius,
          Math.sin(angle) * .72,
        );
        return { x, y, depth, index };
      }).sort((a, b) => b.depth - a.depth);

      for (const particle of particles) {
        const near = Math.max(0, Math.min(1, (1.5 - particle.depth) / 3));
        const radius = .7 + near * 1.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.index % 5 === 0
          ? `rgba(121,215,234,${.18 + near * .42})`
          : `rgba(193,174,255,${.12 + near * .35})`;
        ctx.shadowColor = settings.current.color;
        ctx.shadowBlur = 4 + near * 7;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, []);
  return <canvas ref={canvas} className="universe-canvas" aria-label="Interactive three-dimensional flowing torus. Drag to rotate, or use the scene controls." />;
}
