import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Support</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Contact Us</h2>
        <p className="mt-6 text-stone-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          Have a question about planning a destination wedding in Kenya, vendor partnerships, or experiences in Diani?
          Reach out and we’ll point you in the right direction.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
        <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">How to Reach Amari</h3>
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
