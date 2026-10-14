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
      className={`overflow-hidden relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-out"
        style={{
          transform: isZoomed ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        draggable={false}
      />
    </div>
  );
}

export function ProductGallery({ mainImage, extraImages = [] }: { mainImage: string; extraImages: string[] }) {
  const [activeImage, setActiveImage] = useState(mainImage);

  React.useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  const allImages = React.useMemo(() => {
    return Array.from(new Set([mainImage, ...(extraImages || [])])).filter(Boolean);
  }, [mainImage, extraImages]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image */}
      <div className="w-full bg-surface border border-hairline relative aspect-square overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md border border-hairline text-ink text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 shadow-sm z-10 pointer-events-none">
          Featured
        </div>
        <ZoomableImage
          src={activeImage || mainImage}
          alt="Featured Product"
          className="w-full h-full"
        />
      </div>

      {/* Grid of Extra Images / Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`aspect-square w-full bg-surface border overflow-hidden relative transition-all duration-300 cursor-pointer ${
                activeImage === img ? 'border-sage ring-1 ring-sage' : 'border-hairline hover:border-muted opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
