import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta o que cada teste renderizou, para não vazar estado entre testes.
afterEach(() => {
  cleanup();
});
