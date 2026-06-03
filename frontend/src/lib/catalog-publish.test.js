import { describe, expect, it } from 'vitest';
import { isPublished, isVisibleOnSite, publishedProducts } from './catalog-publish.js';

describe('catalog-publish', () => {
  it('oculta produto não publicado', () => {
    expect(isVisibleOnSite({ published: false, active: true })).toBe(false);
    expect(isVisibleOnSite({ published: true, active: false })).toBe(false);
    expect(isVisibleOnSite({ published: true, active: true })).toBe(true);
  });

  it('filtra lista publicada', () => {
    const list = [
      { id: '1', published: true, active: true },
      { id: '2', published: false, active: true },
      { id: '3', published: true, active: true }
    ];
    expect(publishedProducts(list)).toHaveLength(2);
    expect(isPublished({ published: true })).toBe(true);
  });
});
