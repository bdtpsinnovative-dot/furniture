'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Pagination } from '@/components/collections/Pagination';
import { Product } from './PremiumProductCard';
import { AsymmetricGrid } from './AsymmetricGrid';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Sticky sidebar logic for items taller than the viewport
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rect = sidebar.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sidebarHeight = rect.height;

      // Scroll direction
      const isScrollingDown = scrollY > lastScrollY;
      lastScrollY = scrollY;

      // If sidebar is shorter than viewport, standard sticky top is fine
      if (sidebarHeight < viewportHeight - 140) {
        sidebar.style.position = 'sticky';
        sidebar.style.top = '120px';
        sidebar.style.bottom = 'auto';
        return;
      }

      // If taller than viewport:
      if (isScrollingDown) {
        // Scrolling down: stick to the bottom of the viewport
        const bottomOffset = viewportHeight - sidebarHeight - 40; // 40px padding at bottom
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${bottomOffset}px`;
        sidebar.style.bottom = 'auto';
      } else {
        // Scrolling up: stick to the top of the viewport
        sidebar.style.position = 'sticky';
        sidebar.style.top = '120px';
        sidebar.style.bottom = 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const currentQ = current.get('q') || '';
      if (currentQ !== searchTerm) {
        if (searchTerm) current.set('q', searchTerm);
        else current.delete('q');
        current.delete('page');
        startTransition(() => {
          router.push(`${pathname}?${current.toString()}`, { scroll: false });
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) current.set(key, values.join(','));
    else current.delete(key);
    current.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };

  const handleMaterialToggle = (material: string) => {
    const next = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    updateParams('material', next);
  };

  const handleGroupToggle = (groupId: string) => {
    const next = currentGroups.includes(groupId)
      ? currentGroups.filter(g => g !== groupId)
      : [...currentGroups, groupId];
    updateParams('group', next);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.target.value) current.set('sort', e.target.value);
    else current.delete('sort');
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
    setSearchTerm('');
  };

  const hasActiveFilters = currentMaterials.length > 0 || currentGroups.length > 0 || !!searchTerm;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 md:px-20 lg:px-32 xl:px-[180px] pt-28 pb-20 lg:pt-36">

      {/* Sage loading bar — appears at top when filter is fetching */}
      <div
        className="fixed top-0 left-0 z-50 h-[2px] bg-sage transition-all duration-500"
        style={{
          width: isPending ? '100%' : '0%',
          opacity: isPending ? 1 : 0,
          transition: isPending
            ? 'width 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease'
            : 'opacity 300ms ease 100ms, width 0ms ease 400ms',
        }}
      />

      {/* Page Title */}
      <div className="mb-12 border-b border-hairline/40 pb-8 flex items-end gap-6">
        <div className="w-[3px] h-12 bg-sage flex-shrink-0 self-stretch" />
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage mb-2.5 block">
            Collection Directory
          </span>
          <h1 className="font-serif text-[38px] md:text-[52px] font-medium leading-[1.05] text-ink tracking-tight">
            Curated Exhibition
          </h1>
        </div>
      </div>

      {/* Two-column layout: products LEFT, filter panel RIGHT */}
      <div className="flex gap-16 xl:gap-20 items-start relative">

        {/* ── LEFT: Product Grid ──────────────────────────────────── */}
        <div
          className="flex-1 min-w-0"
          style={{
            opacity: isPending ? 0.5 : 1,
            transition: 'opacity 200ms ease',
            pointerEvents: isPending ? 'none' : 'auto',
          }}
        >

          {/* Item count */}
          <div className="font-sans text-[11px] text-muted mb-8">
            Showing{' '}
            <span className="text-ink font-semibold">{products.length}</span>
            {' '}of{' '}
            <span className="text-ink font-semibold">{totalCount}</span>
            {' '}pieces
          </div>

          {products.length > 0 ? (
            <AsymmetricGrid products={products} />
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-muted border border-dashed border-hairline w-full">
              <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-muted stroke-[1.5px] fill-none mb-3">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-[14px]">No pieces found matching your filters.</p>
            </div>
          )}

          <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
        </div>

        {/* ── RIGHT: Sticky Filter Panel ─────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col gap-10 w-[240px] xl:w-[260px] flex-shrink-0"
          style={{ position: 'sticky', top: '120px', alignSelf: 'flex-start' }}
        >

          {/* Search */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-3">
              Search
            </span>
            <div className="relative border-b border-hairline focus-within:border-sage transition-colors duration-300 pb-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pieces…"
                className="w-full bg-transparent border-none py-2 pl-7 pr-2 font-sans text-[13px] text-ink outline-none placeholder:text-muted/50"
              />
              <svg viewBox="0 0 24 24" className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 stroke-muted stroke-[1.5px] fill-none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-3">
              Sort By
            </span>
            <div className="border-b border-hairline focus-within:border-sage transition-colors duration-300 pb-1">
              <select
                className="w-full border-none bg-transparent font-sans text-[13px] font-medium text-ink outline-none cursor-pointer"
                value={searchParams.get('sort') || ''}
                onChange={handleSortChange}
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-4">
              Category
            </span>
            <div className="flex flex-col gap-3">
              {collectionGroups.map((group) => {
                const isActive = currentGroups.includes(group.id);
                return (
                  <button
                    key={group.id}
                    onClick={() => handleGroupToggle(group.id)}
                    className="flex items-center text-left text-[12px] font-medium transition-colors hover:text-sage w-full group relative"
                  >
                    <span className={`w-[5px] h-[5px] bg-sage absolute left-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'}`} />
                    <span className={`font-sans tracking-wide transition-all duration-200 ${isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'}`}>
                      {group.product_sup}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Filter */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-4">
              Material
            </span>
            <div className="flex flex-col gap-3">
              {['Solid Wood', 'Bouclé Fabric', 'Leather'].map((material) => {
                const isActive = currentMaterials.includes(material);
                return (
                  <button
                    key={material}
                    onClick={() => handleMaterialToggle(material)}
                    className="flex items-center text-left text-[12px] font-medium transition-colors hover:text-sage w-full group relative"
                  >
                    <span className={`w-[5px] h-[5px] bg-sage absolute left-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'}`} />
                    <span className={`font-sans tracking-wide transition-all duration-200 ${isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'}`}>
                      {material}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors text-left bg-transparent border-none cursor-pointer"
              onClick={handleClearAll}
            >
              Clear all ×
            </button>
          )}

          {/* Provenance note */}
          <div className="border-t border-sage/20 pt-6 mt-2">
            <span className="font-sans text-[9px] uppercase tracking-widest text-sage block mb-2">
              Provenance
            </span>
            <div className="text-[10px] font-medium text-body leading-[1.7] uppercase tracking-wider">
              Timber: FSC Certified Oak<br />
              Upholstery: Belgian Bouclé<br />
              Batch No: EA-04-2026
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
