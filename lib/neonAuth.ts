// Auth Integration (serverless API backed)
const authEnv = (import.meta as any).env || {};
const API_BASE = authEnv.VITE_API_BASE || '';
const AUTH_BASE_URL = `${API_BASE}/api/auth`;

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'couple' | 'vendor' | 'admin';
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'couple' | 'vendor';
}

class NeonAuth {
  private async request<T>(path: string, options: RequestInit = {}) {
    let response: Response;
    try {
      response = await fetch(`${AUTH_BASE_URL}${path}`, {
        credentials: 'include',
        ...options
      });
    } catch (networkError: any) {
      console.error(`Network error calling ${path}:`, networkError);
      return { ok: false as const, error: networkError?.message || 'Network error – please check your connection' };
    }

    let payload: any;
    try {
      const contentType = response.headers.get('content-type') || '';
      payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const errMsg = typeof payload?.error === 'string'
        ? payload.error
        : typeof payload === 'string' && payload.length < 200
          ? payload
          : payload?.message || response.statusText || 'Request failed';
      return { ok: false as const, error: errMsg };
    }

    return { ok: true as const, data: payload as T };
  }

  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await this.request<{ user: User }>('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!result.ok) {
        return { success: false, error: result.error || 'Registration failed' };
      }

      const user = result.data?.user;
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await this.request<{ user: User }>('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!result.ok) {
        return { success: false, error: result.error || 'Login failed' };
      }

      const user = result.data?.user;
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.request('/logout', {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('currentUser');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Verify session
  async verifySession(): Promise<User | null> {
    try {
      const result = await this.request<{ user: User }>('/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!result.ok) {
        localStorage.removeItem('currentUser');
        return null;
      }

      const user = result.data?.user || null;
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Session verification error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await this.request<{ user: User }>('/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ updates })
      });

      if (!result.ok) {
        return { success: false, error: result.error || 'Failed to update profile' };
      }

      const user = result.data?.user;
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      return { success: true, user };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.request('/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!result.ok) {
        return { success: false, error: result.error || 'Failed to change password' };
      }

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  // Initialize auth state
  async initializeAuth(): Promise<User | null> {
    try {
      // Ensure database tables exist before any auth operation
      await fetch(`${API_BASE}/api/db/init`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      }).catch(() => {});

      const user = await this.verifySession();
      if (!user) {
        localStorage.removeItem('currentUser');
      }
      return user;
    } catch (error) {
      console.error('Auth initialization error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const neonAuth = new NeonAuth();

