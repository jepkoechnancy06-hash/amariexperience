import React from 'react';

const VendorTerms: React.FC = () => {
  const effectiveDate = new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(new Date());

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <span className="text-amari-500 font-bold uppercase tracking-widest text-xs mb-3 block">Legal</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amari-900">Vendor Terms & Conditions</h2>
        <p className="mt-6 text-stone-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
          These terms apply to vendors listing on Amari.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-amari-100 p-8">
        <h3 className="text-2xl font-serif font-bold text-amari-900 mb-4">Terms</h3>
        <p className="text-stone-600 leading-relaxed whitespace-pre-line">
          {`Amari Vendor Terms and Conditions
Effective Date: ${effectiveDate}
These Terms and Conditions (“Terms”) govern your use of Amari’s platform as a vendor (“you” or “vendor”). By creating a profile on Amari, you agree to these Terms.
1. Eligibility
Only legitimate businesses or independent professionals providing wedding-related services may create a vendor profile.
Vendors must provide at least one verification document for admin approval.
2. Profile Approval & Verification
All profiles are subject to review and approval by Amari’s admin team.
Verification documents may include: business registration, trade license, professional license, VAT/tax registration, or proof of prior wedding service.
Approval is required before a profile goes live.
Admin decisions regarding profile approval are final.
3. Service Listing
Profiles on Amari are for advertising purposes only.
Amari does not facilitate bookings, payments, or contracts between vendors and couples.
Vendors are responsible for all communication, agreements, and transactions outside the platform.
4. Pricing and Information
Vendors must provide accurate and up-to-date information about their services, pricing, availability, and logistics.
Misleading or false information may result in profile suspension or removal.
5. Free Trial and Billing
Vendors receive a 3-month free trial on the platform.
After the trial period, a billing plan will commence as communicated to the vendor.
Amari reserves the right to change pricing with prior notice to vendors.
6. Content & Media
All images and content uploaded must be original and accurate. No stock images may be used to misrepresent services.
Vendors grant Amari a non-exclusive license to display content on the platform.
7. Prohibited Conduct
Vendors must not:
Offer services or bookings through the Amari platform directly.
Misrepresent themselves or their services.
Upload harmful, illegal, or offensive content.
8. Termination & Suspension
Amari may suspend or remove vendor profiles at its discretion for violations of these Terms.
Vendors may request removal of their profiles at any time by contacting support.
9. Limitation of Liability
Amari is not responsible for any disputes, losses, or damages arising from vendor-couple interactions outside the platform.
10. Governing Law
These Terms are governed by the laws of Kenya. Any disputes shall be resolved in accordance with local jurisdiction.
By creating a vendor profile on Amari, you confirm that you have read, understood, and agreed to these Terms.`}
        </p>
      </section>
    </div>
  );
};

export default VendorTerms;
