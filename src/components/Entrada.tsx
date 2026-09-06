// Tela pública de entrada do NortGo — curta e direta. Explica o produto em
// segundos ("você fala ou escreve; o NortGo organiza") e leva ao login.
// Componente de servidor: a animação de entrada é CSS puro (.animate-rise em
// globals.css, já com fallback de prefers-reduced-motion).

import Image from "next/image";
import logo from "../../public/brand/nortgo-full-logo-v3.png";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/links";

// Ícones de linha (Tabler, inline — sem carregar fonte de ícone). Cor por tipo,
// dentro da paleta quente da marca (azul/roxo proibidos — docs/PROJETO.md §6.2):
// agenda = cobre, dinheiro = verde (status), tarefa = laranja.
const rowIcons = {
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e0824a"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4 flex-none"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M4 11h16" />
    </svg>
  ),
  money: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 flex-none"
      aria-hidden="true"
    >
      <path d="M16.7 8a3 3 0 0 0-2.7-2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1-2.7-2M12 3v3m0 12v3" />
    </svg>
  ),
  task: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 flex-none"
      aria-hidden="true"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2" />
    </svg>
  ),
} as const;

const todayItems: {
  icon: keyof typeof rowIcons;
  title: string;
  meta: string;
  metaExpense?: boolean;
}[] = [
  { icon: "calendar", title: "Dentista amanhã às 15h", meta: "13:00" },
  { icon: "money", title: "Gastei no mercado", meta: "R$ 120,00", metaExpense: true },
  { icon: "task", title: "Comprar ração", meta: "15:00" },
];

const stores = [
  { src: "/brand/app-store.svg", alt: "Em breve na App Store" },
  { src: "/brand/google-play.svg", alt: "Em breve no Google Play" },
];

export default function Entrada() {
  return (
    <section className="entrada relative isolate overflow-hidden">
      {/* Foto de fundo (atmosfera) + camada escura por cima — em globals.css.
          Decorativa: não entra na árvore de acessibilidade. */}
      <div className="entrada-photo" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src={logo}
          alt="NortGo"
          width={480}
          height={468}
          priority
          className="h-24 w-auto animate-rise sm:h-28"
        />

        <h1
          className="mt-8 animate-rise text-[1.9rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem] md:text-[3.25rem]"
          style={{ animationDelay: "60ms" }}
        >
          Foco no que importa.
          <br />
          <span className="text-grad">Vida organizada.</span>
        </h1>

        <p
          className="lead mt-6 max-w-md animate-rise text-ink-dim"
          style={{ animationDelay: "120ms" }}
        >
          Coloque no NortGo o que você precisa fazer, lembrar, registrar ou
          organizar. Você fala ou escreve, o NortGo entende e organiza para
          você.
        </p>

        {/* Prévia do que o NortGo devolve: a lista "HOJE" já organizada. */}
        <div
          className="mt-9 w-full max-w-md animate-rise overflow-hidden rounded-xl border border-line-strong bg-bg-raised-2/90 text-left shadow-card backdrop-blur-sm"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex h-8 items-center justify-center border-b border-line-strong bg-white/[0.04] text-[12px] font-medium tracking-[0.06em] text-ink-dim">
            HOJE
          </div>
          <ul aria-label="Lista de hoje, já organizada pelo NortGo">
            {todayItems.map((item, i) => (
              <li
                key={item.title}
                className={`flex items-center gap-3 py-2.5 pl-5 pr-3 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span
                  className="h-[18px] w-[18px] flex-none rounded-full border-[1.5px] border-ink-faint"
                  aria-hidden="true"
                />
                {rowIcons[item.icon]}
                <span className="flex-1 text-[14px] font-medium text-ink">
                  {item.title}
                </span>
                <span
                  className={`text-[12px] font-medium ${
                    item.metaExpense ? "text-[#e0555b]" : "text-ink-faint"
                  }`}
                >
                  {item.meta}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 flex-none text-ink-faint"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-10 flex animate-rise flex-col items-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={APP_SIGNUP_URL}
            data-track="entrada-primary-cta"
            className="btn-glass-copper px-8 py-3.5 text-[15px]"
          >
            Começar
          </a>
          <a
            href={APP_LOGIN_URL}
            data-track="entrada-login"
            className="text-[14px] text-ink-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Já tenho conta
          </a>
        </div>

        <div
          className="mt-14 flex animate-rise flex-col items-center gap-3"
          style={{ animationDelay: "300ms" }}
        >
          <p className="eyebrow text-ink-faint">Lançamento em breve para</p>
          <div className="flex items-center gap-3 opacity-90">
            {stores.map((store) => (
              // Selos oficiais das lojas (SVG local, 120×40, decorativo, sem
              // link — os apps ainda não estão publicados). next/image bloqueia
              // SVG sem dangerouslyAllowSVG; <img> é adequado aqui.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={store.src}
                src={store.src}
                alt={store.alt}
                width={120}
                height={40}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
