'use client';

import React, { useRef, useState, useCallback } from 'react';

function ZoomableImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsZoomed(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setOrigin({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        draggable={false}
      />
    </div>
  );
}

export function ProductGallery({ mainImage, extraImages }: { mainImage: string; extraImages: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image */}
      <div className="w-full bg-[#F5F2EC] relative aspect-[4/3]">
        <div className="absolute top-6 right-6 border border-ink text-ink text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 z-10 pointer-events-none">
          Featured
        </div>
        <ZoomableImage
          src={mainImage}
          alt="Featured Product"
          className="w-full h-full p-8 lg:p-12"
        />
      </div>

      {/* Grid of Extra Images */}
      {extraImages && extraImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {extraImages.map((img, idx) => (
            <div key={idx} className="w-full bg-[#F5F2EC] relative aspect-[4/3]">
              <ZoomableImage
                src={img}
                alt={`Product Detail ${idx + 1}`}
                className="w-full h-full p-4 lg:p-8"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
