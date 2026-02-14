import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = (req.body || {}) as any;

  if (!body.businessName) {
    res.status(400).json({ error: 'Business name is required' });
    return;
  }

  try {
    const sql = getSql();

    const id = body.id || crypto.randomUUID();
    const submittedAt = body.submittedAt || new Date().toISOString();

    const vendorSubcategories: string[] = Array.isArray(body.vendorSubcategories)
      ? body.vendorSubcategories.map((s: any) => String(s)).filter(Boolean)
      : [];

    const realWorkImages: string[] = Array.isArray(body.realWorkImages)
      ? body.realWorkImages
          .map((p: any) => (typeof p === 'string' ? p : null))
          .filter(Boolean)
      : [];

    const verificationDocumentUrl = typeof body.verificationDocumentUrl === 'string'
      ? body.verificationDocumentUrl
      : null;

    await sql`
      INSERT INTO vendor_applications (
        id, user_id,
        business_name,
        vendor_category,
        vendor_subcategories,
        business_description,
        vendor_story,
        other_services,
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
        ${id}, ${body.userId || null},
        ${body.businessName},
        ${body.vendorCategory || null},
        ${vendorSubcategories},
        ${body.businessDescription || null},
        ${body.vendorStory || null},
        ${body.otherServices || null},
        ${body.primaryLocation || null},
        ${body.areasServed || null},
        ${body.contactPhone || null},
        ${body.contactEmail || null},
        ${body.website || null},
        ${body.socialLinks || null},
        ${realWorkImages},
        ${body.startingPrice || null},
        ${body.pricingModel || null},
        ${body.startingPriceIncludes || null},
        ${body.minimumBookingRequirement || null},
        ${body.advanceBookingNotice || null},
        ${body.setupTimeRequired || null},
        ${body.breakdownTimeRequired || null},
        ${body.outdoorExperience || null},
        ${body.destinationWeddingExperience || null},
        ${body.specialRequirements || null},
        ${body.categorySpecific ? JSON.stringify(body.categorySpecific) : null}::jsonb,
        ${body.verificationDocumentType || null},
        ${verificationDocumentUrl},
        ${!!body.termsAccepted},
        ${body.termsAccepted ? new Date().toISOString() : null},
        ${submittedAt},
        ${'Pending'}
      );
    `;

    // Link uploaded files to this application
    const allFileUrls = [...realWorkImages];
    if (verificationDocumentUrl) allFileUrls.push(verificationDocumentUrl);
    for (const url of allFileUrls) {
      // Extract file ID from /api/files?id=<uuid>
      const match = url.match(/[?&]id=([a-f0-9-]+)/i);
      if (match) {
        try {
          await sql`UPDATE vendor_files SET application_id = ${id} WHERE id = ${match[1]};`;
        } catch (linkErr: any) {
          console.warn('Failed to link file to application:', linkErr?.message);
        }
      }
    }

    res.status(201).json({
      ok: true,
      application: {
        id,
        businessName: body.businessName,
        status: 'Pending',
        submittedAt
      }
    });
  } catch (e: any) {
    console.error('Vendor application submission failed:', e?.message);
    res.status(500).json({ error: 'Failed to submit vendor application' });
  }
 } catch (fatal: any) {
    console.error('Apply fatal:', fatal?.message);
    res.status(500).json({ error: 'Internal server error' });
 }
}
