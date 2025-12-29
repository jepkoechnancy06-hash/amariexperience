import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=2400&auto=format&fit=crop"
            alt="Beach shoreline"
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
        <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
          <li>
            For quick guidance, use the in-app AI concierge on the site.
          </li>
          <li>
            For partnerships, go to the “Partner with Us” flow.
          </li>
        </ul>
        <p className="text-stone-600 leading-relaxed mt-5">
          If you’d like a direct email address or phone number shown here, tell me what contact details you want to use
          and I’ll add them.
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
