import { catalogProducts } from './catalog.js';

/** Desconto Pix conforme termos da loja */
export const PIX_DISCOUNT_PERCENT = 5;

export function pixPrice(price) {
  const p = Number(price) || 0;
  if (p <= 0) return 0;
  return Math.round(p * (1 - PIX_DISCOUNT_PERCENT / 100) * 100) / 100;
}

export function installmentPrice(price, installments = 10) {
  const p = Number(price) || 0;
  if (p <= 0) return 0;
  return Math.round((p / installments) * 100) / 100;
}

function discountPercent(product) {
  const list = Number(product.listPrice) || 0;
  const price = Number(product.price) || 0;
  if (list > price && list > 0) return ((list - price) / list) * 100;
  return 0;
}

/** Fim da promoção exibida no countdown (renovável ao recarregar o mês) */
export function flashSaleEndsAt() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

function pickPromoPool() {
  const withImage = catalogProducts.filter((p) => p.image && (p.price || 0) > 0);
  const withDiscount = withImage
    .filter((p) => discountPercent(p) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a));
  if (withDiscount.length >= 3) return withDiscount;
  const comestiveis = withImage.filter((p) => p.categorySlug === 'comestiveis');
  if (comestiveis.length >= 3) return comestiveis;
  return withImage.slice(0, 12);
}

export function getFlashSaleDeals() {
  const pool = pickPromoPool();
  if (!pool.length) {
    return { featured: null, endsAt: flashSaleEndsAt(), pixLabel: null };
  }

  return {
    featured: pool[0],
    endsAt: flashSaleEndsAt(),
    pixLabel: `${PIX_DISCOUNT_PERCENT}% OFF no PIX`
  };
}
