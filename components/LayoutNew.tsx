import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sunset, Waves, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WhatsAppChat from './WhatsAppChat';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutNew: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isCouplesRoute = location.pathname === '/' || location.pathname === '/couples';

  const navLinkBase =
    'px-3 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amari-300 focus-visible:ring-offset-2';

  const navLinkClass = useMemo(
    () =>
      ({ isActive }: { isActive: boolean }) =>
        `${navLinkBase} ${
          isActive
            ? 'text-amari-600 bg-amari-50'
            : 'text-stone-600 hover:text-amari-600 hover:bg-amari-50/60'
        }`,
    [navLinkBase]
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-amari-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] bg-white text-amari-900 px-4 py-2 rounded-xl shadow-lg border border-amari-100"
      >
        Skip to content
      </a>
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 border-b border-amari-100/50 backdrop-blur-md transition-shadow ${
          isScrolled ? 'bg-white/90 shadow-sm' : 'bg-white/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl overflow-hidden transition-transform group-hover:rotate-3">
                  <img 
                    src="/amariexperienceslogo.jpeg" 
                    alt="Amari Experience Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-amari-500 tracking-wide">AMARI</h1>
                  <p className="text-[10px] text-amari-500 uppercase tracking-[0.2em] -mt-1 font-medium group-hover:text-amari-600 transition-colors">Experience</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-between space-x-10">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  aria-current={isCouplesRoute ? 'page' : undefined}
                  className={`${navLinkBase} ${
                    isCouplesRoute
                      ? 'text-amari-600 bg-amari-50'
                      : 'text-stone-600 hover:text-amari-600 hover:bg-amari-50/60'
                  }`}
                >
                  For Couples
                </Link>
                <NavLink to="/vendors" className={navLinkClass}>Directory</NavLink>
                <NavLink to="/gallery" className={navLinkClass}>Inspiration</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/community" className={navLinkClass}>Community</NavLink>
                <NavLink to="/history" className={navLinkClass}>Diani History</NavLink>
                <div className="relative">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center gap-2 text-stone-400 hover:text-stone-600 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    <User size={18} />
                    {isAuthenticated ? (
                      <>
                        <span className="text-stone-700">Welcome, {user.firstName}!</span>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <div className="font-medium text-stone-900">Dashboard</div>
                            <div className="text-sm text-stone-600">Manage your wedding planning tools</div>
                          </Link>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <div className="font-medium text-stone-900">Profile</div>
                            <div className="text-sm text-stone-600">View and manage your profile</div>
                          </Link>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link to="/login" className="block">
                        Login
                      </Link>
                    )}
                  </button>
                </div>
              </div>
              <Link to="/admin" className="text-stone-400 hover:text-stone-600 text-xs font-medium transition-colors">
                Admin
              </Link>
              <Link to="/partner" className={`bg-amari-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-amari-900 transition shadow-lg hover:shadow-xl flex items-center gap-2 ${location.pathname === '/partner' ? 'ring-2 ring-offset-2 ring-amari-600' : ''}`}>
                Partner with Us
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className="text-amari-600 hover:text-amari-500 focus:outline-none p-2 rounded-lg hover:bg-amari-50 transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-amari-100 shadow-xl absolute w-full">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Authentication Section */}
              <div className="mb-6">
                {isAuthenticated ? (
                  <div className="bg-amari-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amari-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-amari-900">Welcome, {user.firstName}!</div>
                        <div className="text-sm text-stone-600">{user.email}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/dashboard"
                        className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-amari-100 rounded-lg transition-colors"
                      >
                        <div className="font-medium">Dashboard</div>
                        <div className="text-sm text-stone-600">Manage your wedding planning tools</div>
                      </Link>
                      <Link
                        to="/profile"
                        className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-amari-100 rounded-lg transition-colors"
                      >
                        <div className="font-medium">Profile</div>
                        <div className="text-sm text-stone-600">View and manage your profile</div>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <div className="font-medium">Logout</div>
                        <div className="text-sm text-red-500">Sign out of your account</div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User size={32} className="text-stone-400" />
                      </div>
                      <div className="font-medium text-stone-900">Sign In Required</div>
                      <div className="text-sm text-stone-600">Access your dashboard and profile</div>
                    </div>
                    <Link
                      to="/login"
                      className="block w-full bg-amari-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-amari-700 transition-colors text-center"
                    >
                      Sign In / Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="border-t border-amari-100 pt-4">
                <Link to="/partner" className="block w-full text-center bg-amari-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-amari-900 mb-4 shadow-md">
                  Partner with Us
                </Link>
                <Link
                  to="/"
                  aria-current={isCouplesRoute ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl font-medium transition ${
                    isCouplesRoute
                      ? 'bg-amari-50 text-amari-600'
                      : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'
                  }`}
                >
                  For Couples
                </Link>
                <NavLink to="/vendors" className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-amari-50 text-amari-600' : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'}`}>Directory</NavLink>
                <NavLink to="/gallery" className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-amari-50 text-amari-600' : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'}`}>Inspiration Board</NavLink>
                <div className="pt-2 mt-2 border-t border-amari-100/70"></div>
                <NavLink to="/about" className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-amari-50 text-amari-600' : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'}`}>About Us</NavLink>
                <NavLink to="/community" className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-amari-50 text-amari-600' : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'}`}>Community</NavLink>
                <NavLink to="/history" className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-amari-50 text-amari-600' : 'text-stone-600 hover:bg-amari-50 hover:text-amari-600'}`}>Diani History</NavLink>
                <Link to="/admin" className="block px-4 py-3 rounded-xl font-medium text-stone-400 hover:text-stone-600 transition-colors">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>

      <WhatsAppChat />

      {/* Footer */}
      <footer
        className="bg-amari-900 text-amari-200 py-16 border-t-[6px] border-amari-300"
        onClickCapture={(e) => {
          const el = e.target as HTMLElement;
          if (el.closest('a')) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img 
                    src="/amariexperienceslogo.jpeg" 
                    alt="Amari Experience Logo" 
                    className="w-full h-full object-cover"
                  />
               </div>
               <span className="text-white text-xl font-serif tracking-wide">AMARI</span>
            </div>
            <p className="text-sm leading-relaxed text-amari-100/70 font-light">
              We bring the magic of Diani coastline to your special day. Simplifying destination weddings with local expertise and curated style.
            </p>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/couples" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">For Couples</Link></li>
              <li><Link to="/vendors" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Vendor Directory</Link></li>
              <li><Link to="/tools" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Planning Tools</Link></li>
              <li><Link to="/gallery" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Inspiration Board</Link></li>
              <li><Link to="/community" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Community Hub</Link></li>
              <li><Link to="/activities" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Activities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/concierge" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Concierge Services</Link></li>
              <li><Link to="/about" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link to="/community" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Community</Link></li>
              <li><Link to="/contact" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">For Business</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/partner" className="inline-block bg-amari-300 text-amari-900 px-6 py-2.5 rounded-lg transition font-bold hover:bg-white hover:text-amari-600">Join as Vendor</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs flex flex-col md:flex-row justify-between items-center text-amari-100/50">
          <p>© {new Date().getFullYear()} Amari Experience. Made with ❤️ in Diani.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutNew;
