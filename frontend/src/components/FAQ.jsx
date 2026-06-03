import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <button
            key={it.q}
            type="button"
            onClick={() => setOpen(isOpen ? -1 : idx)}
            className="w-full text-left glass rounded-2xl p-4 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">{it.q}</div>
              <ChevronDown className={`h-5 w-5 text-white/70 transition ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen ? <div className="mt-3 text-white/70 leading-relaxed">{it.a}</div> : null}
          </button>
        );
      })}
    </div>
  );
}

