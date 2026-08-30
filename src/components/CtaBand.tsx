import Waitlist from "@/components/Waitlist";
import WaitlistProof from "@/components/WaitlistProof";

// CTA intermediário — quebra o vão longo entre o hero e o CtaFinal.
// Mais discreto que o CtaFinal de propósito: uma faixa, não uma seção
// de fechamento. Entra no meio da página (depois de "Como funciona").
export default function CtaBand() {
  return (
    <section
      aria-label="Entrar na lista de espera"
      className="bg-bg-secondary"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-sm">
          <h2 className="sub-heading">
            Convencido de que sua cabeça merece{" "}
            <span className="text-grad">descanso</span>?
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-dim">
            Entre na lista e receba o acesso antecipado antes do lançamento
            público.
          </p>
        </div>

        <div className="w-full md:max-w-sm" data-track="midpage-cta">
          <Waitlist variant="compact" />
          <WaitlistProof className="mt-3" />
        </div>
      </div>
    </section>
  );
}
