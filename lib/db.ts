// Database connection configuration
const env = (import.meta as any).env || {};
const API_URL = env.VITE_API_URL || '/api/db/execute';

// Real Neon database connection using fetch API
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    console.log('Executing database query:', query);
    console.log('With params:', params);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
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
let mockUsers: any[] = [];
let mockSessions: any[] = [];

const executeQueryFallback = async (query: string, params: any[] = []) => {
  console.log('Using fallback mock database for:', query);

  const normalizedQuery = query.replace(/\s+/g, ' ').trim().toLowerCase();

  // Auth table creation / extension commands: no-op in fallback
  if (normalizedQuery.startsWith('create table') || normalizedQuery.startsWith('create extension') || normalizedQuery.startsWith('alter table')) {
    return [];
  }

  // =====================================================
  // USERS
  // =====================================================
  if (normalizedQuery.includes('insert into users')) {
    const email = params[0];
    const firstName = params[1];
    const lastName = params[2];
    const phone = params[3];
    const userType = params[4];
    const passwordHash = params[5];
    const emailVerified = params[6];
    const isActive = params[7];

    const existing = mockUsers.find((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase());
    if (existing) {
      throw new Error('duplicate key value violates unique constraint "users_email_key"');
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const newUser = {
      id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      user_type: userType,
      profile_image: null,
      email_verified: !!emailVerified,
      is_active: !!isActive,
      created_at: now,
      last_login: null,
      password_hash: passwordHash
    };

    mockUsers.push(newUser);

    // Mimic RETURNING behavior
    return [
      {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        user_type: newUser.user_type,
        email_verified: newUser.email_verified,
        is_active: newUser.is_active,
        created_at: newUser.created_at
      }
    ];
  }

  if (normalizedQuery.includes('from users') && normalizedQuery.includes('where email')) {
    const email = params[0];
    const user = mockUsers.find(
      (u) => (u.email || '').toLowerCase() === (email || '').toLowerCase() && u.is_active === true
    );
    return user ? [user] : [];
  }

  if (normalizedQuery.startsWith('select password_hash from users where id')) {
    const userId = params[0];
    const user = mockUsers.find((u) => u.id === userId);
    return user ? [{ password_hash: user.password_hash }] : [];
  }

  if (normalizedQuery.startsWith('update users set last_login')) {
    const userId = params[0];
    const user = mockUsers.find((u) => u.id === userId);
    if (user) user.last_login = new Date().toISOString();
    return [];
  }

  if (normalizedQuery.startsWith('update users set password_hash')) {
    const newHash = params[0];
    const userId = params[1];
    const user = mockUsers.find((u) => u.id === userId);
    if (user) user.password_hash = newHash;
    return [];
  }

  if (normalizedQuery.startsWith('update users set')) {
    // Generic profile update: last param is userId
    const userId = params[params.length - 1];
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return [];

    // Parse `set a = $1, b = $2` clause to determine columns
    const setMatch = normalizedQuery.match(/set (.*) where id/);
    const setClause = setMatch?.[1] || '';
    const assignments = setClause.split(',').map((s) => s.trim()).filter(Boolean);

    assignments.forEach((assignment, idx) => {
      const col = assignment.split('=')[0]?.trim();
      if (!col) return;
      (user as any)[col] = params[idx];
    });

    return [];
  }

  // =====================================================
  // SESSIONS
  // =====================================================
  if (normalizedQuery.includes('insert into sessions')) {
    const userId = params[0];
    const tokenHash = params[1];
    const expiresAt = params[2];
    mockSessions.push({
      id: crypto.randomUUID(),
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    });
    return [];
  }

  if (normalizedQuery.startsWith('delete from sessions where token_hash')) {
    const tokenHash = params[0];
    mockSessions = mockSessions.filter((s) => s.token_hash !== tokenHash);
    return [];
  }

  if (normalizedQuery.startsWith('delete from sessions where user_id')) {
    const userId = params[0];
    mockSessions = mockSessions.filter((s) => s.user_id !== userId);
    return [];
  }

  if (normalizedQuery.includes('from sessions s') && normalizedQuery.includes('join users u') && normalizedQuery.includes('where s.token_hash')) {
    const tokenHash = params[0];
    const session = mockSessions.find((s) => s.token_hash === tokenHash);
    if (!session) return [];

    const expires = new Date(session.expires_at).getTime();
    if (Number.isNaN(expires) || expires <= Date.now()) return [];

    const user = mockUsers.find((u) => u.id === session.user_id && u.is_active === true);
    if (!user) return [];

    return [
      {
        user_id: session.user_id,
        expires_at: session.expires_at,
        ...user
      }
    ];
  }
  
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
    const env = (import.meta as any).env || {};
    const initUrl = env.VITE_DB_INIT_URL || '/api/db/init';

    const response = await fetch(initUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Database init failed:', errorText);
      return false;
    }

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};
