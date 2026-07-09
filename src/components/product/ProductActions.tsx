'use client';

import React, { useState } from 'react';

interface ProductActionsProps {
  id: string | number;
  name: string;
  price: number;
}

export function ProductActions({ id, name, price }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  const increase = () => setQuantity(q => q + 1);

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
      
      {/* Price */}
      <div className="text-[15px] font-semibold text-ink mt-2">
        ${Number(price).toLocaleString()}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6 h-12">
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
