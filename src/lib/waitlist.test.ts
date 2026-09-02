import { describe, expect, it } from "vitest";
import {
  formatWaitlistProof,
  WAITLIST_COUNT_MIN_TO_SHOW,
} from "./waitlist";

// A prova social é a única credibilidade da página antes do produto existir.
// Estes testes travam a regra de "nunca mostrar número que não dá pra sustentar"
// (ver comentário em waitlist.ts e §6.1 do docs/PROJETO.md).
describe("formatWaitlistProof", () => {
  it("sem número confiável (null) → chamada sem número", () => {
    expect(formatWaitlistProof(null)).toBe("Lista de lançamento aberta");
  });

  it("abaixo do piso → texto de início, sem cravar o número baixo", () => {
    const proof = formatWaitlistProof(WAITLIST_COUNT_MIN_TO_SHOW - 1);
    expect(proof).toBe("Primeiras vagas de acesso antecipado");
    expect(proof).not.toMatch(/\d/);
  });

  it("no piso ou acima → número formatado em pt-BR", () => {
    expect(formatWaitlistProof(1234)).toBe(
      "Junte-se a 1.234 pessoas na lista de espera",
    );
  });
});
