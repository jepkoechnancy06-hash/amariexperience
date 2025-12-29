import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amari-100 bg-white shadow-xl mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2400&auto=format&fit=crop"
            alt="Beach sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/95"></div>
        </div>
        <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-6 py-2 text-white text-xs font-bold uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-700">
            FAQ
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-sm leading-tight animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            Planning a Destination Wedding in Kenya
          </h2>
          <p className="mt-6 text-amari-50 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            The essentials for weddings, guest travel, and the celebrations around your big day — with in-app AI for personalized guidance.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Weddings in Kenya – Legal &amp; Symbolic Options</h3>
          <p className="text-stone-700 leading-relaxed">
            Kenya legally recognises marriages involving foreign nationals, provided official requirements are met.
          </p>
          <p className="text-stone-700 leading-relaxed mt-4">Couples may choose:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>A legal marriage in Kenya, or</li>
            <li>A symbolic ceremony in Kenya, with legal formalities completed elsewhere</li>
          </ul>
          <p className="text-stone-700 leading-relaxed mt-5">
            Amari does not process legal marriages or paperwork. We provide information and connect you with experienced planners, venues, and vendors.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Legal marriage basics (at a glance)</h3>
          <p className="text-stone-700 leading-relaxed">Legal marriages may require:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>Valid passports</li>
            <li>Birth certificates</li>
            <li>Proof of marital status</li>
            <li>Passport-size photographs</li>
            <li>Compliance with notice periods and registration timelines</li>
          </ul>
          <p className="text-stone-700 leading-relaxed mt-5">
            Requirements vary by nationality and ceremony type. Always confirm through official government sources.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Symbolic ceremonies &amp; wedding events</h3>
          <p className="text-stone-700 leading-relaxed">
            Symbolic ceremonies are common for destination weddings and allow flexibility in location and format.
          </p>
          <p className="text-stone-600 leading-relaxed mt-4 font-semibold">Important:</p>
          <p className="text-stone-700 leading-relaxed mt-2">
            Even symbolic weddings and related events may require event permits, depending on location.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>Hotels &amp; private venues: approvals are usually handled by the venue</li>
            <li>Public beaches, parks, conservancies: permits may be required</li>
          </ul>
          <p className="text-stone-700 leading-relaxed mt-5">
            Amari does not obtain permits but connects you with professionals familiar with local requirements.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Beyond the wedding day</h3>
          <p className="text-stone-700 leading-relaxed">While weddings are our core focus, Amari also supports planning for:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>Proposals</li>
            <li>Welcome dinners &amp; receptions</li>
            <li>Bachelor &amp; bachelorette parties</li>
            <li>Vow renewals &amp; anniversaries</li>
            <li>Honeymoons</li>
            <li>Guest travel, tours, and experiences</li>
          </ul>
          <p className="text-stone-700 leading-relaxed mt-5">
            These events usually don’t require personal legal documentation but may still involve venue or location approvals.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Travel &amp; entry for couples and guests</h3>
          <p className="text-stone-700 leading-relaxed">
            Most visitors to Kenya require an official e-Travel Authorisation (eTA) prior to arrival, depending on nationality.
          </p>
          <p className="text-stone-700 leading-relaxed mt-4">
            Guests planning safaris, tours, or extended stays should check official immigration guidance before travel.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">What to wear in Kenya</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-500 mb-3">For weddings &amp; events</h4>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                <li>Formalwear is welcome and widely worn</li>
                <li>Light, breathable fabrics are ideal for coastal climates</li>
                <li>Beachwear is appropriate at resorts and beaches</li>
              </ul>
            </div>
            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-500 mb-3">For travel &amp; excursions</h4>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                <li>Modest dress is recommended in towns and cultural sites</li>
                <li>Comfortable shoes for safaris and walking</li>
                <li>Light layers for cooler evenings inland</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Safety &amp; general guidance</h3>
          <p className="text-stone-700 leading-relaxed">Kenya is an established destination for international weddings and tourism.</p>
          <p className="text-stone-700 leading-relaxed mt-4">General tips:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>Use licensed transport and guides</li>
            <li>Secure valuables</li>
            <li>Respect local laws and customs</li>
            <li>Exercise caution when moving around cities at night</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Official Government &amp; Travel Resources</h3>
          <p className="text-stone-700 leading-relaxed">For accurate and up-to-date information:</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed mt-3">
            <li>
              Kenya eCitizen – Marriage &amp; Civil Services:{' '}
              <a className="text-amari-400 font-semibold hover:text-amari-500 underline" href="https://oag.ecitizen.go.ke/" target="_blank" rel="noreferrer">
                https://oag.ecitizen.go.ke/
              </a>
            </li>
            <li>
              Department of Immigration Services (Visas &amp; Entry):{' '}
              <a className="text-amari-400 font-semibold hover:text-amari-500 underline" href="https://immigration.go.ke/" target="_blank" rel="noreferrer">
                https://immigration.go.ke/
              </a>
            </li>
            <li>
              Kenya eTA Portal:{' '}
              <a className="text-amari-400 font-semibold hover:text-amari-500 underline" href="https://etakenya.go.ke/" target="_blank" rel="noreferrer">
                https://etakenya.go.ke/
              </a>
            </li>
            <li>
              Official Tourism Information – Magical Kenya:{' '}
              <a className="text-amari-400 font-semibold hover:text-amari-500 underline" href="https://www.magicalkenya.com/" target="_blank" rel="noreferrer">
                https://www.magicalkenya.com/
              </a>
            </li>
          </ul>
          <p className="text-stone-700 leading-relaxed mt-5">
            Amari may link to these resources for convenience but is not affiliated with government agencies.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">What Amari Does (and Doesn’t Do)</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-500 mb-3">Amari does:</h4>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                <li>Focus on destination weddings in Kenya</li>
                <li>Connect couples, planners, and families with venues, vendors, and experience providers</li>
                <li>Share general planning information</li>
                <li>Offer AI-powered guidance to explore options</li>
              </ul>
            </div>
            <div className="bg-amari-50 rounded-2xl border border-amari-100 p-6">
              <h4 className="text-lg font-bold text-amari-500 mb-3">Amari does not:</h4>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 leading-relaxed">
                <li>Apply for visas, permits, or licenses</li>
                <li>Register marriages or events</li>
                <li>Act as a planner, agent, or tour operator</li>
              </ul>
            </div>
          </div>
          <p className="text-stone-700 leading-relaxed mt-5">
            All legal, contractual, and logistical responsibilities remain with users and their chosen service providers.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
          <h3 className="text-2xl font-serif font-bold text-amari-500 mb-4">Final note</h3>
          <p className="text-stone-700 leading-relaxed">
            Amari is built for destination weddings — and everything that makes them unforgettable. If you have a specific question, use the in-app assistant for tailored guidance.
          </p>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
