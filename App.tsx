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
import { ArrowRight, Check, Star, Heart, Sun, MapPin } from 'lucide-react';

const CouplesLanding = () => (
  <>
    {/* Hero Section */}
    <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2072&auto=format&fit=crop" 
          alt="Diani Sunset Boat" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-amari-50/90"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 text-white text-sm font-bold uppercase tracking-widest mb-6 animate-in slide-in-from-bottom-4 duration-700">
           Kenya's Premier Wedding Destination
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-sm leading-none animate-in slide-in-from-bottom-6 duration-1000 delay-100">
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
            Concierge Service <ArrowRight size={18} />
          </Link>
        </div>
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
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-900">Verified Vendors</h3>
            <p className="text-stone-500 leading-relaxed">
              Access our exclusive network of Diani's best venues, planners, and creatives, personally vetted for quality and reliability.
            </p>
            <Link to="/vendors" className="inline-block mt-6 text-amari-500 font-bold text-sm uppercase tracking-wider hover:text-amari-600">
              Browse Directory &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amari-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amari-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amari-200 transition-colors">
              <Sun className="text-amari-600" size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-900">Smart Planning</h3>
            <p className="text-stone-500 leading-relaxed">
              Stay organized with our digital budget calculator, guest list manager, and day-of timeline creator designed for destination weddings.
            </p>
            <Link to="/tools" className="inline-block mt-6 text-amari-500 font-bold text-sm uppercase tracking-wider hover:text-amari-600">
              Start Planning &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amari-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-amari-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amari-200 transition-colors">
              <Heart className="text-amari-600" size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-amari-900">Concierge Support</h3>
            <p className="text-stone-500 leading-relaxed">
              Upgrade to our premium package for a dedicated local wedding expert to handle bookings, logistics, and legal requirements.
            </p>
            <Link to="/concierge" className="inline-block mt-6 text-amari-500 font-bold text-sm uppercase tracking-wider hover:text-amari-600">
              Learn More &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
    
    <div className="bg-white py-12">
        <VendorDirectory />
    </div>
    
    <div className="bg-amari-50 py-12">
        <InspirationGallery />
    </div>
  </>
);

const ConciergePage = () => (
  <div className="max-w-7xl mx-auto py-20 px-4">
    <div className="bg-[#1a3038] text-white rounded-[2rem] p-8 md:p-20 overflow-hidden relative shadow-2xl">
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
              Inquire for Pricing
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
      <Layout>
        <Routes>
          <Route path="/" element={<VendorOnboarding />} />
          <Route path="/couples" element={<CouplesLanding />} />
          <Route path="/vendors" element={<VendorDirectory />} />
          <Route path="/tools" element={<PlanningTools />} />
          <Route path="/flights" element={<AirlineBooking />} />
          <Route path="/gallery" element={<InspirationGallery />} />
          <Route path="/concierge" element={<ConciergePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
      <GeminiPlanner />
    </Router>
  );
};

export default App;