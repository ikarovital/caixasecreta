import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { menuItems } from '../data/catalog.js';
import { SHOP_NAME, SHOP_TAGLINE } from '../data/brand.js';

const navClass = ({ isActive }) =>
  `block w-full rounded-lg border-l-2 px-3 py-2.5 text-sm transition ${
    isActive
      ? 'border-purpleGlow-500 bg-purpleGlow-500/20 font-medium text-white'
      : 'border-transparent text-white/75 hover:bg-white/5 hover:text-white'
  }`;

function SidebarNav({ onNavigate }) {
  return (
    <nav className="sidebar-scroll flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-2 py-2" aria-label="Menu do site">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={navClass}
          end={item.to === '/'}
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop: barra lateral fixa */}
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-white/10 bg-brand-900/95 backdrop-blur-lg pt-[env(safe-area-inset-top,0px)] lg:flex"
        aria-label="Navegação lateral"
      >
        <div className="shrink-0 border-b border-white/10 px-4 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src={encodeURI('/imagens/logo.jpg')}
              alt=""
              className="h-10 w-10 rounded-xl border border-white/10 object-cover"
            />
            <div className="leading-tight">
              <span className="block text-xs font-semibold text-white/60">{SHOP_NAME.toUpperCase()}</span>
              <span className="block text-sm font-semibold text-white/90 line-clamp-1">{SHOP_TAGLINE}</span>
            </div>
          </NavLink>
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile: gaveta lateral */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-[min(18rem,85vw)] flex-col border-r border-white/10 bg-brand-900 pt-[env(safe-area-inset-top,0px)] transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
        aria-label="Menu"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <img
              src={encodeURI('/imagens/logo.jpg')}
              alt=""
              className="h-9 w-9 rounded-xl border border-white/10 object-cover"
            />
            <span className="text-sm font-semibold">{SHOP_NAME}</span>
          </NavLink>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 hover:bg-white/10"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={onClose} />
      </aside>
    </>
  );
}
