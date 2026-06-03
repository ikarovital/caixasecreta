/**
 * Frete fixo — Grande São Paulo (capital, ABC, litoral).
 * Valores calibrados como estimativa de corrida curta (referência 99 / Uber ~R$ 12–22).
 */

import { FRETE_SP_REGIOES } from './shipping-config.js';

const CEP_NUM = (cep) => {
  const d = String(cep || '').replace(/\D/g, '');
  return d.length === 8 ? parseInt(d, 10) : NaN;
};

/** Prefixo de 3 dígitos → região (capital e entorno imediato) */
const PREFIX3 = {
  '010': 'centro',
  '011': 'centro',
  '012': 'centro',
  '013': 'centro',
  '014': 'centro',
  '015': 'centro',
  '016': 'centro',
  '017': 'centro',
  '018': 'centro',
  '019': 'centro',
  '020': 'zona_norte',
  '021': 'zona_norte',
  '022': 'zona_norte',
  '023': 'zona_norte',
  '024': 'zona_norte',
  '025': 'zona_norte',
  '026': 'zona_norte',
  '027': 'zona_norte',
  '028': 'zona_norte',
  '029': 'zona_norte',
  '030': 'zona_leste',
  '031': 'zona_leste',
  '032': 'zona_leste',
  '033': 'zona_leste',
  '034': 'zona_leste',
  '035': 'zona_leste',
  '036': 'zona_leste',
  '037': 'zona_leste',
  '038': 'zona_leste',
  '039': 'zona_leste',
  '040': 'zona_sul',
  '041': 'zona_sul',
  '042': 'zona_sul',
  '043': 'zona_sul',
  '044': 'zona_sul',
  '045': 'zona_sul',
  '046': 'zona_sul',
  '047': 'zona_sul',
  '048': 'zona_sul',
  '049': 'zona_sul',
  '050': 'zona_oeste',
  '051': 'zona_oeste',
  '052': 'zona_oeste',
  '053': 'zona_oeste',
  '054': 'zona_oeste',
  '055': 'zona_oeste',
  '056': 'zona_oeste',
  '057': 'zona_oeste',
  '058': 'zona_oeste',
  '059': 'zona_oeste',
  '060': 'zona_oeste',
  '061': 'zona_oeste',
  '062': 'zona_oeste',
  '080': 'zona_leste',
  '081': 'zona_leste',
  '082': 'zona_leste',
  '083': 'zona_leste',
  '084': 'zona_leste',
  '090': 'abc',
  '091': 'abc',
  '092': 'abc',
  '093': 'abc',
  '094': 'abc',
  '095': 'abc',
  '096': 'abc',
  '097': 'abc',
  '098': 'abc',
  '099': 'abc',
  '110': 'litoral',
  '111': 'litoral',
  '112': 'litoral',
  '113': 'litoral',
  '114': 'litoral',
  '115': 'litoral',
  '116': 'litoral',
  '117': 'litoral',
  '118': 'litoral',
  '119': 'litoral'
};

const CIDADES_ABC = new Set([
  'santo andre',
  'santo andré',
  'sao bernardo do campo',
  'são bernardo do campo',
  'diadema',
  'maua',
  'mauá',
  'ribeirao pires',
  'ribeirão pires',
  'sao caetano do sul',
  'são caetano do sul',
  'suzano',
  'ribeirao pires'
]);

const CIDADES_LITORAL = new Set([
  'santos',
  'sao vicente',
  'são vicente',
  'guaruja',
  'guarujá',
  'praia grande',
  'cubatao',
  'cubatão',
  'bertioga',
  'itanhaem',
  'itanhaém',
  'mongagua',
  'mongaguá'
]);

function normCity(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function classifySpRegion(cep, localidade = '') {
  const n = CEP_NUM(cep);
  if (!Number.isFinite(n)) return null;

  const city = normCity(localidade);
  if (CIDADES_LITORAL.has(city)) return 'litoral';
  if (CIDADES_ABC.has(city)) return 'abc';

  const p3 = String(cep).replace(/\D/g, '').slice(0, 3);
  const byPrefix = PREFIX3[p3];
  if (byPrefix) return byPrefix;

  return null;
}

export function isDeliveryArea(cep, localidade, uf) {
  if (String(uf || '').toUpperCase() !== 'SP') return false;
  return classifySpRegion(cep, localidade) != null;
}

export function getRegionalFreight(cep, localidade) {
  const regionId = classifySpRegion(cep, localidade);
  if (!regionId) return null;
  return FRETE_SP_REGIOES[regionId] ?? null;
}

export function formatRegionLabel(regionId) {
  const r = FRETE_SP_REGIOES[regionId];
  return r?.label ?? regionId;
}
