import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sunset, Waves } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-amari-500 font-semibold border-b-2 border-amari-500' 
      : 'text-stone-600 hover:text-amari-500 hover:bg-amari-50/50 rounded-lg transition-colors';
  };

  return (
    <div className="min-h-screen flex flex-col bg-amari-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-amari-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="bg-amari-100 text-amari-600 p-2.5 rounded-xl transition-transform group-hover:rotate-3">
                  <Waves size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-amari-900 tracking-wide">AMARI</h1>
                    <p className="text-[10px] text-amari-500 uppercase tracking-[0.2em] -mt-1 font-medium group-hover:text-amari-600 transition-colors">Experience</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/couples" className={`py-2 ${isActive('/couples')}`}>For Couples</Link>
              <Link to="/vendors" className={`py-2 ${isActive('/vendors')}`}>Directory</Link>
              <Link to="/tools" className={`py-2 ${isActive('/tools')}`}>Tools</Link>
              <Link to="/concierge" className={`py-2 ${isActive('/concierge')}`}>Concierge</Link>
              <div className="h-8 w-px bg-amari-100 mx-2"></div>
              <Link to="/" className={`bg-amari-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-amari-900 transition shadow-lg shadow-amari-200 hover:shadow-xl flex items-center gap-2 ${location.pathname === '/' ? 'ring-2 ring-offset-2 ring-amari-600' : ''}`}>
                Partner with Us
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-amari-600 hover:text-amari-900 focus:outline-none p-2 rounded-lg hover:bg-amari-50 transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-amari-100 shadow-xl absolute w-full">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-amari-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-amari-900 mb-6 shadow-md">
                Partner with Us
              </Link>
              <Link to="/couples" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-stone-600 hover:bg-amari-50 hover:text-amari-600 rounded-xl font-medium transition">For Couples</Link>
              <Link to="/vendors" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-stone-600 hover:bg-amari-50 hover:text-amari-600 rounded-xl font-medium transition">Directory</Link>
              <Link to="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-stone-600 hover:bg-amari-50 hover:text-amari-600 rounded-xl font-medium transition">Planning Tools</Link>
              <Link to="/concierge" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-stone-600 hover:bg-amari-50 hover:text-amari-600 rounded-xl font-medium transition">Concierge</Link>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-xs text-amari-300 hover:text-amari-500 uppercase tracking-widest mt-4">Admin Access</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3038] text-amari-200 py-16 border-t-[6px] border-amari-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="bg-white/10 p-2 rounded-xl">
                  <Waves size={20} className="text-amari-300" />
               </div>
               <span className="text-white text-xl font-serif tracking-wide">AMARI</span>
            </div>
            <p className="text-sm leading-relaxed text-amari-100/70 font-light">
              We bring the magic of the Diani coastline to your special day. Simplifying destination weddings with local expertise and curated style.
            </p>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/couples" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">For Couples</Link></li>
              <li><Link to="/vendors" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Vendor Directory</Link></li>
              <li><Link to="/tools" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Planning Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/concierge" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Concierge Services</Link></li>
              <li><a href="#" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">Contact Us</a></li>
              <li><a href="#" className="hover:text-amari-300 transition hover:translate-x-1 inline-block">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6">For Business</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="inline-block bg-amari-300 text-amari-900 px-6 py-2.5 rounded-lg transition font-bold hover:bg-white hover:text-amari-600">Join as Vendor</Link></li>
              <li><Link to="/admin" className="hover:text-white text-amari-500/50 text-xs block">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs flex flex-col md:flex-row justify-between items-center text-amari-100/50">
          <p>© {new Date().getFullYear()} Amari Experience. Made with ❤️ in Diani.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition">Privacy Policy</a>
             <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;