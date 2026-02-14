import { VendorApplication } from '../types';
import { executeQuery } from '../lib/db';

const env = (import.meta as any).env || {};
const API_BASE = env.VITE_API_BASE || '';

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });

// Compress an image file client-side using canvas (max 1200px, JPEG 80%)
const compressImage = (file: File, maxDim = 1200, quality = 0.8): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

// Upload a single file to /api/vendors/upload and return the serving URL
const uploadFile = async (
  file: File | string,
  fileCategory: 'verification_document' | 'real_work_image'
): Promise<string> => {
  // If already a URL (e.g. from a previous upload), pass through
  if (typeof file === 'string') {
    if (file.startsWith('/api/files') || file.startsWith('http')) return file;
    // Already a data URL — upload it
    const resp = await fetch(`${API_BASE}/api/vendors/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fileCategory, fileData: file })
    });
    if (!resp.ok) throw new Error('File upload failed');
    const data = await resp.json();
    return data.file?.url || file;
  }

  // Convert File object to data URL (compress images first)
  let dataUrl: string;
  if (file.type.startsWith('image/') && fileCategory === 'real_work_image') {
    dataUrl = await compressImage(file);
  } else {
    dataUrl = await readFileAsDataURL(file);
  }

  const resp = await fetch(`${API_BASE}/api/vendors/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      fileCategory,
      fileName: file.name,
      mimeType: file.type,
      fileData: dataUrl
    })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'File upload failed');
  }

  const data = await resp.json();
  return data.file?.url || dataUrl;
};

// Submit vendor application to database via public API endpoint
export const submitApplication = async (
  app: Omit<VendorApplication, 'id' | 'submittedAt' | 'status'>,
  userId?: string
): Promise<VendorApplication> => {
  try {
    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();

    // Upload verification document
    let verificationDocumentUrl: string | null = null;
    if (app.verificationDocument) {
      verificationDocumentUrl = await uploadFile(app.verificationDocument, 'verification_document');
    }

    // Upload real work images individually (compressed)
    const realWorkImages: string[] = [];
    if (Array.isArray(app.realWorkImages)) {
      for (const img of app.realWorkImages) {
        if (!img) continue;
        try {
          const url = await uploadFile(img, 'real_work_image');
          realWorkImages.push(url);
        } catch (e) {
          console.warn('Failed to upload real work image, skipping:', e);
        }
      }
    }

    const vendorSubcategories: string[] = Array.isArray(app.vendorSubcategories)
      ? (app.vendorSubcategories as any[]).map((s) => String(s)).filter(Boolean)
      : [];

    const newApp: VendorApplication = {
      ...app,
      id,
      submittedAt: new Date(submittedAt).getTime(),
      status: 'Pending'
    };

    // POST to the dedicated public vendor application endpoint
    // Now sends lightweight URL references instead of raw base64 blobs
    const response = await fetch(`${API_BASE}/api/vendors/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        id,
        userId: userId || null,
        businessName: app.businessName,
        vendorCategory: app.vendorCategory || null,
        vendorSubcategories,
        businessDescription: app.businessDescription || null,
        vendorStory: app.vendorStory || null,
        otherServices: app.otherServices || null,
        primaryLocation: app.primaryLocation || null,
        areasServed: app.areasServed || null,
        contactPhone: app.contactPhone || null,
        contactEmail: app.contactEmail || null,
        website: app.website || null,
        socialLinks: app.socialLinks || null,
        realWorkImages,
        startingPrice: app.startingPrice || null,
        pricingModel: app.pricingModel || null,
        startingPriceIncludes: app.startingPriceIncludes || null,
        minimumBookingRequirement: app.minimumBookingRequirement || null,
        advanceBookingNotice: app.advanceBookingNotice || null,
        setupTimeRequired: app.setupTimeRequired || null,
        breakdownTimeRequired: app.breakdownTimeRequired || null,
        outdoorExperience: app.outdoorExperience || null,
        destinationWeddingExperience: app.destinationWeddingExperience || null,
        specialRequirements: app.specialRequirements || null,
        categorySpecific: app.categorySpecific || null,
        verificationDocumentType: app.verificationDocumentType || null,
        verificationDocumentUrl,
        termsAccepted: !!app.termsAccepted,
        submittedAt
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(errorData.error || 'Failed to submit vendor application');
    }

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
      vendorStory: row.vendor_story || '',
      otherServices: row.other_services || '',
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
      vendorStory: row.vendor_story || '',
      otherServices: row.other_services || '',
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

        // Extract the first real work image as the vendor's public image
        let imageUrl: string | null = null;
        try {
          const imgs = typeof app.real_work_images === 'string'
            ? JSON.parse(app.real_work_images)
            : app.real_work_images;
          if (Array.isArray(imgs) && imgs.length > 0) {
            imageUrl = typeof imgs[0] === 'string' ? imgs[0] : null;
          }
        } catch {}

        const priceRange = app.starting_price ? `From ${app.starting_price}` : null;

        // Parse social links JSON
        let socialLinks: string | null = null;
        try {
          if (app.social_links) {
            socialLinks = typeof app.social_links === 'string' ? app.social_links : JSON.stringify(app.social_links);
          }
        } catch {}

        await executeQuery(`
          INSERT INTO vendors (
            id, user_id, name, category, rating, price_range, description, image_url,
            location, contact_email, contact_phone, website, social_links, vendor_story, other_services, approved_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15, $16
          )
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            image_url = EXCLUDED.image_url,
            price_range = EXCLUDED.price_range,
            location = EXCLUDED.location,
            contact_email = EXCLUDED.contact_email,
            contact_phone = EXCLUDED.contact_phone,
            website = EXCLUDED.website,
            social_links = EXCLUDED.social_links,
            vendor_story = EXCLUDED.vendor_story,
            other_services = EXCLUDED.other_services,
            approved_at = EXCLUDED.approved_at
        `, [
          app.id,
          app.user_id || null,
          app.business_name,
          app.vendor_category || app.vendor_type,
          0.0,
          priceRange,
          app.business_description || null,
          imageUrl,
          app.primary_location || app.location,
          app.contact_email || app.email,
          app.contact_phone || app.phone,
          app.website || null,
          socialLinks,
          app.vendor_story || null,
          app.other_services || null,
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

// Get approved vendors for directory via public API endpoint
export const getApprovedVendors = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/vendors/approved`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      console.error('Failed to fetch approved vendors:', response.status);
      return [];
    }

    const data = await response.json();
    return data.vendors || [];
  } catch (error) {
    console.error('Failed to get approved vendors:', error);
    return [];
  }
};

// Remove an approved vendor from the directory
export const removeVendor = async (id: string): Promise<void> => {
  try {
    await executeQuery(`DELETE FROM vendors WHERE id = $1`, [id]);
    await executeQuery(`UPDATE vendor_applications SET status = 'Rejected' WHERE id = $1`, [id]);
    console.log(`Vendor ${id} removed from directory`);
  } catch (error) {
    console.error('Failed to remove vendor:', error);
    throw new Error('Failed to remove vendor');
  }
};

export const getApprovedVendorById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/vendors/approved?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.vendor || null;
  } catch (error) {
    console.error('Failed to get approved vendor:', error);
    return null;
  }
};
