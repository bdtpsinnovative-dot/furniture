'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header({ dynamic = false }: { dynamic?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!dynamic) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run initially

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dynamic]);

  const isTransparent = dynamic && !isScrolled;
  const isCollectionsActive = pathname === '/collections2';

  return (
    <header
      className={`w-full z-50 transition-all duration-500 ease-in-out ${
        isTransparent
          ? 'absolute top-0 left-0 bg-transparent border-b border-transparent py-6 px-6 md:px-20 lg:px-32 xl:px-[180px]'
          : 'fixed top-0 left-0 bg-canvas/92 backdrop-blur-md border-b border-hairline py-3.5 px-6 md:px-20 lg:px-32 xl:px-[180px] shadow-sm'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex justify-between items-center relative">

        {/* Left: Brand Logo (Dynamic theme swap) */}
        <div className="flex items-center z-10">
          <Link href="/" className="flex items-center">
            <img
              src="/image-Photoroom.png"
              alt="Ember & Ash Logo"
              className={`h-14 md:h-16 w-auto object-contain transition-all duration-500 ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>
        </div>

        {/* Center: Navigation Links (Dynamic color swap) */}
        <ul className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center gap-8 list-none z-0">
          <li>
            <Link
              href="/collections2"
              className={`text-[12px] font-semibold uppercase tracking-[0.1em] py-1 transition-all duration-300 border-b-2 ${
                isCollectionsActive
                  ? isTransparent
                    ? 'text-white border-white'
                    : 'text-ink border-sage'
                  : isTransparent
                    ? 'text-canvas/75 border-transparent hover:border-canvas/40 hover:text-white'
                    : 'text-ink/75 border-transparent hover:text-sage'
              }`}
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`text-[12px] font-medium uppercase tracking-[0.1em] py-1 transition-all duration-300 ${
                isTransparent ? 'text-canvas/75 hover:text-white' : 'text-ink/75 hover:text-sage'
              }`}
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`text-[12px] font-medium uppercase tracking-[0.1em] py-1 transition-all duration-300 ${
                isTransparent ? 'text-canvas/75 hover:text-white' : 'text-ink/75 hover:text-sage'
              }`}
            >
              Materials
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`text-[12px] font-medium uppercase tracking-[0.1em] py-1 transition-all duration-300 ${
                isTransparent ? 'text-canvas/75 hover:text-white' : 'text-ink/75 hover:text-sage'
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`text-[12px] font-medium uppercase tracking-[0.1em] py-1 transition-all duration-300 ${
                isTransparent ? 'text-canvas/75 hover:text-white' : 'text-ink/75 hover:text-sage'
              }`}
            >
              Journal
            </Link>
          </li>
        </ul>

        {/* Right: Action Buttons (Dynamic color swap) */}
        <div className="flex justify-end items-center gap-4 z-10">
          <button
            className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
              isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                isTransparent ? 'stroke-canvas' : 'stroke-ink'
              }`}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="hidden lg:inline">Search</span>
          </button>

          <button
            className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
              isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                isTransparent ? 'stroke-canvas' : 'stroke-ink'
              }`}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="hidden lg:inline">Wishlist</span>
          </button>

          <button
            className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
              isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                isTransparent ? 'stroke-canvas' : 'stroke-ink'
              }`}
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="hidden lg:inline">Cart (0)</span>
          </button>
        </div>

      </div>
    </header>
  );
}
