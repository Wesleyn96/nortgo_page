import Link from "next/link";

// Link "voltar ao início" no topo das páginas de Termos e Privacidade.
// Seta de linha (mesmo estilo dos ícones da tela de entrada), que desliza
// um pouco para a esquerda no hover.
export default function BackLink() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim transition-colors hover:text-ink"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      Voltar ao início
    </Link>
  );
}
