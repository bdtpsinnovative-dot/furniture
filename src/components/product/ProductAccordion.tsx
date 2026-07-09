'use client';

import React, { useState } from 'react';

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="flex flex-col border-t border-hairline mt-10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-hairline">
            <button 
              className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
              onClick={() => toggle(index)}
            >
              <span className={`text-[14px] font-sans transition-colors duration-300 ${isOpen ? 'text-sage font-medium' : 'text-ink group-hover:text-sage'}`}>
                {item.title}
              </span>
              <span className={`text-[18px] font-light transition-all duration-300 ${isOpen ? 'text-sage' : 'text-muted group-hover:text-sage'}`}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] pb-4 opacity-100' : 'max-h-0 opacity-0'
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
