'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Pagination } from '@/components/collections/Pagination';
import { PremiumProductCard, Product } from './PremiumProductCard';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface CatalogLayoutProps {
  products: Product[];
  collectionGroups: CollectionGroup[];
  totalCount: number;
  itemsPerPage: number;
}

export function CatalogLayout({
  products,
  collectionGroups,
  totalCount,
  itemsPerPage,
}: CatalogLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter States
  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Search Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const currentQ = current.get('q') || '';
      if (currentQ !== searchTerm) {
        if (searchTerm) {
          current.set('q', searchTerm);
        } else {
          current.delete('q');
        }
        current.delete('page'); // reset page to 1
        router.push(`${pathname}?${current.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    current.delete('page');
    router.push(`${pathname}?${current.toString()}`);
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.target.value) {
      current.set('sort', e.target.value);
    } else {
      current.delete('sort');
    }
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleClearAll = () => {
    router.push(pathname);
    setSearchTerm('');
  };

  return (
    <>
      {/* Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/30 backdrop-blur-[3px] z-50 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Drawer Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 w-[320px] bg-canvas border-r border-hairline z-50 p-8 flex flex-col justify-between shadow-[20px_0_50px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col">
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-6 border-b border-hairline mb-8">
            <span className="font-serif text-[18px] font-medium text-ink uppercase tracking-wide">
              Exhibition Filter
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-8 h-8 rounded-none border border-hairline flex items-center justify-center bg-surface text-ink hover:bg-sage hover:text-white hover:border-sage transition-all duration-300 cursor-pointer text-lg font-light"
              aria-label="Close filters"
            >
              &times;
            </button>
          </div>

          {/* Section: Category */}
          <div className="border-b border-hairline pb-8 mb-8">
            <h4 className="font-serif text-[12px] font-semibold uppercase tracking-[0.15em] text-ink mb-6">
              Architectural Class
            </h4>
            <div className="flex flex-col gap-3.5">
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

          {/* Section: Materials */}
          <div className="border-b border-hairline pb-8 mb-8">
            <h4 className="font-serif text-[12px] font-semibold uppercase tracking-[0.15em] text-ink mb-6">
              Material Palette
            </h4>
            <div className="flex flex-col gap-3.5">
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
          </div>
        </div>

        {/* Reset & Provenance Metadata */}
        <div className="flex flex-col gap-6">
          {(currentMaterials.length > 0 || currentGroups.length > 0 || searchTerm) && (
            <button
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors text-left bg-transparent border-none cursor-pointer"
              onClick={handleClearAll}
            >
              Reset All Filters &times;
            </button>
          )}

          <div className="border-t border-hairline pt-6">
            <span className="font-sans text-[9px] uppercase tracking-widest text-muted block mb-2">
              Exhibition Provenance
            </span>
            <div className="text-[10px] font-medium text-body leading-[1.5] uppercase tracking-wider">
              Timber: FSC Certified Oak<br />
              Upholstery: Belgian Bouclé<br />
              Batch No: EA-04-2026
            </div>
          </div>
        </div>
      </aside>

      {/* Main Squeezed Content Wrapper */}
      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-20 lg:px-32 xl:px-[180px] py-16">
        <div className="w-full flex flex-col">

          {/* Header above search bar */}
          <div className="mb-10 text-left border-b border-hairline/40 pb-6">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage mb-2.5 block">
              Collection Directory
            </span>
            <h2 className="font-serif text-[38px] md:text-[46px] font-medium leading-[1.1] text-ink tracking-tight">
              Curated Exhibition
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center border-b border-hairline pb-5 mb-8 gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 flex-grow md:max-w-3xl">
              {/* Collapsible Trigger Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center justify-center gap-2 border border-sage/85 bg-transparent text-sage hover:bg-sage hover:text-white font-sans text-[13px] font-medium uppercase tracking-[0.05em] py-[10px] px-6 rounded-none transition-all duration-300 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current stroke-[1.5px] fill-none">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                + Filter
              </button>

              {/* Minimalist Search Bar with Left Icon */}
              <div className="relative flex-grow md:max-w-2xl border-b border-hairline focus-within:border-sage transition-colors duration-300 pb-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search the collection..."
                  className="w-full bg-transparent border-none py-[10px] pl-8 pr-4 font-sans text-[14px] text-ink outline-none placeholder:text-muted/50"
                />
                <svg viewBox="0 0 24 24" className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 stroke-muted stroke-[1.5px] fill-none">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Inline Sort controls */}
            <div className="flex items-center justify-between md:justify-end gap-2 text-[12px] text-muted self-start md:self-auto border-b border-hairline pb-1.5 focus-within:border-sage transition-colors duration-300">
              <span className="text-ink font-semibold uppercase tracking-[0.05em] text-[11px]">Sort By</span>
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

          {/* Item count summary */}
          <div className="font-sans text-[12px] text-muted mb-8 text-left">
            Showing <span className="text-ink font-semibold">{products.length}</span> of <span className="text-ink font-semibold">{totalCount}</span> curation items
          </div>

          {/* Uniform Exhibition Grid (Equal sized cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-6 min-h-[400px] w-full">
            {products.length > 0 ? (
              products.map((product, index) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted border border-dashed border-hairline w-full">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-muted stroke-[1.5px] fill-none mb-3">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-[14px]">No furniture pieces found matching your filter selection.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
        </div>
      </main>
    </>
  );
}
