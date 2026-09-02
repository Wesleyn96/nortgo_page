import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

// A landing coleta e-mails reais → o link para a Política de Privacidade
// precisa existir e apontar para /privacidade (requisito LGPD, §10 do doc).
describe("Footer", () => {
  it("tem link de Privacidade apontando para /privacidade", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Privacidade" });
    expect(link).toHaveAttribute("href", "/privacidade");
  });

  it("tem um canal de contato", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });
});
