import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/LayoutNew';
import VendorDirectory from './components/VendorDirectory';
import VendorProfile from './components/VendorProfile';
import PlanningTools from './components/PlanningTools';
import AirlineBooking from './components/AirlineBooking';
import InspirationGallery from './components/InspirationGallery';
import GeminiPlanner from './components/GeminiPlanner';
import VendorOnboarding from './components/VendorOnboarding';
import AdminDashboard from './components/AdminDashboard';
import VendorCategories from './components/VendorCategories';
import VendorTerms from './components/VendorTerms';
import AdminVendorVerification from './components/AdminVendorVerification';
import AdminGuard from './components/AdminGuard';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AboutUs from './components/AboutUs';
import Community from './components/Community';
import Activities from './components/Activities';
import DianiHistory from './components/DianiHistory';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Wishlist from './components/Wishlist';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ArrowRight, Check, Star, Heart, Sun, MapPin, Sparkles, Play } from 'lucide-react';
import { MOCK_VENDORS } from './constants';
import { getApprovedVendors } from './services/vendorService';

const CouplesLanding = () => {
  const [featuredVendors, setFeaturedVendors] = useState(MOCK_VENDORS.slice(0, 3));

  useEffect(() => {
    let mounted = true;
    getApprovedVendors().then((vendors) => {
      if (!mounted) return;
      if (vendors && vendors.length > 0) {
        setFeaturedVendors(vendors.slice(0, 3));
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────── */}
      <div className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://parkside.pewa.ke/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-29-at-8.44.09-PM.jpeg"
            alt="Diani Beach"
            className="w-full h-full object-cover scale-105"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-amari-950/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-8 animate-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={14} className="text-amari-gold" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">Kenya's Premier Wedding Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.05] mb-6 animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              Your Dream <br />
              <span className="text-gradient font-amari-script font-normal">Coastal Wedding</span><br />
              Starts Here
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/70 mb-8 sm:mb-10 max-w-lg leading-relaxed font-light animate-in slide-in-from-bottom-5 duration-1000 delay-200">
              Curated vendors, intelligent planning tools, and dedicated local expertise for your perfect Diani celebration.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in zoom-in duration-700 delay-300">
              <Link to="/vendors" className="bg-white text-amari-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                <Star size={16} /> Explore Vendors
              </Link>
              <Link to="/concierge" className="glass-dark border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                <Play size={14} /> Amari Concierge
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 sm:mt-12 flex items-center gap-4 sm:gap-6 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-amari-900 overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amari-gold fill-amari-gold" />)}
                </div>
                <p className="text-white/50 text-xs mt-0.5">Trusted by 200+ couples</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* ─── FEATURES ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amari-300/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-20">
            <span className="text-amari-500 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Why Amari</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amari-900 mb-5">Everything You Need</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-lg">The essential elements for a seamless destination wedding experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Star size={24} />, title: 'Verified Vendors', desc: 'Diani\'s best venues, planners, and creatives — personally vetted for quality.', link: '/vendors', cta: 'Browse Directory' },
              { icon: <Sun size={24} />, title: 'Smart Planning', desc: 'Budget calculator, guest list manager, and timeline creator for destination weddings.', link: '/tools', cta: 'Start Planning' },
              { icon: <Heart size={24} />, title: 'Concierge Support', desc: 'A dedicated local expert to handle bookings, logistics, and legal requirements.', link: '/concierge', cta: 'Learn More' },
            ].map((f, i) => (
              <Link key={i} to={f.link} className="group relative bg-stone-50 hover:bg-white p-8 rounded-3xl border border-stone-200/60 hover:border-amari-200 hover:shadow-2xl hover:shadow-amari-500/5 hover:-translate-y-1 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amari-400 to-amari-500 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-900">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                <span className="text-amari-500 font-bold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  {f.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-16 sm:py-28 bg-amari-900 relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amari-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-20">
            <span className="text-amari-300 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-5">Three Simple Steps</h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">From dreaming to booked — without losing the magic.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Explore', desc: 'Browse vetted coastal vendors and gather inspiration that matches your style.', link: '/gallery', cta: 'Get Inspired' },
              { step: '02', title: 'Plan', desc: 'Keep budgets, guests, and timelines organized — all in one dashboard.', link: '/tools', cta: 'Open Tools' },
              { step: '03', title: 'Book', desc: 'Get local support to coordinate logistics, vendor bookings, and travel.', link: '/concierge', cta: 'Start Booking' },
            ].map((s, i) => (
              <Link key={i} to={s.link} className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amari-300/30 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1">
                <span className="text-6xl font-serif font-bold text-amari-500/20 group-hover:text-amari-500/40 transition-colors absolute top-6 right-8">{s.step}</span>
                <div className="relative">
                  <h3 className="text-2xl font-serif font-bold text-white mb-4 mt-8">{s.title}</h3>
                  <p className="text-white/50 leading-relaxed mb-6 text-sm">{s.desc}</p>
                  <span className="text-amari-300 font-bold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                    {s.cta} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED VENDORS ──────────────────────────────────── */}
      <section className="py-16 sm:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="text-amari-500 font-bold uppercase tracking-[0.3em] text-xs mb-3 block">Featured</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amari-900">Coastal Favorites</h2>
              <p className="mt-4 text-stone-500 max-w-lg text-lg">A preview of our curated directory — find your perfect match.</p>
            </div>
            <Link to="/vendors" className="bg-amari-900 text-white px-7 py-3.5 rounded-full font-bold hover:bg-amari-800 hover:shadow-lg transition-all duration-300 flex items-center gap-2 self-start md:self-auto text-sm">
              Full Directory <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVendors.map((vendor) => (
              <Link key={vendor.id} to={`/vendor/${vendor.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 hover:border-amari-200 hover:shadow-2xl hover:shadow-amari-500/5 transition-all duration-500 block">
                <div className="relative h-60 overflow-hidden">
                  <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-1">
                    <Star size={12} className="text-amari-gold fill-amari-gold" />
                    <span className="text-xs font-bold text-stone-900">{vendor.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="glass-dark text-white/90 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-3 py-1">{vendor.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-1.5 group-hover:text-amari-600 transition-colors">{vendor.name}</h3>
                  <div className="flex items-center text-stone-400 text-xs mb-3">
                    <MapPin size={13} className="mr-1 text-amari-300" />
                    {vendor.location}
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{vendor.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL STRIP ─────────────────────────────────── */}
      <section className="py-20 bg-amari-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-amari-gold fill-amari-gold" />)}
          </div>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amari-900 italic leading-snug mb-8">
            "Like the drum that calls the people home, our love calls two families into one rythm. May our union be steady like the earth beneath our feet, patient like the seasons, and generous like the land that feeds us all."
          </blockquote>
        </div>
      </section>
    </>
  );
};

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-amari-50 flex items-center justify-center px-4">
    <div className="max-w-lg w-full bg-white border border-stone-200 rounded-2xl shadow-sm p-8 text-center">
      <h2 className="text-3xl font-serif font-bold text-amari-900">Page not found</h2>
      <p className="mt-3 text-stone-600">The page you tried to open doesn’t exist.</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="bg-amari-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amari-700 transition"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="bg-white border border-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-50 transition"
        >
          Login
        </Link>
      </div>
    </div>
  </div>
);

const ConciergePage = () => (
  <div className="max-w-7xl mx-auto py-20 px-4">
    <div className="bg-amari-900 text-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-20 overflow-hidden relative shadow-2xl">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amari-500 rounded-full blur-[128px] opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amari-gold rounded-full blur-[100px] opacity-10 -ml-20 -mb-20"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
            <span className="text-amari-300 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Premium Service</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 sm:mb-8 leading-tight">
              Amari <span className="text-amari-300 font-amari-script font-normal">Concierge</span>
            </h2>
            <p className="text-amari-100/80 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              Let us handle the details while you enjoy the journey. Our concierge service offers end-to-end planning assistance, exclusive vendor rates, and on-site coordination for a stress-free experience.
            </p>
            
            <Link to="/partner" className="inline-block bg-amari-300 text-amari-900 px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-amari-600 transition shadow-lg text-lg">
              Partner with Amari
            </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-serif font-bold mb-6">What's Included</h3>
            <ul className="space-y-4">
              {[
                  "Dedicated Wedding Expert",
                  "Vendor Contract Negotiation",
                  "Guest Accommodation & Travel",
                  "Legal Documentation Assistance",
                  "Day-of Coordination",
                  "Honeymoon Planning"
              ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-amari-50">
                    <div className="w-6 h-6 rounded-full bg-amari-500/30 flex items-center justify-center flex-shrink-0">
                         <Check size={14} className="text-amari-300" />
                    </div>
                    {item}
                  </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<CouplesLanding />} />
            <Route path="/couples" element={<CouplesLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserDashboard />} />
            <Route path="/partner" element={<VendorOnboarding />} />
            <Route path="/vendors" element={<VendorDirectory />} />
            <Route path="/vendor/:id" element={<VendorProfile />} />
            <Route path="/vendor-categories" element={<VendorCategories />} />
            <Route path="/vendor-terms" element={<VendorTerms />} />
            <Route path="/tools" element={<PlanningTools />} />
            <Route path="/flights" element={<AirlineBooking />} />
            <Route path="/gallery" element={<InspirationGallery />} />
            <Route path="/about" element={<AboutUs />} />
                        <Route path="/community" element={<Community />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/history" element={<DianiHistory />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/concierge" element={<ConciergePage />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/vendor-verification" element={<AdminGuard><AdminVendorVerification /></AdminGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;