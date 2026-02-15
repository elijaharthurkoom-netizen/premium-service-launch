
import React from 'react';

const PROTOTYPES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', // Dashboard mockup
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', // Analytics
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800', // Web design
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', // Mobile app UI
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800', // Design process
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=800', // High-end SaaS UI
];

const Marquee: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full h-80 group">
      {/* Edge Fades for seamless transition */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-onyx to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-onyx to-transparent z-20 pointer-events-none" />
      
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {[...PROTOTYPES, ...PROTOTYPES].map((src, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 mx-4 w-96 h-64 relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-xl"
          >
            <img 
              src={src} 
              alt={`Prototype ${idx}`} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110 grayscale brightness-75 group-hover:grayscale-0"
            />
            {/* Overlays for social proof */}
            <div className="absolute top-4 left-4">
              <span className="bg-onyx/90 border border-gold/50 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                Live Prototype
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div className="text-left">
                <p className="text-gold font-bold text-lg mb-1">Conversion Engine v4.2</p>
                <p className="text-white/60 text-xs font-medium">Optimized for High-Ticket Enrollment</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
