import { Link } from 'react-router-dom';
import { categorySections, WHATSAPP_PHONE } from '../data/catalog.js';
import { FLASH_SALE_ATIVA, SHOP_NAME } from '../data/brand.js';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="container-page grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-sm text-white/60">
        <div>
          <div className="font-semibold text-white">{SHOP_NAME}</div>
          <p className="mt-2 text-white/60">Lingerie e produtos íntimos com discrição.</p>
        </div>
        <div>
          <div className="font-semibold text-white mb-2">Categorias</div>
          <div className="flex flex-col gap-1">
            {categorySections.map((c) => (
              <Link key={c.id} to={`/${c.id}`} className="hover:text-white">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            WhatsApp (11) 91853-5361
          </a>
          <Link to="/carrinho" className="hover:text-white">
            Carrinho
          </Link>
          {FLASH_SALE_ATIVA ? (
            <Link to="/#ofertas" className="hover:text-white">
              Ofertas
            </Link>
          ) : null}
          <Link to="/termos" className="hover:text-white">
            Termos e Condições
          </Link>
          <Link to="/" className="hover:text-white">
            Voltar ao início
          </Link>
        </div>
      </div>
    </footer>
  );
}
