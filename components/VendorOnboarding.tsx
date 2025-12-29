import React, { useState } from 'react';
import { VendorCategory } from '../types';
import { submitApplication } from '../services/vendorService';
import { CheckCircle, Store, MapPin, Phone, Mail, ArrowRight, Upload, Info, Globe, Target, Eye, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorOnboarding: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    category: VendorCategory.Venue,
    description: '',
    priceRange: '$$' as '$$' | '$$$' | '$$$$',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication(formData);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-amari-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-amari-100 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amari-500 to-amari-gold"></div>
          <div className="w-24 h-24 bg-amari-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in delay-200 duration-500">
            <CheckCircle className="text-amari-500" size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-amari-900 mb-4">Application Received</h2>
          <p className="text-stone-600 mb-10 leading-relaxed">
            Our concierge team will review your application and reach out to {formData.contactEmail} within 24-48 hours.
          </p>
          <div className="space-y-4">
            <Link to="/couples" className="block w-full bg-white text-stone-600 border border-amari-200 px-6 py-4 rounded-xl font-bold hover:bg-amari-50 transition">
              Visit Couple's Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-amari-50">
      {/* Left Panel - Hero/Info (Desktop) */}
      <div className="lg:w-5/12 bg-amari-900 relative hidden lg:flex flex-col justify-between p-16 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1996&auto=format&fit=crop" 
            alt="Luxury Wedding Setup" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-in fade-in duration-1000 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amari-900/80 via-amari-900/60 to-amari-900/95"></div>
        </div>
        
        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-amari-500 rounded-xl flex items-center justify-center shadow-lg shadow-amari-900/50">
                <Waves size={20} className="text-white" />
             </div>
             <div>
                <span className="font-serif text-xl tracking-wide font-bold block leading-none">AMARI</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-amari-300">Partners</span>
             </div>
          </div>
          <h1 className="text-5xl font-serif font-bold leading-[1.1] mb-8 drop-shadow-lg text-amari-50">
            Help couples plan their ideal coastal wedding.
          </h1>
          
          <div className="space-y-8 border-l-2 border-amari-500/30 pl-8">
             <div className="animate-in slide-in-from-left-2 duration-500 delay-100">
                <div className="flex items-center gap-2 mb-2 text-amari-300">
                  <Target size={18} />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Our Mission</h4>
                </div>
                <p className="leading-relaxed text-amari-100/80 font-light">To simplify destination wedding planning in Kenya using digital tools, curated vendors, and local insight.</p>
             </div>
             <div className="animate-in slide-in-from-left-2 duration-500 delay-200">
                <div className="flex items-center gap-2 mb-2 text-amari-300">
                  <Eye size={18} />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Our Vision</h4>
                </div>
                <p className="leading-relaxed text-amari-100/80 font-light">To become East Africa’s leading online resource for beach and destination weddings.</p>
             </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 pt-10 border-t border-white/10 animate-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="flex items-start gap-4 group">
             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amari-500 transition-colors">
                <CheckCircle size={20} className="text-amari-300 group-hover:text-white" />
             </div>
             <div>
               <h3 className="font-bold text-base text-amari-50">Verified Listing</h3>
               <p className="text-amari-200/60 text-sm">Premium profile with photos, pricing & reviews.</p>
             </div>
           </div>
           <div className="flex items-start gap-4 group">
             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amari-500 transition-colors">
                <Globe size={20} className="text-amari-300 group-hover:text-white" />
             </div>
             <div>
               <h3 className="font-bold text-base text-amari-50">East Africa's Leading Resource</h3>
               <p className="text-amari-200/60 text-sm">Connect with international clients planning Diani weddings.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="lg:w-7/12 w-full bg-amari-50 overflow-y-auto">
        {/* Mobile Hero */}
        <div className="lg:hidden relative h-72">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1996&auto=format&fit=crop" 
              alt="Luxury Wedding" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amari-900 via-transparent to-black/30"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
               <span className="bg-amari-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">Partner Program</span>
               <h1 className="text-3xl font-serif font-bold text-white leading-none">Join the Coastal Leader</h1>
            </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10 lg:py-24 animate-in slide-in-from-bottom-4 duration-700">
          
          <div className="mb-8 lg:hidden bg-white p-6 rounded-2xl border border-amari-100 shadow-sm">
             <h4 className="font-bold text-amari-600 text-xs uppercase mb-2">Our Mission</h4>
             <p className="text-stone-600 text-sm leading-relaxed">
               To simplify destination wedding planning in Kenya using digital tools, curated vendors, and local insight.
             </p>
          </div>

          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl font-serif font-bold text-amari-900">Vendor Application</h2>
            <p className="text-stone-500 mt-2 text-lg">Join us in simplifying destination weddings in Kenya.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-amari-100/50 border border-amari-100">
            
            {/* Section 1 */}
            <div className="space-y-8">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Business Name</label>
                  <input 
                    required
                    type="text" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                    placeholder="e.g. The Coastal Lens"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Category</label>
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all appearance-none focus:bg-white cursor-pointer"
                    >
                      {Object.values(VendorCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-amari-400">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Description</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-amari-50 border-0 rounded-xl px-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 resize-none focus:bg-white"
                  placeholder="Tell us about your style, experience, and what makes your service unique..."
                ></textarea>
                <div className="flex gap-2 text-xs text-amari-400 items-center mt-1">
                  <Info size={14} />
                  <span>This will appear on your public profile.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <label className="text-sm font-bold text-amari-900">Pricing Tier</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['$$', '$$$', '$$$$'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priceRange: tier as any }))}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.priceRange === tier ? 'bg-amari-900 text-white border-amari-900 shadow-md transform scale-105' : 'bg-white text-stone-500 border-amari-200 hover:border-amari-400 hover:bg-amari-50'}`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
                 <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Business Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="Street address or Area"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-8 pt-6">
              <h3 className="text-sm font-bold text-amari-500 uppercase tracking-widest border-b border-amari-100 pb-4">Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="email" 
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="name@business.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-amari-900 group-focus-within:text-amari-600 transition-colors">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-amari-400 group-focus-within:text-amari-500 transition-colors" size={20} />
                    <input 
                      required
                      type="tel" 
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full bg-amari-50 border-0 rounded-xl pl-12 pr-4 py-4 text-amari-900 ring-1 ring-inset ring-amari-200 focus:ring-2 focus:ring-amari-500 transition-all placeholder:text-amari-300 focus:bg-white"
                      placeholder="+254 7..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <button 
                type="submit" 
                className="group relative w-full bg-amari-600 text-white text-lg font-bold py-5 rounded-2xl hover:bg-amari-900 transition-all shadow-xl shadow-amari-200 hover:shadow-2xl hover:-translate-y-1 active:scale-95 duration-300"
              >
                Submit Application
                <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" size={20} />
              </button>
              <p className="text-xs text-amari-300 text-center mt-6">
                By clicking submit, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;