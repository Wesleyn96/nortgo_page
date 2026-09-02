"use client";

import { useSyncExternalStore } from "react";

// Botão flutuante para comparar as duas versões do site (clara x "black").
// Grava a escolha em localStorage; um <script> inline no layout aplica o
// data-theme antes da primeira pintura para não piscar.
//
// É um controle de PRÉVIA — quando você decidir a direção, ele sai (ou vira
// uma feature de verdade, com preferência do sistema etc.).
//
// O tema mora FORA do React: o <script> anti-flash já escreveu data-theme no
// <html> antes da hidratação, e outra aba pode trocá-lo. Por isso lemos com
// useSyncExternalStore — sem setState dentro de effect (o que o lint proíbe) e
// sem warning de hidratação quando o snapshot do servidor difere do cliente.

const STORAGE_KEY = "nortgo-theme";

const listeners = new Set<() => void>();

// Cliente: a verdade é o atributo que o <script> inline colocou no <html>.
function getSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

// Servidor / primeira hidratação: o layout renderiza sempre data-theme="dark".
function getServerSnapshot() {
  return true;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // 'storage' cobre a troca feita em outra aba; o toggle desta aba notifica
  // manualmente (o evento não dispara na aba que escreveu).
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function setDarkTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // localStorage indisponível (aba privada, etc.) — o tema ainda vale
    // nesta sessão, só não persiste.
  }
  listeners.forEach((notify) => notify());
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setDarkTheme(!dark)}
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
