import React from 'react';

const rooms = [
  { name: 'The Living Space', count: 42, image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=600' },
  { name: 'The Sanctuary', count: 28, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600' },
  { name: 'The Dining Room', count: 31, image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=600' },
  { name: 'The Terrace', count: 18, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600' },
];

export function RoomsBanner() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-hairline">
      {rooms.map((room, index) => (
        <div 
          key={index} 
          className={`group relative h-[260px] lg:h-[340px] overflow-hidden border-hairline border-b md:border-b-0 lg:border-r last:border-b-0 lg:last:border-r-0 ${
            index === 0 || index === 1 ? 'md:border-b lg:border-b-0' : ''
          } ${
            index % 2 === 0 ? 'md:border-r lg:border-r' : 'md:border-r-0 lg:border-r'
          }`}
        >
          <img 
            src={room.image} 
            alt={room.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03] brightness-[0.85] contrast-[0.95]"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-start bg-gradient-to-b from-ink/30 to-transparent text-white pointer-events-none">
            <h3 className="font-serif text-[28px] font-normal tracking-[0.02em] uppercase mb-1">
              {room.name}
            </h3>
            <span className="text-[12px] font-sans font-normal tracking-[0.05em] opacity-90 flex items-center gap-2">
              {room.count} Pieces &rarr;
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
