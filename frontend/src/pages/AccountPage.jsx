import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gift, LogOut, Package, Star, User } from 'lucide-react';
import { useCustomer } from '../context/CustomerContext.jsx';
import {
  BONUS_FIRST_ORDER,
  CAMPANHA_PONTOS,
  describePointsRule,
  formatarPontos,
  PONTOS_ATIVO,
  pontosParaValorEmReais,
  pontosPorRealAtual
} from '../data/points-config.js';
import { formatCep, normalizeCep } from '../lib/shipping.js';
import { priceBRL } from '../lib/catalog-ui.js';
import { SHOP_NAME } from '../data/brand.js';

function formatPhone(value) {
  const d = String(value).replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AuthForm({ mode: initialMode }) {
  const { register, login } = useCustomer();
  const [mode, setMode] = useState(initialMode);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        login(telefone);
      } else {
        register({ nome, telefone, cep: formatCep(cep), email });
      }
    } catch (err) {
      setError(err.message || 'Não foi possível continuar.');
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 max-w-md mx-auto space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === 'login' ? 'bg-purpleGlow-500/30 text-white' : 'bg-white/5 text-white/70'}`}
          onClick={() => setMode('login')}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === 'register' ? 'bg-purpleGlow-500/30 text-white' : 'bg-white/5 text-white/70'}`}
          onClick={() => setMode('register')}
        >
          Cadastrar
        </button>
      </div>

      {mode === 'register' ? (
        <div>
          <label className="text-sm text-white/80">Nome completo *</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
      ) : null}

      <div>
        <label className="text-sm text-white/80">WhatsApp *</label>
        <input
          type="tel"
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
          value={telefone}
          onChange={(e) => setTelefone(formatPhone(e.target.value))}
          placeholder="(11) 99999-9999"
          required
        />
      </div>

      {mode === 'register' ? (
        <>
          <div>
            <label className="text-sm text-white/80">CEP</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              placeholder="00000-000"
            />
          </div>
          <div>
            <label className="text-sm text-white/80">E-mail (opcional)</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button type="submit" className="btn-primary w-full">
        {mode === 'login' ? 'Entrar na minha conta' : 'Criar cadastro'}
      </button>

      {PONTOS_ATIVO ? (
        <p className="text-xs text-white/50 text-center">{describePointsRule()}</p>
      ) : null}
    </form>
  );
}

function ProfilePanel() {
  const { customer, points, orders, logout, updateProfile } = useCustomer();
  const [nome, setNome] = useState(customer?.nome || '');
  const [cep, setCep] = useState(customer?.cep || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [saved, setSaved] = useState(false);

  if (!customer) return null;

  function saveProfile(e) {
    e.preventDefault();
    updateProfile({
      nome,
      cep: normalizeCep(cep) ? formatCep(cep) : cep,
      email
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-8">
      <div className={`grid gap-4 ${PONTOS_ATIVO ? 'sm:grid-cols-2' : ''}`}>
        {PONTOS_ATIVO ? (
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-purpleGlow-500/20 flex items-center justify-center">
              <Star className="h-7 w-7 text-purpleGlow-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Seus pontos</p>
              <p className="text-3xl font-extrabold text-purpleGlow-400">{points}</p>
              <p className="text-xs text-white/50 mt-1">{describePointsRule()}</p>
            </div>
          </div>
        ) : null}
        <div className="glass rounded-2xl p-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <Package className="h-7 w-7 text-white/70" />
          </div>
          <div>
            <p className="text-sm text-white/60">Pedidos no histórico</p>
            <p className="text-3xl font-extrabold">{orders.length}</p>
            <p className="text-xs text-white/50 mt-1">Salvos neste navegador</p>
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-purpleGlow-500" />
          Meu cadastro
        </h2>
        <p className="text-sm text-white/60">
          WhatsApp: <strong className="text-white">{formatPhone(customer.telefone)}</strong>
        </p>
        <div>
          <label className="text-sm text-white/80">Nome</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-white/80">CEP</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm text-white/80">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {saved ? <p className="text-sm text-green-400">Dados salvos.</p> : null}
        <button type="submit" className="btn-secondary">Salvar alterações</button>
      </form>

      {PONTOS_ATIVO ? (
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-purpleGlow-500" />
            Como ganhar pontos
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            <strong>Compras bonificadas:</strong> a cada pedido confirmado pelo WhatsApp você acumula pontos na
            sua <strong>conta {SHOP_NAME}</strong>.
          </p>
          {CAMPANHA_PONTOS.ativa ? (
            <div className="rounded-xl border border-purpleGlow-500/30 bg-purpleGlow-500/10 p-4 text-sm">
              <p className="font-semibold text-purpleGlow-400">{CAMPANHA_PONTOS.nome}</p>
              <p className="mt-2 text-white/80">
                A cada <strong>R$ 1,00</strong> do seu pedido (total com frete, valor final no Pix ou
                cartão), você ganha <strong>{pontosPorRealAtual()} pontos</strong>.
              </p>
            </div>
          ) : null}
          <ul className="text-sm text-white/75 space-y-3 list-disc pl-5">
            <li>
              <strong>Como funciona aqui:</strong> finalize o pedido no carrinho → os pontos entram em Minha
              conta. No checkout você pode usar o saldo para desconto nos produtos.
            </li>
            <li>
              <strong>Exemplo prático (campanha {pontosPorRealAtual()} pts por real):</strong> um pedido de{' '}
              <strong>R$ 300,00</strong> gera <strong>{formatarPontos(pontosParaValorEmReais(300))} pontos</strong>{' '}
              (R$ 300 × {pontosPorRealAtual()}), somados à sua conta.
            </li>
            <li>
              <strong>Outro exemplo:</strong> pedido de <strong>R$ 89,90</strong> →{' '}
              <strong>{formatarPontos(pontosParaValorEmReais(89.9))} pontos</strong>.
            </li>
            <li>
              <strong>Primeira compra:</strong> +{formatarPontos(BONUS_FIRST_ORDER)} pontos bônus além dos
              pontos do pedido.
            </li>
          </ul>
          <p className="text-xs text-white/45">{describePointsRule()}</p>
        </section>
      ) : null}

      <section>
        <h2 className="font-bold text-lg mb-4">Histórico de pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-white/60 text-sm">Nenhum pedido ainda. Finalize uma compra pelo carrinho.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <article key={o.id} className="glass rounded-2xl p-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">{formatDate(o.date)}</span>
                  {PONTOS_ATIVO && o.pointsEarned > 0 ? (
                    <span className="text-purpleGlow-400 font-semibold">+{o.pointsEarned} pts</span>
                  ) : null}
                </div>
                <p className="text-white/70 mt-1">
                  Total {priceBRL(o.total)} · {o.payment === 'pix' ? 'Pix' : 'Cartão'}
                  {PONTOS_ATIVO && o.bonusFirstOrder ? ` · bônus 1ª compra +${o.bonusFirstOrder}` : ''}
                </p>
                <ul className="mt-2 text-white/55 space-y-0.5">
                  {(o.items || []).map((it, idx) => (
                    <li key={idx}>
                      {it.quantity}x {it.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <button type="button" className="btn-secondary inline-flex items-center gap-2" onClick={logout}>
        <LogOut className="h-4 w-4" />
        Sair da conta
      </button>
    </div>
  );
}

export function AccountPage() {
  const { isLoggedIn, customer } = useCustomer();

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold flex items-center gap-3">
          <User className="h-8 w-8 text-purpleGlow-500" />
          Minha conta
        </h1>
        <p className="mt-2 text-white/65 text-sm">
          O ícone de perfil no topo leva aqui. Cadastro e histórico de pedidos.
        </p>

        <div className="mt-8">
          {isLoggedIn && customer ? (
            <ProfilePanel />
          ) : (
            <AuthForm mode="register" />
          )}
        </div>
      </div>
    </div>
  );
}
