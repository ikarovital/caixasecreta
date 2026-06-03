import catalogoLingerie from './catalogo-lingerie.json';
import catalogoImportado from './catalogo-importado.json';
import { FLASH_SALE_ATIVA } from './brand.js';
import { isPublished, isActive, isVisibleOnSite, publishedProducts } from '../lib/catalog-publish.js';

export const WHATSAPP_PHONE = '5511918535361';

/** Catálogo completo (inclui ocultos) — curadoria / scripts */
export const catalogAllProducts = [...catalogoLingerie, ...catalogoImportado];

/** Apenas produtos publicados (listagens, busca, promoções) */
export const catalogProducts = publishedProducts(catalogAllProducts);

export { isPublished, isActive, isVisibleOnSite };

const CATEGORY_META = {
  calcinhas: {
    title: 'Calcinhas',
    subtitle: 'Tamanhos e cores — frente e verso.'
  },
  lingeries: {
    title: 'Lingeries',
    subtitle: 'Conjuntos e lingeries — tamanhos e cores.'
  },
  camisolas: {
    title: 'Camisolas',
    subtitle: 'Camisolas sensuais — consulte tamanhos no detalhe.'
  },
  espartilhos: {
    title: 'Espartilhos',
    subtitle: 'Frente e verso — várias cores.'
  },
  comestiveis: {
    title: 'Comestíveis',
    subtitle: 'Gel, balas e itens comestíveis — sabores e tamanhos no detalhe.'
  },
  cosmeticos: {
    title: 'Cosméticos',
    subtitle: 'Cosméticos e velas — preços do catálogo.'
  },
  vibradores: {
    title: 'Vibradores',
    subtitle: 'Vibradores e masturbadores femininos.'
  },
  proteses: {
    title: 'Próteses',
    subtitle: 'Próteses e acessórios — valores no catálogo.'
  },
  acessorios: {
    title: 'Acessórios',
    subtitle: 'Plugs, pompoarismo e acessórios variados.'
  },
  sado: {
    title: 'Fetiche e Sado',
    subtitle: 'Itens BDSM e fetiche.'
  }
};

/** Slugs que entram juntos na mesma página de categoria */
const CATEGORY_INCLUDES = {
  comestiveis: ['comestiveis', 'sex-shop']
};

const CATEGORY_ORDER = [
  'calcinhas',
  'lingeries',
  'camisolas',
  'espartilhos',
  'comestiveis',
  'cosmeticos',
  'vibradores',
  'proteses',
  'acessorios',
  'sado'
];

/** Categorias que permanecem no menu mesmo sem produtos publicados */
const MENU_ALWAYS_VISIBLE = ['calcinhas'];

function slugsPresentes() {
  const set = new Set(catalogProducts.map((p) => p.categorySlug).filter(Boolean));
  MENU_ALWAYS_VISIBLE.forEach((s) => set.add(s));
  for (const [main, extras] of Object.entries(CATEGORY_INCLUDES)) {
    if (extras.some((s) => set.has(s))) set.add(main);
    extras.forEach((s) => {
      if (s !== main) set.delete(s);
    });
  }
  const ordered = CATEGORY_ORDER.filter((s) => set.has(s));
  const rest = [...set].filter((s) => !ordered.includes(s)).sort();
  return [...ordered, ...rest];
}

export const categorySections = slugsPresentes().map((id) => {
  const meta = CATEGORY_META[id] || {
    title: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: 'Catálogo atualizado.'
  };
  return { id, title: meta.title, subtitle: meta.subtitle };
});

export const menuItems = [
  { label: 'Início', to: '/' },
  ...(FLASH_SALE_ATIVA ? [{ label: 'Ofertas', to: '/#ofertas' }] : []),
  { label: 'Carrinho', to: '/carrinho' },
  ...categorySections.map((c) => ({ label: c.title, to: `/${c.id}` })),
  { label: 'Termos', to: '/termos' }
];

export function productsByCategory(slug) {
  const slugs = CATEGORY_INCLUDES[slug] ?? [slug];
  return catalogProducts.filter((p) => slugs.includes(p.categorySlug));
}

export const categories = categorySections.map((c) => {
  const list = productsByCategory(c.id);
  const preview = list.find((p) => p.image);
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    count: list.length,
    previewImage: preview?.image ?? null,
    withImage: list.filter((p) => p.image).length
  };
});

export const testimonials = [
  { id: 't1', name: 'Juliana S.', city: 'São Paulo - SP', stars: 5, text: 'Chegou rápido e super discreto. Atendimento excelente.' },
  { id: 't2', name: 'Carlos e Diego', city: 'Campinas - SP', stars: 5, text: 'Qualidade acima do esperado. Embalagem perfeita.' },
  { id: 't3', name: 'Beatriz M.', city: 'Santos - SP', stars: 4, text: 'Site bonito e fácil de usar. Recomendo.' }
];

export const instagramImages = catalogProducts
  .filter((p) => p.image)
  .slice(0, 8)
  .map((p, i) => ({ id: `ig-${i}`, image: p.image, name: p.name }));

export const faq = [
  { q: 'Como funciona a entrega discreta?', a: 'Enviamos em embalagem neutra, sem identificação do conteúdo. Sigilo total.' },
  { q: 'Os preços são de atacado?', a: 'Valores do catálogo; confirme no WhatsApp.' },
  { q: 'Posso trocar um produto?', a: 'Itens íntimos abertos não podem ser trocados, exceto defeito.' }
];
