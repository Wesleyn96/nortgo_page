import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Faq from "./Faq";

// A copy do FAQ foi corrigida (branch fix/faq-copy-claims) para não afirmar
// recursos que o app ainda não tem. Estes testes travam o que NÃO pode voltar.
describe("Faq", () => {
  it("renderiza todas as perguntas", () => {
    render(<Faq />);
    const questions = screen.getAllByRole("group"); // <details>
    expect(questions.length).toBeGreaterThanOrEqual(5);
  });

  it("não promete pagamento 'via Mercado Pago' nem 'garante' condição especial", () => {
    const { container } = render(<Faq />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/Mercado Pago/i);
    expect(text).not.toMatch(/garante uma condição especial/i);
  });

  it("emite JSON-LD de FAQPage com uma entrada por pergunta", () => {
    const { container } = render(<Faq />);
    const ld = container.querySelector('script[type="application/ld+json"]');
    expect(ld).not.toBeNull();
    const data = JSON.parse(ld!.innerHTML);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(
      screen.getAllByRole("group").length,
    );
  });
});
