import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, ArrowRight, MessageSquare, Trash2, ShoppingBag } from 'lucide-react';

const WISHLIST_KEY = 'amari_wishlist_v1';
const WISHLIST_DATA_KEY = 'amari_wishlist_data_v1';

const Wishlist: React.FC = () => {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(WISHLIST_KEY); if (v) return new Set(JSON.parse(v)); } catch {}
    return new Set();
  });
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_DATA_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        if (Array.isArray(all)) setVendors(all.filter((v: any) => savedIds.has(v.id)));
      }
    } catch {}
  }, []);

  const removeFromWishlist = (id: string) => {
    const next = new Set(savedIds);
    next.delete(id);
    setSavedIds(next);
    setVendors(prev => prev.filter(v => v.id !== id));
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...next])); } catch {}
    try {
      const raw = localStorage.getItem(WISHLIST_DATA_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        if (Array.isArray(all)) {
          localStorage.setItem(WISHLIST_DATA_KEY, JSON.stringify(all.filter((v: any) => v.id !== id)));
        }
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto py-12 sm:py-20 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 mb-5">
            <Heart size={26} className="text-red-400 fill-red-400" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amari-900">My Wishlist</h1>
          <p className="mt-4 text-stone-500 text-sm sm:text-base max-w-lg mx-auto">
            Vendors you've hearted are saved here. Review and compare your favorites before reaching out.
          </p>
          {vendors.length > 0 && (
            <p className="mt-2 text-amari-500 text-sm font-bold">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} saved</p>
          )}
        </div>

        {vendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={32} className="text-stone-300" />
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-2">Your wishlist is empty</h3>
            <p className="text-stone-400 text-sm mb-6 max-w-sm mx-auto">
              Browse our vendor directory and tap the heart icon to save your favorites here.
            </p>
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 bg-amari-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-amari-600 transition shadow-md"
            >
              Browse Vendors <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map(vendor => (
              <div key={vendor.id} className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden hover:border-amari-200 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 md:w-56 h-40 sm:h-auto flex-shrink-0 relative overflow-hidden">
                    <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                    <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Star size={11} className="text-amari-gold fill-amari-gold" />
                      <span className="text-[11px] font-bold text-stone-800">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amari-500 mb-1 block">{vendor.category}</span>
                          <h3 className="text-lg font-bold text-stone-900">{vendor.name}</h3>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(vendor.id)}
                          className="flex-shrink-0 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-stone-400 text-xs flex items-center gap-1.5 mb-2">
                        <MapPin size={13} className="text-amari-300" /> {vendor.location}
                      </p>
                      {vendor.description && (
                        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{vendor.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-stone-100">
                      <Link
                        to={`/vendor/${vendor.id}`}
                        className="flex-1 bg-amari-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-amari-800 transition text-center flex items-center justify-center gap-1.5"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
