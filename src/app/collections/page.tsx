import React from 'react';
import { Header } from '@/components/layout/Header';
import { RoomsBanner } from '@/components/collections/RoomsBanner';
import { SidebarFilter } from '@/components/collections/SidebarFilter';
import { ProductCard, Product } from '@/components/collections/ProductCard';
import { CatalogControls } from '@/components/collections/CatalogControls';
import { Pagination } from '@/components/collections/Pagination';
import { createClient } from '@/supabase/server';

export default async function CollectionsPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  
  const supabase = await createClient();
  
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) || 1 : 1;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : '';
  const materialParam = typeof searchParams?.material === 'string' ? searchParams.material : '';
  const groupParam = typeof searchParams?.group === 'string' ? searchParams.group : '';
  
  const itemsPerPage = 12;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let products: Product[] = [];
  let totalCount = 0;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .or('category_id.eq.furniture,sku.ilike.EMBER%');
      
    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    if (materialParam) {
      const materials = materialParam.split(',').filter(Boolean);
      if (materials.length > 0) {
        // JSONB filtering for specs->>material
        const orConditions = materials.map(m => `specs->>material.ilike.%${m}%`).join(',');
        query = query.or(orConditions);
      }
    }

    // Filter by collection group (Product Sup)
    if (groupParam) {
      const groups = groupParam.split(',').filter(Boolean);
      if (groups.length > 0) {
        query = query.in('collection_group_id', groups);
      }
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('id', { ascending: false }); // Newest default
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Supabase query error:', error.message);
    }
    
    if (data && data.length > 0) {
      products = data as Product[];
      totalCount = count || data.length;
    }
  } catch (err: unknown) {
    console.error('Error fetching products:', err instanceof Error ? err.message : String(err));
    products = [];
    totalCount = 0;
  }

  // Fetch collection groups for sidebar filter
  let collectionGroups: { id: string; product_sup: string }[] = [];
  try {
    const { data: groupData } = await supabase
      .from('collection_groups')
      .select('id, product_sup')
      .order('product_sup', { ascending: true });
    
    if (groupData) {
      // Deduplicate by product_sup
      const seen = new Set<string>();
      collectionGroups = groupData.filter(g => {
        if (!g.product_sup || seen.has(g.product_sup)) return false;
        seen.add(g.product_sup);
        return true;
      });
    }
  } catch (err) {
    console.log('Could not fetch collection groups');
  }

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header />
      <RoomsBanner />

      <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
        
        <SidebarFilter collectionGroups={collectionGroups} />

        <section className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
            Collections
          </span>
          <h1 className="font-serif text-[48px] font-normal leading-[1.15] text-ink mb-3">
            Rooted in warmth.<br/>Refined by design.
          </h1>
          <p className="text-[15px] text-muted max-w-[480px] leading-[1.6] mb-10">
            Discover the Ember & Ash collection. Timeless furniture, thoughtfully crafted from raw organic materials and deep natural textures.
          </p>

          <CatalogControls />

          <div className="text-[12px] text-muted mb-4">
            <span className="text-ink font-medium">{totalCount}</span> Pieces
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted">
                <p className="text-[14px]">No products found matching your filters.</p>
              </div>
            )}
          </div>

          <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
        </section>

      </main>
    </div>
  );
}
