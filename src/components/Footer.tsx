import Image from "next/image";
import Link from "next/link";
import icon from "../../public/brand/nortgo-icon.png";
import appStore from "../../public/brand/app-store.svg";
import googlePlay from "../../public/brand/google-play.svg";

// Redes sociais do NortGo. Preencha `href` com a URL real do perfil —
// entradas com href vazio não são renderizadas. `label` vira o aria-label.
const socials: { label: string; href: string; icon: "instagram" | "x" | "github" }[] = [
  { label: "Instagram", href: "", icon: "instagram" },
  { label: "X (Twitter)", href: "", icon: "x" },
];

const socialPaths: Record<(typeof socials)[number]["icon"], string> = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 12 18.75 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 12 7.62a4.38 4.38 0 0 1 0 8.76Zm6.9-11.4a1.58 1.58 0 1 1-3.15 0 1.58 1.58 0 0 1 3.15 0Z",
  x: "M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.82-6.3L5.06 21H2l7.15-8.17L2.25 3h6.32l4.36 5.76L17.53 3Zm-1.08 16.2h1.7L7.63 4.71H5.8L16.45 19.2Z",
  github:
    "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
};

const columns = [
  {
    heading: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      // { label: "Planos", href: "#planos" }, — seção "Planos" desativada por ora
    ],
  },
  {
    heading: "Suporte",
    links: [{ label: "Contato", href: "mailto:nortgo@nortgo.com" }],
  },
  {
    heading: "Legal",
    links: [{ label: "Privacidade", href: "/privacidade" }],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src={icon} alt="" width={24} height={24} className="h-6 w-6" />
              <span className="font-display text-[16px] font-bold tracking-tight text-ink">
                NortGo
              </span>
            </Link>
            <p className="caption mt-4 max-w-[220px] text-ink-faint">
              Sistema pessoal de organização da vida.
            </p>
            <p className="caption mt-3 max-w-[220px] text-ink-faint">
              Em construção à vista de todos.{" "}
              <a
                href="mailto:nortgo@nortgo.com?subject=Quero acompanhar o NortGo"
                className="underline decoration-line-strong underline-offset-2 hover:text-ink"
              >
                Acompanhe o desenvolvimento
              </a>
              .
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <span className="eyebrow text-ink-faint">
                {col.heading}
              </span>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-ink-dim transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <span className="eyebrow text-ink-faint">Downloads</span>
            <div className="mt-4 flex flex-col items-start gap-2 opacity-80">
              <Image src={appStore} alt="Em breve na App Store" width={110} height={36} />
              <Image src={googlePlay} alt="Em breve no Google Play" width={110} height={36} />
            </div>
          </div>
        </div>

        <div className="eyebrow mt-14 flex flex-col gap-4 border-t border-line pt-6 text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} NortGo. Todos os direitos reservados.</span>

          {socials.some((s) => s.href) && (
            <div className="flex items-center gap-4">
              {socials
                .filter((s) => s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-faint transition-colors hover:text-ink"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current"
                      aria-hidden
                    >
                      <path d={socialPaths[s.icon]} />
                    </svg>
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
