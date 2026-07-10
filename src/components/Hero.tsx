'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins (if any, but core gsap is fine)
const SLIDE_DATA = [
  {
    tag: "Architectural Curation",
    title: "Crafted for Calm Living.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600",
    buttons: [
      { label: "Explore Collections", href: "/collections2" },
      { label: "Our Provenance", href: "/collections2?group=oak" }
    ]
  },
  {
    tag: "Timber Provenance",
    title: "Solid FSC Oak Joinery.",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658884219-216.webp",
    buttons: [
      { label: "View Timber", href: "/collections2?group=oak" },
      { label: "Read Provenance", href: "/collections2" }
    ]
  },
  {
    tag: "Travertine Collection",
    title: "Sculpted Stone Tables.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
    buttons: [
      { label: "Shop Travertine", href: "/collections2?group=stone" },
      { label: "View Curation", href: "/collections2" }
    ]
  },
  {
    tag: "Comfort & Form",
    title: "Tactile Bouclé Chairs.",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658898381-674.webp",
    buttons: [
      { label: "Explore Comfort", href: "/collections2?group=lumina" },
      { label: "Our Story", href: "/collections2" }
    ]
  }
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-play slide cycling every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const prevIndexRef = useRef(0);

  useGSAP(() => {
    const currentIndex = activeIndex;
    const prevIndex = prevIndexRef.current;
    
    if (!slidesRef.current[currentIndex]) return;

    const currentSlide = slidesRef.current[currentIndex];
    const previousSlide = slidesRef.current[prevIndex];
    const currentImg = currentSlide.querySelector('.slide-img');
    const currentContent = currentSlide.querySelector('.slide-content');

    // Force hide and reset any stray slides if user clicks fast
    SLIDE_DATA.forEach((_, idx) => {
      if (idx !== currentIndex && idx !== prevIndex) {
        const slideEl = slidesRef.current[idx];
        if (!slideEl) return;
        gsap.killTweensOf(slideEl);
        gsap.set(slideEl, { visibility: 'hidden', zIndex: 1 });
        
        const img = slideEl.querySelector('.slide-img');
        const content = slideEl.querySelector('.slide-content');
        if (img && content) {
          gsap.killTweensOf([img, content]);
          gsap.set(img, { scale: 1.0, xPercent: 0 });
          gsap.set(content, { opacity: 0, y: 30 });
        }
      }
    });

    if (currentIndex === prevIndex) {
      // 1. Initial Load
      gsap.set(currentSlide, { xPercent: 0, visibility: 'visible', zIndex: 10 });
      gsap.fromTo(currentImg,
        { scale: 1.0, xPercent: 0 },
        { scale: 1.08, xPercent: -2.5, duration: 6.5, ease: 'none', overwrite: 'auto' }
      );
      gsap.fromTo(currentContent,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.4, overwrite: 'auto' }
      );
    } else {
      // 2. Transition
      let direction = 1;
      if (currentIndex > prevIndex) direction = 1;
      else if (currentIndex < prevIndex) direction = -1;
      
      // Wrap overrides for infinite loop
      if (currentIndex === 0 && prevIndex === SLIDE_DATA.length - 1) direction = 1;
      if (currentIndex === SLIDE_DATA.length - 1 && prevIndex === 0) direction = -1;

      const startX = 100 * direction;
      const endX = -100 * direction;

      gsap.set(currentSlide, { xPercent: startX, visibility: 'visible', zIndex: 10 });
      if (previousSlide) gsap.set(previousSlide, { zIndex: 5 });

      gsap.to(currentSlide, {
        xPercent: 0,
        duration: 1.5,
        ease: 'power3.inOut',
        overwrite: 'auto'
      });

      if (previousSlide) {
        gsap.to(previousSlide, {
          xPercent: endX,
          duration: 1.5,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(previousSlide, { visibility: 'hidden', zIndex: 1 });
            const prevImg = previousSlide.querySelector('.slide-img');
            const prevContent = previousSlide.querySelector('.slide-content');
            if (prevImg && prevContent) {
              gsap.killTweensOf([prevImg, prevContent]);
              gsap.set(prevImg, { scale: 1.0, xPercent: 0 });
              gsap.set(prevContent, { opacity: 0, y: 30 });
            }
          }
        });
      }

      gsap.fromTo(currentImg,
        { scale: 1.0, xPercent: 0 },
        { scale: 1.08, xPercent: -2.5, duration: 6.5, ease: 'none', overwrite: 'auto' }
      );
      gsap.fromTo(currentContent,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.4, overwrite: 'auto' }
      );
    }

    prevIndexRef.current = currentIndex;
  }, { dependencies: [activeIndex], scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-ink select-none"
    >
      {/* Stacked Slides */}
      <div className="absolute inset-0 w-full h-full">
        {SLIDE_DATA.map((slide, idx) => (
          <div
            key={idx}
            ref={(el) => { slidesRef.current[idx] = el; }}
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ visibility: idx === 0 ? 'visible' : 'hidden' }}
          >
            {/* Background Image & Editorial Overlay Mask */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-ink/40 z-10" />
              <img
                src={slide.img}
                alt={`${slide.title}`}
                className="slide-img absolute inset-0 w-full h-full object-cover will-change-transform"
              />
            </div>

            {/* Slide Content Box */}
            <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-25 px-6 md:px-12 text-center">
              <div className="slide-content w-full max-w-2xl flex flex-col items-center">
                {/* Collection Tag */}
                <span className="inline-block font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas/80 mb-4 md:mb-6">
                  {slide.tag}
                </span>

                {/* Title */}
                <h1 className="font-serif text-[40px] md:text-[56px] lg:text-[68px] leading-[1.1] tracking-tight text-white font-medium mb-6">
                  {slide.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                  {slide.buttons.map((btn, bIdx) => (
                    <Link
                      key={bIdx}
                      href={btn.href}
                      className={`font-sans font-semibold text-[12px] md:text-[13px] uppercase tracking-[0.1em] transition-all duration-300 ${bIdx === 0
                        ? "bg-sage text-white px-7 py-4 hover:bg-olive"
                        : "bg-transparent text-white border-b-2 border-white/60 pb-1.5 hover:text-canvas hover:border-white"
                        }`}
                    >
                      {btn.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Index Dot Navigation */}
      <div className="absolute bottom-10 right-6 md:right-20 lg:right-32 xl:right-[180px] z-30 flex items-center gap-4">
        <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-canvas/60">
          0{activeIndex + 1} / 0{SLIDE_DATA.length}
        </span>
        <div className="flex items-center gap-2">
          {SLIDE_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-[2px] transition-all duration-500 rounded-none focus:outline-none cursor-pointer ${idx === activeIndex ? 'w-10 bg-white' : 'w-4 bg-canvas/40 hover:bg-canvas/80'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
