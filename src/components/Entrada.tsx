// Tela pública de entrada do NortGo — curta e direta. Explica o produto em
// segundos e leva ao cadastro/login do app.
// Componente de servidor: a animação de entrada é CSS puro (.animate-rise em
// globals.css, já com fallback de prefers-reduced-motion).

import Image from "next/image";
import type { ReactNode } from "react";
import logo from "../../public/brand/nortgo-full-logo-v3.png";
import { APP_SIGNUP_URL } from "@/lib/links";

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

const stores = [
  { src: "/brand/app-store.svg", alt: "Em breve na App Store" },
  { src: "/brand/google-play.svg", alt: "Em breve no Google Play" },
];

export default function Entrada() {
  return (
    <section className="entrada relative isolate flex flex-1 flex-col overflow-hidden">
      {/* Foto de fundo (atmosfera) + camada escura por cima — em globals.css.
          Decorativa: não entra na árvore de acessibilidade. */}
      <div className="entrada-photo" aria-hidden="true" />

      {/* Coluna central. Preenche o espaço que sobra da viewport depois do
          rodapé (flex-1) e centraliza o conteúdo. Todo o dimensionamento
          (gap, logo, título, áreas, botão, selos, padding) é fluido em
          unidades `svh` (.entrada-* em globals.css): a tela se ajusta a
          qualquer altura de navegador sem scroll. */}
      <div className="entrada-fit relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center">
        <Image
          src={logo}
          alt="NortGo"
          width={480}
          height={468}
          priority
          className="entrada-logo animate-rise"
        />

        <h1
          className="entrada-title max-w-xl animate-rise text-ink"
          style={{ animationDelay: "60ms" }}
        >
          Foco no que importa.
          <br />
          <span className="text-grad">Vida organizada.</span>
        </h1>

        <p
          className="lead max-w-md animate-rise text-ink-dim"
          style={{ animationDelay: "120ms" }}
        >
          Coloque no NortGo o que você precisa fazer, lembrar, registrar ou
          organizar. Você fala ou escreve, o NortGo entende e organiza para
          você.
        </p>

        {/* As seis áreas da vida que o NortGo cobre — badges com brilho quente
            (combina com o "liquid glass" da página). 3×2 no mobile, 6×1 acima
            de sm; nunca estoura a largura. Folga horizontal maior no desktop
            e notebook (sm/lg) pra os rótulos não se encostarem. */}
        <ul
          className="entrada-areas grid w-full max-w-full animate-rise grid-cols-3 gap-x-5 sm:grid-cols-6 md:gap-x-10 lg:gap-x-14"
          style={{ animationDelay: "150ms" }}
          aria-label="O que o NortGo organiza"
        >
          {features.map((f) => (
            <li key={f.label} className="flex flex-col items-center">
              <span className="feature-badge grid place-items-center rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef9f66"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
              </span>
              <span className="entrada-area-label text-ink-dim">{f.label}</span>
            </li>
          ))}
        </ul>

        <div
          className="entrada-cta flex animate-rise flex-col items-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={APP_SIGNUP_URL}
            data-track="entrada-primary-cta"
            className="btn-glass-copper entrada-cta-btn"
          >
            Começar
          </a>
        </div>

        {/* Selos das lojas — discretos, um pouco afastados do resto
            (.entrada-stores em globals.css: selos ~30px de altura, respiro
            extra fluido com a altura da tela). Sem rótulo e sem link: os
            apps ainda não estão publicados. */}
        <div
          className="entrada-stores flex animate-rise flex-col items-center"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-4 opacity-90">
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
