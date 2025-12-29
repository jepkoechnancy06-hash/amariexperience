import React from 'react';

const DianiHistory: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=2400&auto=format&fit=crop"
            alt="Coastal sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            History
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            The Beautiful History of Diani
          </h2>
          <p className="mt-6 text-amari-50 max-w-4xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Diani was born of the sea and the sun. First home to the Digo people, it later welcomed Arab and Persian traders whose journeys shaped Swahili culture along the coast. Under British rule, it rested quietly, waiting. Then it awakened—its white sands and turquoise waters calling travelers, lovers, and dreamers. Today, Diani is where many histories meet, and every tide feels like a promise.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amari-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Roots</h3>
            <p className="text-stone-600 leading-relaxed">
              Diani’s earliest story is coastal and local—woven through the lives of the Digo people and the rhythms of the ocean.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Trade & Culture</h3>
            <p className="text-stone-600 leading-relaxed">
              Traders from across the Indian Ocean brought languages, faiths, and ideas that helped shape the Swahili coast.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">A Quiet Chapter</h3>
            <p className="text-stone-600 leading-relaxed">
              Under British rule, the coastline changed slowly, holding onto calm stretches and everyday life.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Diani Today</h3>
            <p className="text-stone-600 leading-relaxed">
              Now it’s a meeting place of stories—where celebrations feel brighter, and the sea keeps time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DianiHistory;
