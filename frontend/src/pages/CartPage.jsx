import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { CheckoutForm } from '../components/CheckoutForm.jsx';
import { FLASH_SALE_ATIVA } from '../data/brand.js';
import { assetUrl, priceBRL } from '../lib/catalog-ui.js';

export function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, count, removeItem, setQuantity, clearCart } = useCart();

  if (count === 0) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold">Carrinho</h1>
        <p className="mt-4 text-white/60">Seu carrinho está vazio.</p>
        <Link to={FLASH_SALE_ATIVA ? '/#ofertas' : '/'} className="btn-primary mt-8 inline-flex">
          {FLASH_SALE_ATIVA ? 'Ver ofertas' : 'Ver produtos'}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container-page">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold">Carrinho ({count})</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="glass rounded-2xl p-4 flex gap-4">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-brand-900/50 flex items-center justify-center p-1">
                  {item.image ? (
                    <img
                      src={assetUrl(item.image)}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-sm leading-snug line-clamp-2">{item.name}</h2>
                  {item.ref ? (
                    <p className="text-xs text-white/50 mt-0.5">Ref. {item.ref}</p>
                  ) : null}
                  <p className="text-sm text-purpleGlow-400 mt-1">{priceBRL(item.price)} un.</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-lg border border-white/10">
                      <button
                        type="button"
                        className="p-2 hover:bg-white/10"
                        aria-label="Diminuir"
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.id)
                            : setQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        className="p-2 hover:bg-white/10"
                        aria-label="Aumentar"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold shrink-0">
                  {priceBRL(item.price * item.quantity)}
                </div>
              </article>
            ))}

            <div className="flex justify-between items-center text-sm">
              <button type="button" className="text-white/50 hover:text-white" onClick={clearCart}>
                Esvaziar carrinho
              </button>
              <p>
                <strong>Subtotal:</strong> {priceBRL(subtotal)}
              </p>
            </div>
          </div>

          <CheckoutForm
            onSuccess={() => {
              clearCart();
              navigate('/conta');
            }}
          />
        </div>
      </div>
    </div>
  );
}
