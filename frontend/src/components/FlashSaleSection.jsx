import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import {
  getFlashSaleDeals,
  installmentPrice,
  pixPrice,
  PIX_DISCOUNT_PERCENT
} from '../data/promotions.js';
import { FLASH_SALE_ATIVA, FLASH_SALE_TITLE, SHOP_FLASH_BRAND } from '../data/brand.js';
import { assetUrl, priceBRL } from '../lib/catalog-ui.js';
import { FlashSaleCountdown } from './FlashSaleCountdown.jsx';

function PromoBadge({ label }) {
  return <span className="chip text-[10px] uppercase font-bold">{label}</span>;
}

function PromoPricing({ product, badge }) {
  const price = Number(product.price) || 0;
  const list = Number(product.listPrice) || 0;
  const pix = pixPrice(price);
  const showList = list > price && list > 0;
  const parcel = installmentPrice(price);

  return (
    <div className="space-y-1">
      {badge ? <PromoBadge label={badge} /> : null}
      {showList ? (
        <p className="text-xs text-white/45 line-through">De {priceBRL(list)}</p>
      ) : null}
      <p className="text-xl sm:text-2xl font-bold text-white">
        {price > 0 ? (
          <>
            {priceBRL(pix)} <span className="text-sm sm:text-base font-semibold text-white/80">no pix</span>
          </>
        ) : (
          'Consulte o valor'
        )}
      </p>
      {price > 0 ? (
        <>
          <p className="text-xs text-white/55">10x de {priceBRL(parcel)} sem juros</p>
          <p className="text-xs text-white/45">{priceBRL(price)} a prazo</p>
        </>
      ) : null}
    </div>
  );
}

function FeaturedFlashDeal({ product, endsAt, badge }) {
  const { addItem } = useCart();
  const categoryLink = product.categorySlug ? `/${product.categorySlug}` : '/';
  const displayName =
    product.name.length > 60 ? `${product.name.slice(0, 57)}…` : product.name;

  return (
    <article className="glass rounded-2xl p-4 sm:p-6 ring-2 ring-purpleGlow-500/35 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-black leading-tight text-purpleGlow-500 uppercase tracking-tight">
            {SHOP_FLASH_BRAND}
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-purpleGlow-400 tracking-tight mt-0.5">
            FLASH
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs sm:text-sm font-extrabold text-white/90 uppercase tracking-wide">
            Oferta relâmpago
          </p>
          <div className="mt-2 flex justify-end">
            <FlashSaleCountdown endsAt={endsAt} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-5 sm:gap-6 items-center">
        <Link
          to={categoryLink}
          className="flex items-center justify-center bg-brand-900/40 border border-white/10 rounded-xl p-4 min-h-[200px] sm:min-h-[240px]"
        >
          {product.image ? (
            <img
              src={assetUrl(product.image)}
              alt={product.name}
              className="max-h-52 sm:max-h-60 max-w-full object-contain"
            />
          ) : null}
        </Link>

        <div className="min-w-0">
          <Link
            to={categoryLink}
            className="text-base sm:text-lg font-semibold text-white hover:text-purpleGlow-400 line-clamp-2 transition"
          >
            {displayName}
          </Link>
          {product.ref ? (
            <p className="text-xs text-white/50 mt-1">Ref. {product.ref}</p>
          ) : null}
          <div className="mt-4">
            <PromoPricing product={product} badge={badge} />
          </div>
          <button
            type="button"
            className="btn-primary mt-5 w-full py-3.5 text-sm sm:text-base font-bold"
            onClick={() => addItem(product)}
          >
            Aproveite muito!
          </button>
        </div>
      </div>
    </article>
  );
}

export function FlashSaleSection() {
  if (!FLASH_SALE_ATIVA) return null;

  const { featured, endsAt, pixLabel } = getFlashSaleDeals();

  if (!featured) return null;

  const badge = pixLabel || `${PIX_DISCOUNT_PERCENT}% OFF no PIX`;

  return (
    <section id="ofertas" className="scroll-mt-28 py-10 sm:py-14" aria-label={FLASH_SALE_TITLE}>
      <div className="container-page max-w-4xl">
        <h2 className="text-center text-base sm:text-xl font-bold text-purpleGlow-400 flex items-center justify-center gap-2 flex-wrap mb-6 uppercase tracking-wide">
          <Heart className="h-5 w-5 fill-purpleGlow-500 text-purpleGlow-500 shrink-0" aria-hidden />
          {FLASH_SALE_TITLE}
          <Heart className="h-5 w-5 fill-purpleGlow-500 text-purpleGlow-500 shrink-0" aria-hidden />
        </h2>
        <FeaturedFlashDeal product={featured} endsAt={endsAt} badge={badge} />
        <p className="text-center text-xs text-white/45 mt-4">
          {PIX_DISCOUNT_PERCENT}% no Pix · valor final confirmado no WhatsApp
        </p>
      </div>
    </section>
  );
}
