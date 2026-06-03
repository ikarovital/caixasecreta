export const CATALOG_ASSET_VERSION = '27';

export function priceBRL(v) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  } catch {
    return `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
  }
}

export function assetUrl(src) {
  if (!src) return '';
  try {
    const base = encodeURI(src);
    return `${base}${base.includes('?') ? '&' : '?'}v=${CATALOG_ASSET_VERSION}`;
  } catch {
    return src;
  }
}
