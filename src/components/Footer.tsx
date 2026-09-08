import Link from "next/link";

// Rodapé enxuto para a tela de entrada: só a identificação e os links
// obrigatórios (Privacidade e Termos — requisitos LGPD/CDC, §10 do
// docs/PROJETO.md — e um canal de contato). Deixado bem discreto (baixa
// opacidade) e menor no mobile para não competir com a tela de entrada.
// A versão longa da landing está no histórico do git.
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-1.5 px-6 py-3.5 text-center opacity-70 sm:flex-row sm:justify-between sm:gap-2 sm:py-4 sm:text-left">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint sm:text-[11px]">
          © {new Date().getFullYear()} NortGo
        </span>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/termos"
            className="text-[10px] text-ink-faint transition-colors hover:text-ink-dim sm:text-[12px]"
          >
            Termos
          </Link>
          <Link
            href="/privacidade"
            className="text-[10px] text-ink-faint transition-colors hover:text-ink-dim sm:text-[12px]"
          >
            Privacidade
          </Link>
          <a
            href="mailto:contato@nortgo.com"
            className="text-[10px] text-ink-faint transition-colors hover:text-ink-dim sm:text-[12px]"
          >
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
