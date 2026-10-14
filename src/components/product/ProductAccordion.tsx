'use client';

import React, { useState } from 'react';

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function ProductAccordion({ 
  items, 
  defaultOpenIndices = [0, 1] 
}: { 
  items: AccordionItem[]; 
  defaultOpenIndices?: number[];
}) {
  const [openIndices, setOpenIndices] = useState<number[]>(defaultOpenIndices);

  const toggle = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="flex flex-col border-t border-hairline mt-10">
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        return (
          <div key={index} className="border-b border-hairline">
            <button 
              className="w-full py-4 flex justify-between items-center text-left focus:outline-none group cursor-pointer"
              onClick={() => toggle(index)}
            >
              <span className={`text-[13px] font-sans font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${isOpen ? 'text-sage' : 'text-ink group-hover:text-sage'}`}>
                {item.title}
              </span>
              <span className={`text-[18px] font-light transition-all duration-300 ${isOpen ? 'text-sage' : 'text-muted group-hover:text-sage'}`}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[800px] pb-5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="text-[13px] leading-[1.6] text-muted">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
