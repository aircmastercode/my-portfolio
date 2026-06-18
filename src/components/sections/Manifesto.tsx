"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

// Apple-style "scene, not scroll": the section pins and each word lights up
// from dim to full as the visitor scrolls through it. Restrained, professional.
export default function Manifesto() {
  const root = useRef<HTMLDivElement>(null);
  const words = profile.approach.manifesto.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>(".mf-word");
      gsap.set(wordEls, { opacity: 0.16 });
      gsap.to(wordEls, {
        opacity: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 1.5),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="manifesto" className="relative flex min-h-[100svh] items-center">
      <div className="mx-auto max-w-5xl px-6">
        <span className="eyebrow mb-8 block">The short version</span>
        <p className="font-display text-3xl font-light leading-[1.25] tracking-tight sm:text-5xl lg:text-[3.4rem]">
          {words.map((w, i) => (
            <span key={i} className="mf-word inline-block">
              {w === "shipped" || w === "AI." ? (
                <span className="font-italic-accent text-gradient">{w}</span>
              ) : (
                w
              )}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
