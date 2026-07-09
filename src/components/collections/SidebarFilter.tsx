'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface SidebarFilterProps {
  collectionGroups?: CollectionGroup[];
}

export function SidebarFilter({ collectionGroups = [] }: SidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];
  
  // Accordion state
  const [materialOpen, setMaterialOpen] = useState(true);
  const [groupOpen, setGroupOpen] = useState(true);

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    current.delete('page'); // Reset page to 1
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const handleMaterialChange = (material: string) => {
    let newMaterials = [...currentMaterials];
    
    if (material === 'all') {
      newMaterials = [];
    } else {
      if (newMaterials.includes(material)) {
        newMaterials = newMaterials.filter(m => m !== material);
      } else {
        newMaterials.push(material);
      }
    }

    updateParams('material', newMaterials);
  };

  const handleGroupChange = (groupId: string) => {
    let newGroups = [...currentGroups];
    
    if (groupId === 'all') {
      newGroups = [];
    } else {
      if (newGroups.includes(groupId)) {
        newGroups = newGroups.filter(g => g !== groupId);
      } else {
        newGroups.push(groupId);
      }
    }

    updateParams('group', newGroups);
  };

  const handleClearAll = () => {
    router.push(pathname);
  };

  const isAllMaterialChecked = currentMaterials.length === 0;
  const isAllGroupChecked = currentGroups.length === 0;
  
  const CheckboxIcon = ({ checked }: { checked: boolean }) => (
    <div className={`w-4 h-4 border bg-surface grid place-content-center transition-colors ${checked ? 'border-ink' : 'border-muted group-hover:border-ink'}`}>
      <div className={`w-[10px] h-[10px] bg-sage transition-transform ${checked ? 'scale-100' : 'scale-0'}`}></div>
    </div>
  );

  const AccordionIcon = ({ open }: { open: boolean }) => (
    <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-ink stroke-2 fill-none">
      {open ? (
        <line x1="5" y1="12" x2="19" y2="12"></line>
      ) : (
        <>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </>
      )}
    </svg>
  );

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[260px] flex-shrink-0">
      
      {/* Collection Group Filter */}
      {collectionGroups.length > 0 && (
        <div className="border-b border-hairline pb-4 mb-1">
          <div 
            className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setGroupOpen(!groupOpen)}
          >
            <span>Category</span>
            <AccordionIcon open={groupOpen} />
          </div>
          
          {groupOpen && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" onClick={() => handleGroupChange('all')}>
                <div className="flex items-center gap-3">
                  <CheckboxIcon checked={isAllGroupChecked} />
                  <span className="text-body">All Categories</span>
                </div>
              </label>
              {collectionGroups.map((group) => (
                <label 
                  key={group.id} 
                  className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" 
                  onClick={() => handleGroupChange(group.id)}
                >
                  <div className="flex items-center gap-3">
                    <CheckboxIcon checked={currentGroups.includes(group.id)} />
                    <span className="text-body">{group.product_sup}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div 
          className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => setMaterialOpen(!materialOpen)}
        >
          <span>Material</span>
          <AccordionIcon open={materialOpen} />
        </div>
        
        {materialOpen && (
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" onClick={() => handleMaterialChange('all')}>
              <div className="flex items-center gap-3">
                <CheckboxIcon checked={isAllMaterialChecked} />
                <span className="text-body">All Materials</span>
              </div>
            </label>
            <label className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" onClick={() => handleMaterialChange('Solid Wood')}>
              <div className="flex items-center gap-3">
                <CheckboxIcon checked={currentMaterials.includes('Solid Wood')} />
                <span className="text-body">Solid Wood</span>
              </div>
              <span className="text-[12px] text-muted"></span>
            </label>
            <label className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" onClick={() => handleMaterialChange('Bouclé Fabric')}>
              <div className="flex items-center gap-3">
                <CheckboxIcon checked={currentMaterials.includes('Bouclé Fabric')} />
                <span className="text-body">Bouclé Fabric</span>
              </div>
              <span className="text-[12px] text-muted"></span>
            </label>
            <label className="flex items-center justify-between text-[13px] color-body cursor-pointer select-none group" onClick={() => handleMaterialChange('Leather')}>
              <div className="flex items-center gap-3">
                <CheckboxIcon checked={currentMaterials.includes('Leather')} />
                <span className="text-body">Leather</span>
              </div>
              <span className="text-[12px] text-muted"></span>
            </label>
          </div>
        )}
      </div>

      {/* Wood Type Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Wood Type</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      {/* Room Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Room</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Price</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      <div 
        className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted cursor-pointer mt-2 hover:text-ink transition-colors w-fit"
        onClick={handleClearAll}
      >
        Clear All
      </div>
    </aside>
  );
}
