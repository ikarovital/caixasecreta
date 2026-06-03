import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categorySections, productsByCategory } from '../data/catalog.js';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { ProductSortSelect } from '../components/ProductSortSelect.jsx';
import { Section } from '../components/Section.jsx';
import { buildOrderIndex, DEFAULT_SORT, sortProducts } from '../lib/sort-products.js';

export function CategoryPage({ allowedIds }) {
  const { categorySlug } = useParams();
  const slug = categorySlug?.trim();
  const isKnown = slug && (!allowedIds || allowedIds.has(slug));
  const section = isKnown ? categorySections.find((c) => c.id === slug) : null;
  const products = isKnown ? productsByCategory(slug) : [];
  const [sort, setSort] = useState(DEFAULT_SORT);

  const orderIndex = useMemo(() => buildOrderIndex(products), [products]);
  const sortedProducts = useMemo(
    () => sortProducts(products, sort, orderIndex),
    [products, sort, orderIndex]
  );

  if (!section) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container-page">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>

      <Section
        title={section.title}
        subtitle={section.subtitle}
        className="pt-4 pb-10 sm:pb-14"
      >
        <div className="mb-6 flex justify-end">
          <ProductSortSelect value={sort} onChange={setSort} />
        </div>
        <ProductGrid products={sortedProducts} categoryTitle={section.title} />
      </Section>
    </div>
  );
}
