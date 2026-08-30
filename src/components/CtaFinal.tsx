import Waitlist from "@/components/Waitlist";

export default function CtaFinal() {
  return (
    <section id="lista-de-espera">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
        <p className="eyebrow text-copper-ink">Lançamento em breve</p>
        <h2 className="section-title mt-4">Reserve seu lugar na clareza</h2>
        <p className="lead mx-auto mt-4 max-w-md text-ink-dim">
          Deixe seu e-mail e seja avisado assim que o NortGo abrir as
          primeiras vagas de acesso antecipado.
        </p>

        <div className="mt-9">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}
