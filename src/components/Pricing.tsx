const plans = [
  {
    name: "Essencial",
    price: "Grátis",
    period: "",
    body: "Para começar a tirar tudo da cabeça.",
    features: [
      "Rotina, tarefas e compromissos",
      "Uma tela por dia",
      "Sincronização em 1 dispositivo",
    ],
    featured: false,
  },
  {
    name: "NortGo Plus",
    price: "A definir",
    period: "/mês",
    body: "Para quem quer o filtro completo, todo dia.",
    features: [
      "Tudo do Essencial",
      "Notas e decisões ilimitadas",
      "Sincronização em todos os dispositivos",
      "Prioridades ajustadas por IA",
    ],
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="planos">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-14 max-w-xl">
          <p className="eyebrow text-copper-ink">Planos</p>
          <h2 className="section-title mt-4">Preços ainda em definição</h2>
          <p className="lead mt-4 text-ink-dim">
            O NortGo está em desenvolvimento. Quem entrar na lista de espera
            agora garante condição especial de lançamento, com pagamento via
            Mercado Pago, direto pelo app, quando o NortGo estiver no ar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-copper/40 bg-copper-wash shadow-card"
                  : "border-line bg-bg-raised shadow-card"
              }`}
            >
              <h3 className="sub-heading">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-800 text-ink">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-ink-faint">{plan.period}</span>
                )}
              </p>
              <p className="mt-2 text-base text-ink-dim">{plan.body}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-base text-ink-dim">
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#lista-de-espera"
                className={`eyebrow mt-8 rounded-full px-5 py-3 text-center transition-colors ${
                  plan.featured
                    ? "bg-copper-deep text-white hover:bg-copper"
                    : "border border-line-strong text-ink hover:border-copper hover:text-copper-ink"
                }`}
              >
                Garantir vaga na lista
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
