import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Sparkles, ArrowRight, Instagram, Facebook, Twitter, Mail, Shield, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WhatsAppChat from './WhatsAppChat';
import GeminiPlanner from './GeminiPlanner';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutNew: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isHome = location.pathname === '/' || location.pathname === '/couples';

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const nlBase = 'relative px-1 py-2 text-[13px] font-medium tracking-wide transition-all duration-300';
  const nlActive = `${nlBase} text-amari-500`;
  const nlInactive = `${nlBase} text-stone-500 hover:text-amari-500`;
  const navClass = ({ isActive }: { isActive: boolean }) => isActive ? nlActive : nlInactive;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] bg-white text-amari-900 px-4 py-2 rounded-xl shadow-lg border border-amari-100"
      >
        Skip to content
      </a>
      {/* ─── TOP BAR ──────────────────────────────────────────────── */}
      <div className="hidden lg:block bg-amari-900 text-amari-200/80 text-[11px] tracking-wide">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <span className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-amari-gold" />
            Kenya's Premier Destination Wedding Platform
          </span>
          <div className="flex items-center gap-5">
            <Link to="/admin" className="hover:text-white transition">Admin</Link>
            <a href="mailto:hello@amariexperience.com" className="hover:text-white transition">hello@amariexperience.com</a>
            <a href="https://wa.me/254796535120" target="_blank" rel="noreferrer" className="hover:text-white transition">+254 796 535 120</a>
          </div>
        </div>
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass shadow-lg shadow-stone-900/5 border-b border-white/40'
            : 'bg-white/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-amari-100 group-hover:ring-amari-300 transition-all duration-300 group-hover:scale-105">
                <img src="/amariexperienceslogo.jpeg" alt="Amari Experience" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-serif font-bold text-amari-900 tracking-wider leading-none">AMARI</h1>
                <p className="text-[9px] text-amari-500 uppercase tracking-[0.25em] font-bold">Experience</p>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" aria-current={isHome ? 'page' : undefined} className={isHome ? nlActive : nlInactive}>Home</Link>
              <NavLink to="/vendors" className={navClass}>Vendors</NavLink>
              <NavLink to="/gallery" className={navClass}>Inspiration</NavLink>
              <NavLink to="/tools" className={navClass}>Planning</NavLink>
              <NavLink to="/concierge" className={navClass}>Concierge</NavLink>
              <NavLink to="/about" className={navClass}>About</NavLink>
              <NavLink to="/community" className={navClass}>Community</NavLink>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* User area */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amari-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amari-300 to-amari-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-[55]" onClick={() => setIsUserMenuOpen(false)} />
                        <div className="absolute top-full right-0 mt-3 w-64 glass rounded-2xl shadow-xl border border-white/60 py-2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="px-4 py-3 border-b border-stone-100">
                            <p className="font-bold text-stone-900 text-sm">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                          </div>
                          <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                            Dashboard
                          </Link>
                          <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                            Profile
                          </Link>
                          {user?.userType === 'admin' && (
                            <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                              <Shield size={15} /> Admin Portal
                            </Link>
                          )}
                          <div className="border-t border-stone-100 my-1" />
                          <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm">
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 text-stone-500 hover:text-amari-500 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      <User size={16} />
                      Account
                      <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-[55]" onClick={() => setIsUserMenuOpen(false)} />
                        <div className="absolute top-full right-0 mt-3 w-56 glass rounded-2xl shadow-xl border border-white/60 py-2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                          <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                            <LogIn size={15} /> Sign In
                          </Link>
                          <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                            <UserPlus size={15} /> Create Account
                          </Link>
                          <div className="border-t border-stone-100 my-1" />
                          <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-stone-500 hover:bg-amari-50 hover:text-amari-600 transition-colors text-sm">
                            <Shield size={15} /> Admin Portal
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <Link
                to="/partner"
                className="bg-amari-900 text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-amari-800 transition-all duration-300 hover:shadow-lg hover:shadow-amari-900/20 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Partner with Us
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-amari-50 text-amari-900 transition"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ─── MOBILE DRAWER ──────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-[55] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <div id="mobile-menu" className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[60] lg:hidden shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-stone-100">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl overflow-hidden">
                    <img src="/amariexperienceslogo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-bold text-amari-900 tracking-wide">AMARI</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
                  <X size={18} className="text-stone-600" />
                </button>
              </div>

              <div className="p-5 space-y-1">
                {/* Auth card */}
                {isAuthenticated ? (
                  <div className="bg-gradient-to-br from-amari-50 to-white rounded-2xl p-4 mb-5 border border-amari-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amari-300 to-amari-500 flex items-center justify-center text-white font-bold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{user?.firstName}</p>
                        <p className="text-xs text-stone-400">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center bg-amari-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-amari-800 transition">Dashboard</Link>
                      {user?.userType === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center bg-amari-50 text-amari-700 py-2 rounded-xl text-xs font-bold hover:bg-amari-100 transition border border-amari-200">Admin</Link>
                      )}
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition">Logout</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-amari-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-amari-800 transition">
                      <LogIn size={16} /> Sign In
                    </Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-amari-50 text-amari-700 py-3 rounded-2xl font-bold text-sm hover:bg-amari-100 transition border border-amari-200">
                      <UserPlus size={16} /> Create Account
                    </Link>
                  </div>
                )}

                {/* Nav links */}
                {[
                  ['/', 'Home'],
                  ['/vendors', 'Vendors'],
                  ['/gallery', 'Inspiration'],
                  ['/tools', 'Planning Tools'],
                  ['/concierge', 'Concierge'],
                  ['/about', 'About Us'],
                  ['/community', 'Community'],
                  ['/history', 'Diani History'],
                  ['/activities', 'Activities'],
                  ['/contact', 'Contact'],
                ].map(([path, label]) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                      location.pathname === path
                        ? 'bg-amari-50 text-amari-600 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-stone-100">
                  <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-amari-500 text-white py-3 rounded-2xl font-bold text-sm hover:bg-amari-600 transition shadow-lg">
                    <Sparkles size={15} /> Partner with Us
                  </Link>
                </div>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition mt-2">
                  <Shield size={15} /> Admin Portal
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────── */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>

      <WhatsAppChat />
      <GeminiPlanner />

      {/* ─── FOOTER ────────────────────────────────────────────────── */}
      <footer className="relative bg-amari-950 text-white overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amari-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Main footer */}
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-amari-300/40 transition">
                  <img src="/amariexperienceslogo.jpeg" alt="Amari" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold tracking-wider">AMARI</h3>
                  <p className="text-[9px] text-amari-300 uppercase tracking-[0.25em] font-bold">Experience</p>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-white/50 max-w-xs">
                Bringing the magic of Diani's coastline to your special day. Curated vendors, smart tools, local expertise.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amari-500 flex items-center justify-center transition-all duration-300 hover:scale-110"><Instagram size={16} className="text-white/60" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amari-500 flex items-center justify-center transition-all duration-300 hover:scale-110"><Facebook size={16} className="text-white/60" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amari-500 flex items-center justify-center transition-all duration-300 hover:scale-110"><Twitter size={16} className="text-white/60" /></a>
                <a href="mailto:hello@amariexperience.com" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amari-500 flex items-center justify-center transition-all duration-300 hover:scale-110"><Mail size={16} className="text-white/60" /></a>
              </div>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amari-300 mb-5">Explore</h4>
              <ul className="space-y-3">
                {[['/', 'Home'], ['/vendors', 'Vendors'], ['/gallery', 'Inspiration'], ['/tools', 'Planning'], ['/activities', 'Activities']].map(([p, l]) => (
                  <li key={p}><Link to={p} className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amari-300 mb-5">Support</h4>
              <ul className="space-y-3">
                {[['/concierge', 'Concierge'], ['/about', 'About Us'], ['/faq', 'FAQ'], ['/contact', 'Contact'], ['/community', 'Community']].map(([p, l]) => (
                  <li key={p}><Link to={p} className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* CTA column */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amari-300 mb-5">For Vendors</h4>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                Join East Africa's leading wedding marketplace. Reach couples planning their dream coastal celebration.
              </p>
              <Link
                to="/partner"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amari-500 to-amari-400 text-white px-6 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-amari-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles size={15} /> Become a Partner
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Amari Experience. Crafted with care in Diani Beach, Kenya.</p>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link to="/privacy" className="hover:text-white/70 transition">Privacy</Link>
              <Link to="/terms" className="hover:text-white/70 transition">Terms</Link>
              <Link to="/vendor-terms" className="hover:text-white/70 transition">Vendor Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutNew;
