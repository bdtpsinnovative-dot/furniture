'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function CatalogControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Debounce logic for search
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      // Only push if there's an actual change in the URL to avoid endless loops
      const currentQ = current.get('q') || '';
      if (currentQ !== searchTerm) {
        if (searchTerm) {
          current.set('q', searchTerm);
        } else {
          current.delete('q');
        }
        
        // Reset page to 1 when search changes
        current.delete('page');

        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.target.value) {
      current.set('sort', e.target.value);
    } else {
      current.delete('sort');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-hairline pb-4 mb-6 gap-4 w-full">
      <div className="relative w-full md:w-[320px]">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search furniture" 
          className="w-full bg-surface border border-linen rounded-none py-[10px] pl-4 pr-10 font-sans text-[13px] text-ink outline-none focus:border-ink transition-colors"
        />
        <svg viewBox="0 0 24 24" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-muted stroke-[1.5px] fill-none">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <span className="text-ink font-medium uppercase tracking-[0.05em]">Sort By</span>
        <select 
          className="border-none bg-transparent font-sans text-[13px] font-medium text-ink outline-none cursor-pointer pr-1"
          value={searchParams.get('sort') || ''}
          onChange={handleSortChange}
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
