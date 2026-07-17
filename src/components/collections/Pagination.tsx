'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function Pagination({ totalItems, itemsPerPage = 12 }: { totalItems: number, itemsPerPage?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}#catalog`);
  };

  // Logic to show a truncated list of page buttons with ellipsis
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-12 pt-8 border-t border-hairline w-full flex-wrap">
      <button 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70 transition-opacity flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2"
      >
        &larr; <span className="hidden sm:inline">Prev</span>
      </button>
      
      <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-8 h-8 grid place-content-center text-[13px] text-muted">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`w-8 h-8 grid place-content-center text-[13px] font-sans transition-colors ${
                currentPage === page 
                  ? 'bg-sage text-white' 
                  : 'bg-transparent text-body hover:bg-surface border border-transparent hover:border-hairline'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70 transition-opacity flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2"
      >
        <span className="hidden sm:inline">Next</span> &rarr;
      </button>
    </div>
  );
}
