import { useEffect, useMemo, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { WHATSAPP_PHONE } from '../data/catalog.js';

import { PIX_DISCOUNT_PERCENT } from '../data/promotions.js';

import {

  descontoReaisFromPontos,

  formatarPontos,

  maxPontosResgate,

  PONTOS_ATIVO,

  PONTOS_POR_REAL_RESGATE,

  pontosPorRealAtual

} from '../data/points-config.js';

import { useCart } from '../context/CartContext.jsx';

import { useCustomer } from '../context/CustomerContext.jsx';

import { getCustomerByPhone, recordOrder, registerCustomer } from '../lib/customer-account.js';

import {

  buildOrderWhatsAppMessage,

  orderTotals

} from '../lib/checkout-message.js';

import { priceBRL } from '../lib/catalog-ui.js';

import { FRETE_GRATIS_MINIMO, FRETE_GRATIS_UF, FRETE_MENSAGEM_AREA } from '../lib/shipping-config.js';

import { calculateShipping, formatCep, normalizeCep } from '../lib/shipping.js';

import { openWhatsapp } from '../lib/whatsapp.js';
import { sanitizeCartItems, sanitizeTextField } from '../lib/cart-security.js';



function formatPhone(value) {

  const d = String(value).replace(/\D/g, '').slice(0, 11);

  if (d.length <= 2) return d;

  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;

  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;

  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;

}



export function CheckoutForm({ onSuccess }) {

  const { items, subtotal, persistClient, loadSavedClient } = useCart();

  const { isLoggedIn, points: sessionPoints, refresh: refreshCustomer } = useCustomer();

  const [pointsNotice, setPointsNotice] = useState(null);

  const [nome, setNome] = useState('');

  const [telefone, setTelefone] = useState('');

  const [cep, setCep] = useState('');

  const [cupom, setCupom] = useState('');

  const [usePoints, setUsePoints] = useState(false);

  const [payment, setPayment] = useState('pix');

  const [shipping, setShipping] = useState(null);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});



  useEffect(() => {

    const saved = loadSavedClient();

    if (saved) {

      setNome(saved.nome || '');

      setTelefone(saved.telefone || '');

      setCep(saved.cep || '');

      setCupom(saved.cupom || '');

    }

  }, [loadSavedClient]);



  const phoneAccount = useMemo(() => {

    const tel = telefone.replace(/\D/g, '');

    return tel.length >= 10 ? getCustomerByPhone(telefone) : null;

  }, [telefone]);



  const saldoPontos = isLoggedIn ? sessionPoints : (phoneAccount?.points ?? 0);



  const pontosAplicar = useMemo(() => {

    if (!usePoints || !shipping) return 0;

    return maxPontosResgate(saldoPontos, subtotal);

  }, [usePoints, shipping, saldoPontos, subtotal]);



  const descontoPontos = descontoReaisFromPontos(pontosAplicar);



  const totals = shipping

    ? orderTotals({

        subtotal,

        freight: shipping.freight,

        payment: payment === 'pix' ? 'pix' : 'card',

        pointsDiscountReais: descontoPontos

      })

    : null;



  useEffect(() => {

    if (saldoPontos <= 0) setUsePoints(false);

  }, [saldoPontos]);

  useEffect(() => {
    const digits = normalizeCep(cep);
    if (!digits || digits.length !== 8) return;
    const t = window.setTimeout(() => {
      handleCalculateFrete();
    }, 400);
    return () => window.clearTimeout(t);
  }, [cep, subtotal]);

  async function handleCalculateFrete(e) {
    if (e?.preventDefault) e.preventDefault();

    setErrors({});

    if (!normalizeCep(cep)) {

      setErrors({ cep: 'CEP deve ter 8 dígitos.' });

      return;

    }

    setLoading(true);

    setShipping(null);

    try {

      const result = await calculateShipping({

        cepDestino: cep,

        cartItems: items,

        subtotal

      });

      setShipping(result);

    } catch (err) {

      setErrors({ cep: err.message || 'Erro ao calcular frete.' });

    } finally {

      setLoading(false);

    }

  }



  function validate() {

    const next = {};

    if (!nome.trim()) next.nome = 'Informe seu nome.';

    const tel = telefone.replace(/\D/g, '');

    if (tel.length < 10) next.telefone = 'Informe um WhatsApp válido.';

    if (!normalizeCep(cep)) next.cep = 'CEP inválido.';

    if (shipping === null) next.frete = 'Calcule o frete antes de confirmar.';

    if (sanitizeCartItems(items).length === 0) next.carrinho = 'Carrinho inválido ou vazio.';

    if (usePoints && pontosAplicar > saldoPontos) {

      next.pontos = 'Saldo de pontos insuficiente.';

    }

    setErrors(next);

    return Object.keys(next).length === 0;

  }



  function handleSubmit(e) {

    e.preventDefault();

    if (!validate()) return;



    const secureItems = sanitizeCartItems(items);
    if (secureItems.length === 0) {
      setErrors({ carrinho: 'Atualize o carrinho e tente novamente.' });
      return;
    }

    const secureSubtotal = secureItems.reduce(
      (n, i) => n + (Number(i.price) || 0) * (i.quantity || 0),
      0
    );

    const client = {

      nome: sanitizeTextField(nome, 80),

      telefone: formatPhone(telefone),

      cep: formatCep(cep),

      cupom: sanitizeTextField(cupom, 40)

    };

    persistClient(client);



    const paidTotal = orderTotals({

      subtotal: secureSubtotal,

      freight: shipping.freight,

      payment: payment === 'pix' ? 'pix' : 'card',

      pointsDiscountReais: descontoPontos

    }).total;

    const account = registerCustomer({

      nome: client.nome,

      telefone: client.telefone,

      cep: client.cep

    });



    let recordResult;

    try {

      recordResult = recordOrder(account.id, {

        items: secureItems.map((i) => ({

          id: i.id,

          name: i.name,

          quantity: i.quantity,

          price: i.price,

          ref: i.ref || null

        })),

        subtotal: secureSubtotal,

        freight: shipping.freight,

        total: paidTotal,

        payment,

        address: shipping.address,

        pointsRedeemed: pontosAplicar,

        pointsDiscountReais: descontoPontos

      });

    } catch (err) {

      setErrors({ pontos: err.message || 'Não foi possível usar os pontos.' });

      return;

    }



    const { pointsEarned, customer: updated } = recordResult;

    refreshCustomer();

    setPointsNotice({ earned: pointsEarned, total: updated.points, used: pontosAplicar });



    const message = buildOrderWhatsAppMessage({

      client,

      address: shipping.address,

      items: secureItems,

      subtotal: secureSubtotal,

      freight: shipping.freight,

      payment,

      service: shipping.service,

      prazo: shipping.prazo,

      cupom: client.cupom,

      pointsRedeemed: pontosAplicar,

      pointsDiscountReais: descontoPontos

    });



    openWhatsapp({ phoneE164: WHATSAPP_PHONE, message });

    onSuccess?.({ pointsEarned, totalPoints: updated.points, pointsUsed: pontosAplicar });

  }



  return (

    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4" noValidate>

      <h2 className="text-xl font-bold">Finalizar pedido</h2>

      <p className="text-sm text-white/65">

        Pré-cadastro rápido. {FRETE_MENSAGEM_AREA} Frete grátis em pedidos a partir de{' '}

        {priceBRL(FRETE_GRATIS_MINIMO)} (SP). Frete calculado por região ao informar o CEP.

      </p>



      <div>

        <label htmlFor="checkout-nome" className="text-sm text-white/80">

          Nome completo *

        </label>

        <input

          id="checkout-nome"

          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"

          value={nome}

          onChange={(e) => setNome(e.target.value)}

          autoComplete="name"

        />

        {errors.nome ? <p className="text-xs text-red-400 mt-1">{errors.nome}</p> : null}

      </div>



      <div>

        <label htmlFor="checkout-tel" className="text-sm text-white/80">

          WhatsApp *

        </label>

        <input

          id="checkout-tel"

          type="tel"

          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"

          value={telefone}

          onChange={(e) => setTelefone(formatPhone(e.target.value))}

          placeholder="(11) 99999-9999"

          autoComplete="tel"

        />

        {errors.telefone ? <p className="text-xs text-red-400 mt-1">{errors.telefone}</p> : null}

      </div>



      <div>

        <label htmlFor="checkout-cep" className="text-sm text-white/80">

          CEP *

        </label>

        <div className="mt-1 flex flex-col sm:flex-row gap-2">

          <input

            id="checkout-cep"

            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"

            value={cep}

            onChange={(e) => setCep(formatCep(e.target.value))}

            placeholder="00000-000"

            maxLength={9}

            autoComplete="postal-code"

          />

          <button

            type="button"

            className="btn-secondary shrink-0"

            onClick={handleCalculateFrete}

            disabled={loading}

          >

            {loading ? (

              <>

                <Loader2 className="h-4 w-4 animate-spin inline mr-1" />

                Calculando…

              </>

            ) : (

              'Atualizar frete'

            )}

          </button>

        </div>

        {errors.cep ? <p className="text-xs text-red-400 mt-1">{errors.cep}</p> : null}

        {errors.frete ? <p className="text-xs text-red-400 mt-1">{errors.frete}</p> : null}

      </div>



      {shipping?.address ? (

        <p className="text-sm text-white/70">

          {shipping.address.bairro}, {shipping.address.localidade} - {shipping.address.uf}

          {shipping.regionLabel ? (
            <span className="text-purpleGlow-400"> · {shipping.regionLabel}</span>
          ) : null}

        </p>

      ) : null}



      {shipping && totals ? (

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm space-y-1">

          <p>

            <strong>Subtotal:</strong> {priceBRL(subtotal)}

          </p>

          <p>

            <strong>Frete:</strong>{' '}

            {shipping.freight === 0 ? 'Grátis' : priceBRL(shipping.freight)}

            {shipping.service ? ` (${shipping.service})` : ''}

          </p>

          {descontoPontos > 0 ? (

            <p className="text-purpleGlow-400">

              <strong>Desconto pontos:</strong> −{priceBRL(descontoPontos)} ({formatarPontos(pontosAplicar)}{' '}

              pts)

            </p>

          ) : null}

          {payment === 'pix' && totals.pixDiscount > 0 ? (

            <p>

              <strong>Desconto Pix ({PIX_DISCOUNT_PERCENT}%):</strong> −{priceBRL(totals.pixDiscount)}

            </p>

          ) : null}

          {shipping.prazo ? (

            <p className="text-white/60">Prazo estimado: {shipping.prazo} dia(s) útil(eis)</p>

          ) : null}

          <p className="text-lg font-bold text-purpleGlow-400 pt-1">

            Total: {priceBRL(totals.total)}

          </p>

          <p className="text-xs text-white/50 pt-1">{shipping.message}</p>

        </div>

      ) : null}



      {PONTOS_ATIVO && shipping && saldoPontos > 0 ? (

        <div className="rounded-xl border border-purpleGlow-500/25 bg-purpleGlow-500/10 p-4 space-y-2">

          <label className="flex items-start gap-3 cursor-pointer">

            <input

              type="checkbox"

              className="mt-1"

              checked={usePoints}

              onChange={(e) => setUsePoints(e.target.checked)}

            />

            <span className="text-sm text-white/85">

              <strong>Usar pontos neste pedido</strong>

              <span className="block text-white/60 mt-0.5">

                Saldo: {formatarPontos(saldoPontos)} pts

                {usePoints && pontosAplicar > 0

                  ? ` · desconto de ${priceBRL(descontoPontos)} (${formatarPontos(pontosAplicar)} pts no subtotal)`

                  : ` · até ${priceBRL(descontoReaisFromPontos(maxPontosResgate(saldoPontos, subtotal)))} no subtotal`}

              </span>

            </span>

          </label>

          <p className="text-xs text-white/45">

            {PONTOS_POR_REAL_RESGATE} pontos = R$ 1,00 de desconto nos produtos. O saldo aparece em Minha
            conta.

          </p>

          {errors.pontos ? <p className="text-xs text-red-400">{errors.pontos}</p> : null}

        </div>

      ) : null}



      <div>

        <label htmlFor="checkout-cupom" className="text-sm text-white/80">

          Cupom de desconto

        </label>

        <input

          id="checkout-cupom"

          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm uppercase"

          value={cupom}

          onChange={(e) => setCupom(e.target.value)}

          placeholder="Opcional"

          autoComplete="off"

        />

        <p className="text-xs text-white/45 mt-1">

          Se tiver cupom, informe aqui. O desconto é confirmado no WhatsApp.

        </p>

      </div>



      <fieldset className="space-y-2">

        <legend className="text-sm font-medium text-white/80">Forma de pagamento *</legend>

        <label className="flex items-center gap-2 text-sm cursor-pointer">

          <input

            type="radio"

            name="pagamento"

            value="pix"

            checked={payment === 'pix'}

            onChange={() => setPayment('pix')}

          />

          Pix ({PIX_DISCOUNT_PERCENT}% de desconto)

        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">

          <input

            type="radio"

            name="pagamento"

            value="card"

            checked={payment === 'card'}

            onChange={() => setPayment('card')}

          />

          Cartão de crédito

        </label>

      </fieldset>



      {PONTOS_ATIVO && pointsNotice ? (

        <p className="text-sm text-purpleGlow-400 text-center">

          {pointsNotice.used > 0 ? `${formatarPontos(pointsNotice.used)} pts usados · ` : ''}

          +{formatarPontos(pointsNotice.earned)} pts ganhos · saldo {formatarPontos(pointsNotice.total)}

        </p>

      ) : null}



      <button type="submit" className="btn-primary w-full">

        Confirmar pedido no WhatsApp

      </button>

      {PONTOS_ATIVO ? (
        <p className="text-xs text-white/45 text-center">
          Compras bonificadas: {pontosPorRealAtual()} pontos por real gasto. Saldo em Minha conta.
        </p>
      ) : null}

    </form>

  );

}


