import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useCustomer } from '../context/CustomerContext.jsx';
import { CAMPANHA_PONTOS, PONTOS_ATIVO, pontosPorRealAtual } from '../data/points-config.js';
import { SHOP_NAME, SHOP_TAGLINE } from '../data/brand.js';

function HeaderIconLink({ to, label, title, children, badge, badgeClass = 'bg-purpleGlow-500 text-white' }) {
  return (
    <Link
      to={to}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/10 hover:border-white/20"
      aria-label={label}
      title={title || label}
    >
      {children}
      {badge != null && badge > 0 ? (
        <span
          className={`pointer-events-none absolute -top-1 -right-1 flex h-[18px] min-w-[18px] max-w-[2.75rem] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ring-2 ring-brand-950 ${badgeClass}`}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function Header({ onSearchChange, onSearchSubmit, searchValue, onMenuOpen }) {
  const { count: cartCount } = useCart();
  const { isLoggedIn } = useCustomer();

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] lg:left-56 lg:right-0">
      <div className="bg-purpleGlow-500/20 text-white/90">
        <div className="container-page py-2 text-center text-xs font-medium">
          Frete grátis SP acima de R$120
          {PONTOS_ATIVO && CAMPANHA_PONTOS.ativa ? ` · ${pontosPorRealAtual()} pts por real` : ''}
        </div>
      </div>

      <div className="bg-brand-950/90 backdrop-blur-lg border-b border-white/10">
        {/* Linha 1: logo · busca · perfil + carrinho */}
        <div className="container-page flex h-16 items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white lg:hidden"
            aria-label="Abrir menu"
            onClick={onMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          <NavLink to="/" className="flex shrink-0 items-center gap-2 min-w-0 lg:hidden">
            <img
              src={encodeURI('/imagens/logo.jpg')}
              alt={SHOP_NAME}
              className="h-9 w-9 rounded-xl border border-white/10 object-cover"
            />
            <p className="hidden min-[361px]:block leading-tight">
              <span className="block font-semibold">{SHOP_NAME.toUpperCase()}</span>
              <span className="block text-white/80 text-sm -mt-0.5">{SHOP_TAGLINE}</span>
            </p>
          </NavLink>

          <div className="flex min-w-0 flex-1 items-center justify-center lg:justify-start">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                type="search"
                enterKeyHint="search"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearchSubmit?.();
                  }
                }}
                onFocus={(e) => e.target.select()}
                placeholder="Buscar nome ou ref…"
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/45 focus:border-purpleGlow-500/40 focus:outline-none"
                aria-label="Buscar por nome ou referência"
              />
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-white/10"
            aria-label="Conta e carrinho"
          >
            <HeaderIconLink
              to="/conta"
              label={isLoggedIn ? 'Minha conta' : 'Entrar ou cadastrar'}
              title="Minha conta"
            >
              <User className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
            </HeaderIconLink>
            <HeaderIconLink
              to="/carrinho"
              label={`Carrinho, ${cartCount} itens`}
              title="Carrinho"
              badge={cartCount > 0 ? (cartCount > 99 ? '99+' : cartCount) : null}
            >
              <ShoppingCart className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
            </HeaderIconLink>
          </div>
        </div>
      </div>
    </header>
  );
}
