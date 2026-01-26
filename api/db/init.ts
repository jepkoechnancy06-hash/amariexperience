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
