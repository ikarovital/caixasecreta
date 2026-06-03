import { ChevronDown } from 'lucide-react';
import { DEFAULT_SORT, SORT_OPTIONS } from '../lib/sort-products.js';

export function ProductSortSelect({ value = DEFAULT_SORT, onChange, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 ${className}`}>
      <label htmlFor="product-sort" className="text-sm text-white/70 shrink-0">
        Ordenar por
      </label>
      <div className="relative w-full sm:w-auto sm:min-w-[220px]">
        <select
          id="product-sort"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/20 bg-white text-brand-900 text-sm font-medium py-2.5 pl-3 pr-10 shadow-sm cursor-pointer hover:border-purpleGlow-500/40 focus:outline-none focus:ring-2 focus:ring-purpleGlow-500/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-900/70"
          aria-hidden
        />
      </div>
    </div>
  );
}
