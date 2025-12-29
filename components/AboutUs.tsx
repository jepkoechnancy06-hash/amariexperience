import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2400&auto=format&fit=crop"
            alt="Coastal shoreline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            About Us
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Amari Experience
          </h2>
          <p className="mt-6 text-amari-50 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            We help couples (and their people) plan unforgettable celebrations in Diani — pairing local insight with curated vendors and practical tools.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amari-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">What We Do</h3>
            <p className="text-stone-600 leading-relaxed">
              Amari Experience brings together trusted coastal vendors, planning resources, and on-the-ground knowledge so you can design a celebration that feels effortless and personal.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Celebrations We Love</h3>
            <ul className="text-stone-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Honeymoons</li>
              <li>Anniversaries</li>
              <li>Proposals</li>
              <li>Rehearsal dinners</li>
              <li>Bachelor / bachelorette parties</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-amari-100">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Community, Not Just a Checklist</h3>
          <p className="text-stone-600 leading-relaxed">
            We’re building a community where guests and vendors can share real stories, inspiration, and local recommendations—so planning feels grounded in lived experiences, not generic templates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
