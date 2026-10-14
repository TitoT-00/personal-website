"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  base: number;
  pulse: number;
  speed: number;
  tint: number;
};

export default function Starfield({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let stars: Star[] = [];
    let dirty = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const createStars = () => {
      const count = Math.min(180, Math.max(70, Math.floor((width * height) / 12500)));
      stars = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 18 === 0 ? 1.4 : .45 + Math.random() * .65,
        base: .08 + Math.random() * .2,
        pulse: Math.random() * Math.PI * 2,
        speed: .00035 + Math.random() * .001,
        tint: Math.random(),
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio, 1);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createStars();
      dirty = true;
    };

    let elapsed = 0;
    let previous = performance.now();
    let lastPaint = 0;
    const draw = (time: number) => {
      animationFrame = requestAnimationFrame(draw);
      const delta = Math.max(0, Math.min(time - previous, 40));
      previous = time;
      if (document.hidden) return;
      const animate = !pausedRef.current && !reducedMotion.matches;
      if (animate) elapsed += delta;
      // The slow background shimmer needs only 30 updates/second; paused
      // backgrounds remain cached instead of repainting their full canvas.
      if (!dirty && (!animate || time - lastPaint < 1000 / 30)) return;
      lastPaint = time; dirty = false;
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const shimmer = reducedMotion.matches ? .25 : (Math.sin(elapsed * star.speed + star.pulse) + 1) / 2;
        const alpha = star.base + shimmer * .32;
        const red = star.tint > .82 ? 191 : 218;
        const green = star.tint > .82 ? 205 : 219;
        const blue = star.tint > .82 ? 255 : 238;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * (.85 + shimmer * .25), 0, Math.PI * 2);
        context.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
        context.fill();
      }
      context.shadowBlur = 0;
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-starfield" aria-hidden="true" />;
}
