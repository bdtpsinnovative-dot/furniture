import React from 'react';
import { Header } from '@/components/layout/Header';
import { CollectionsHero } from '@/components/collections2/CollectionsHero';
import { CatalogLayout } from '@/components/collections2/CatalogLayout';
import { Product } from '@/components/collections2/PremiumProductCard';
import { createClient } from '@/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Collections2Page(
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

  // Fetch collection groups first to map names back to IDs for filtering
  let allGroups: { id: string; product_sup: string }[] = [];
  try {
    const { data: groupData } = await supabase
      .from('collection_groups')
      .select('id, product_sup')
      .ilike('tag', 'furniture')
      .order('product_sup', { ascending: true });
    
    if (groupData) {
      allGroups = groupData;
    }
  } catch (err) {
    console.log('Could not fetch collection groups');
  }

  // Deduplicate for the Sidebar props
  const seenGroupNames = new Set<string>();
  const collectionGroups = allGroups.filter(g => {
    if (!g.product_sup || seenGroupNames.has(g.product_sup)) return false;
    seenGroupNames.add(g.product_sup);
    return true;
  });

  try {
    // Fetch a large pool to allow deduplication by collection_group_id.
    // Each collection_group_id represents ONE product collection — only the
    // first (representative) product per group is shown on the grid.
    let query = supabase
      .from('products')
      .select('*')
      .eq('category_id', 'furniture');

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    if (materialParam) {
      const materials = materialParam.split(',').filter(Boolean).map(m => m.toLowerCase());
      if (materials.length > 0) {
        const orConditions = materials.map(m => `specs->>material.ilike.%${m}%`).join(',');
        query = query.or(orConditions);
      }
    }

    if (groupParam) {
      const groupNames = groupParam.split(',').filter(Boolean).map(n => n.toLowerCase());
      if (groupNames.length > 0) {
        const matchingIds = allGroups
          .filter(g => groupNames.includes(g.product_sup.toLowerCase()) || groupNames.includes(g.id.toLowerCase()))
          .map(g => g.id);
        
        if (matchingIds.length > 0) {
          query = query.in('collection_group_id', matchingIds);
        } else {
          query = query.in('collection_group_id', groupParam.split(','));
        }
      }
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('id', { ascending: false });
    }

    // Fetch enough rows to cover full deduplication (cap at 1000)
    query = query.limit(1000);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error.message);
    }

    const allRows = (data as Product[]) || [];

    // Deduplicate: keep only the first product per collection_group_id.
    // Products without a group id are shown as-is (each is unique).
    const seen = new Set<string>();
    const unique: Product[] = [];
    for (const p of allRows) {
      const key = p.collection_group_id ?? `__no_group_${p.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    totalCount = unique.length;
    products = unique.slice(from, from + itemsPerPage);

  } catch (err: any) {
    console.log('Database query failed. Reason:', err.message);
    products = [];
    totalCount = 0;
  }

  // Collection groups are already fetched above

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header dynamic={true} />
      <CollectionsHero />
      <CatalogLayout 
        products={products}
        collectionGroups={collectionGroups}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
