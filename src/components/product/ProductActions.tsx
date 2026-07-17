'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface Variant {
  id: string | number;
  color?: string;
  price?: number;
  image_url?: string;
  specs?: {
    material?: string;
    width_cm?: number;
    length_cm?: number;
    thickness_cm?: number;
    group_size?: string;
  };
}

interface ProductActionsProps {
  id: string | number;
  name: string;
  price: number;
  variants?: Variant[];
}

// Extract a clean color label from "Family - 002 Light Brown" → "Light Brown"
function cleanColorLabel(raw?: string): string {
  if (!raw) return 'Default';
  return raw.replace(/^Family\s*-\s*\d+\s*/i, '').trim() || raw;
}

// Generate a unique label for a variant by appending specs if color alone is not unique or descriptive
function generateVariantLabel(v: Variant, allVariants: Variant[]): string {
  const baseColor = cleanColorLabel(v.color);
  const sameColorCount = allVariants.filter(other => cleanColorLabel(other.color) === baseColor).length;

  let label = baseColor;
  const isColorNumeric = /^\d+$/.test(baseColor);
  const isDefaultColor = baseColor.toLowerCase() === 'default';

  if (sameColorCount > 1 || isColorNumeric || isDefaultColor) {
    const specs = v.specs;
    if (specs) {
      if (specs.group_size) {
        label += isColorNumeric || isDefaultColor ? specs.group_size : ` - ${specs.group_size}`;
      } else if (specs.width_cm || specs.length_cm || specs.thickness_cm) {
        const dims = [specs.width_cm, specs.length_cm, specs.thickness_cm].filter(Boolean).join('x');
        if (dims) {
          label += isColorNumeric || isDefaultColor ? dims : ` - ${dims}cm`;
        }
      }
    }
  }

  if (label.toLowerCase() === 'default') {
    label = `Option ${v.id}`;
  } else if (label.toLowerCase().startsWith('default - ')) {
    label = label.substring(10);
  } else if (label.toLowerCase().startsWith('default')) {
    if (label.length > 7) {
      label = label.substring(7).trim();
    }
  }

  return label;
}

// Derive a CSS color approximation from the color name (best-effort)
const COLOR_MAP: Record<string, string> = {
  beige: '#D4C5A9',
  'light brown': '#A97C50',
  brown: '#7B4F2E',
  'dark brown': '#4A2C17',
  black: '#1A1A1A',
  'light black': '#3A3A3A',
  'silver grey': '#A0A0A0',
  silver: '#C0C0C0',
  white: '#F5F2EC',
  'dirty green': '#7A8C5A',
  'dark pink': '#C47A8A',
  yellow: '#D4A843',
  'light blue': '#90B4CE',
  blue: '#4A72A0',
};

function colorSwatch(colorName: string): string {
  const key = colorName.toLowerCase();
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (key.includes(k)) return v;
  }
  return '#C8C0B4'; // warm neutral fallback
}

export function ProductActions({ id, name, price, variants = [] }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  const increase = () => setQuantity(q => q + 1);

  // Group variants by material (wood type) for cleaner display
  // material format: "W07 Light Walnut" → strip code prefix
  const cleanMaterial = (m?: string) => m?.replace(/^W\d+\s*/i, '').trim() || 'Default';

  // Build structure: { material → variants[] }
  const grouped: Record<string, Variant[]> = {};
  for (const v of variants) {
    const mat = cleanMaterial(v.specs?.material);
    if (!grouped[mat]) grouped[mat] = [];
    grouped[mat].push(v);
  }
  const hasGroups = Object.keys(grouped).length > 1;
  const hoveredVariant = hoveredId != null ? variants.find(v => String(v.id) === String(hoveredId)) : null;

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Brand & Heart */}
      <div className="flex justify-between items-start">
        <span className="font-serif text-[18px] font-medium tracking-[0.1em] uppercase text-ink">Ember & Ash</span>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="hover:scale-110 transition-transform focus:outline-none"
          aria-label="Add to wishlist"
        >
          <svg viewBox="0 0 24 24" className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-sage stroke-sage' : 'stroke-ink fill-transparent'} stroke-[1.5px]`}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h1 className="font-serif text-[36px] lg:text-[42px] leading-[1.1] font-normal text-ink">{name}</h1>

      {/* Price — updates on hover */}
      <div className="text-[15px] font-semibold text-ink mt-2">
        {hoveredVariant?.price != null
          ? `฿${Number(hoveredVariant.price).toLocaleString()}`
          : `฿${Number(price).toLocaleString()}`}
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div className="flex flex-col gap-4 mt-2">
          <span className="font-sans text-[10px] uppercase tracking-widest text-muted block">
            Options / Colors
            <span className="ml-2 text-ink font-semibold normal-case tracking-normal">
              {variants.length} variants
            </span>
          </span>

          {/* Swatch groups — one section per material/frame if multiple */}
          {Object.entries(grouped).map(([mat, vars]) => (
            <div key={mat}>
              {hasGroups && (
                <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted mb-2">
                  {mat}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {vars.map((v) => {
                  const isActive = String(v.id) === String(id);
                  const baseColorLabel = cleanColorLabel(v.color);
                  const label = generateVariantLabel(v, variants);
                  const swatch = colorSwatch(baseColorLabel);
                  return (
                    <Link
                      key={v.id}
                      href={`/product/${v.id}`}
                      onMouseEnter={() => setHoveredId(v.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`relative flex items-center gap-2 px-2.5 py-1.5 border text-[11px] font-sans font-medium transition-all duration-200 ${
                        isActive
                          ? 'border-sage bg-sage/10 text-sage'
                          : 'border-hairline bg-surface text-ink hover:border-sage/60'
                      }`}
                      title={label}
                    >
                      {/* Color swatch dot */}
                      <span
                        className="w-3 h-3 flex-shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: swatch }}
                      />
                      <span className="max-w-[80px] truncate text-[11px]">{label}</span>
                      {isActive && (
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-sage rounded-full border-2 border-canvas" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Hover preview card — appears below swatches so it doesn't shift them while hovering */}
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: hoveredVariant ? '120px' : '0px',
              opacity: hoveredVariant ? 1 : 0,
            }}
          >
            {hoveredVariant && (
              <div className="flex gap-3 bg-surface border border-hairline p-3 mt-2">
                {hoveredVariant.image_url && (
                  <div className="w-[80px] h-[80px] flex-shrink-0 bg-[#F5F2EC] overflow-hidden">
                    <img
                      src={hoveredVariant.image_url}
                      alt=""
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <div className="text-[11px] font-semibold text-ink truncate">
                    {generateVariantLabel(hoveredVariant, variants)}
                  </div>
                  {hoveredVariant.specs?.material && (
                    <div className="text-[10px] text-muted truncate">
                      Frame: {cleanMaterial(hoveredVariant.specs.material)}
                    </div>
                  )}
                  {(hoveredVariant.specs?.width_cm || hoveredVariant.specs?.length_cm) && (
                    <div className="text-[10px] text-muted">
                      {hoveredVariant.specs.width_cm} × {hoveredVariant.specs.length_cm} ×{' '}
                      {hoveredVariant.specs.thickness_cm} cm
                    </div>
                  )}
                  {hoveredVariant.price != null && (
                    <div className="text-[12px] font-bold text-sage mt-0.5">
                      ฿{Number(hoveredVariant.price).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-4 h-12">
        <div className="flex items-center border border-linen bg-surface">
          <button onClick={decrease} className="w-10 h-full flex items-center justify-center text-muted hover:text-ink transition-colors focus:outline-none">
            <span className="text-[18px] leading-none mb-[2px]">-</span>
          </button>
          <span className="w-10 text-center font-sans text-[14px] text-ink">{quantity}</span>
          <button onClick={increase} className="w-10 h-full flex items-center justify-center text-muted hover:text-ink transition-colors focus:outline-none">
            <span className="text-[18px] leading-none mb-[2px]">+</span>
          </button>
        </div>
        <button className="flex-1 bg-sage text-white text-[12px] font-medium uppercase tracking-[0.1em] hover:bg-olive transition-colors rounded-none border-none focus:outline-none">
          Add to cart
        </button>
      </div>

      {/* Delivery Notice */}
      <div className="flex items-center gap-3 text-muted text-[13px] mt-2">
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-muted stroke-[1.5px] fill-none">
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>Handcrafted upon purchase. Estimated delivery in 6-8 weeks.</span>
      </div>
    </div>
  );
}
