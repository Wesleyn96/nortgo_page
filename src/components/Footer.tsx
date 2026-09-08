import Link from "next/link";

// Rodapé enxuto para a tela de entrada: só a identificação e os links
// obrigatórios (Privacidade e Termos — requisitos LGPD/CDC, §10 do
// docs/PROJETO.md — e um canal de contato). Deixado bem discreto (baixa
// opacidade) e menor no mobile para não competir com a tela de entrada.
// Identificação e links lado a lado em qualquer largura.
// A versão longa da landing está no histórico do git.
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-5 py-3.5 opacity-70 sm:gap-2 sm:px-6 sm:py-4">
        <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint sm:text-[11px] sm:tracking-[0.14em]">
          © {new Date().getFullYear()} NortGo
        </span>
        <nav className="flex items-center gap-2.5 sm:gap-4">
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
