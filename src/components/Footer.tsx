import Link from "next/link";

// Rodapé enxuto para a tela de entrada: só a identificação e os links
// obrigatórios (Privacidade e Termos — requisitos LGPD/CDC, §10 do
// docs/PROJETO.md — e um canal de contato). A versão longa da landing está
// no histórico do git.
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="eyebrow text-ink-faint">
          © {new Date().getFullYear()} NortGo
        </span>
        <nav className="flex items-center gap-4">
          <Link
            href="/termos"
            className="text-[13px] text-ink-dim transition-colors hover:text-ink"
          >
            Termos
          </Link>
          <Link
            href="/privacidade"
            className="text-[13px] text-ink-dim transition-colors hover:text-ink"
          >
            Privacidade
          </Link>
          <a
            href="mailto:contato@nortgo.com"
            className="text-[13px] text-ink-dim transition-colors hover:text-ink"
          >
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
