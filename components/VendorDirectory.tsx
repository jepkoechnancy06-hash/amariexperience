import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedVendors } from '../services/vendorService';
import { MapPin, Star, MessageSquare, Heart } from 'lucide-react';

const VendorDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getApprovedVendors()
      .then((data) => {
        if (mounted) setVendors(data || []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (vendors || []).forEach((v) => {
      if (v?.category) set.add(v.category);
    });
    return Array.from(set);
  }, [vendors]);

  const filteredVendors = selectedCategory === 'All'
    ? vendors
    : (vendors || []).filter((v) => v.category === selectedCategory);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-14">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2400&auto=format&fit=crop"
            alt="Beach wedding details"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>

        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            The Best of Diani
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Curated Vendor Directory
          </h2>
          <p className="mt-6 text-amari-50 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            From beachfront venues to Swahili caterers — discover trusted professionals who make your coastal celebration feel effortless.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          onClick={() => setSelectedCategory('All')}
          aria-pressed={selectedCategory === 'All'}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === 'All' ? 'bg-amari-600 text-white shadow-lg transform -translate-y-0.5' : 'bg-white text-stone-500 hover:bg-amari-50 hover:text-amari-600 border border-amari-100'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={selectedCategory === cat}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-amari-600 text-white shadow-lg transform -translate-y-0.5' : 'bg-white text-stone-500 hover:bg-amari-50 hover:text-amari-600 border border-amari-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading && (
          <div className="col-span-full text-center text-stone-500">Loading vendors...</div>
        )}
        {!loading && filteredVendors.length === 0 && (
          <div className="col-span-full text-center text-stone-500">No approved vendors yet.</div>
        )}
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-500 overflow-hidden group border border-amari-100/50 flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
              <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4">
                <button className="bg-white/95 p-2 rounded-full text-stone-400 hover:text-amari-terracotta transition shadow-sm">
                  <Heart size={16} />
                </button>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amari-500 mb-1 block">{vendor.category}</span>
                    <h3 className="text-xl font-bold text-amari-900 font-serif leading-tight">{vendor.name}</h3>
                 </div>
                 <div className="flex items-center bg-amari-50 px-2 py-1 rounded-lg border border-amari-100">
                   <Star size={12} className="text-amari-gold fill-amari-gold mr-1" />
                   <span className="text-xs font-bold text-amari-900">{vendor.rating}</span>
                 </div>
              </div>
              
              <div className="flex items-center text-stone-500 text-xs mb-5">
                <MapPin size={14} className="mr-1.5 text-amari-300" />
                {vendor.location}
              </div>
              
              <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{vendor.description}</p>
              
              <div className="pt-6 border-t border-amari-50 flex gap-3 mt-auto">
                <Link 
                  to={`/vendor/${vendor.id}`}
                  className="flex-1 bg-amari-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-amari-600 transition shadow-lg text-center"
                >
                  View Profile
                </Link>
                <button className="flex items-center justify-center w-12 bg-amari-50 text-amari-600 rounded-xl hover:bg-amari-100 border border-amari-100 transition">
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDirectory;