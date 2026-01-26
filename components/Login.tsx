import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'couple'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [didSubmit, setDidSubmit] = useState(false);
  
  const { login, register, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!didSubmit) return;
    if (!isAuthenticated || !user) return;

    if (user.userType === 'vendor') {
      navigate('/partner');
      return;
    }

    if (user.userType === 'admin') {
      navigate('/admin');
      return;
    }

    navigate('/dashboard');
  }, [didSubmit, isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for registration
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        alert('First name is required');
        return;
      }
      if (!formData.lastName.trim()) {
        alert('Last name is required');
        return;
      }
      if (formData.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }
    }
    
    if (isLogin) {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } else {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        userType: formData.userType,
      });
    }

    setDidSubmit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-amari-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden transition-transform group-hover:rotate-3">
              <img 
                src="/amariexperienceslogo.jpeg" 
                alt="Amari Experience Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-amari-500 tracking-wide">AMARI</h1>
              <p className="text-[10px] text-amari-500 uppercase tracking-[0.2em] -mt-1 font-medium">Experience</p>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-amari-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-amari-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-stone-600">
              {isLogin 
                ? 'Sign in to access your wedding planning tools'
                : 'Join us to start planning your perfect wedding'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={!isLogin}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                      placeholder="Doe"
                    />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                  placeholder="+254 712 345 678"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Account Type
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                >
                  <option value="couple">Couple</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amari-500 focus:border-amari-500 transition-all"
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amari-600 text-white py-3 rounded-xl font-bold hover:bg-amari-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amari-600 font-bold hover:text-amari-500 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/vendors" 
              className="text-stone-500 text-sm hover:text-stone-700 transition-colors"
            >
              ← Back to Vendor Directory
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500">
            🔒 Your information is secure and encrypted. We never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
