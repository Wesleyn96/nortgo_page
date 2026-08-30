"use client";

import { useId, useState, type FormEvent } from "react";
import { FORMSPREE_ENDPOINT } from "@/lib/waitlist";

type Status = "idle" | "loading" | "success" | "error";

// "default" — bloco centralizado (CtaFinal, CtaBand).
// "compact" — linha enxuta para caber no hero, sem card grande de sucesso.
type Variant = "default" | "compact";

export default function Waitlist({ variant = "default" }: { variant?: Variant }) {
  const [status, setStatus] = useState<Status>("idle");
  // useId garante labels/inputs únicos quando o formulário aparece 2x na
  // mesma página (hero + CtaFinal) — id fixo quebraria o htmlFor.
  const uid = useId();
  const emailId = `waitlist-email-${uid}`;
  const compact = variant === "compact";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (data.get("_gotcha")) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className={
          compact
            ? "rounded-full border border-copper/25 bg-copper-wash px-5 py-3 text-[14px] text-ink"
            : "rounded-2xl border border-copper/25 bg-copper-wash p-6 text-center"
        }
      >
        {compact ? (
          <p>
            <span className="font-700 text-ink">Você está na lista.</span>{" "}
            <span className="text-ink-dim">Avisamos por e-mail no lançamento.</span>
          </p>
        ) : (
          <>
            <p className="font-display text-lg font-700 text-ink">
              Você está na lista.
            </p>
            <p className="mt-2 text-[14px] text-ink-dim">
              Avisamos por e-mail assim que o NortGo estiver pronto para você.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="hidden"
        name="_subject"
        value="Novo cadastro - Lista de espera NortGo"
      />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label htmlFor={emailId} className="sr-only">
            Seu melhor e-mail
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="Seu melhor e-mail"
            className="w-full rounded-full border border-line-strong bg-bg-secondary px-5 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-copper focus:bg-bg-raised"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary shrink-0 text-[13px] uppercase tracking-[0.08em] disabled:opacity-60"
        >
          {status === "loading"
            ? "Enviando…"
            : compact
              ? "Entrar na lista"
              : "Avise-me"}
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 text-center text-[12px] leading-snug text-ink-faint">
        <input
          type="checkbox"
          name="consent"
          required
          className="h-3.5 w-3.5 shrink-0 accent-copper"
        />
        <span>
          Li e concordo com a{" "}
          <a
            href="/privacidade"
            className="underline decoration-line-strong underline-offset-2 hover:text-ink"
          >
            Política de Privacidade
          </a>
          .
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="text-[13px] text-copper-ink">
          Não foi possível enviar agora. Tente novamente em instantes.
        </p>
      )}
    </form>
  );
}
