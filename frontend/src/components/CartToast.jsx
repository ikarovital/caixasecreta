import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl } from '../lib/catalog-ui.js';

export function CartToast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] max-w-sm glass rounded-2xl p-4 shadow-glow border border-purpleGlow-500/30 animate-in"
      role="status"
    >
      <div className="flex gap-3">
        <div className="h-14 w-14 rounded-xl bg-brand-900/50 flex items-center justify-center shrink-0">
          {toast.image ? (
            <img src={assetUrl(toast.image)} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <Check className="h-6 w-6 text-purpleGlow-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-purpleGlow-400 font-medium uppercase">Adicionado ao carrinho</p>
          <p className="text-sm font-medium line-clamp-2">{toast.name}</p>
          <div className="mt-2 flex gap-2">
            <Link to="/carrinho" className="text-xs btn-primary py-1.5 px-3" onClick={dismissToast}>
              Ver carrinho
            </Link>
            <button type="button" className="text-xs text-white/60 hover:text-white" onClick={dismissToast}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
