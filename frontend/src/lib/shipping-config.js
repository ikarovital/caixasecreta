/** CEP de origem da loja (postagem) — ajuste se necessário */
export const CEP_ORIGEM = '01310100';

export const FRETE_GRATIS_MINIMO = 120;

/** Frete grátis: subtotal ≥ R$ 120 e destino em São Paulo (termos da loja) */
export const FRETE_GRATIS_UF = 'SP';

/**
 * Frete fixo por região — Grande SP (sem consulta Correios).
 * Referência: corridas curtas 99 / Uber na capital costumam ficar entre ~R$ 11 e R$ 22;
 * valores abaixo são estimativa de entrega com margem para o catálogo.
 */
export const FRETE_SP_REGIOES = {
  centro: { label: 'Centro', freight: 13, prazo: 1, nota: 'Entrega na região central' },
  zona_sul: { label: 'Zona Sul', freight: 14, prazo: 1, nota: 'Entrega na Zona Sul' },
  zona_norte: { label: 'Zona Norte', freight: 15, prazo: 1, nota: 'Entrega na Zona Norte' },
  zona_leste: { label: 'Zona Leste', freight: 16, prazo: 1, nota: 'Entrega na Zona Leste' },
  zona_oeste: { label: 'Zona Oeste', freight: 15, prazo: 1, nota: 'Entrega na Zona Oeste' },
  abc: { label: 'ABC', freight: 19, prazo: 1, nota: 'Entrega na Grande ABC' },
  litoral: { label: 'Litoral (Baixada Santista)', freight: 32, prazo: 2, nota: 'Entrega no litoral paulista' }
};

/** Área atendida: capital + ABC + litoral SP */
export const FRETE_MENSAGEM_AREA =
  'Entregamos na capital de São Paulo, região ABC e litoral (Baixada Santista).';

/** Fallback regional quando CEP fora da área SP atendida */
export const FRETE_POR_UF = {
  SP: 15,
  RJ: 18,
  MG: 18,
  ES: 18,
  PR: 20,
  SC: 20,
  RS: 20,
  DF: 22,
  GO: 22,
  MT: 22,
  MS: 22,
  BA: 24,
  CE: 24,
  PE: 24,
  RN: 24,
  PB: 24,
  AL: 24,
  SE: 24,
  MA: 24,
  PI: 24,
  AC: 26,
  AM: 26,
  AP: 26,
  PA: 26,
  RO: 26,
  RR: 26,
  TO: 26
};

export const FRETE_PADRAO_UF = 25;

export const CORREIOS_CALC_URL =
  'https://www2.correios.com.br/sistemas/precosPrazos/';
