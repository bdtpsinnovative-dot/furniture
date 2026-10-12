'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from './PremiumProductCard';

// ─── Individual Card with Multi-Image Cycling ──────────────────────────────
function AsymCard({
  product,
  index,
  aspectClass = 'aspect-square',
  hFull = false,
}: {
  product: Product;
  index: number;
  aspectClass?: string;
  hFull?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Direct DOM manipulation bypasses React state for buttery smooth 60fps tracking
    const imgs = imageRef.current.querySelectorAll<HTMLElement>('.card-img');
    imgs.forEach(img => {
      img.style.transformOrigin = `${x}% ${y}%`;
    });
  }, []);

  // Extract all unique images
  const images = useMemo(() => {
    const list: string[] = [];
    if (product.image_url) {
      list.push(product.image_url);
    }
    const extraImages = product.specs?.images;
    if (Array.isArray(extraImages)) {
      extraImages.forEach((img: unknown) => {
        if (typeof img === 'string') {
          list.push(img);
        } else if (img && typeof img === 'object' && 'path' in img && typeof (img as { path: unknown }).path === 'string') {
          list.push((img as { path: string }).path);
        }
      });
    }
    return Array.from(new Set(list)).filter(Boolean);
  }, [product.image_url, product.specs?.images]);

  // Cycle images automatically if there are multiple
  useEffect(() => {
    if (images.length <= 1) return;

    let timer: NodeJS.Timeout;
    
    // Stagger start based on index to prevent cards from changing images in perfect unison
    const delay = index * 300;
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [images.length, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1], // Custom bounce/spring-like ease
        delay: (index % 3) * 0.1 // Staggering effect based on index
      }}
      className={`flex flex-col group w-full ${hFull ? 'h-full' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (imageRef.current) {
          const imgs = imageRef.current.querySelectorAll<HTMLElement>('.card-img');
          imgs.forEach(img => {
            img.style.transformOrigin = '50% 50%';
          });
        }
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={imageRef}
        className={`relative ${aspectClass} w-full overflow-hidden cursor-pointer bg-transparent transition-shadow duration-500 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] ${hFull ? 'flex-grow' : ''}`}
      >
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-20" aria-label={product.name} />
        
        {images.length > 0 ? (
          images.map((imgUrl, idx) => (
            <img
              key={`${product.id}-${idx}`}
              src={imgUrl}
              alt={`${product.name} - view ${idx + 1}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="card-img absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{
                opacity: currentImageIndex === idx ? 1 : 0,
                transform: currentImageIndex === idx
                  ? (hovered ? 'scale(1.05)' : 'scale(1)')
                  : 'scale(1.02)',
                transformOrigin: '50% 50%', // default, dynamically updated via DOM
                transition: 'opacity 1000ms ease-in-out, transform 700ms cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: currentImageIndex === idx ? 'auto' : 'none',
              }}
            />
          ))
        ) : (
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Discount Badge */}
        {product.discount_label && (
          <div className="absolute top-3.5 left-3.5 z-25 px-2 py-0.5 bg-[#8C3A36] text-white font-sans text-[10px] font-bold tracking-wider uppercase shadow-sm pointer-events-none">
            {product.discount_label}
          </div>
        )}

        {/* Gallery Dot Indicators for Multi-image Slabs */}
        {images.length > 1 && (
          <div className="absolute top-3.5 right-3.5 z-25 flex gap-1.5 px-2.5 py-1 bg-ink/25 backdrop-blur-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            {images.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCurrentImageIndex(idx);
                }}
                className={`h-[4px] rounded-full transition-all duration-500 focus:outline-none cursor-pointer ${
                  currentImageIndex === idx ? 'w-4 bg-white' : 'w-1 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* ── Glassmorphic Slide-up Overlay inside the image ── */}
        <div
          className={`absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-ink/85 via-ink/50 to-transparent backdrop-blur-[3px] text-canvas transition-all duration-400 ease-out flex flex-col justify-end ${
            hovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-5 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-canvas/80 truncate">
              {product.category_id || 'Furniture'}
              {product.specs?.material ? ` · ${product.specs.material}` : ''}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {product.original_price && product.original_price > product.price ? (
                <>
                  <span className="font-sans text-[11px] line-through text-canvas/50">
                    ฿{Number(product.original_price).toLocaleString()}
                  </span>
                  <span className="font-sans text-[13px] font-semibold text-white">
                    ฿{Number(product.price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="font-sans text-[13px] font-medium text-canvas">
                  ฿{Number(product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D8CFBC] group-hover:text-white transition-colors">
            <span>View piece</span>
            <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current stroke-[2px] fill-none transition-transform duration-300 group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Caption ── */}
      <div className="pt-3 pb-2 bg-canvas">
        <div className="relative inline-block min-w-0">
          <h3
            className="font-sans font-semibold uppercase tracking-tight text-ink leading-tight text-[13px] md:text-[14px] truncate"
            style={{ letterSpacing: '-0.01em' }}
          >
            {product.name}
          </h3>
          {/* Sage underline accent — grows from left on hover */}
          <span
            className="absolute bottom-0 left-0 transition-all duration-500"
            style={{
              width: hovered ? '100%' : '0%',
              height: '2px',
              backgroundColor: '#656C54',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export: Alternating Predictable Rows ──────────────────────────────
export function AsymmetricGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const rows: React.ReactNode[] = [];
  let i = 0;
  let rowIndex = 0;

  while (i < products.length) {
    const cycle = rowIndex % 2; // 0 = A (Asymmetric Left), 1 = C (3 normal columns)
    rowIndex++;

    if (cycle === 0) {
      // Row Pattern A: [Wide Left (2fr), 2 Stacked Small Right (1fr)]
      const p1 = products[i];
      const p2 = products[i + 1];
      const p3 = products[i + 2];

      if (p1 && p2 && p3) {
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-1 items-start mb-1">
            <AsymCard product={p1} index={i} aspectClass="aspect-square md:aspect-auto md:h-full" hFull={true} />
            <div className="grid grid-cols-2 md:flex md:flex-col gap-1">
              <AsymCard product={p2} index={i + 1} aspectClass="aspect-square" />
              <AsymCard product={p3} index={i + 2} aspectClass="aspect-square" />
            </div>
          </div>
        );
        i += 3;
      } else if (p1 && p2) {
        // Fallback for 2 products: wide left, small right
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-1 items-start mb-1">
            <AsymCard product={p1} index={i} aspectClass="aspect-square" />
            <AsymCard product={p2} index={i + 1} aspectClass="aspect-square" />
          </div>
        );
        i += 2;
      } else {
        // Fallback for final single product
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
            <div className="col-span-1">
              <AsymCard product={p1} index={i} aspectClass="aspect-square" />
            </div>
          </div>
        );
        i++;
      }
    } else {
      // Row Pattern C: [Normal, Normal, Normal]
      const p1 = products[i];
      const p2 = products[i + 1];
      const p3 = products[i + 2];

      if (p1 && p2 && p3) {
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-2 md:grid-cols-3 gap-1 items-start mb-1">
            <div className="col-span-2 md:col-span-1">
              <AsymCard product={p1} index={i} aspectClass="aspect-square" />
            </div>
            <AsymCard product={p2} index={i + 1} aspectClass="aspect-square" />
            <AsymCard product={p3} index={i + 2} aspectClass="aspect-square" />
          </div>
        );
        i += 3;
      } else {
        // Fallback if we only have 1 or 2 products left
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-2 md:grid-cols-3 gap-1 mb-1">
            {p1 && <AsymCard product={p1} index={i} aspectClass="aspect-square" />}
            {p2 && <AsymCard product={p2} index={i + 1} aspectClass="aspect-square" />}
          </div>
        );
        i += (p2 ? 2 : 1);
      }
    }
  }

  return <div className="w-full flex flex-col">{rows}</div>;
}
