import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2400&auto=format"
            alt="Diani Beach wedding ceremony"
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
            We help couples (and their people) plan unforgettable celebrations in Diani — pairing local insight with curated vendors and practical tools. At Amari, we connect couples with trusted wedding vendors to help create unforgettable destination weddings. All vendor profiles on the platform are carefully reviewed and approved by our team to ensure authenticity and quality, so couples can explore services with confidence. While the platform showcases detailed information, pricing, and offerings from each vendor, Amari does not handle bookings or payments—all arrangements are made directly between couples and vendors. Our goal is to make wedding planning seamless, transparent, and inspiring, providing a single place to discover venues, stylists, caterers, photographers, and all the details that make a wedding truly exceptional.
          </p>
        </div>
      </div>

      {/* About Amari Experience Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amari-100 mb-12">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-3">Amari Experience</h3>
          <p className="text-stone-700 leading-relaxed">
            Born in Diani, a beautiful, culture-rich place with so much potential, Amari Experience began with quiet moments of noticing — and falling in love. In a destination where the ocean meets heritage and celebrations unfold effortlessly, there was no single digital space that truly reflected its magic or the people who bring it to life.
          </p>
          <p className="mt-4 text-stone-700 leading-relaxed">
            While its beauty lived in memories, messages, and word of mouth, Amari Experience was created to give Diani a lasting presence online — a home where love stories, local creators, and meaningful experiences could be discovered with ease and trust.
          </p>
          <p className="mt-4 text-stone-700 leading-relaxed">
            Rooted in destination weddings and expanding into honeymoons, anniversaries, and romantic escapes, Amari Experience exists to honour places worth celebrating — and to share their beauty with the world.
          </p>
        </div>

        <div className="mt-10 pt-10 border-t border-amari-100" />
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
            We're building a community where guests and vendors can share real stories, inspiration, and local recommendations—so planning feels grounded in lived experiences, not generic templates.
          </p>
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amari-100">
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center rounded-full bg-amari-50 border border-amari-100 px-5 py-2 text-amari-500 text-[10px] font-bold uppercase tracking-[0.25em]">
            Meet Our Founder
          </span>
          <h3 className="mt-4 text-2xl md:text-3xl font-serif font-bold text-amari-900">The Heart Behind Amari</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative">
                <div className="absolute inset-0 bg-amari-200 rounded-2xl transform rotate-3"></div>
                <img
                  src="/fionaprofilepic.jpeg"
                  alt="Fiona"
                  className="relative w-full rounded-2xl shadow-lg object-cover aspect-[3/4]"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-serif font-bold text-amari-500">Fiona</h3>
                <p className="text-amari-400 text-sm uppercase tracking-wider mt-1">Founder & Creator</p>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Hi, I'm Fiona.</h3>
              <p className="text-stone-700 leading-relaxed text-lg">
                I'm curious by nature and drawn to creativity in all its forms. I love nature photography, music, reading, art, and long conversations with interesting people—without claiming to be particularly good at any of them 😅. I simply enjoy experiencing them, learning from them, and letting them shape how I see the world.
              </p>
            </div>

            <div className="border-t border-amari-100 pt-8">
              <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">My Connection to Diani</h3>
              <p className="text-stone-700 leading-relaxed text-lg">
                Diani has deeply influenced my perspective. Its landscapes, history, and rhythm have taught me to value preservation over excess, people over pace, and progress that strengthens communities without eroding what makes a place special.
              </p>
              <p className="mt-4 text-stone-700 leading-relaxed text-lg">
                I'm guided by a strong respect for nature, local stories, and thoughtful growth, with a genuine belief in creating impact that uplifts both people and place.
              </p>
            </div>

            <div className="border-t border-amari-100 pt-8">
              <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">My Philosophy</h3>
              <p className="text-stone-700 leading-relaxed text-lg">
                At the heart of everything I do is a love for life, meaningful connection, and experiences that feel authentic, grounded, and lasting.
              </p>
            </div>

            <div className="border-t border-amari-100 pt-8">
              <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">What I Love</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Nature Photography',
                  'Music',
                  'Reading',
                  'Art',
                  'Long Conversations',
                  'Local Stories'
                ].map((interest, index) => (
                  <div key={index} className="bg-amari-50 rounded-xl p-4 text-center border border-amari-100">
                    <span className="text-amari-600 font-medium">{interest}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
