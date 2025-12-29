import React from 'react';

const Community: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Community</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Welcome to the Diani Community Hub</h2>
        <p className="mt-6 text-stone-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          The Diani Community Hub is your space to connect, share, and celebrate life in our stunning coastal town. From tourism and culture to local businesses and social initiatives, this hub brings together everyone who calls Diani home—or anyone passionate about it.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Who We Are</h3>
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
          <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Making a Difference Together</h3>
          <p className="text-stone-600 leading-relaxed mb-6">
            As a community, we have the power to make Diani not only beautiful but also sustainable and supportive:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-900 mb-3">Charity Initiatives</h4>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                <li>Organize and participate in local outreach programs, schools, health campaigns, and community development projects.</li>
                <li>Support underprivileged families, youth programs, and local causes that strengthen the social fabric of Diani.</li>
              </ul>
            </div>

            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-900 mb-3">Nature &amp; Environmental Conservation</h4>
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
  );
};

export default Community;
