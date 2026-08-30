const faqs = [
  {
    q: "O NortGo substitui meu calendário e minha lista de tarefas?",
    a: "Sim. Ele reúne o que hoje fica espalhado entre calendário, apps de tarefas e notas soltas, e organiza tudo num único lugar, sem que você precise migrar nada manualmente no dia do lançamento.",
  },
  {
    q: "Preciso organizar as informações que eu colocar?",
    a: "Não. Você só registra o que precisa lembrar, do jeito que pensou. O NortGo é quem decide o que mostrar e quando, com base em prazo, rotina e prioridade.",
  },
  {
    q: "Quando o NortGo é lançado?",
    a: "Estamos em desenvolvimento ativo. Quem entra na lista de espera recebe o convite de acesso antecipado antes do lançamento público na Web, App Store e Google Play.",
  },
  {
    q: "Vai ser pago?",
    a: "Haverá um plano essencial gratuito e um plano completo pago, com pagamento via Mercado Pago direto pelo app. Quem entrar na lista de espera garante uma condição especial de lançamento.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Suas informações são tratadas com criptografia em trânsito e acesso restrito, seguindo a nossa Política de Privacidade. Nunca vendemos ou compartilhamos seus dados com terceiros para publicidade.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Faq() {
  return (
    <section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow text-copper-ink">Perguntas frequentes</p>
          <h2 className="section-title mt-4">
            Antes de <span className="text-grad">entrar na lista</span>
          </h2>
        </div>

        <div className="mt-12 flex flex-col divide-y divide-line border-t border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-600 text-ink marker:content-none">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-copper-ink transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-dim">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
