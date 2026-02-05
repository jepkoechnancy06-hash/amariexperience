import React from 'react';
import { Link } from 'react-router-dom';
import { WEDDING_VENDOR_CATEGORIES } from '../constants';

const VendorCategories: React.FC = () => {
  return (
    <div className="min-h-screen bg-amari-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl border border-amari-100 p-8 md:p-12">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Wedding Vendor Categories</h1>
              <p className="text-stone-600 mt-3 text-lg">
                Approved categories used across Amari for vendor onboarding and vendor profiles.
              </p>
            </div>
            <Link
              to="/partner"
              className="bg-amari-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-amari-900 transition shadow-lg"
            >
              Register as a Vendor
            </Link>
          </div>

          <div className="mt-10 space-y-6">
            {WEDDING_VENDOR_CATEGORIES.map((c) => (
              <div key={c.category} className="rounded-2xl border border-amari-100 bg-amari-50/60 p-6">
                <h2 className="text-xl font-bold text-amari-900">{c.category}</h2>
                <p className="text-stone-600 mt-2">{c.examples.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCategories;
