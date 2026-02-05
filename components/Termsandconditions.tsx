import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Legal</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Privacy Policy</h2>
        <p className="mt-6 text-stone-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          This is a placeholder privacy policy page.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
        <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Coming Soon</h3>
        <p className="text-stone-600 leading-relaxed">
          If you share what data you collect (e.g., vendor onboarding form fields, analytics, inspiration board posts)
          and what services you use (hosting, email, payments), I can draft a proper privacy policy aligned to your app.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
