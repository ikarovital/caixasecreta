import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { catalogProducts } from '../data/catalog.js';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { ProductSortSelect } from '../components/ProductSortSelect.jsx';
import { Section } from '../components/Section.jsx';
import { buildOrderIndex, DEFAULT_SORT, sortProducts } from '../lib/sort-products.js';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();

  const [sort, setSort] = useState(DEFAULT_SORT);

  const results = useMemo(() => {
    if (!q) return [];
    const s = q.toLowerCase();
    return catalogProducts.filter((p) => {
      const hay = [p.name, p.ref, p.description, p.category, p.categorySlug].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(s);
    });
  }, [q]);

  const orderIndex = useMemo(() => buildOrderIndex(results), [results]);
  const sortedResults = useMemo(
    () => sortProducts(results, sort, orderIndex),
    [results, sort, orderIndex]
  );

  return (
    <Section
      title="Busca"
      subtitle={q ? `"${q}" · ${results.length} resultado(s)` : 'Digite no campo de busca do topo'}
      className="py-10 sm:py-14"
    >
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao início
      </Link>
      {q ? (
        <>
          <div className="mb-6 flex justify-end">
            <ProductSortSelect value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={sortedResults} categoryTitle="Busca" />
        </>
      ) : null}
    </Section>
  );
}
