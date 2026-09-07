import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Entrada from "./Entrada";
import { APP_SIGNUP_URL } from "@/lib/links";

describe("Entrada", () => {
  it("mostra a proposta do produto", () => {
    render(<Entrada />);
    expect(
      screen.getByRole("heading", { name: /foco no que importa/i }),
    ).toBeInTheDocument();
  });

  it("mostra as seis áreas que o NortGo organiza", () => {
    render(<Entrada />);
    for (const label of [
      "Agenda",
      "Tarefas",
      "Rotinas",
      "Finanças",
      "Saúde",
      "Notas",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("o CTA 'Começar' leva ao cadastro do app", () => {
    render(<Entrada />);
    expect(screen.getByRole("link", { name: "Começar" })).toHaveAttribute(
      "href",
      APP_SIGNUP_URL,
    );
  });

  it("não tem mais o link 'Já tenho conta'", () => {
    render(<Entrada />);
    expect(
      screen.queryByRole("link", { name: /já tenho conta/i }),
    ).not.toBeInTheDocument();
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
