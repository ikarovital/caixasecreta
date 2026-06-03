import { PIX_DISCOUNT_PERCENT } from '../data/promotions.js';

import { priceBRL } from './catalog-ui.js';

import { formatCep } from './shipping.js';
import { sanitizeTextField } from './cart-security.js';



export function orderTotals({ subtotal, freight = 0, payment, pointsDiscountReais = 0 }) {

  const base = (Number(subtotal) || 0) + (Number(freight) || 0);

  const pointsOff = Math.min(

    Math.max(0, Number(pointsDiscountReais) || 0),

    Math.max(0, Number(subtotal) || 0)

  );

  const afterPoints = Math.max(0, Math.round((base - pointsOff) * 100) / 100);

  const pixDiscount =

    payment === 'pix'

      ? Math.round(afterPoints * (PIX_DISCOUNT_PERCENT / 100) * 100) / 100

      : 0;

  const total =

    payment === 'pix'

      ? Math.round((afterPoints - pixDiscount) * 100) / 100

      : afterPoints;

  return { base, pointsOff, afterPoints, pixDiscount, total };

}



export function totalWithPayment(subtotal, freight, payment, pointsDiscountReais = 0) {

  return orderTotals({

    subtotal,

    freight,

    payment: payment === 'pix' ? 'pix' : 'card',

    pointsDiscountReais

  }).total;

}



export function buildOrderWhatsAppMessage({

  client,

  address,

  items,

  subtotal,

  freight,

  payment,

  service,

  prazo,

  cupom,

  pointsRedeemed = 0,

  pointsDiscountReais = 0

}) {

  const totals = orderTotals({

    subtotal,

    freight,

    payment: payment === 'pix' ? 'pix' : 'card',

    pointsDiscountReais

  });



  const cidade = address

    ? [address.bairro, address.localidade, address.uf].filter(Boolean).join(', ')

    : '';

  const nome = sanitizeTextField(client.nome, 80);
  const tel = String(client.telefone || '').replace(/\D/g, '').slice(0, 11);
  const cupomSafe = sanitizeTextField(cupom, 40);

  const lines = [

    'Pedido Clube',

    `${nome} · ${tel} · CEP ${formatCep(client.cep)}`,

    cidade || null,

    ''

  ];



  items.forEach((i) => {

    const ref = i.ref ? ` · Ref ${i.ref}` : '';

    lines.push(`${i.quantity}x ${i.name}${ref} — ${priceBRL(i.price)}`);

  });



  lines.push('');

  lines.push(`Subtotal ${priceBRL(subtotal)}`);

  lines.push(`Frete ${freight === 0 ? 'Grátis' : priceBRL(freight)}${service ? ` (${service})` : ''}`);

  if (prazo) lines.push(`Prazo ${prazo} dia(s) úteis`);

  if (totals.pointsOff > 0) {

    lines.push(`Desconto pontos (${pointsRedeemed} pts) −${priceBRL(totals.pointsOff)}`);

  }

  if (payment === 'pix' && totals.pixDiscount > 0) {

    lines.push(`Desconto Pix ${PIX_DISCOUNT_PERCENT}% −${priceBRL(totals.pixDiscount)}`);

  }

  lines.push(`Total ${priceBRL(totals.total)} · ${payment === 'pix' ? 'Pix' : 'Cartão'}`);



  if (cupomSafe) lines.push(`Cupom ${cupomSafe}`);



  return lines.filter(Boolean).join('\n');

}


