export function Section({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`py-12 min-[390px]:py-14 sm:py-16 ${className}`}>
      <div className="container-page">
        {title ? (
          <div className="mb-6 min-[390px]:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-white/70 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

