import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import VendorDirectory from './components/VendorDirectory';
import PlanningTools from './components/PlanningTools';
import AirlineBooking from './components/AirlineBooking';
import InspirationGallery from './components/InspirationGallery';
import GeminiPlanner from './components/GeminiPlanner';
import VendorOnboarding from './components/VendorOnboarding';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import AboutMe from './components/AboutMe';
import Community from './components/Community';
import Activities from './components/Activities';
import DianiHistory from './components/DianiHistory';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ScrollToTop from './components/ScrollToTop';
import { ArrowRight, Check, Star, Heart, Sun, MapPin } from 'lucide-react';
import { MOCK_VENDORS } from './constants';

const CouplesLanding = () => (
  <>
    {/* Hero Section */}
    <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://parkside.pewa.ke/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-29-at-8.44.09-PM.jpeg" 
          alt="Diani Sunset Boat" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-amari-50/95"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <div className="inline-flex flex-col items-center bg-black/25 backdrop-blur-md border border-white/20 rounded-[2rem] px-6 md:px-10 py-8 md:py-10 shadow-2xl">
          <div className="inline-block bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-6 py-2 text-white text-sm font-bold uppercase tracking-widest mb-6 animate-in slide-in-from-bottom-4 duration-700">
             Kenya's Premier Wedding Destination
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-none animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Say Yes to <span className="italic text-amari-100">Diani</span>
          </h1>
          <p className="text-xl md:text-2xl text-amari-50 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Curated vendors, intuitive tools, and local insight for your perfect coastal celebration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in zoom-in duration-700 delay-300">
            <Link to="/vendors" className="bg-amari-50 text-amari-900 px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
              Find Vendors
            </Link>
            <Link to="/concierge" className="bg-amari-500/90 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold hover:bg-amari-600 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
              Amari Concierge <span className="text-xs">(Private Launch Phase)</span> <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none" aria-hidden="true">
          <path
            fill="var(--amari-50)"
            d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,80C672,64,768,32,864,37.3C960,43,1056,85,1152,101.3C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>

    {/* Features Section */}
    <section className="py-24 bg-amari-50 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amari-900 mb-4">Everything Under the Sun</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">We've gathered the essential elements for a seamless beach wedding experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amari-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amari-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amari-200 transition-colors">
              <Star className="text-amari-600" size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-500">Verified Vendors</h3>
            <p className="text-stone-500 leading-relaxed">
              Access our exclusive network of Diani's best venues, planners, and creatives, personally vetted for quality and reliability.
            </p>
            <Link to="/vendors" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              Browse Directory &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amari-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amari-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amari-200 transition-colors">
              <Sun className="text-amari-600" size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-500">Smart Planning</h3>
            <p className="text-stone-500 leading-relaxed">
              Stay organized with our digital budget calculator, guest list manager, and day-of timeline creator designed for destination weddings.
            </p>
            <Link to="/tools" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              Start Planning &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amari-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amari-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amari-200 transition-colors">
              <Heart className="text-amari-600" size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-500">Concierge Support</h3>
            <p className="text-stone-500 leading-relaxed">
              Upgrade to our premium package for a dedicated local wedding expert to handle bookings, logistics, and legal requirements.
            </p>
            <Link to="/concierge" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              Learn More &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amari-500 mb-4">A Simple Coastal Flow</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            A clear path from “we’re dreaming” to “we’re booked” — without losing the magic.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-amari-50 border border-amari-100 rounded-3xl p-8 hover:shadow-xl transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amari-500 mb-3">Step 1</p>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Explore</h3>
            <p className="text-stone-600 leading-relaxed">
              Browse vetted coastal vendors and gather inspiration that matches your style.
            </p>
            <Link to="/gallery" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              View Inspiration &rarr;
            </Link>
          </div>

          <div className="bg-amari-50 border border-amari-100 rounded-3xl p-8 hover:shadow-xl transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amari-500 mb-3">Step 2</p>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Plan</h3>
            <p className="text-stone-600 leading-relaxed">
              Keep budgets, guests, and timelines organized — all in one dashboard.
            </p>
            <Link to="/tools" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              Open Tools &rarr;
            </Link>
          </div>

          <div className="bg-amari-50 border border-amari-100 rounded-3xl p-8 hover:shadow-xl transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amari-500 mb-3">Step 3</p>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Book</h3>
            <p className="text-stone-600 leading-relaxed">
              Get local support to coordinate logistics, vendor bookings, and travel.
            </p>
            <Link to="/concierge" className="inline-block mt-6 text-amari-400 font-bold text-sm uppercase tracking-wider hover:text-amari-500">
              Concierge &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Vendors Preview */}
    <section className="py-24 bg-amari-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Directory Preview</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amari-500">A Few Coastal Favorites</h2>
            <p className="mt-4 text-stone-600 max-w-2xl">
              A quick taste of what’s inside the directory — browse by category to find your perfect fit.
            </p>
          </div>
          <Link to="/vendors" className="bg-amari-600 text-white px-7 py-3 rounded-xl font-bold hover:bg-amari-900 transition shadow-lg self-start md:self-auto">
            Browse Full Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_VENDORS.slice(0, 3).map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden border border-amari-100/60">
              <div className="relative h-56 overflow-hidden">
                <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">{vendor.category}</span>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <Star size={12} className="text-amari-300 fill-amari-300 mr-1" />
                      <span className="text-xs font-bold text-amari-900">{vendor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-serif font-bold text-amari-900 mb-2">{vendor.name}</h3>
                <div className="flex items-center text-stone-500 text-xs mb-4">
                  <MapPin size={14} className="mr-1.5 text-amari-300" />
                  {vendor.location}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">{vendor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

const ConciergePage = () => (
  <div className="max-w-7xl mx-auto py-20 px-4">
    <div className="bg-amari-900 text-white rounded-[2rem] p-8 md:p-20 overflow-hidden relative shadow-2xl">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amari-500 rounded-full blur-[128px] opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amari-gold rounded-full blur-[100px] opacity-10 -ml-20 -mb-20"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
            <span className="text-amari-300 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Premium Service</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              Amari <span className="text-amari-300 italic">Concierge</span>
            </h2>
            <p className="text-amari-100/80 text-lg mb-10 leading-relaxed">
              Let us handle the details while you enjoy the journey. Our concierge service offers end-to-end planning assistance, exclusive vendor rates, and on-site coordination for a stress-free experience.
            </p>
            
            <button className="bg-amari-300 text-amari-900 px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-amari-600 transition shadow-lg text-lg">
              Partner with Amari
            </button>
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
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<CouplesLanding />} />
          <Route path="/couples" element={<CouplesLanding />} />
          <Route path="/partner" element={<VendorOnboarding />} />
          <Route path="/vendors" element={<VendorDirectory />} />
          <Route path="/tools" element={<PlanningTools />} />
          <Route path="/flights" element={<AirlineBooking />} />
          <Route path="/gallery" element={<InspirationGallery />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/community" element={<Community />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/history" element={<DianiHistory />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/concierge" element={<ConciergePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
      <GeminiPlanner />
    </Router>
  );
};

export default App;