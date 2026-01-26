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
    
    // Handle file uploads (convert to URLs or base64 for storage)
    let businessRegistrationUrl = null;
    if (app.businessRegistration) {
      // In a real app, you'd upload to a storage service
      // For now, we'll store the file name
      businessRegistrationUrl = typeof app.businessRegistration === 'string'
        ? app.businessRegistration
        : app.businessRegistration.name;
    }

    const portfolioPhotos: string[] = Array.isArray(app.portfolioPhotos)
      ? (app.portfolioPhotos as any[])
          .map((p) => (typeof p === 'string' ? p : p?.name))
          .filter(Boolean)
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
        id, user_id, business_name, vendor_type, location, business_registration_url,
        contact_person_name, email, phone, portfolio_photos,
        submitted_at, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `, [
      id,
      userId || null,
      app.businessName,
      app.vendorType,
      app.location,
      businessRegistrationUrl,
      app.contactPersonName,
      app.email,
      app.phone,
      portfolioPhotos,
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
      vendorType: row.vendor_type,
      location: row.location,
      businessRegistration: null, // Would be file object in real implementation
      contactPersonName: row.contact_person_name,
      email: row.email,
      phone: row.phone,
      portfolioPhotos: Array.isArray(row.portfolio_photos) ? row.portfolio_photos : [],
      submittedAt: new Date(row.submitted_at).getTime(),
      status: row.status
    }));
  } catch (error) {
    console.error('Failed to get applications:', error);
    throw new Error('Failed to retrieve vendor applications');
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
          app.vendor_type,
          0.0,
          null,
          null,
          null,
          app.location,
          app.email,
          app.phone,
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
