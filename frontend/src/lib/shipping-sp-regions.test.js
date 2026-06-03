import { describe, expect, it } from 'vitest';
import { classifySpRegion, getRegionalFreight, isDeliveryArea } from './shipping-sp-regions.js';

describe('shipping-sp-regions', () => {
  it('classifica centro e zonas', () => {
    expect(classifySpRegion('01310100', 'São Paulo')).toBe('centro');
    expect(classifySpRegion('04000000', 'São Paulo')).toBe('zona_sul');
    expect(classifySpRegion('02000000', 'São Paulo')).toBe('zona_norte');
    expect(classifySpRegion('03000000', 'São Paulo')).toBe('zona_leste');
    expect(classifySpRegion('05000000', 'São Paulo')).toBe('zona_oeste');
  });

  it('classifica ABC e litoral', () => {
    expect(classifySpRegion('09600000', 'São Bernardo do Campo')).toBe('abc');
    expect(classifySpRegion('11000000', 'Santos')).toBe('litoral');
  });

  it('retorna frete fixo por região', () => {
    const r = getRegionalFreight('01310100', 'São Paulo');
    expect(r.freight).toBe(13);
    expect(r.label).toBe('Centro');
  });

  it('rejeita fora da área', () => {
    expect(isDeliveryArea('80000000', 'Curitiba', 'PR')).toBe(false);
    expect(isDeliveryArea('01310100', 'São Paulo', 'SP')).toBe(true);
  });
});
