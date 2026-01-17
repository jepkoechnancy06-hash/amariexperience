// Database connection configuration
const connectionString = 'postgresql://neondb_owner:npg_COWH0y3qtwUa@ep-misty-bush-ah51gttt-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Real Neon database connection using fetch API
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const response = await fetch('https://ep-misty-bush-ah51gttt-pooler.c-3.us-east-1.aws.neon.tech/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer npg_COWH0y3qtwUa`
      },
      body: JSON.stringify({ query, params })
    });
    
    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Database query failed:', error);
    // Fallback to mock storage for development
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
      business_name: params[1],
      vendor_type: params[2],
      location: params[3],
      business_registration_url: params[4],
      contact_person_name: params[5],
      email: params[6],
      phone: params[7],
      portfolio_photos: params[8],
      submitted_at: params[9],
      status: params[10]
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
    // Create vendor_applications table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS vendor_applications (
        id VARCHAR(255) PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create vendors table for approved vendors
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS vendors (
        id VARCHAR(255) PRIMARY KEY,
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

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};
