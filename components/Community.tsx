import React from 'react';
import InspirationGallery from './InspirationGallery';

const Community: React.FC = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=2400&auto=format"
              alt="Coastal wedding celebration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
          </div>
          <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
              Community
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              Welcome to the Diani Community Hub
            </h2>
            <p className="mt-6 text-amari-50 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
              Connect, share, and celebrate life in our stunning coastal town — from culture and tourism to local businesses and social initiatives.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Who We Are</h3>
            <p className="text-stone-600 leading-relaxed mb-4">We are a diverse and vibrant community made up of:</p>
            <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
              <li>Local businesses and entrepreneurs shaping Diani’s economy</li>
              <li>Artisans, performers, and creatives showcasing talent and culture</li>
              <li>Tourism and hospitality providers creating unforgettable experiences</li>
              <li>Residents and families who make Diani a welcoming home</li>
              <li>Visitors and tourists eager to experience Diani authentically</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-5">
              Our mission is to strengthen local connections, foster collaboration, and ensure Diani thrives culturally, socially, and economically.
            </p>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
            <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Making a Difference Together</h3>
            <p className="text-stone-600 leading-relaxed mb-6">
              As a community, we have the power to make Diani not only beautiful but also sustainable and supportive:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
                <h4 className="text-lg font-bold text-amari-500 mb-3">Charity Initiatives</h4>
                <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                  <li>Organize and participate in local outreach programs, schools, health campaigns, and community development projects.</li>
                  <li>Support underprivileged families, youth programs, and local causes that strengthen the social fabric of Diani.</li>
                </ul>
              </div>

              <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
                <h4 className="text-lg font-bold text-amari-500 mb-3">Nature &amp; Environmental Conservation</h4>
                <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                  <li>Join beach cleanups, tree planting, and wildlife protection initiatives.</li>
                  <li>Promote sustainable tourism and eco-friendly practices that preserve Diani’s unique coastal environment for generations to come.</li>
                </ul>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed mt-6">
              By working together, we can celebrate Diani’s culture, support its people, and protect its natural beauty, making it a thriving, resilient, and inclusive community.
            </p>
          </section>
        </div>
      </div>

      <div className="bg-amari-50 py-12">
        <InspirationGallery />
      </div>
    </>
  );
};

export default Community;
