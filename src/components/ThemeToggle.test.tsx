import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

// Controle de PRÉVIA (some ou vira feature depois). Enquanto existe, garante
// que ele reflete e escreve a mesma fonte de verdade do <script> anti-flash:
// o atributo data-theme no <html> + a chave "nortgo-theme" no localStorage.
describe("ThemeToggle", () => {
  it("reflete o data-theme já aplicado no <html>", () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button")).toHaveAccessibleName(/tema claro/i);
  });

  it("clicar troca o atributo do <html> e persiste a escolha", async () => {
    document.documentElement.dataset.theme = "dark";
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("nortgo-theme")).toBe("light");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button"));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("nortgo-theme")).toBe("dark");
  });
});
