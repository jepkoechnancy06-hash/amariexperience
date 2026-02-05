import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sql = getSql();

    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

    await sql`
      CREATE TABLE IF NOT EXISTS vendor_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        business_name VARCHAR(255) NOT NULL,
        vendor_type VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        business_registration_url TEXT,
        contact_person_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        portfolio_photos TEXT[],
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending',
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS user_id UUID;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vendor_category VARCHAR(255);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vendor_subcategories TEXT[];`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS business_description TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS primary_location VARCHAR(255);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS areas_served TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS website VARCHAR(500);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS social_links TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS real_work_images TEXT[];`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS starting_price TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS pricing_model VARCHAR(50);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS starting_price_includes TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS minimum_booking_requirement TEXT;`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS advance_booking_notice TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS setup_time_required TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS breakdown_time_required TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS outdoor_experience VARCHAR(10);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS destination_wedding_experience VARCHAR(10);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS special_requirements TEXT;`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS category_specific JSONB;`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS verification_document_type VARCHAR(255);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS verification_document_url TEXT;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;`;

    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS verification_document_uploaded BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255);`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS date_verified TIMESTAMP;`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'Pending';`;
    await sql`ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;`;

    await sql`
      CREATE TABLE IF NOT EXISTS vendors (
        id UUID PRIMARY KEY,
        user_id UUID,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0.0,
        price_range VARCHAR(10),
        description TEXT,
        image_url VARCHAR(500),
        location VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS user_id UUID;`;

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Init failed' });
  }
}
