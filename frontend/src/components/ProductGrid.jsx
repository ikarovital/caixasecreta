import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Package, X } from 'lucide-react';
import { assetUrl, priceBRL } from '../lib/catalog-ui.js';
import { useCart } from '../context/CartContext.jsx';

function ProductImage({ p, className, priority, src, alt }) {
  const url = src || p?.image;
  if (!url) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 text-white/40 text-sm ${className}`}>
        <Package className="h-8 w-8 text-purpleGlow-500/50" />
        <span>Sem foto</span>
      </div>
    );
  }
  return (
    <img
      src={assetUrl(url)}
      alt={alt || p?.name || 'Produto'}
      className={`h-full w-full object-contain object-center ${className}`}
      loading="lazy"
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
    />
  );
}

function ProductPhotoPair({ p, className, priority, mode = 'pair' }) {
  if (!p?.imageBack || mode === 'front') {
    return (
      <div className={`relative h-full w-full flex items-center justify-center ${className || ''}`}>
        <ProductImage p={p} className="max-h-full max-w-full" priority={priority} />
        {mode === 'front' && p?.imageBack ? (
          <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white">
            + verso
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div className={`flex h-full w-full items-stretch justify-center gap-1 ${className || ''}`}>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
        <span className="mb-0.5 text-[9px] uppercase tracking-wide text-black/50">Frente</span>
        <ProductImage p={p} className="flex-1 min-h-0 w-full" priority={priority} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center border-l border-black/10 pl-1">
        <span className="mb-0.5 text-[9px] uppercase tracking-wide text-black/50">Verso</span>
        <ProductImage p={p} src={p.imageBack} alt={`${p.name} — verso`} className="flex-1 min-h-0 w-full" />
      </div>
    </div>
  );
}

/** Card compacto no grid — mobile sempre assim; desktop quando não expandido inline */
function ProductCard({
  p,
  categoryTitle,
  selected,
  expandedDesktop,
  onToggle,
}) {
  const { addItem } = useCart();
  const label = p.ref ? `Ref. ${p.ref}` : null;
  const hasDescription = Boolean(p.description?.trim());
  const showDesktopExpand = expandedDesktop;

  return (
    <article
      data-expanded={expandedDesktop ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      className={`glass rounded-2xl overflow-hidden transition-all flex flex-col ${
        selected ? 'ring-2 ring-purpleGlow-500/70' : 'hover:shadow-glow'
      } ${showDesktopExpand ? 'lg:col-span-2 lg:shadow-glow' : ''}`}
    >
      <button
        type="button"
        className="flex flex-col flex-1 text-left w-full min-w-0"
        onClick={onToggle}
        aria-expanded={selected || showDesktopExpand}
      >
        <div
          className={`bg-white border-b border-white/10 flex items-center justify-center overflow-hidden p-0.5 sm:p-1 ${
            showDesktopExpand ? 'h-32 sm:h-40 lg:h-72' : 'h-32 sm:h-40 lg:h-44'
          }`}
        >
          <ProductPhotoPair
            p={p}
            className="max-h-full max-w-full"
            priority={showDesktopExpand}
            mode={p.imageBack && !showDesktopExpand ? 'front' : 'pair'}
          />
        </div>

        <div className={`flex flex-col flex-1 min-w-0 ${showDesktopExpand ? 'p-4' : 'p-2.5 sm:p-3'}`}>
          <div className="flex items-start justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1 min-w-0">
              <span className="chip text-[9px] sm:text-[10px] uppercase truncate max-w-full">
                {categoryTitle || p.category}
              </span>
              {label ? (
                <span className="chip text-[9px] sm:text-[10px] truncate">{label}</span>
              ) : null}
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-purpleGlow-500 transition ${
                selected || showDesktopExpand ? 'rotate-180' : ''
              }`}
            />
          </div>
          <h3
            className={`mt-1.5 font-semibold leading-snug line-clamp-2 ${
              showDesktopExpand ? 'text-lg' : 'text-sm sm:text-base'
            }`}
          >
            {p.name}
          </h3>
          <div className={`text-white/80 ${showDesktopExpand ? 'mt-1 text-base' : 'mt-0.5 text-sm'}`}>
            {p.price > 0 ? priceBRL(p.price) : 'Consulte o valor'}
          </div>

          {showDesktopExpand ? (
            <div className="mt-4 border-t border-white/10 pt-4 hidden lg:block">
              <div className="text-xs font-medium uppercase text-purpleGlow-500/90">Descrição</div>
              <p className="mt-2 text-sm text-white/75 whitespace-pre-line leading-relaxed">
                {hasDescription ? p.description : 'Sem descrição no catálogo.'}
              </p>
              {(p.source || p.page) && (
                <p className="mt-2 text-xs text-white/40">
                  {p.source}
                  {p.page ? ` · Pág. ${p.page}` : ''}
                </p>
              )}
            </div>
          ) : (
            <>
              {hasDescription ? (
                <p className="mt-1.5 text-xs text-white/55 line-clamp-2 whitespace-pre-line hidden sm:block">
                  {p.description}
                </p>
              ) : null}
              <p className="mt-1.5 text-[10px] sm:text-xs text-white/45 lg:hidden">Toque para detalhes</p>
            </>
          )}
        </div>
      </button>

      <div
        className={`flex gap-2 ${showDesktopExpand ? 'px-4 pb-4 flex-col sm:flex-row' : 'px-2.5 pb-2.5 sm:px-3 sm:pb-3'}`}
      >
        {showDesktopExpand ? (
          <button type="button" className="btn-secondary flex-1 hidden lg:flex" onClick={onToggle}>
            Fechar
          </button>
        ) : null}
        <button
          type="button"
          className={`btn-primary text-xs sm:text-sm py-2.5 ${showDesktopExpand ? 'flex-1' : 'w-full'}`}
          onClick={(e) => {
            e.stopPropagation();
            addItem(p);
          }}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            Adicionar <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </button>
      </div>
    </article>
  );
}

/** Painel inferior no mobile — não cobre o grid inteiro */
function ProductDetailSheet({ p, categoryTitle, onClose }) {
  const { addItem } = useCart();
  if (!p) return null;

  const label = p.ref ? `Ref. ${p.ref}` : null;
  const hasDescription = Boolean(p.description?.trim());

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Fechar detalhes"
        onClick={onClose}
      />
      <div className="relative mx-auto w-full max-w-lg rounded-t-2xl border border-white/10 bg-brand-900 shadow-2xl max-h-[min(48vh,400px)] flex flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 shrink-0">
          <span className="text-xs font-medium text-white/60">Detalhes do produto</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/80 hover:bg-white/10"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
          <div
            className={`shrink-0 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden ${
              p.imageBack ? 'h-28 w-40' : 'h-28 w-24'
            }`}
          >
            <ProductPhotoPair p={p} className="max-h-full max-w-full" priority />
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex flex-wrap gap-1">
              <span className="chip text-[9px] uppercase">{categoryTitle || p.category}</span>
              {label ? <span className="chip text-[9px]">{label}</span> : null}
            </div>
            <h3 className="mt-1 font-semibold text-base leading-snug line-clamp-2">{p.name}</h3>
            <div className="mt-0.5 text-sm text-white/80">
              {p.price > 0 ? priceBRL(p.price) : 'Consulte o valor'}
            </div>
            <p className="mt-2 text-xs text-white/70 whitespace-pre-line line-clamp-4 leading-relaxed">
              {hasDescription ? p.description : 'Sem descrição no catálogo.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-white/10 p-3 shrink-0">
          <button type="button" className="btn-secondary flex-1 text-sm py-2.5" onClick={onClose}>
            Fechar
          </button>
          <button
            type="button"
            className="btn-primary flex-1 text-sm py-2.5"
            onClick={() => addItem(p)}
          >
            Adicionar <ArrowRight className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, categoryTitle }) {
  const [expandedId, setExpandedId] = useState(null);
  const gridRef = useRef(null);
  const expandedProduct = products.find((p) => p.id === expandedId) ?? null;

  useEffect(() => {
    if (!expandedId) return;

    const closeIfOutside = (event) => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      const expandedEl = gridRef.current?.querySelector('[data-expanded="true"]');
      if (expandedEl && !expandedEl.contains(event.target)) {
        setExpandedId(null);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setExpandedId(null);
    };

    document.addEventListener('mousedown', closeIfOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', closeIfOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expandedId]);

  useEffect(() => {
    if (!expandedId) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia('(max-width: 1023px)').matches) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expandedId]);

  if (!products.length) {
    return <p className="text-white/60 text-center py-12">Nenhum produto nesta categoria.</p>;
  }

  const toggle = (id) => setExpandedId((current) => (current === id ? null : id));

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4"
      >
        {products.map((p) => {
          const selected = expandedId === p.id;
          const expandedDesktop = selected;

          return (
            <ProductCard
              key={p.id}
              p={p}
              categoryTitle={categoryTitle}
              selected={selected}
              expandedDesktop={expandedDesktop}
              onToggle={() => toggle(p.id)}
            />
          );
        })}
      </div>

      <ProductDetailSheet
        p={expandedProduct}
        categoryTitle={categoryTitle}
        onClose={() => setExpandedId(null)}
      />
    </>
  );
}
