import {
  WAITLIST_COUNT,
  formatWaitlistProof,
} from "@/lib/waitlist";

// Linha de prova social exibida logo abaixo dos CTAs de captura.
// Todo o texto vem de formatWaitlistProof() (src/lib/waitlist.ts) — se
// aquela função retornar null, nada é renderizado.
export default function WaitlistProof({
  className = "",
}: {
  className?: string;
}) {
  const label = formatWaitlistProof(WAITLIST_COUNT);
  if (!label) return null;

  return (
    <p className={`eyebrow text-center text-ink-faint ${className}`}>{label}</p>
  );
}
