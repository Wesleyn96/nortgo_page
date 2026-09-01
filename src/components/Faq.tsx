const faqs = [
  {
    q: "O NortGo substitui meu calendário e minha lista de tarefas?",
    a: "Essa é a proposta: reunir num único lugar o que hoje fica espalhado entre calendário, apps de tarefas e notas soltas.",
  },
  {
    q: "Preciso organizar as informações que eu colocar?",
    a: "Não. Você só registra o que precisa lembrar, do jeito que pensou. O NortGo é quem decide o que mostrar e quando, com base em prazo, rotina e prioridade.",
  },
  {
    q: "Quando o NortGo é lançado?",
    a: "O NortGo está nos ajustes finais para o lançamento. Quem entra na lista de espera recebe o convite de acesso antecipado antes da abertura pública na Web, App Store e Google Play.",
  },
  {
    q: "Vai ser pago?",
    a: "O plano de preços ainda está sendo fechado. A intenção é ter uma versão gratuita para começar e uma versão paga mais completa, com pagamento via Mercado Pago. Quem entrar na lista de espera garante uma condição especial de lançamento.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Levamos isso a sério. Este site usa conexão criptografada (HTTPS) e hoje coleta apenas o seu e-mail para avisar do lançamento — nada de senha ou dados de pagamento. O tratamento completo dos seus dados dentro do app será detalhado na Política de Privacidade e nos Termos de Uso antes do lançamento. Não vendemos nem compartilhamos seus dados com terceiros para publicidade.",
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
