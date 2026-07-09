'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface Collections2SidebarProps {
  collectionGroups?: CollectionGroup[];
}

export function Collections2Sidebar({ collectionGroups = [] }: Collections2SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    current.delete('page'); // Reset to page 1
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const handleMaterialToggle = (material: string) => {
    let newMaterials = [...currentMaterials];
    if (newMaterials.includes(material)) {
      newMaterials = newMaterials.filter(m => m !== material);
    } else {
      newMaterials.push(material);
    }
    updateParams('material', newMaterials);
  };

  const handleGroupToggle = (groupId: string) => {
    let newGroups = [...currentGroups];
    if (newGroups.includes(groupId)) {
      newGroups = newGroups.filter(g => g !== groupId);
    } else {
      newGroups.push(groupId);
    }
    updateParams('group', newGroups);
  };

  const handleClearAll = () => {
    router.push(pathname);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 sticky top-28 h-fit border-r border-hairline pr-10">
      
      {/* 1. Filter Section: Category */}
      <div className="border-b border-hairline pb-8 mb-8">
        <h4 className="font-serif text-[13px] font-semibold uppercase tracking-[0.15em] text-ink mb-6">
          Architectural Class
        </h4>
        <div className="flex flex-col gap-3">
          {collectionGroups.map((group) => {
            const isActive = currentGroups.includes(group.id);
            return (
              <button
                key={group.id}
                onClick={() => handleGroupToggle(group.id)}
                className="flex items-center text-left text-[13px] font-medium transition-colors hover:text-sage w-full group relative"
              >
                <span className={`w-[6px] h-[6px] bg-sage absolute left-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'}`} />
                <span className={`font-sans tracking-wide transition-all ${isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'}`}>
                  {group.product_sup}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filter Section: Materials */}
      <div className="border-b border-hairline pb-8 mb-8">
        <h4 className="font-serif text-[13px] font-semibold uppercase tracking-[0.15em] text-ink mb-6">
          Material Palette
        </h4>
        <div className="flex flex-col gap-3">
          {['Solid Wood', 'Bouclé Fabric', 'Leather'].map((material) => {
            const isActive = currentMaterials.includes(material);
            return (
              <button
                key={material}
                onClick={() => handleMaterialToggle(material)}
                className="flex items-center text-left text-[13px] font-medium transition-colors hover:text-sage w-full group relative"
              >
                <span className={`w-[6px] h-[6px] bg-sand absolute left-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'}`} />
                <span className={`font-sans tracking-wide transition-all ${isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'}`}>
                  {material}
                </span>
              </button>
            );
          })}
        </div>
        
        {(currentMaterials.length > 0 || currentGroups.length > 0) && (
          <button 
            className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors mt-6 block text-left"
            onClick={handleClearAll}
          >
            Reset Filters &times;
          </button>
        )}
      </div>

      {/* 3. Curation Note (Fills vertical empty space with beautiful editorial copy) */}
      <div className="border-b border-hairline pb-8 mb-8">
        <span className="font-sans text-[9px] uppercase tracking-widest text-muted block mb-3">
          Curation Principles
        </span>
        <p className="font-serif text-[14px] text-body leading-[1.6] italic">
          "The visual language blends the raw organic beauty of nature with refined structural modernism. We prioritize pure forms and uncompromised materials."
        </p>
      </div>

      {/* 4. Batch Provenance (Fills vertical space with technical/craft specifications) */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-[9px] uppercase tracking-widest text-muted block mb-1">
          Exhibition Provenance
        </span>
        <div className="text-[11px] font-medium text-body leading-[1.5] uppercase tracking-wider">
          Origin: Stockholm / Bangkok<br />
          Timber: FSC Certified Oak<br />
          Upholstery: Belgian Bouclé<br />
          Batch No: EA-04-2026
        </div>
      </div>

    </aside>
  );
}
