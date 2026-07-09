import React from 'react';

export function ProductGallery({ mainImage, extraImages }: { mainImage: string; extraImages: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image */}
      <div className="w-full bg-[#F5F2EC] flex items-center justify-center p-8 lg:p-12 relative overflow-hidden h-[500px] lg:h-[700px]">
        <div className="absolute top-6 right-6 border border-ink text-ink text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 z-10">
          Featured
        </div>
        <img 
          src={mainImage} 
          alt="Featured Product" 
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Grid of Extra Images */}
      {extraImages && extraImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {extraImages.map((img, idx) => (
            <div key={idx} className="w-full bg-[#F5F2EC] flex items-center justify-center p-4 lg:p-8 relative h-[240px] lg:h-[400px]">
              <img 
                src={img} 
                alt={`Product Detail ${idx + 1}`} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
