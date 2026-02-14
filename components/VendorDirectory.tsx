import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedVendors } from '../services/vendorService';
import { MapPin, Star, MessageSquare, Heart, Search, ArrowRight, Sparkles } from 'lucide-react';

const WISHLIST_KEY = 'amari_wishlist_v1';
const WISHLIST_DATA_KEY = 'amari_wishlist_data_v1';

const VendorDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedVendors, setSavedVendors] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(WISHLIST_KEY); if (v) return new Set(JSON.parse(v)); } catch {}
    return new Set();
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...savedVendors])); } catch {}
    // Also persist full vendor data for saved vendors so Wishlist page can use it
    if (vendors.length > 0) {
      const savedData = vendors.filter(v => savedVendors.has(v.id));
      try { localStorage.setItem(WISHLIST_DATA_KEY, JSON.stringify(savedData)); } catch {}
    }
  }, [savedVendors, vendors]);

  const toggleSave = (vendorId: string) => {
    setSavedVendors(prev => {
      const next = new Set(prev);
      if (next.has(vendorId)) next.delete(vendorId); else next.add(vendorId);
      return next;
    });
  };

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

  const filteredVendors = useMemo(() => {
    let result = selectedCategory === 'All'
      ? vendors
      : (vendors || []).filter((v) => v.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((v) =>
        v.name?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.location?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vendors, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amari-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2400&auto=format" alt="Diani Beach wedding venue" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-amari-900/80 to-amari-950/95" />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amari-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6 animate-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={13} className="text-amari-gold" />
            <span className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">The Best of Diani</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-5 animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Vendor Directory
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-lg mb-10 animate-in slide-in-from-bottom-5 duration-1000 delay-200">
            Discover trusted professionals for your coastal celebration.
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto animate-in zoom-in duration-700 delay-300">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search vendors by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amari-300/50 focus:bg-white/15 backdrop-blur-sm transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── FILTERS + GRID ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 glass rounded-2xl p-4 border border-white/60 shadow-lg">
          <button
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${selectedCategory === 'All' ? 'bg-amari-900 text-white shadow-md -translate-y-0.5' : 'bg-white text-stone-500 hover:bg-amari-50 hover:text-amari-600 border border-stone-200'}`}
          >
            All Vendors
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${selectedCategory === cat ? 'bg-amari-900 text-white shadow-md -translate-y-0.5' : 'bg-white text-stone-500 hover:bg-amari-50 hover:text-amari-600 border border-stone-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-stone-400 text-sm mb-6">{filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full py-20 text-center">
              <div className="w-10 h-10 border-3 border-amari-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-400 text-sm">Loading vendors...</p>
            </div>
          )}
          {!loading && filteredVendors.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-stone-400 text-lg mb-2">No vendors found</p>
              <p className="text-stone-300 text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
          {filteredVendors.map(vendor => (
            <div key={vendor.id} className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 hover:border-amari-200 hover:shadow-2xl hover:shadow-amari-500/5 transition-all duration-500 flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Save button */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleSave(vendor.id); }}
                  className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center transition-all hover:scale-110"
                >
                  <Heart size={15} className={savedVendors.has(vendor.id) ? 'text-red-500 fill-red-500' : 'text-stone-500'} />
                </button>

                {/* Rating badge */}
                <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Star size={11} className="text-amari-gold fill-amari-gold" />
                  <span className="text-[11px] font-bold text-stone-800">{vendor.rating}</span>
                </div>

                {/* Category */}
                <div className="absolute bottom-3 left-3">
                  <span className="glass-dark text-white/90 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-3 py-1">{vendor.category}</span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-amari-600 transition-colors">{vendor.name}</h3>
                <div className="flex items-center text-stone-400 text-xs mb-3">
                  <MapPin size={13} className="mr-1 text-amari-300" />
                  {vendor.location}
                </div>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-grow mb-5">{vendor.description}</p>

                <div className="flex gap-2 mt-auto pt-4 border-t border-stone-100">
                  <Link
                    to={`/vendor/${vendor.id}`}
                    className="flex-1 bg-amari-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-amari-800 transition-all duration-300 text-center flex items-center justify-center gap-1.5"
                  >
                    View Profile <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${(vendor.contactPhone || '254796535120').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi! I'm interested in ${vendor.name} for my wedding. Could you tell me more about your services?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-11 bg-stone-50 text-amari-600 rounded-xl hover:bg-amari-50 border border-stone-200 transition"
                    title={vendor.contactPhone ? `WhatsApp ${vendor.name}` : 'WhatsApp Amari'}
                  >
                    <MessageSquare size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDirectory;