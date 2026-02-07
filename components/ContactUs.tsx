import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=2400&auto=format"
            alt="Diani Beach wedding venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            Support
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Contact Us
          </h2>
          <p className="mt-6 text-amari-50 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Questions about planning a destination wedding in Kenya, vendor partnerships, or experiences in Diani? We’ll point you in the right direction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl border border-amari-100 p-7 shadow-sm hover:shadow-xl transition">
          <h3 className="text-xl font-serif font-bold text-amari-500 mb-2">Quick answers</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Use the in-app assistant for fast guidance.
          </p>
          <p className="mt-4 text-xs text-stone-500">Look for “Ask Amari AI” on the bottom-right.</p>
        </div>
        <div className="bg-white rounded-3xl border border-amari-100 p-7 shadow-sm hover:shadow-xl transition">
          <h3 className="text-xl font-serif font-bold text-amari-500 mb-2">Partnerships</h3>
          <p className="text-stone-600 text-sm leading-relaxed">Vendors can apply in minutes.</p>
          <Link to="/partner" className="inline-block mt-5 bg-amari-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amari-900 transition shadow-lg">
            Partner with Us
          </Link>
        </div>
        <div className="bg-white rounded-3xl border border-amari-100 p-7 shadow-sm hover:shadow-xl transition">
          <h3 className="text-xl font-serif font-bold text-amari-500 mb-2">Planning basics</h3>
          <p className="text-stone-600 text-sm leading-relaxed">Read the essentials in our FAQ.</p>
          <Link to="/faq" className="inline-block mt-5 bg-amari-50 text-amari-900 border border-amari-100 px-5 py-2.5 rounded-xl font-bold hover:bg-white transition">
            Open FAQ
          </Link>
        </div>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
        <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">How to Reach Amari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amari-50 flex items-center justify-center flex-shrink-0">
              <span className="text-amari-500 text-lg">📧</span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Email</p>
              <a href="mailto:hello@amariexperience.com" className="text-amari-500 text-sm hover:underline">hello@amariexperience.com</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amari-50 flex items-center justify-center flex-shrink-0">
              <span className="text-amari-500 text-lg">📱</span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">WhatsApp / Phone</p>
              <a href="https://wa.me/254796535120" target="_blank" rel="noreferrer" className="text-amari-500 text-sm hover:underline">+254 796 535 120</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amari-50 flex items-center justify-center flex-shrink-0">
              <span className="text-amari-500 text-lg">📍</span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Location</p>
              <p className="text-stone-600 text-sm">Diani Beach, Kwale County, Kenya</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amari-50 flex items-center justify-center flex-shrink-0">
              <span className="text-amari-500 text-lg">⏰</span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Hours</p>
              <p className="text-stone-600 text-sm">Mon–Sat: 8 AM – 6 PM EAT</p>
            </div>
          </div>
        </div>
        <a
          href="https://wa.me/254796535120?text=Hi%20Amari!%20I%20have%20a%20question."
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-amari-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amari-900 transition shadow-lg"
        >
          Chat with Us on WhatsApp
        </a>
      </section>
    </div>
  );
};

export default ContactUs;
