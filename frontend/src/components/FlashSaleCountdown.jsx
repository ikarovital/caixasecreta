import { useEffect, useState } from 'react';



function pad(n) {

  return String(n).padStart(2, '0');

}



export function FlashSaleCountdown({ endsAt }) {

  const [left, setLeft] = useState(() => Math.max(0, endsAt - Date.now()));



  useEffect(() => {

    const tick = () => setLeft(Math.max(0, endsAt - Date.now()));

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);

  }, [endsAt]);



  const h = Math.floor(left / 3600000);

  const m = Math.floor((left % 3600000) / 60000);

  const s = Math.floor((left % 60000) / 1000);



  const blocks = [

    { label: 'h', value: pad(h) },

    { label: 'm', value: pad(m) },

    { label: 's', value: pad(s) }

  ];



  return (

    <div className="flex items-center gap-1.5" aria-live="polite" aria-label="Tempo restante da oferta">

      {blocks.map((b, i) => (

        <span key={b.label} className="flex items-center gap-1.5">

          <span className="flex flex-col items-center">

            <span className="min-w-[2.25rem] rounded-md bg-brand-900/80 border border-white/15 text-white text-sm font-bold py-1 px-1.5 tabular-nums">

              {b.value}

            </span>

            <span className="text-[9px] text-white/45 uppercase mt-0.5">{b.label}</span>

          </span>

          {i < blocks.length - 1 ? (

            <span className="text-white/60 font-bold pb-3" aria-hidden>

              :

            </span>

          ) : null}

        </span>

      ))}

    </div>

  );

}


