import { describe, expect, it } from 'vitest';
import { orderTotals, totalWithPayment } from './checkout-message.js';

describe('checkout-message', () => {
  it('calcula total com frete', () => {
    const t = orderTotals({ subtotal: 100, freight: 15, payment: 'card' });
    expect(t.total).toBe(115);
  });

  it('aplica desconto pix', () => {
    const t = orderTotals({ subtotal: 100, freight: 0, payment: 'pix' });
    expect(t.total).toBeLessThan(100);
    expect(t.pixDiscount).toBeGreaterThan(0);
  });

  it('limita desconto de pontos ao subtotal', () => {
    const t = orderTotals({
      subtotal: 50,
      freight: 10,
      payment: 'card',
      pointsDiscountReais: 999
    });
    expect(t.pointsOff).toBe(50);
    expect(t.total).toBe(10);
  });

  it('totalWithPayment espelha orderTotals', () => {
    expect(totalWithPayment(80, 5, 'card', 0)).toBe(85);
  });
});
