import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Waitlist from "./Waitlist";
import { FORMSPREE_ENDPOINT } from "@/lib/waitlist";

// O formulário é a única captação de leads hoje. Estes testes travam o
// contrato visível: validação nativa, honeypot silencioso, e os estados
// de sucesso/erro que o usuário vê.

function mockFetch(ok: boolean) {
  const fn = vi.fn().mockResolvedValue({ ok });
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Waitlist", () => {
  it("não envia sem e-mail e sem consentimento (validação nativa)", async () => {
    const fetchFn = mockFetch(true);
    const user = userEvent.setup();
    render(<Waitlist />);

    await user.click(screen.getByRole("button", { name: /avise-me/i }));

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("envia ao Formspree e mostra o estado de sucesso", async () => {
    const fetchFn = mockFetch(true);
    const user = userEvent.setup();
    render(<Waitlist />);

    await user.type(
      screen.getByLabelText(/seu melhor e-mail/i),
      "pessoa@exemplo.com",
    );
    await user.click(screen.getByRole("checkbox", { name: /política de privacidade/i }));
    await user.click(screen.getByRole("button", { name: /avise-me/i }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/você está na lista/i),
    );
    expect(fetchFn).toHaveBeenCalledWith(
      FORMSPREE_ENDPOINT,
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("resposta não-ok do Formspree → mensagem de erro, sem estado de sucesso", async () => {
    mockFetch(false);
    const user = userEvent.setup();
    render(<Waitlist />);

    await user.type(
      screen.getByLabelText(/seu melhor e-mail/i),
      "pessoa@exemplo.com",
    );
    await user.click(screen.getByRole("checkbox", { name: /política de privacidade/i }));
    await user.click(screen.getByRole("button", { name: /avise-me/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/não foi possível enviar/i),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("honeypot preenchido → finge sucesso e nunca chama a rede", async () => {
    const fetchFn = mockFetch(true);
    const user = userEvent.setup();
    const { container } = render(<Waitlist />);

    await user.type(
      screen.getByLabelText(/seu melhor e-mail/i),
      "bot@exemplo.com",
    );
    await user.click(screen.getByRole("checkbox", { name: /política de privacidade/i }));

    const honeypot = container.querySelector<HTMLInputElement>('input[name="_gotcha"]')!;
    honeypot.value = "sou um bot";
    await user.click(screen.getByRole("button", { name: /avise-me/i }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/você está na lista/i),
    );
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("variante compact usa o rótulo de botão curto", () => {
    render(<Waitlist variant="compact" />);
    expect(
      screen.getByRole("button", { name: /entrar na lista/i }),
    ).toBeInTheDocument();
  });
});
