import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

// Produto pago + dados sensíveis → os links de Termos e Privacidade
// precisam existir e apontar certo (requisitos CDC/LGPD, §10 do doc).
describe("Footer", () => {
  it("tem link de Privacidade apontando para /privacidade", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Privacidade" });
    expect(link).toHaveAttribute("href", "/privacidade");
  });

  it("tem link de Termos apontando para /termos", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Termos" })).toHaveAttribute(
      "href",
      "/termos",
    );
  });

  it("tem um canal de contato", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });
});
