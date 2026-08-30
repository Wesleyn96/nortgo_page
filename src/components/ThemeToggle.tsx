"use client";

import { useEffect, useState } from "react";

// Botão flutuante para comparar as duas versões do site (clara x "black").
// Grava a escolha em localStorage; um <script> inline no layout aplica o
// data-theme antes da primeira pintura para não piscar.
//
// É um controle de PRÉVIA — quando você decidir a direção, ele sai (ou vira
// uma feature de verdade, com preferência do sistema etc.).

const STORAGE_KEY = "nortgo-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // O script inline já pode ter marcado <html data-theme="dark"> — sincroniza.
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    if (next) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // localStorage indisponível (aba privada, etc.) — tema ainda funciona
      // nesta sessão, só não persiste.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full border border-line-strong bg-bg-raised/85 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim shadow-card backdrop-blur-md transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="none">
        {dark ? (
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        ) : (
          <path
            d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {dark ? "Tema claro" : "Tema escuro"}
    </button>
  );
}
