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

  it("mostra os três exemplos de entrada → categoria", () => {
    render(<Entrada />);
    for (const category of ["Agenda", "Finanças", "Tarefa"]) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
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
});
