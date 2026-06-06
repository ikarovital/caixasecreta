import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { Sidebar } from './Sidebar.jsx';
import { CartToast } from './CartToast.jsx';
import { sanitizeSearchQuery } from '../lib/cart-security.js';

const SEARCH_DEBOUNCE_MS = 400;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchDraft, setSearchDraft] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchDebounceRef = useRef(null);

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
    if (location.pathname !== '/busca') {
      setSearchDraft('');
    }
  }, [location.pathname]);

  const runSearch = useCallback(
    (rawValue, { clearField = false } = {}) => {
      const safe = sanitizeSearchQuery(rawValue);
      const trimmed = safe.trim();
      if (trimmed) {
        navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
        if (clearField) setSearchDraft('');
      } else if (location.pathname === '/busca') {
        navigate('/');
        if (clearField) setSearchDraft('');
      }
    },
    [location.pathname, navigate]
  );

  const handleSearchChange = (value) => {
    const safe = sanitizeSearchQuery(value);
    setSearchDraft(safe);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => runSearch(safe), SEARCH_DEBOUNCE_MS);
  };

  const handleSearchSubmit = () => {
    clearTimeout(searchDebounceRef.current);
    runSearch(searchDraft, { clearField: true });
  };

  useEffect(
    () => () => clearTimeout(searchDebounceRef.current),
    []
  );

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-56">
        <Header
          searchValue={searchDraft}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
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
