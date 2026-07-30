export function PartnerLogos() {
  const PARTNERS = [
    'TechKids Africa',
    'Google for Education',
    'STEM Hub',
    'Paystack Ecosystem',
    'Future Labs',
  ];

  return (
    <section className="py-10 border-y border-zinc-800/60 bg-zinc-950/40">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
          Trusted by Mentors & Partners From Top Tech Organizations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
          {PARTNERS.map((partner, index) => (
            <span key={index} className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-300 hover:text-emerald-400 transition-colors">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}