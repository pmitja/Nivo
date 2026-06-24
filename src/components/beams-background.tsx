"use client";

import { useEffect, useRef } from "react";

interface Beam {
  angle: number;   // degrees from straight-down; negative = left, positive = right
  spread: number;  // half-angle of the cone in degrees
  opacity: number; // peak opacity
  phase: number;   // sine-wave phase offset (radians)
  speed: number;   // radians/second for the opacity oscillation
}

// Fixed, intentionally spaced beams — no random values so they look designed
const BEAMS: Beam[] = [
  { angle: -62, spread: 2.5, opacity: 0.07, phase: 0.0, speed: 0.38 },
  { angle: -46, spread: 3.0, opacity: 0.13, phase: 1.3, speed: 0.32 },
  { angle: -30, spread: 3.5, opacity: 0.19, phase: 2.2, speed: 0.44 },
  { angle: -14, spread: 4.5, opacity: 0.23, phase: 3.1, speed: 0.28 },
  { angle:   0, spread: 5.5, opacity: 0.26, phase: 4.0, speed: 0.36 },
  { angle:  14, spread: 4.5, opacity: 0.23, phase: 4.9, speed: 0.28 },
  { angle:  30, spread: 3.5, opacity: 0.19, phase: 5.7, speed: 0.44 },
  { angle:  46, spread: 3.0, opacity: 0.13, phase: 0.6, speed: 0.32 },
  { angle:  62, spread: 2.5, opacity: 0.07, phase: 1.9, speed: 0.38 },
];

// Cache drawn per setup; recreated only on resize
interface CachedBeam {
  gradient: CanvasGradient;
  // triangle points
  ox: number; oy: number;
  x1: number; y1: number;
  x2: number; y2: number;
  baseOpacity: number;
  phase: number;
  speed: number;
}

function buildCache(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): CachedBeam[] {
  const diagonal = Math.sqrt(w * w + h * h);
  // origin slightly above the canvas so beams feel like they come from "above"
  const ox = w / 2;
  const oy = -h * 0.08;

  return BEAMS.map((b) => {
    const aRad = (b.angle * Math.PI) / 180;
    const sRad = (b.spread * Math.PI) / 180;

    const a1 = aRad - sRad;
    const a2 = aRad + sRad;

    const x1 = ox + Math.sin(a1) * diagonal;
    const y1 = oy + Math.cos(a1) * diagonal;
    const x2 = ox + Math.sin(a2) * diagonal;
    const y2 = oy + Math.cos(a2) * diagonal;

    // gradient along the beam centre axis
    const gx = ox + Math.sin(aRad) * diagonal;
    const gy = oy + Math.cos(aRad) * diagonal;

    const gradient = ctx.createLinearGradient(ox, oy, gx, gy);
    gradient.addColorStop(0.0, `rgba(106, 90, 224, ${b.opacity})`);
    gradient.addColorStop(0.45, `rgba(106, 90, 224, ${b.opacity * 0.5})`);
    gradient.addColorStop(1.0, "rgba(106, 90, 224, 0)");

    return { gradient, ox, oy, x1, y1, x2, y2, baseOpacity: b.opacity, phase: b.phase, speed: b.speed };
  });
}

export function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let cache: CachedBeam[] = [];
    let startTime = performance.now();

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2); // cap at 2× for perf
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.scale(dpr, dpr);
      // rebuild gradient cache whenever dimensions change
      cache = buildCache(ctx!, w, h);
    }

    function draw(now: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const elapsed = (now - startTime) / 1000; // seconds

      ctx!.clearRect(0, 0, w, h);

      for (const b of cache) {
        // gentle sine-wave opacity pulse — stays within [0.4, 1.0] × baseOpacity
        const pulse = 0.7 + 0.3 * Math.sin(elapsed * b.speed + b.phase);
        ctx!.globalAlpha = pulse;
        ctx!.fillStyle = b.gradient;
        ctx!.beginPath();
        ctx!.moveTo(b.ox, b.oy);
        ctx!.lineTo(b.x1, b.y1);
        ctx!.lineTo(b.x2, b.y2);
        ctx!.closePath();
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        startTime = performance.now() - startTime; // avoid jump
        startTime = performance.now();
        rafId = requestAnimationFrame(draw);
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
      }, 100);
    }

    resize();
    rafId = requestAnimationFrame(draw);

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
