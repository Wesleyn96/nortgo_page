// Tela pública de entrada do NortGo — curta e direta. Explica o produto em
// segundos ("você fala ou escreve; o NortGo organiza") e leva ao login.
// Componente de servidor: a animação de entrada é CSS puro (.animate-rise em
// globals.css, já com fallback de prefers-reduced-motion).

import Image from "next/image";
import logo from "../../public/brand/nortgo-full-logo-v3.png";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/links";

const examples = [
  { phrase: "Dentista amanhã às 15h.", category: "Agenda" },
  { phrase: "Gastei R$ 120 no mercado.", category: "Finanças" },
  { phrase: "Comprar ração.", category: "Tarefa" },
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

        <ul
          className="mt-9 w-full max-w-md animate-rise overflow-hidden rounded-2xl border border-line-strong bg-bg-raised/80 text-left shadow-card backdrop-blur-sm"
          style={{ animationDelay: "180ms" }}
        >
          {examples.map((ex, i) => (
            <li
              key={ex.category}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="text-[15px] italic text-ink">
                &ldquo;{ex.phrase}&rdquo;
              </span>
              <span className="shrink-0 rounded-full bg-copper-wash px-3 py-1 text-[12px] font-semibold text-copper-ink">
                {ex.category}
              </span>
            </li>
          ))}
        </ul>

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
