import { describe, expect, it } from 'vitest';
import { clampQuantity, sanitizeCartItems, sanitizeSearchQuery, sanitizeTextField } from './cart-security.js';

describe('cart-security', () => {
  it('limita quantidade', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(200)).toBe(99);
    expect(clampQuantity(3)).toBe(3);
  });

  it('remove itens desconhecidos do carrinho', () => {
    expect(sanitizeCartItems([{ id: 'fake-id-xyz', price: 0.01, quantity: 1 }])).toEqual([]);
  });

  it('sanitiza busca', () => {
    expect(sanitizeSearchQuery('  teste  ')).toBe('teste');
    expect(sanitizeSearchQuery('a'.repeat(200)).length).toBe(80);
  });

  it('remove caracteres de controle em campos', () => {
    expect(sanitizeTextField('João\x00Silva')).toBe('JoãoSilva');
  });
});
