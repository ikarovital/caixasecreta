/** Programa de fidelidade Clube — compras bonificadas (pontos por real) */

/** Desligado temporariamente — altere para true para reativar na loja */
export const PONTOS_ATIVO = false;

/** Taxa padrão fora de campanha */
export const POINTS_PER_REAL_PADRAO = 1;

/** Campanha ativa na loja — a cada R$ 1,00 do pedido você ganha X pontos */
export const CAMPANHA_PONTOS = {
  ativa: PONTOS_ATIVO,
  nome: 'Compras bonificadas',
  pontosPorReal: 10
};

/** Bônus extra na 1ª compra confirmada (além dos pontos do pedido) */
export const BONUS_FIRST_ORDER = 50;

export function pontosPorRealAtual() {
  return CAMPANHA_PONTOS.ativa ? CAMPANHA_PONTOS.pontosPorReal : POINTS_PER_REAL_PADRAO;
}

/** Pontos do pedido = total em R$ × pontos por real (arredonda para baixo) */
export function pointsFromOrderTotal(totalPaid) {
  if (!PONTOS_ATIVO) return 0;
  const t = Number(totalPaid) || 0;
  if (t <= 0) return 0;
  return Math.floor(t * pontosPorRealAtual());
}

/** Exemplo: R$ 300,00 × 10 pts = 3.000 pontos */
export function pontosParaValorEmReais(valorReais) {
  return pointsFromOrderTotal(valorReais);
}

export function describePointsRule() {
  const x = pontosPorRealAtual();
  const campanha = CAMPANHA_PONTOS.ativa ? ` · campanha ${x} pts/R$` : '';
  return `${x} pontos por real gasto${campanha} · +${BONUS_FIRST_ORDER} pts na 1ª compra`;
}

export function formatarPontos(n) {
  return new Intl.NumberFormat('pt-BR').format(Math.floor(n) || 0);
}

/** Pontos gastos para cada R$ 1,00 de desconto no pedido (espelha a bonificação) */
export const PONTOS_POR_REAL_RESGATE = 10;

export function descontoReaisFromPontos(pontos) {
  const p = Math.max(0, Math.floor(Number(pontos) || 0));
  return Math.round((p / PONTOS_POR_REAL_RESGATE) * 100) / 100;
}

/** Máximo de pontos aplicáveis (desconto só no subtotal dos produtos) */
export function maxPontosResgate(saldoPontos, subtotal) {
  if (!PONTOS_ATIVO) return 0;
  const saldo = Math.max(0, Math.floor(Number(saldoPontos) || 0));
  const maxPorSubtotal = Math.floor(Math.max(0, Number(subtotal) || 0) * PONTOS_POR_REAL_RESGATE);
  return Math.min(saldo, maxPorSubtotal);
}
