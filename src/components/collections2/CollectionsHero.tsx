'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the plugins in an SSR-safe way
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const SLIDE_DATA = [
  {
    tag: "Ember & Ash Curation",
    title: "Collections",
    desc: "Browse our catalog of custom-crafted architectural furniture. Each piece is designed to celebrate the raw, honest texture of timber, travertine, and natural fabrics.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600",
  },
  {
    tag: "Material Sourcing",
    title: "Provenance",
    desc: "We honor the weight of solid FSC Oak and hand-honed travertine. Exposed grains, tactile textures, and natural details define our curation ethos.",
    img: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1600",
  },
  {
    tag: "Form & Texture",
    title: "Living Space",
    desc: "Bringing architectural poise and comfort to residential interiors. Beautiful forms sculpted for a lifetime of sensory tactile warmth.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
  }
];

export function CollectionsHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Set up auto-play loop (change slide every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (!ribbonRef.current) return;

    // 1. Slide the ribbon to the active position
    const slidePercent = -activeIndex * (100 / SLIDE_DATA.length);
    gsap.to(ribbonRef.current, {
      xPercent: slidePercent,
      duration: 1.4,
      ease: 'power3.inOut',
      overwrite: 'auto'
    });

    // 2. Animate Ken Burns and text fades for active slide, and reset inactive ones
    SLIDE_DATA.forEach((_, idx) => {
      const slideEl = slidesRef.current[idx];
      if (!slideEl) return;

      const img = slideEl.querySelector('.slide-img');
      const content = slideEl.querySelector('.slide-content');

      if (idx === activeIndex) {
        // Active Slide: Trigger Ken Burns (slow zoom + slide left)
        gsap.fromTo(img, 
          { scale: 1.0, xPercent: 0 }, 
          { scale: 1.08, xPercent: -3, duration: 6, ease: 'none', overwrite: 'auto' }
        );
        // Fade in content
        gsap.fromTo(content, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5, overwrite: 'auto' }
        );
      } else {
        // Inactive Slides: Instantly reset positions and kill active animations
        gsap.killTweensOf([img, content]);
        gsap.set(img, { scale: 1.0, xPercent: 0 });
        gsap.set(content, { opacity: 0, y: 30 });
      }
    });

  }, { dependencies: [activeIndex], scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-ink select-none"
    >
      {/* Horizontal Ribbon Container */}
      <div 
        ref={ribbonRef}
        className="flex w-[300%] h-full"
        style={{ transform: 'translate3d(0%, 0, 0)' }}
      >
        {SLIDE_DATA.map((slide, idx) => (
          <div
            key={idx}
            ref={(el) => { slidesRef.current[idx] = el; }}
            className="w-1/3 h-full relative overflow-hidden flex-shrink-0"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-ink/35 z-10" />
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover origin-center will-change-transform slide-img"
              />
            </div>

            {/* Slide Text Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6 slide-content opacity-0">
              <div className="flex flex-col items-center max-w-3xl mx-auto">
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#C1B59A] border border-sage/30 bg-sage/10 px-3 py-1 mb-6 inline-block">
                  {slide.tag}
                </span>
                <h1 className="font-serif text-[64px] sm:text-[96px] lg:text-[110px] font-medium leading-none text-canvas tracking-[-0.03em] uppercase drop-shadow-sm mb-6">
                  {slide.title}
                </h1>
                <p className="font-sans text-[14px] sm:text-[16px] text-canvas/90 leading-[1.6] mb-8 font-light max-w-2xl">
                  {slide.desc}
                </p>
                <div className="w-12 h-[1px] bg-linen/50 mb-4" />
                <span className="font-sans text-[9px] tracking-widest uppercase text-linen/60">
                  Slide {idx + 1} / {SLIDE_DATA.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side Dots Indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {SLIDE_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
              activeIndex === idx 
                ? 'bg-sage border-sage scale-125' 
                : 'bg-canvas/30 border-canvas/20 hover:bg-canvas/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
