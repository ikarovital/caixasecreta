import { getCatalogProduct } from './catalog-index.js';

const MAX_QTY = 99;
const MAX_NAME_LEN = 200;
const MAX_FIELD_LEN = 120;

export function clampQuantity(qty) {
  return Math.max(1, Math.min(MAX_QTY, Math.floor(Number(qty) || 1)));
}

/** Linha do carrinho alinhada ao catálogo (evita preço adulterado no localStorage). */
export function toSecureCartLine(stored, catalogProduct) {
  const qty = clampQuantity(stored?.quantity);
  return {
    id: catalogProduct.id,
    name: String(catalogProduct.name || '').slice(0, MAX_NAME_LEN),
    ref: catalogProduct.ref || null,
    price: Math.max(0, Number(catalogProduct.price) || 0),
    image: catalogProduct.image || null,
    quantity: qty
  };
}

export function sanitizeCartItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  const out = [];
  for (const row of rawItems) {
    if (!row?.id) continue;
    const catalog = getCatalogProduct(row.id);
    if (!catalog) continue;
    out.push(toSecureCartLine(row, catalog));
  }
  return out;
}

export function resolveProductForCart(product) {
  if (!product?.id) return null;
  const catalog = getCatalogProduct(product.id);
  if (!catalog) return null;
  return catalog;
}

export function sanitizeTextField(value, maxLen = MAX_FIELD_LEN) {
  return String(value ?? '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLen);
}

export function sanitizeSearchQuery(value) {
  return sanitizeTextField(value, 80);
}
