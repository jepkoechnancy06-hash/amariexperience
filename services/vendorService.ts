import { VendorApplication } from '../types';
import { executeQuery } from '../lib/db';

// Submit vendor application to database
export const submitApplication = async (
  app: Omit<VendorApplication, 'id' | 'submittedAt' | 'status'>,
  userId?: string
): Promise<VendorApplication> => {
  try {
    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    const termsAcceptedAt = app.termsAccepted ? new Date().toISOString() : null;

    const verificationDocumentUrl = app.verificationDocument
      ? (typeof app.verificationDocument === 'string' ? app.verificationDocument : app.verificationDocument.name)
      : null;

    const realWorkImages: string[] = Array.isArray(app.realWorkImages)
      ? (app.realWorkImages as any[])
          .map((p) => (typeof p === 'string' ? p : p?.name))
          .filter(Boolean)
      : [];

    const vendorSubcategories: string[] = Array.isArray(app.vendorSubcategories)
      ? (app.vendorSubcategories as any[]).map((s) => String(s)).filter(Boolean)
      : [];

    const newApp: VendorApplication = {
      ...app,
      id,
      submittedAt: new Date(submittedAt).getTime(),
      status: 'Pending'
    };

    // Insert into database
    await executeQuery(`
      INSERT INTO vendor_applications (
        id, user_id,
        business_name,
        vendor_category,
        vendor_subcategories,
        business_description,
        primary_location,
        areas_served,
        contact_phone,
        contact_email,
        website,
        social_links,
        real_work_images,
        starting_price,
        pricing_model,
        starting_price_includes,
        minimum_booking_requirement,
        advance_booking_notice,
        setup_time_required,
        breakdown_time_required,
        outdoor_experience,
        destination_wedding_experience,
        special_requirements,
        category_specific,
        verification_document_type,
        verification_document_url,
        terms_accepted,
        terms_accepted_at,
        submitted_at,
        status
      ) VALUES (
        $1, $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24,
        $25,
        $26,
        $27,
        $28,
        $29,
        $30,
        $31
      )
    `, [
      id,
      userId || null,
      app.businessName,
      app.vendorCategory || null,
      vendorSubcategories,
      app.businessDescription || null,
      app.primaryLocation || null,
      app.areasServed || null,
      app.contactPhone || null,
      app.contactEmail || null,
      app.website || null,
      app.socialLinks || null,
      realWorkImages,
      app.startingPrice || null,
      app.pricingModel || null,
      app.startingPriceIncludes || null,
      app.minimumBookingRequirement || null,
      app.advanceBookingNotice || null,
      app.setupTimeRequired || null,
      app.breakdownTimeRequired || null,
      app.outdoorExperience || null,
      app.destinationWeddingExperience || null,
      app.specialRequirements || null,
      app.categorySpecific || null,
      app.verificationDocumentType || null,
      verificationDocumentUrl,
      !!app.termsAccepted,
      termsAcceptedAt,
      submittedAt,
      'Pending'
    ]);

    console.log('Application submitted successfully:', newApp);
    return newApp;
  } catch (error) {
    console.error('Failed to submit application:', error);
    throw new Error('Failed to submit vendor application');
  }
};

export const updateApplicationVerification = async (
  id: string,
  updates: {
    verificationDocumentUploaded?: boolean;
    verifiedBy?: string;
    dateVerified?: number | null;
    approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
    adminNotes?: string;
  }
): Promise<void> => {
  try {
    await executeQuery(`
      UPDATE vendor_applications
      SET
        verification_document_uploaded = $1,
        verified_by = $2,
        date_verified = $3,
        approval_status = $4,
        admin_notes = $5
      WHERE id = $6
    `, [
      typeof updates.verificationDocumentUploaded === 'boolean' ? updates.verificationDocumentUploaded : null,
      updates.verifiedBy || null,
      typeof updates.dateVerified === 'number' ? new Date(updates.dateVerified).toISOString() : null,
      updates.approvalStatus || null,
      updates.adminNotes || null,
      id
    ]);
  } catch (error) {
    console.error('Failed to update verification metadata:', error);
    throw new Error('Failed to update verification metadata');
  }
};

// Get all vendor applications
export const getApplications = async (): Promise<VendorApplication[]> => {
  try {
    const result = await executeQuery(`
      SELECT * FROM vendor_applications 
      ORDER BY submitted_at DESC
    `);
    
    return (result || []).map((row: any) => ({
      id: row.id,
      businessName: row.business_name,
      vendorCategory: row.vendor_category || '',
      vendorSubcategories: Array.isArray(row.vendor_subcategories)
        ? row.vendor_subcategories
        : (typeof row.vendor_subcategories === 'string' ? (JSON.parse(row.vendor_subcategories) || []) : []),
      businessDescription: row.business_description || '',
      primaryLocation: row.primary_location || '',
      areasServed: row.areas_served || '',
      contactPhone: row.contact_phone || row.phone || '',
      contactEmail: row.contact_email || row.email || '',
      website: row.website || '',
      socialLinks: row.social_links || '',
      realWorkImages: Array.isArray(row.real_work_images)
        ? row.real_work_images
        : (typeof row.real_work_images === 'string' ? (JSON.parse(row.real_work_images) || []) : []),

      startingPrice: row.starting_price || '',
      pricingModel: row.pricing_model || '',
      startingPriceIncludes: row.starting_price_includes || '',
      minimumBookingRequirement: row.minimum_booking_requirement || '',

      advanceBookingNotice: row.advance_booking_notice || '',
      setupTimeRequired: row.setup_time_required || '',
      breakdownTimeRequired: row.breakdown_time_required || '',
      outdoorExperience: row.outdoor_experience || '',
      destinationWeddingExperience: row.destination_wedding_experience || '',
      specialRequirements: row.special_requirements || '',

      categorySpecific: row.category_specific || {},

      verificationDocumentType: row.verification_document_type || '',
      verificationDocument: row.verification_document_url || null,
      termsAccepted: !!row.terms_accepted,
      termsAcceptedAt: row.terms_accepted_at ? new Date(row.terms_accepted_at).getTime() : null,

      verificationDocumentUploaded: typeof row.verification_document_uploaded === 'boolean'
        ? row.verification_document_uploaded
        : !!row.verification_document_url,
      verifiedBy: row.verified_by || '',
      dateVerified: row.date_verified ? new Date(row.date_verified).getTime() : null,
      approvalStatus: row.approval_status || row.status || 'Pending',
      adminNotes: row.admin_notes || '',
      submittedAt: new Date(row.submitted_at).getTime(),
      status: row.status
    }));
  } catch (error) {
    console.error('Failed to get applications:', error);
    throw new Error('Failed to retrieve vendor applications');
  }
};

export const getLatestApplicationByUserId = async (userId: string): Promise<VendorApplication | null> => {
  try {
    const result = await executeQuery(`
      SELECT * FROM vendor_applications
      WHERE user_id = $1
      ORDER BY submitted_at DESC
      LIMIT 1
    `, [userId]);

    const row = Array.isArray(result) && result.length > 0 ? result[0] : null;
    if (!row) return null;

    return {
      id: row.id,
      businessName: row.business_name,
      vendorCategory: row.vendor_category || '',
      vendorSubcategories: Array.isArray(row.vendor_subcategories)
        ? row.vendor_subcategories
        : (typeof row.vendor_subcategories === 'string' ? (JSON.parse(row.vendor_subcategories) || []) : []),
      businessDescription: row.business_description || '',
      primaryLocation: row.primary_location || '',
      areasServed: row.areas_served || '',
      contactPhone: row.contact_phone || row.phone || '',
      contactEmail: row.contact_email || row.email || '',
      website: row.website || '',
      socialLinks: row.social_links || '',
      realWorkImages: Array.isArray(row.real_work_images)
        ? row.real_work_images
        : (typeof row.real_work_images === 'string' ? (JSON.parse(row.real_work_images) || []) : []),

      startingPrice: row.starting_price || '',
      pricingModel: row.pricing_model || '',
      startingPriceIncludes: row.starting_price_includes || '',
      minimumBookingRequirement: row.minimum_booking_requirement || '',

      advanceBookingNotice: row.advance_booking_notice || '',
      setupTimeRequired: row.setup_time_required || '',
      breakdownTimeRequired: row.breakdown_time_required || '',
      outdoorExperience: row.outdoor_experience || '',
      destinationWeddingExperience: row.destination_wedding_experience || '',
      specialRequirements: row.special_requirements || '',

      categorySpecific: row.category_specific || {},

      verificationDocumentType: row.verification_document_type || '',
      verificationDocument: row.verification_document_url || null,
      termsAccepted: !!row.terms_accepted,
      termsAcceptedAt: row.terms_accepted_at ? new Date(row.terms_accepted_at).getTime() : null,

      verificationDocumentUploaded: typeof row.verification_document_uploaded === 'boolean'
        ? row.verification_document_uploaded
        : !!row.verification_document_url,
      verifiedBy: row.verified_by || '',
      dateVerified: row.date_verified ? new Date(row.date_verified).getTime() : null,
      approvalStatus: row.approval_status || row.status || 'Pending',
      adminNotes: row.admin_notes || '',
      submittedAt: new Date(row.submitted_at).getTime(),
      status: row.status
    };
  } catch (error) {
    console.error('Failed to get latest application:', error);
    return null;
  }
};

// Update application status
export const updateApplicationStatus = async (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
  try {
    await executeQuery(`
      UPDATE vendor_applications 
      SET status = $1, approved_at = $2
      WHERE id = $3
    `, [status, status === 'Approved' ? new Date().toISOString() : null, id]);

    if (status === 'Approved') {
      const apps = await executeQuery('SELECT * FROM vendor_applications WHERE id = $1', [id]);
      const app = Array.isArray(apps) && apps.length > 0 ? apps[0] : null;
      if (app) {
        const hasVerificationDoc = !!app.verification_document_url;
        if (!hasVerificationDoc) {
          throw new Error('Vendor cannot be approved without at least one verification document.');
        }

        await executeQuery(`
          INSERT INTO vendors (
            id, user_id, name, category, rating, price_range, description, image_url,
            location, contact_email, contact_phone, approved_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12
          )
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            location = EXCLUDED.location,
            contact_email = EXCLUDED.contact_email,
            contact_phone = EXCLUDED.contact_phone,
            approved_at = EXCLUDED.approved_at
        `, [
          app.id,
          app.user_id || null,
          app.business_name,
          app.vendor_category || app.vendor_type,
          0.0,
          null,
          app.business_description || null,
          null,
          app.primary_location || app.location,
          app.contact_email || app.email,
          app.contact_phone || app.phone,
          new Date().toISOString()
        ]);
      }
    }
    
    console.log(`Application ${id} status updated to:`, status);
  } catch (error) {
    console.error('Failed to update application status:', error);
    throw new Error('Failed to update application status');
  }
};

// Get approved vendors for directory
export const getApprovedVendors = async () => {
  try {
    const result = await executeQuery(`
      SELECT * FROM vendors 
      WHERE approved_at IS NOT NULL
      ORDER BY approved_at DESC
    `);
    
    return (result || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      rating: parseFloat(row.rating),
      priceRange: row.price_range || '$$$',
      description: row.description || '',
      imageUrl: row.image_url || '/beach.jpeg',
      location: row.location
    }));
  } catch (error) {
    console.error('Failed to get approved vendors:', error);
    return [];
  }
};

export const getApprovedVendorById = async (id: string) => {
  try {
    const result = await executeQuery(`
      SELECT * FROM vendors
      WHERE id = $1 AND approved_at IS NOT NULL
      LIMIT 1
    `, [id]);

    const row = Array.isArray(result) && result.length > 0 ? result[0] : null;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      rating: parseFloat(row.rating),
      priceRange: row.price_range || '$$$',
      description: row.description || '',
      imageUrl: row.image_url || '/beach.jpeg',
      location: row.location
    };
  } catch (error) {
    console.error('Failed to get approved vendor:', error);
    return null;
  }
};
