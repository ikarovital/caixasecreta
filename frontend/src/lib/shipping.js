import {
  FRETE_GRATIS_MINIMO,
  FRETE_GRATIS_UF,
  FRETE_MENSAGEM_AREA,
  FRETE_PADRAO_UF,
  FRETE_POR_UF
} from './shipping-config.js';
import {
  classifySpRegion,
  formatRegionLabel,
  getRegionalFreight,
  isDeliveryArea
} from './shipping-sp-regions.js';

const VIACEP_TIMEOUT_MS = 8000;

export function normalizeCep(value) {
  const d = String(value || '').replace(/\D/g, '');
  if (d.length !== 8) return null;
  return d;
}

export function formatCep(value) {
  const d = normalizeCep(value);
  if (!d) return String(value || '');
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function qualifiesFreeShipping(subtotal, uf) {
  return subtotal >= FRETE_GRATIS_MINIMO && String(uf || '').toUpperCase() === FRETE_GRATIS_UF;
}

export function fallbackFreteByUf(uf) {
  const u = String(uf || '').toUpperCase();
  return FRETE_POR_UF[u] ?? FRETE_PADRAO_UF;
}

export async function fetchAddressByCep(cep) {
  const digits = normalizeCep(cep);
  if (!digits) throw new Error('CEP deve ter 8 dígitos.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VIACEP_TIMEOUT_MS);

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: controller.signal
    });
    if (!res.ok) throw new Error('Não foi possível consultar o CEP.');
    const data = await res.json();
    if (data.erro) throw new Error('CEP não encontrado.');

    return {
      cep: digits,
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: (data.uf || '').toUpperCase()
    };
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Consulta de CEP demorou demais. Tente de novo.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Frete por região fixa (capital / ABC / litoral) — sem Correios.
 */
export async function calculateShipping({ cepDestino, cartItems: _cartItems, subtotal }) {
  const digits = normalizeCep(cepDestino);
  if (!digits) throw new Error('CEP inválido.');

  const address = await fetchAddressByCep(digits);

  if (!isDeliveryArea(digits, address.localidade, address.uf)) {
    throw new Error(
      `${FRETE_MENSAGEM_AREA} Seu CEP (${address.localidade || '—'} - ${address.uf}) está fora da área.`
    );
  }

  const regionId = classifySpRegion(digits, address.localidade);
  const regional = getRegionalFreight(digits, address.localidade);
  if (!regional) {
    throw new Error('Não foi possível identificar a região para este CEP.');
  }

  if (qualifiesFreeShipping(subtotal, address.uf)) {
    return {
      address,
      regionId,
      regionLabel: formatRegionLabel(regionId),
      freight: 0,
      freeShipping: true,
      service: 'Entrega regional',
      prazo: regional.prazo,
      source: 'gratis_sp',
      message: `Frete grátis — ${formatRegionLabel(regionId)} (pedido a partir de R$ ${FRETE_GRATIS_MINIMO}).`
    };
  }

  return {
    address,
    regionId,
    regionLabel: formatRegionLabel(regionId),
    freight: regional.freight,
    freeShipping: false,
    service: `Entrega ${formatRegionLabel(regionId)}`,
    prazo: regional.prazo,
    source: 'regiao_fixa',
    message: `${formatRegionLabel(regionId)}: R$ ${regional.freight.toFixed(2).replace('.', ',')}. ${regional.nota}.`
  };
}
