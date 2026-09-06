import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Entrada from "./Entrada";
import { APP_SIGNUP_URL, APP_LOGIN_URL } from "@/lib/links";

describe("Entrada", () => {
  it("mostra a proposta do produto", () => {
    render(<Entrada />);
    expect(
      screen.getByRole("heading", { name: /foco no que importa/i }),
    ).toBeInTheDocument();
  });

  it("mostra a prévia: cards de atrasados e de hoje já organizados", () => {
    render(<Entrada />);
    expect(screen.getByText("ATRASADOS")).toBeInTheDocument();
    expect(screen.getByText("HOJE")).toBeInTheDocument();
    for (const title of [
      "Entregar proposta",
      "Parcela do empréstimo",
      "Consulta no dentista",
      "Compra no mercado",
      "Comprar ração",
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByText("R$ 120,00")).toBeInTheDocument();
  });

  it("o CTA 'Começar' leva ao cadastro do app", () => {
    render(<Entrada />);
    expect(screen.getByRole("link", { name: "Começar" })).toHaveAttribute(
      "href",
      APP_SIGNUP_URL,
    );
  });

  it("tem um caminho para quem já tem conta", () => {
    render(<Entrada />);
    expect(
      screen.getByRole("link", { name: "Já tenho conta" }),
    ).toHaveAttribute("href", APP_LOGIN_URL);
  });

  it("anuncia o lançamento nas lojas, sem link (apps ainda não publicados)", () => {
    render(<Entrada />);
    expect(screen.getByText(/lançamento em breve para/i)).toBeInTheDocument();
    expect(screen.getByAltText(/App Store/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Google Play/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /App Store|Google Play/i }),
    ).not.toBeInTheDocument();
  });
});
