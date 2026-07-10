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

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
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

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error.message);
    }
    
    const dbProducts = (data as Product[]) || [];
    
    // Deduplicate products by collection_group_id (if exists) or name
    const seen = new Set();
    const uniqueProducts: Product[] = [];
    
    dbProducts.forEach(p => {
      const key = p.collection_group_id || p.name;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueProducts.push(p);
      }
    });

    totalCount = uniqueProducts.length;
    products = uniqueProducts.slice(from, from + itemsPerPage);

  } catch (err: any) {
    console.log('Database query failed. Reason:', err.message);
    products = [];
    totalCount = 0;
  }

  // Fetch collection groups
  let collectionGroups: { id: string; product_sup: string }[] = [];
  try {
    const { data: groupData } = await supabase
      .from('collection_groups')
      .select('id, product_sup')
      .ilike('tag', 'furniture')
      .order('product_sup', { ascending: true });
    
    if (groupData) {
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
