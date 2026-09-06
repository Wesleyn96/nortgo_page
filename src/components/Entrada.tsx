// Tela pública de entrada do NortGo — curta e direta. Explica o produto em
// segundos ("você fala ou escreve; o NortGo organiza") e leva ao login.
// Componente de servidor: a animação de entrada é CSS puro (.animate-rise em
// globals.css, já com fallback de prefers-reduced-motion).

import Image from "next/image";
import type { ReactNode } from "react";
import logo from "../../public/brand/nortgo-full-logo-v3.png";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/links";

// As seis áreas da vida que o NortGo cobre. Ícones de linha (Tabler-style,
// inline), 24×24, traço cobre — no modelo enviado pelo dono.
const features: { label: string; icon: ReactNode }[] = [
  {
    label: "Agenda",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M4 10h16" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </>
    ),
  },
  {
    label: "Tarefas",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M9 12.5l2 2 4.5-5" />
      </>
    ),
  },
  {
    label: "Rotinas",
    icon: <path d="M6 20v-6M12 20V6M18 20v-9" />,
  },
  {
    label: "Finanças",
    icon: (
      <>
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v5c0 1.66 3.13 3 7 3s7-1.34 7-3V7" />
        <path d="M5 12v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
      </>
    ),
  },
  {
    label: "Saúde",
    icon: <path d="M3 12h4l2.5-7 4 15 2.5-8H21" />,
  },
  {
    label: "Notas",
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 12h6M9 16h4" />
      </>
    ),
  },
];

// Ícones de linha (Tabler, inline — sem carregar fonte de ícone), 16×16,
// stroke 2. Cor semântica por categoria, conforme o modelo enviado pelo dono.
// O azul do calendário é exceção consciente à regra §6.2 (ver docs/PROJETO.md):
// vale para ícone de mockup do app, não para a identidade da marca.
function RowIcon({ kind }: { kind: "task" | "money" | "recurring" | "calendar" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 16,
    height: 16,
    className: "flex-none",
    "aria-hidden": true,
  };
  if (kind === "task") {
    return (
      <svg {...common} stroke="#F97316">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="2" />
      </svg>
    );
  }
  if (kind === "money") {
    return (
      <svg {...common} stroke="#10B981">
        <path d="M16.7 8a3 3 0 0 0-2.7-2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1-2.7-2M12 3v3m0 12v3" />
      </svg>
    );
  }
  if (kind === "recurring") {
    return (
      <svg {...common} stroke="#22C55E">
        <path d="M20 11a8 8 0 1 0-2.6 5.9M20 5v6h-6" />
      </svg>
    );
  }
  return (
    <svg {...common} stroke="#3B82F6">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M4 11h16" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#818898"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={15}
      height={15}
      className="flex-none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type Row = {
  icon: "task" | "money" | "recurring" | "calendar";
  title: string;
  metas: { text: string; tone: "red" | "muted" }[];
};

const overdue: Row[] = [
  { icon: "task", title: "Entregar proposta", metas: [{ text: "26d", tone: "red" }] },
  {
    icon: "money",
    title: "Cartão de crédito",
    metas: [
      { text: "R$ 3.000,00", tone: "red" },
      { text: "15d", tone: "red" },
    ],
  },
  {
    icon: "recurring",
    title: "Parcela do empréstimo",
    metas: [
      { text: "R$ 2.000,00", tone: "red" },
      { text: "15d", tone: "red" },
    ],
  },
];

const today: Row[] = [
  {
    icon: "calendar",
    title: "Consulta no dentista",
    metas: [{ text: "13:00", tone: "muted" }],
  },
  {
    icon: "money",
    title: "Compra no mercado",
    metas: [{ text: "R$ 120,00", tone: "red" }],
  },
  { icon: "task", title: "Comprar ração", metas: [{ text: "15:00", tone: "muted" }] },
];

function ListCard({ heading, rows }: { heading: string; rows: Row[] }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#333335] bg-[#1C1C1E]">
      <div className="flex h-[31px] items-center justify-center border-b border-[#333335] bg-[#252527] text-[12px] font-bold tracking-[0.5px] text-[#E9EAED]">
        {heading}
      </div>
      <ul aria-label={`${heading}: itens organizados pelo NortGo`}>
        {rows.map((row, i) => (
          <li
            key={row.title}
            className={`flex h-[38px] items-center gap-2 pl-[14px] pr-[10px] ${
              i < rows.length - 1 ? "border-b border-[#333335]" : ""
            }`}
          >
            <span
              className="h-4 w-4 flex-none rounded-full border-[1.5px] border-[#818898]"
              aria-hidden="true"
            />
            <RowIcon kind={row.icon} />
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#D4D6D8]">
              {row.title}
            </span>
            {row.metas.map((m) => (
              <span
                key={m.text}
                className={`flex-none text-[12px] font-semibold ${
                  // #F25555 no lugar do #D92626 do modelo: o vermelho original
                  // dava só 3.5:1 sobre o card (#1C1C1E), abaixo do mínimo WCAG
                  // AA (4.5:1) para texto de 12px. Este clareia p/ ~5:1.
                  m.tone === "red" ? "text-[#F25555]" : "text-[#818898]"
                }`}
              >
                {m.text}
              </span>
            ))}
            <Chevron />
          </li>
        ))}
      </ul>
    </div>
  );
}

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

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src={logo}
          alt="NortGo"
          width={480}
          height={468}
          priority
          className="h-24 w-auto animate-rise sm:h-28"
        />

        <h1
          className="mt-8 max-w-xl animate-rise text-[1.9rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem] md:text-[3.25rem]"
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

        {/* As seis áreas da vida que o NortGo cobre — badges com brilho quente
            (combina com o "liquid glass" da página). 3×2 no mobile, 6×1 acima
            de sm; nunca estoura a largura. */}
        <ul
          className="mt-10 grid w-full max-w-full animate-rise grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6"
          style={{ animationDelay: "150ms" }}
          aria-label="O que o NortGo organiza"
        >
          {features.map((f) => (
            <li key={f.label} className="flex flex-col items-center gap-2.5">
              <span className="feature-badge grid h-14 w-14 place-items-center rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef9f66"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[26px] w-[26px]"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
              </span>
              <span className="text-[13px] font-medium text-ink-dim">
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Prévia do que o NortGo devolve: atrasados e o dia, já organizados.
            Estrutura, tamanhos, ícones e cores conforme o modelo do dono.
            .cards-preview aplica a família de fontes do modelo (Inter → fallback
            de sistema; sem @font-face, nada é baixado). */}
        <div
          className="cards-preview mt-9 grid w-full max-w-full animate-rise gap-4 text-left md:grid-cols-2"
          style={{ animationDelay: "180ms" }}
        >
          <ListCard heading="ATRASADOS" rows={overdue} />
          <ListCard heading="HOJE" rows={today} />
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
