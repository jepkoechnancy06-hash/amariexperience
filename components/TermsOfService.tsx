import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Legal</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Terms of Service</h2>
        <p className="mt-6 text-stone-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          This is a placeholder terms page.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
        <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Coming Soon</h3>
        <p className="text-stone-600 leading-relaxed">
          If you want, I can convert Amari’s “What we do / don’t do” guidance into formal terms, including vendor and
          user responsibilities, disclaimers, and acceptable use for the inspiration board.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
