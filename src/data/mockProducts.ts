export interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  category_id?: string;
  collection_group_id?: string;
  description?: string;
  weight?: number;
  sku?: string;
  specs?: {
    material?: string;
    size?: string;
    images?: Array<{ path: string; [key: string]: unknown }>;
    [key: string]: unknown;
  };
}

export const MOCK_PRODUCTS: Product[] = [
  // 1. Lumina Bouclé Collection
  { 
    id: 'mock-101', 
    name: 'Lumina Sofa', 
    price: 2400, 
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'lumina',
    description: 'The Lumina Sofa features fluid, organic curves wrapped in premium tactile bouclé fabric. Supported by a solid concealed pine frame, it balances structural modernism with high-end plush comfort.',
    weight: 52,
    sku: 'EA-SF-LM101',
    specs: { 
      material: 'Bouclé Fabric & Solid Pine Frame',
      size: '220 x 95 x 72 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-102', 
    name: 'Lumina Lounge Chair', 
    price: 890, 
    image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'lumina',
    description: 'A striking minimalist armchair matching the Lumina series. Designed with a curved backrest and a deep seat cushions upholstered in luxurious, textured cream bouclé.',
    weight: 24,
    sku: 'EA-CH-LM102',
    specs: { 
      material: 'Bouclé Fabric & Concealed Steel Core',
      size: '85 x 82 x 68 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-103', 
    name: 'Lumina Ottoman', 
    price: 450, 
    image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'lumina',
    description: 'An elegant organic-shaped footrest and seat extension that pairs beautifully with the Lumina Sofa. Features textured upholstery and a sleek flush plinth base.',
    weight: 12,
    sku: 'EA-OT-LM103',
    specs: { 
      material: 'Bouclé Upholstery & Ash Veneer Plinth',
      size: '70 x 60 x 38 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },

  // 2. Oak Timber Collection
  { 
    id: 'mock-201', 
    name: 'Oak Dining Table', 
    price: 1850, 
    image_url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'oak',
    description: 'A solid FSC-certified Oak dining table celebrating organic joinery. The massive tabletop highlights natural wood knots, splits, and deep exposed grain texturing.',
    weight: 65,
    sku: 'EA-TB-OK201',
    specs: { 
      material: 'Solid FSC White Oak',
      size: '200 x 90 x 75 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-202', 
    name: 'Minimalist Oak Chair', 
    price: 650, 
    image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'oak',
    description: 'An architectural dining chair crafted from solid oak and upholstered with a minimal saddle leather seat cushion. Features elegant mortise-and-tenon joints.',
    weight: 8,
    sku: 'EA-CH-OK202',
    specs: { 
      material: 'Oak Frame & Full-Grain Saddle Leather',
      size: '48 x 50 x 82 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-203', 
    name: 'Oak Sideboard', 
    price: 1550, 
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'oak',
    description: 'A beautiful minimalist oak credenza sideboard for storage. Built with soft-closing push-to-open doors, exposing a gorgeous uninterrupted horizontal wood grain profile.',
    weight: 48,
    sku: 'EA-SB-OK203',
    specs: { 
      material: 'Solid Oak & Oak Veneer Panels',
      size: '160 x 45 x 75 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },

  // 3. Travertine Stone Collection
  { 
    id: 'mock-301', 
    name: 'Stone Coffee Table', 
    price: 1200, 
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'stone',
    description: 'An monolithic low-slung coffee table sculpted from premium Italian travertine. Left unfilled to celebrate the organic holes, pits, and earthy matte textures.',
    weight: 78,
    sku: 'EA-CT-TR301',
    specs: { 
      material: 'Italian Travertine Stone',
      size: '110 x 110 x 32 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-302', 
    name: 'Stone Side Table', 
    price: 480, 
    image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'stone',
    description: 'A solid travertine pedestal side table matching the Travertine Coffee Table. Features a heavy cylindrical base and clean circular top plate, honed by hand.',
    weight: 28,
    sku: 'EA-ST-TR302',
    specs: { 
      material: 'Italian Travertine Stone',
      size: '40 x 40 x 50 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  { 
    id: 'mock-303', 
    name: 'Arch Table Lamp', 
    price: 340, 
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    category_id: 'furniture',
    collection_group_id: 'stone',
    description: 'An sculptural accent lamp boasting an architectural arched base carved from solid travertine, paired with a hand-spun raw linen fabric shade.',
    weight: 9,
    sku: 'EA-LP-TR303',
    specs: { 
      material: 'Travertine Stone base & Spun Linen Shade',
      size: '30 x 30 x 55 CM',
      images: [
        { path: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=600' },
        { path: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600' }
      ]
    }
  },
  
  // 4. Standalone decorative objects
  { 
    id: 'mock-401', 
    name: 'Ceramic Vase', 
    price: 120, 
    image_url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=600',
    category_id: 'decor',
    description: 'A hand-thrown raw stoneware ceramic vase with a warm, textured oatmeal glaze. An elegant addition to shelf displays and side tables.',
    weight: 3,
    sku: 'EA-VS-CR401',
    specs: { material: 'Ceramic Stoneware', size: '18 x 18 x 28 CM' }
  },
  { 
    id: 'mock-402', 
    name: 'Woven Basket', 
    price: 85, 
    image_url: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=600',
    category_id: 'decor',
    description: 'A hand-woven rattan storage basket with integrated carrying handles. Combining organic texture with practical home organization.',
    weight: 2,
    sku: 'EA-BK-RT402',
    specs: { material: 'Natural Rattan Fibers', size: '40 x 40 x 35 CM' }
  },
];
