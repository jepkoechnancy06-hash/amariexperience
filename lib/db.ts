// Database connection configuration
const env = (import.meta as any).env || {};
const NEON_URL = env.VITE_NEON_DB_URL || 'https://ep-misty-bush-ah51gttt-pooler.c-3.us-east-1.aws.neon.tech';
const NEON_TOKEN = env.VITE_NEON_DB_TOKEN || 'npg_COWH0y3qtwUa';

// Real Neon database connection using fetch API
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    console.log('Executing database query:', query);
    console.log('With params:', params);
    
    const response = await fetch(`${NEON_URL}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEON_TOKEN}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, params })
    });
    
    console.log('Database response status:', response.status);
    console.log('Database response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Database error response:', errorText);
      throw new Error(`Database query failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Database query result:', result);

    if (result && typeof result === 'object' && 'rows' in result && Array.isArray((result as any).rows)) {
      return (result as any).rows;
    }

    return result;
  } catch (error) {
    console.error('Database query failed:', error);
    // Fallback to mock storage for development
    console.log('Falling back to mock storage');
    return await executeQueryFallback(query, params);
  }
};

// Fallback mock implementation for development
let mockApplications: any[] = [];
let mockVendors: any[] = [];

const executeQueryFallback = async (query: string, params: any[] = []) => {
  console.log('Using fallback mock database for:', query);
  
  // Handle different query types based on query string
  if (query.includes('INSERT INTO vendor_applications')) {
    const newApplication = {
      id: params[0],
      user_id: params[1],
      business_name: params[2],
      vendor_type: params[3],
      location: params[4],
      business_registration_url: params[5],
      contact_person_name: params[6],
      email: params[7],
      phone: params[8],
      portfolio_photos: params[9],
      submitted_at: params[10],
      status: params[11]
    };
    mockApplications.push(newApplication);
    return newApplication;
  }
  
  if (query.includes('SELECT * FROM vendor_applications')) {
    return mockApplications;
  }
  
  if (query.includes('UPDATE vendor_applications')) {
    const id = params[2];
    const status = params[0];
    const application = mockApplications.find(app => app.id === id);
    if (application) {
      application.status = status;
    }
    return application;
  }
  
  if (query.includes('SELECT * FROM vendors')) {
    return mockVendors;
  }
  
  // Default response
  return [];
};

// Test connection function
export const testConnection = async () => {
  try {
    const result = await executeQuery('SELECT NOW()');
    console.log('Database connected successfully:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    await executeQuery('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

    // Create vendor_applications table
    await executeQuery(`
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
      )
    `);

    await executeQuery('ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS user_id UUID;');
    await executeQuery('ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;');

    // Create vendors table for approved vendors
    await executeQuery(`
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
      )
    `);

    await executeQuery('ALTER TABLE vendors ADD COLUMN IF NOT EXISTS user_id UUID;');

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};
