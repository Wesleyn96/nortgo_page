import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta o que cada teste renderizou e zera o <html data-theme> / localStorage
// que o ThemeToggle e o script anti-flash tocam, para os testes não vazarem
// estado entre si.
afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-theme");
  try {
    localStorage.clear();
  } catch {
    // jsdom sempre tem localStorage; guardado por consistência com o app.
  }
});
