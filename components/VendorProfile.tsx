import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApprovedVendorById } from '../services/vendorService';
import {
  MapPin, Star, ArrowLeft, Heart, Mail, Phone, Globe, Calendar,
  Users, Award, Check, Clock, DollarSign, Camera, ChevronLeft,
  ChevronRight, Share2, Building2, TreePine, Sun, Verified, Send,
  MessageSquare, Image as ImageIcon
} from 'lucide-react';

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
    <div className="min-h-screen bg-stone-50 pb-24">

      {/* ─── HERO IMAGE GALLERY ─────────────────────────────────── */}
      <div className="relative w-full aspect-[16/7] max-h-[560px] overflow-hidden bg-stone-200">
        <img
          src={gallery[heroIdx]}
          alt={`${vendor.name} photo ${heroIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-700"
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
          <button onClick={() => setSaved(!saved)} className="glass rounded-full p-2.5 hover:scale-105 transition-all">
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

      {/* ─── VENUE HEADER ───────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="bg-white rounded-2xl -mt-10 relative z-10 p-6 sm:p-8 shadow-lg border border-stone-100">
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

        {/* ─── REVIEWS ────────────────────────────────────────────── */}
        <div ref={reviewsRef} className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? 'text-amari-gold fill-amari-gold' : 'text-stone-200'} />)}</div>
                <span className="text-sm font-bold text-stone-800">{avgRating}</span>
                <span className="text-xs text-stone-400">({REVIEWS.length})</span>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp(`Hi! I'd like to leave a review for ${vendor.name} on Amari Experience.`)}
              className="px-4 py-2 border border-amari-200 rounded-full text-xs font-bold text-amari-600 hover:bg-amari-50 transition"
            >
              Write a review
            </button>
          </div>

          <div className="space-y-5">
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
      <div className="fixed bottom-0 inset-x-0 glass border-t border-white/60 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-stone-900 text-sm truncate">From {vd.offPeakPrice}</p>
            <p className="text-[11px] text-stone-400">Responds {vd.responseTime.toLowerCase()}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setSaved(!saved)}
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
