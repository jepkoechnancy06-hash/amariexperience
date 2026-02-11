import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApprovedVendorById } from '../services/vendorService';
import { VendorReview } from '../types';
import {
  MapPin, Star, ArrowLeft, Heart, Mail, Phone, Globe, Calendar,
  Users, Award, Check, Clock, DollarSign, Camera, ChevronLeft,
  ChevronRight, Share2, Building2, TreePine, Sun, Verified, Send,
  MessageSquare, Image as ImageIcon, X
} from 'lucide-react';

const REVIEWS_KEY = 'amari_vendor_reviews_v1';
const WISHLIST_KEY = 'amari_wishlist_v1';
const WISHLIST_DATA_KEY = 'amari_wishlist_data_v1';

// ── Gallery images (fallbacks for demo) ────────────────────────────
const GALLERY_FALLBACKS = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&auto=format',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&auto=format',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=900&auto=format',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&auto=format',
  'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=900&auto=format',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&auto=format',
];

// ── Helper: generate venue-specific data ───────────────────────────
function getVenueData(vendor: any) {
  const cat = vendor.category || '';
  const isVenue = /venue|location/i.test(cat);

  const services = isVenue
    ? ['Beachfront Ceremonies', 'Garden Receptions', 'Indoor Ballrooms', 'Rooftop Events', 'Poolside Gatherings']
    : getServicesByCategory(cat);

  const venueTypes = isVenue
    ? ['Beaches, Waterfront Settings', 'Historic Estates, Mansions']
    : [cat];

  const venueSettings = isVenue
    ? ['Covered Outdoor', 'Indoor', 'Outdoor']
    : ['Indoor', 'Outdoor'];

  const pricingLabel = isVenue
    ? 'Full wedding (ceremony and reception) pricing'
    : `${cat} pricing`;

  const offPeakPrice = getPriceByCategory(cat, 'off');
  const peakPrice = getPriceByCategory(cat, 'peak');

  return {
    services,
    venueTypes,
    venueSettings,
    pricingLabel,
    offPeakPrice,
    peakPrice,
    guestCapacity: '50–300',
    seatedCapacity: 'Up to 300 seated guests',
    description:
      vendor.description && vendor.description.length > 60
        ? vendor.description
        : `${vendor.name} combines historic elegance with modern charm. The venue boasts stunning original architecture and a serene, intimate atmosphere. Guests are often impressed by the exceptional service and the breathtaking views, making it an ideal setting for any special event. The landscaped patio provides a perfect space for cocktail hours, while private rooms offer cozy settings for more intimate gatherings. This venue's flexibility and attention to detail ensure a memorable experience for all occasions.`,
    founded: '2016',
    teamSize: 12,
    completedWeddings: 180,
    languages: ['English', 'Swahili'],
    responseTime: 'Within 2 hours',
    contact: {
      email: `hello@${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+254 712 345 678',
      address: vendor.location,
    },
  };
}

function getServicesByCategory(cat: string): string[] {
  const map: Record<string, string[]> = {
    'Planning and Coordination': ['Full Wedding Planning', 'Day Coordination', 'Vendor Management', 'Timeline Creation', 'Budget Management'],
    'Photography and Videography': ['Pre-Wedding Shoots', 'Ceremony Coverage', 'Drone Photography', 'Video Highlights'],
    'Catering and Cake': ['Multi-Course Menus', 'Cocktail Reception', 'Wedding Cakes', 'Bar Service'],
    'Decor and Styling': ['Floral Design', 'Table Settings', 'Lighting Design', 'Theme Development'],
    'Beauty and Fashion': ['Bridal Makeup', 'Hair Styling', 'Groom Grooming', 'Touch-up Services'],
    'Entertainment and Music': ['Live Bands', 'DJ Services', 'Photo Booths', 'Light Shows'],
    'Transport and Logistics': ['Guest Transportation', 'Bridal Car Service', 'Airport Transfers'],
  };
  return map[cat] || ['Consultation', 'Planning', 'Coordination', 'Support'];
}

function getPriceByCategory(cat: string, tier: 'off' | 'peak'): string {
  const prices: Record<string, [string, string]> = {
    'Venues and Locations': ['KES 1,500,000', 'KES 2,000,000'],
    'Planning and Coordination': ['KES 75,000', 'KES 150,000'],
    'Photography and Videography': ['KES 50,000', 'KES 120,000'],
    'Catering and Cake': ['KES 200,000', 'KES 400,000'],
    'Decor and Styling': ['KES 100,000', 'KES 250,000'],
    'Beauty and Fashion': ['KES 15,000', 'KES 40,000'],
    'Entertainment and Music': ['KES 40,000', 'KES 100,000'],
    'Transport and Logistics': ['KES 25,000', 'KES 60,000'],
  };
  const p = prices[cat] || ['KES 50,000', 'KES 100,000'];
  return tier === 'off' ? p[0] : p[1];
}

// ── Sample reviews ─────────────────────────────────────────────────
const REVIEWS = [
  {
    id: 1,
    name: 'Maggie B.',
    date: 'Nov 23, 2025',
    rating: 5,
    verified: true,
    title: 'Wedding at The Sanctuary',
    text: 'We absolutely loved our wedding here! We initially worked with Amelia and then with Arthur and Kat towards the end of our planning process. Every contact was very responsive and accommodating. We loved the space, especially having multiple different areas for guests to enjoy (the chapel for dancing/desserts, the outdoor patio for smores!) and the beautiful skyline in the background.',
  },
  {
    id: 2,
    name: 'Sarah K.',
    date: 'Oct 5, 2025',
    rating: 5,
    verified: true,
    title: 'Dream Coastal Celebration',
    text: 'Professional, creative, and attentive to every detail. Our beach wedding was absolutely perfect thanks to their expertise. The team went above and beyond to make sure everything ran smoothly. Would recommend to anyone planning a destination wedding!',
  },
  {
    id: 3,
    name: 'James & Aisha',
    date: 'Sep 12, 2025',
    rating: 4,
    verified: true,
    title: 'Beautiful Venue, Great Service',
    text: 'The best decision we made for our wedding. They understood our vision perfectly and executed it flawlessly. The venue was stunning and the coordination team handled every detail with grace.',
  },
];

const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

// ── Component ──────────────────────────────────────────────────────
const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReviews, setUserReviews] = useState<VendorReview[]>([]);
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, title: '', text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const url = window.location.href;
    const title = vendor?.name || 'Amari Experience Vendor';
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const openWhatsApp = (msg: string) => {
    window.open(`https://wa.me/254796535120?text=${encodeURIComponent(msg)}`, '_blank');
  };

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    getApprovedVendorById(id)
      .then((v) => { if (mounted) setVendor(v); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) { setSaved(false); return; }
      const ids = new Set<string>(JSON.parse(raw));
      setSaved(ids.has(id));
    } catch {
      setSaved(false);
    }
  }, [id]);

  const toggleSaved = () => {
    if (!id) return;

    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      const ids = new Set<string>(raw ? JSON.parse(raw) : []);
      const nextSaved = !ids.has(id);
      if (nextSaved) ids.add(id); else ids.delete(id);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...ids]));
      setSaved(nextSaved);
    } catch {
      setSaved((p) => !p);
    }

    if (vendor) {
      try {
        const rawData = localStorage.getItem(WISHLIST_DATA_KEY);
        const all = rawData ? JSON.parse(rawData) : [];
        const arr = Array.isArray(all) ? all : [];
        const idx = arr.findIndex((v: any) => v?.id === id);
        const isNowSaved = (() => {
          try {
            const raw = localStorage.getItem(WISHLIST_KEY);
            const ids = new Set<string>(raw ? JSON.parse(raw) : []);
            return ids.has(id);
          } catch {
            return false;
          }
        })();

        if (isNowSaved) {
          if (idx === -1) arr.push(vendor);
        } else {
          if (idx !== -1) arr.splice(idx, 1);
        }

        localStorage.setItem(WISHLIST_DATA_KEY, JSON.stringify(arr));
      } catch {}
    }
  };

  // Load user-submitted reviews from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) {
        const all: VendorReview[] = JSON.parse(raw);
        if (Array.isArray(all)) {
          setUserReviews(all.filter(r => r.vendorId === id));
        }
      }
    } catch {}
  }, [id]);

  const handleReviewSubmit = () => {
    if (!reviewForm.authorName.trim() || !reviewForm.text.trim() || !vendor) return;

    const newReview: VendorReview = {
      id: crypto.randomUUID(),
      vendorId: vendor.id || id || '',
      vendorName: vendor.name,
      authorName: reviewForm.authorName.trim(),
      rating: reviewForm.rating,
      title: reviewForm.title.trim(),
      text: reviewForm.text.trim(),
      createdAt: Date.now(),
    };

    // Save to localStorage (append to full list)
    let allReviews: VendorReview[] = [];
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) allReviews = p; }
    } catch {}
    allReviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));

    // Update local state
    setUserReviews(prev => [...prev, newReview]);
    setReviewForm({ authorName: '', rating: 5, title: '', text: '' });
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  // Build gallery from vendor image + fallbacks
  const gallery = vendor
    ? [vendor.imageUrl, ...GALLERY_FALLBACKS].filter(Boolean).slice(0, 6)
    : GALLERY_FALLBACKS;

  const vd = vendor ? getVenueData(vendor) : null;

  // ── Loading / Not Found ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center space-y-4">
          <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto" />
          <p className="text-stone-400 font-medium">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (!vendor || !vd) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-stone-900">Venue Not Found</h1>
          <Link to="/vendors" className="text-stone-600 hover:text-stone-900 font-medium inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-stone-50 pb-28">

      {/* ─── HERO IMAGE GALLERY ─────────────────────────────────── */}
      <div className="relative w-full aspect-[16/7] max-h-[560px] overflow-hidden bg-stone-200">
        <img
          src={gallery[heroIdx]}
          alt={`${vendor.name} photo ${heroIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-700 cursor-pointer"
          onClick={() => setLightboxIdx(heroIdx)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Link to="/vendors" className="glass rounded-full p-2.5 hover:scale-105 transition-all">
            <ArrowLeft size={18} className="text-stone-700" />
          </Link>
          <div className="flex gap-2">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <ImageIcon size={13} className="text-stone-600" />
              <span className="text-[11px] font-bold text-stone-800">{heroIdx + 1}/{gallery.length}</span>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={handleShare} className="glass rounded-full p-2.5 hover:scale-105 transition-all">
            <Share2 size={15} className="text-stone-700" />
          </button>
          <button onClick={toggleSaved} className="glass rounded-full p-2.5 hover:scale-105 transition-all">
            <Heart size={15} className={saved ? 'text-red-500 fill-red-500' : 'text-stone-700'} />
          </button>
        </div>

        {/* Nav arrows */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setHeroIdx((p) => (p === 0 ? gallery.length - 1 : p - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:scale-110 transition-all"
            >
              <ChevronLeft size={20} className="text-stone-700" />
            </button>
            <button
              onClick={() => setHeroIdx((p) => (p === gallery.length - 1 ? 0 : p + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:scale-110 transition-all"
            >
              <ChevronRight size={20} className="text-stone-700" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── GALLERY THUMBNAILS ─────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIdx(i)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                i === heroIdx ? 'border-amari-500 ring-2 ring-amari-300' : 'border-stone-200 hover:border-amari-300'
              }`}
            >
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ─── LIGHTBOX OVERLAY ──────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx === 0 ? gallery.length - 1 : lightboxIdx - 1); }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx === gallery.length - 1 ? 0 : lightboxIdx + 1); }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="max-w-3xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[lightboxIdx]}
              alt={`${vendor.name} photo ${lightboxIdx + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-center text-white/60 text-xs mt-3 font-medium">{lightboxIdx + 1} / {gallery.length}</p>
          </div>
        </div>
      )}

      {/* ─── VENUE HEADER ───────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="bg-white rounded-2xl mt-6 relative z-10 p-6 sm:p-8 shadow-lg border border-stone-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amari-500 mb-1 block">{vendor.category}</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {vendor.name}
              </h1>
              <p className="mt-2 text-stone-400 text-sm flex items-center gap-1.5">
                <MapPin size={14} className="text-amari-300 flex-shrink-0" />
                {vendor.location}
              </p>
            </div>
            <div className="flex-shrink-0 bg-amari-50 rounded-xl px-3 py-2 text-center border border-amari-100">
              <div className="flex items-center gap-1 justify-center">
                <Star size={14} className="text-amari-gold fill-amari-gold" />
                <span className="text-lg font-bold text-stone-900">{avgRating}</span>
              </div>
              <button onClick={scrollToReviews} className="text-[10px] text-amari-500 font-bold hover:underline">{REVIEWS.length} reviews</button>
            </div>
          </div>
        </div>

        {/* ─── QUICK INFO CARDS ───────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amari-50 flex items-center justify-center mb-3">
              <Building2 size={18} className="text-amari-500" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">All-inclusive</h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              Full service — food, beverage, rentals.{' '}
              <button onClick={() => setShowServices(!showServices)} className="text-amari-500 font-bold hover:underline">Details</button>
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amari-50 flex items-center justify-center mb-3">
              <DollarSign size={18} className="text-amari-500" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">Pricing</h3>
            <p className="text-stone-400 text-xs">From {vd.offPeakPrice}</p>
            <p className="text-stone-300 text-[10px]">Peak: {vd.peakPrice}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amari-50 flex items-center justify-center mb-3">
              <Users size={18} className="text-amari-500" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">Capacity</h3>
            <p className="text-stone-400 text-xs">{vd.seatedCapacity}</p>
          </div>
        </div>

        {showServices && vd && (
          <div className="mt-3 bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-3">Services Included</h4>
            <div className="grid grid-cols-2 gap-2">
              {vd.services.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                  <Check size={14} className="text-amari-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ABOUT THIS VENUE ───────────────────────────────────── */}
        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-4">About</h2>
          <p className="text-stone-500 text-sm leading-[1.9]">{vd.description}</p>

          {/* Venue details inline */}
          <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Capacity</h3>
              <p className="text-stone-700 text-sm font-medium">{vd.guestCapacity}</p>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Type</h3>
              {vd.venueTypes.map((t, i) => (
                <p key={i} className="text-stone-700 text-sm font-medium">{t}</p>
              ))}
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Setting</h3>
              <div className="flex flex-wrap gap-2">
                {vd.venueSettings.map((s, i) => (
                  <span key={i} className="text-stone-700 text-sm font-medium flex items-center gap-1">
                    {s === 'Indoor' ? <Building2 size={13} /> : s === 'Outdoor' ? <Sun size={13} /> : <TreePine size={13} />}
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAP ────────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
          <div className="p-5 pb-3">
            <h2 className="text-lg font-bold text-stone-900">Location</h2>
            <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-amari-300" />
              {vendor.location}
            </p>
          </div>
          <div className="h-56 bg-stone-100">
            <iframe
              title="Venue location"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(vendor.location)}&zoom=14`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* ─── CONNECT / SOCIAL LINKS ─────────────────────────────── */}
        {(() => {
          let socials: Record<string, string> = {};
          try {
            if (vendor.socialLinks) {
              socials = typeof vendor.socialLinks === 'string' ? JSON.parse(vendor.socialLinks) : vendor.socialLinks;
            }
          } catch {}
          const hasSocials = Object.values(socials).some(v => !!v);
          const hasContact = vendor.contactEmail || vendor.contactPhone || vendor.website;
          if (!hasSocials && !hasContact) return null;
          return (
            <div className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-pink-200 text-pink-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-[9px] font-bold">IG</span>
                    Instagram
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">FB</span>
                    Facebook
                  </a>
                )}
                {socials.tiktok && (
                  <a href={socials.tiktok} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 text-stone-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <span className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center text-white text-[9px] font-bold">TT</span>
                    TikTok
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <span className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold">X</span>
                    X / Twitter
                  </a>
                )}
                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">YT</span>
                    YouTube
                  </a>
                )}
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-amari-50 border border-amari-200 text-amari-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <Globe size={14} /> Website
                  </a>
                )}
                {vendor.contactEmail && (
                  <a href={`mailto:${vendor.contactEmail}`} className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 text-stone-600 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <Mail size={14} /> Email
                  </a>
                )}
                {vendor.contactPhone && (
                  <a href={`tel:${vendor.contactPhone}`} className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-2 text-xs font-bold hover:shadow-md transition">
                    <Phone size={14} /> Call
                  </a>
                )}
              </div>
            </div>
          );
        })()}

        {/* ─── REVIEWS ────────────────────────────────────────────── */}
        <div ref={reviewsRef} className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? 'text-amari-gold fill-amari-gold' : 'text-stone-200'} />)}</div>
                <span className="text-sm font-bold text-stone-800">{avgRating}</span>
                <span className="text-xs text-stone-400">({REVIEWS.length + userReviews.length})</span>
              </div>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 border border-amari-200 rounded-full text-xs font-bold text-amari-600 hover:bg-amari-50 transition"
            >
              {showReviewForm ? 'Cancel' : 'Write a review'}
            </button>
          </div>

          {/* Success message */}
          {reviewSubmitted && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <Check size={16} className="text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm font-medium">Thank you! Your review has been submitted.</p>
            </div>
          )}

          {/* Inline review form */}
          {showReviewForm && (
            <div className="mb-6 p-5 bg-amari-50/50 rounded-xl border border-amari-100 space-y-4 animate-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm">Share your experience</h3>
                <button onClick={() => setShowReviewForm(false)} className="text-stone-400 hover:text-stone-600 transition">
                  <X size={16} />
                </button>
              </div>

              {/* Star rating picker */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star size={24} className={s <= reviewForm.rating ? 'text-amari-gold fill-amari-gold' : 'text-stone-200'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.authorName}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="e.g. Sarah K."
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amari-400 focus:border-amari-400 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">Review Title <span className="text-stone-400 normal-case">(optional)</span></label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Amazing wedding venue!"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amari-400 focus:border-amari-400 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5 block">Your Review</label>
                <textarea
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Tell others about your experience..."
                  rows={4}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amari-400 focus:border-amari-400 bg-white resize-none"
                />
              </div>

              <button
                onClick={handleReviewSubmit}
                disabled={!reviewForm.authorName.trim() || !reviewForm.text.trim()}
                className="w-full bg-amari-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amari-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={14} /> Submit Review
              </button>
            </div>
          )}

          <div className="space-y-5">
            {/* User-submitted reviews (newest first) */}
            {[...userReviews].sort((a, b) => b.createdAt - a.createdAt).map((r) => (
              <div key={r.id} className="border-b border-stone-50 pb-5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amari-300 to-amari-500 flex items-center justify-center text-white text-xs font-bold">
                    {r.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{r.authorName}</span>
                      <span className="text-[10px] bg-amari-50 text-amari-500 font-bold px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <span className="text-[11px] text-stone-400">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < r.rating ? 'text-amari-gold fill-amari-gold' : 'text-stone-200'} />)}</div>
                {r.title && <h3 className="font-bold text-stone-800 text-sm mb-1">{r.title}</h3>}
                <p className="text-stone-500 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}

            {/* Hardcoded sample reviews */}
            {REVIEWS.map((r) => (
              <div key={r.id} className="border-b border-stone-50 pb-5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amari-300 to-amari-500 flex items-center justify-center text-white text-xs font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{r.name}</span>
                      {r.verified && <span className="flex items-center gap-0.5 text-[10px] text-amari-500 font-bold"><Check size={10} /> Verified</span>}
                    </div>
                    <span className="text-[11px] text-stone-400">{r.date}</span>
                  </div>
                </div>
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < r.rating ? 'text-amari-gold fill-amari-gold' : 'text-stone-200'} />)}</div>
                <h3 className="font-bold text-stone-800 text-sm mb-1">{r.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STICKY BOTTOM BAR ────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 glass border-t border-white/60 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-stone-900 text-sm truncate">From {vd.offPeakPrice}</p>
            <p className="text-[11px] text-stone-400">Responds {vd.responseTime.toLowerCase()}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={toggleSaved}
              className="flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-full text-sm font-bold hover:border-amari-200 transition"
            >
              <Heart size={14} className={saved ? 'text-red-500 fill-red-500' : 'text-stone-400'} />
              Save
            </button>
            <button
              onClick={() => openWhatsApp(`Hi! I'm interested in ${vendor.name} for my wedding. Could you share more details?`)}
              className="flex items-center gap-1.5 bg-amari-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-amari-800 transition-all hover:shadow-lg hover:shadow-amari-900/20"
            >
              <Send size={14} />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
