import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { Sidebar } from './Sidebar.jsx';
import { CartToast } from './CartToast.jsx';
import { sanitizeSearchQuery } from '../lib/cart-security.js';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (location.pathname === '/busca') {
      const q = new URLSearchParams(location.search).get('q') || '';
      setSearchValue(q);
    }
  }, [location.pathname, location.search]);

  const handleSearch = (value) => {
    const safe = sanitizeSearchQuery(value);
    setSearchValue(safe);
    const trimmed = safe.trim();
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
    } else if (location.pathname === '/busca') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-56">
        <Header
          searchValue={searchValue}
          onSearch={handleSearch}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 pt-[calc(6.25rem+env(safe-area-inset-top,0px))]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartToast />
    </div>
  );
}
