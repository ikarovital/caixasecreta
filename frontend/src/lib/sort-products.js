/** Ordenação de produtos no catálogo. */
export const SORT_OPTIONS = [
  { id: 'price-asc', label: 'Menor Preço' },
  { id: 'price-desc', label: 'Maior Preço' },
  { id: 'top-sale', label: 'Mais vendidos' },
  { id: 'release-desc', label: 'Data de lançamento' },
  { id: 'discount-desc', label: 'Melhor desconto' }
];

export const DEFAULT_SORT = 'top-sale';

function discountPercent(product) {
  const list = Number(product.listPrice) || 0;
  const price = Number(product.price) || 0;
  if (list > price && list > 0) {
    return ((list - price) / list) * 100;
  }
  return 0;
}

function releaseTimestamp(product) {
  if (product.releaseDate) {
    const t = Date.parse(product.releaseDate);
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}

/**
 * @param {Array} products
 * @param {string} sortId
 * @param {Map<string, number>} [orderIndex] ordem original (ex.: mais vendidos)
 */
export function sortProducts(products, sortId, orderIndex) {
  const list = [...products];

  if (sortId === 'price-asc') {
    return list.sort((a, b) => (a.price || 0) - (b.price || 0));
  }
  if (sortId === 'price-desc') {
    return list.sort((a, b) => (b.price || 0) - (a.price || 0));
  }
  if (sortId === 'release-desc') {
    return list.sort((a, b) => releaseTimestamp(b) - releaseTimestamp(a));
  }
  if (sortId === 'discount-desc') {
    return list.sort((a, b) => discountPercent(b) - discountPercent(a));
  }

  if (orderIndex?.size) {
    return list.sort((a, b) => (orderIndex.get(a.id) ?? 9999) - (orderIndex.get(b.id) ?? 9999));
  }
  return list;
}

export function buildOrderIndex(products) {
  const map = new Map();
  products.forEach((p, i) => {
    if (p.importRank != null) {
      map.set(p.id, p.importRank);
    } else {
      map.set(p.id, i);
    }
  });
  return map;
}
