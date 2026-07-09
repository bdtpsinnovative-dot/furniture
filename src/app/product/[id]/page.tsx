import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { Header } from '@/components/layout/Header';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductAccordion, AccordionItem } from '@/components/product/ProductAccordion';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { PremiumProductCard } from '@/components/collections2/PremiumProductCard';
export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  let product: any = null;
  let recommendedProducts: any[] = [];

  // Intercept mock presentation IDs
  if (params.id.startsWith('mock-')) {
    product = MOCK_PRODUCTS.find(p => p.id === params.id);
    recommendedProducts = MOCK_PRODUCTS.filter(p => p.id !== params.id).slice(0, 8);
  } else {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!error && data) {
      product = data;

      // Fetch recommended products
      const { data: recData } = await supabase
        .from('products')
        .select('*')
        .neq('id', params.id)
        .limit(8);
        
      if (recData) {
        recommendedProducts = recData;
      }
    }
  }

  if (!product) {
    notFound();
  }

  // Fallback image handling
  const mainImage = product.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600';
  
  // Extract extra images from specs.images if they exist
  let extraImages: string[] = [];
  if (product.specs?.images && Array.isArray(product.specs.images)) {
    extraImages = product.specs.images
      .sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
      .map((img: any) => img.path);
  }

  const accordionItems: AccordionItem[] = [
    {
      title: 'Description',
      content: product.description || 'A timeless piece crafted with premium materials. Designed to bring warmth and structural modernism into your living space.',
    },
    {
      title: 'Additional information',
      content: (
        <ul className="list-none space-y-2">
          {product.specs?.material && <li><strong>Material:</strong> {product.specs.material}</li>}
          {product.specs?.size && <li><strong>Size:</strong> {product.specs.size}</li>}
          {product.weight && <li><strong>Weight:</strong> {product.weight} kg</li>}
          <li><strong>SKU:</strong> {product.sku || 'N/A'}</li>
        </ul>
      ),
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header />
      
      <main className="w-full max-w-[1800px] mx-auto px-6 md:px-20 lg:px-32 xl:px-[180px] pt-28 pb-10 lg:pt-36 lg:pb-16">
        
        {/* Back Link */}
        <Link 
          href="/collections2" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted hover:text-sage transition-colors mb-6 group"
        >
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current stroke-[1.5px] fill-none transition-transform duration-300 group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Curation
        </Link>
        
        {/* Breadcrumb */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-8">
          Collections / {product.category_id || 'Furniture'} / <span className="text-ink">{product.name}</span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20">
          
          {/* Left Column: Scrollable Image Gallery */}
          <div className="w-full">
            <ProductGallery mainImage={mainImage} extraImages={extraImages} />
          </div>

          {/* Right Column: Sticky Details Sidebar */}
          <div className="w-full relative">
            <div className="sticky top-24 h-fit flex flex-col">
              
              <ProductActions 
                id={product.id} 
                name={product.name} 
                price={product.price} 
              />
              
              <ProductAccordion items={accordionItems} />

              {/* Sustainability Badge */}
              <div className="mt-8 flex items-center gap-4 text-muted border-t border-hairline pt-6">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-ink stroke-[1.5px] fill-none">
                  {/* Simplistic FSC tree icon representation */}
                  <path d="M12 22V12" />
                  <path d="M12 12C12 12 7 10 7 6C7 2 12 2 12 2s5 0 5 4c0 4-5 6-5 6z" />
                  <path d="M12 12c0 0-3-1-3-4" />
                  <path d="M12 17c0 0 3-1 3-3" />
                </svg>
                <div className="text-[11px] uppercase tracking-[0.05em] font-medium leading-[1.4]">
                  Sustainably sourced<br />wood materials.
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-24 md:mt-32 pt-24 md:pt-32 pb-12 border-t border-hairline relative">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage mb-4 block">
                  Curated Collection
                </span>
                <h2 className="text-[28px] md:text-[36px] font-medium tracking-tight text-ink leading-tight">
                  You May Also Like
                </h2>
              </div>
              <Link 
                href="/collections2" 
                className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink hover:text-sage transition-colors group pb-2 border-b border-ink/20 hover:border-sage"
              >
                View all pieces
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current stroke-[1.5px] fill-none transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {recommendedProducts.map((p, index) => (
                <PremiumProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
