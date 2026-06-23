"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    let rx = 0, ry = 0, dx = 0, dy = 0;
    let raf = 0;
    let running = false;

    // The trailing ring only animates while it's catching up to the cursor.
    // Once it settles we stop the rAF loop entirely — no perpetual 60fps work.
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      r.style.transform = `translate3d(${rx - 17}px, ${ry - 17}px, 0)`;
      if (Math.abs(dx - rx) + Math.abs(dy - ry) < 0.5) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      d.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;
      start();
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-hover]")) r.classList.add("is-hover");
      else r.classList.remove("is-hover");
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
