import { catalogProducts } from '../data/catalog.js';

let indexCache = null;

/** Mapa id → produto publicado (fonte confiável de preço/nome). */
export function getCatalogIndex() {
  if (!indexCache) {
    indexCache = new Map();
    for (const p of catalogProducts) {
      if (p?.id) indexCache.set(p.id, p);
    }
  }
  return indexCache;
}

export function getCatalogProduct(id) {
  if (!id) return null;
  return getCatalogIndex().get(id) ?? null;
}
