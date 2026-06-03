import { Link } from 'react-router-dom';
import { ArrowRight, Package, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { categories, faq } from '../data/catalog.js';
import { assetUrl } from '../lib/catalog-ui.js';
import { FlashSaleSection } from '../components/FlashSaleSection.jsx';
import { Section } from '../components/Section.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { SHOP_NAME, SHOP_TAGLINE } from '../data/brand.js';

export function HomePage() {
  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-center lg:text-left flex flex-col justify-center">
              <h1 className="font-extrabold text-2xl sm:text-4xl lg:text-[2.75rem] leading-tight tracking-tight text-white">
                {SHOP_TAGLINE}.{' '}
                <span className="text-purpleGlow-400">Escolha uma categoria no menu.</span>
              </h1>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="glass rounded-[2rem] overflow-hidden flex items-center justify-center bg-brand-900/50 min-h-[16rem] sm:min-h-[26rem]">
                <img
                  alt={SHOP_NAME}
                  className="h-64 sm:h-[420px] w-full object-contain object-center"
                  src={assetUrl('/imagens/Mysterious Cinematic Digital Banner.png')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FlashSaleSection />

      <Section title="Escolha uma categoria" subtitle="Cada menu abre uma página dedicada.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/${c.id}`}
              className="glass rounded-2xl overflow-hidden hover:shadow-glow hover:bg-white/10 transition group flex flex-col"
            >
              <div className="h-36 bg-brand-900/50 flex items-center justify-center p-3 border-b border-white/10">
                {c.previewImage ? (
                  <img
                    src={assetUrl(c.previewImage)}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs text-white/40">Sem prévia</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-lg font-semibold group-hover:text-purpleGlow-500 transition">{c.title}</div>
                <p className="mt-2 text-sm text-white/70 line-clamp-2">{c.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/80">
                  Abrir página <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Compre com segurança" className="border-y border-white/5 bg-brand-850/35">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Entrega discreta', desc: 'Embalagem neutra.' },
            { icon: ShieldCheck, title: 'Pagamento seguro', desc: 'Privacidade total.' },
            { icon: Package, title: 'Envio rápido', desc: 'Postagem ágil.' },
            { icon: Sparkles, title: 'Atendimento', desc: 'Equipe especializada.' }
          ].map((b) => (
            <div key={b.title} className="glass rounded-2xl p-4">
              <b.icon className="h-5 w-5 text-purpleGlow-500" />
              <div className="mt-3 font-semibold">{b.title}</div>
              <p className="mt-1 text-sm text-white/70">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Dúvidas frequentes">
        <FAQ items={faq} />
      </Section>
    </>
  );
}
