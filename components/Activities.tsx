import React from 'react';

const Activities: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470104240373-bc1812eddc9f?q=80&w=2400&auto=format&fit=crop"
            alt="Tropical beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            Activities
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Things To Do Around Diani
          </h2>
          <p className="mt-6 text-amari-50 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            From ocean adventures to deep rest — Diani has something for every kind of guest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Ocean & Water</h3>
          <ul className="text-stone-600 leading-relaxed space-y-2 list-disc pl-5">
            <li>Snorkelling</li>
            <li>Dhow cruises (sunrise or sunset)</li>
            <li>Swimming and beach walks</li>
            <li>Water sports and guided ocean adventures</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Relaxation</h3>
          <ul className="text-stone-600 leading-relaxed space-y-2 list-disc pl-5">
            <li>Spas and massages</li>
            <li>Beachfront brunches</li>
            <li>Quiet pool days</li>
            <li>Wellness sessions and slow mornings</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Tours & Culture</h3>
          <ul className="text-stone-600 leading-relaxed space-y-2 list-disc pl-5">
            <li>Local markets and coastal towns</li>
            <li>Swahili food experiences</li>
            <li>Guided day tours and adventures</li>
            <li>Photo spots along the coast</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Group Moments</h3>
          <ul className="text-stone-600 leading-relaxed space-y-2 list-disc pl-5">
            <li>Welcome dinners and rehearsal dinners</li>
            <li>Bachelor / bachelorette outings</li>
            <li>Anniversary and honeymoon experiences</li>
            <li>Proposal setups and surprise plans</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Activities;
