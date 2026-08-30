// Configuração compartilhada da lista de espera — usada pelo formulário
// (Waitlist), pelo hero e pela prova social (WaitlistProof).

// Endpoint público do Formspree. Não é segredo (fica no HTML do cliente),
// mas centralizamos aqui para não repetir a string em vários arquivos.
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xljrydqj";

// Número REAL de pessoas já inscritas na lista de espera.
//
// Deixe `null` enquanto não houver um número que você possa comprovar
// (ex.: total de envios no painel do Formspree). Quando `null`, o site
// mostra uma chamada sem número — nada falso é exibido.
//
// ⚠️ Nunca infle este valor. Prova social inflada é problema de confiança
// e, dependendo do contexto, de publicidade enganosa (CDC art. 37).
export const WAITLIST_COUNT: number | null = null;

// Abaixo deste piso, um contador parece pequeno e tira credibilidade em vez
// de dar — nesse caso preferimos a copy sem número. Ajuste ao seu gosto.
export const WAITLIST_COUNT_MIN_TO_SHOW = 50;

/**
 * Decide o texto de prova social exibido perto dos CTAs, a partir do
 * número de inscritos (ou `null` quando ainda não há um número confiável).
 *
 * Contexto / por que essa decisão importa:
 * - O NortGo não tem produto, cliente nem depoimento. Este texto é a única
 *   "prova" disponível, então o tom dele define a credibilidade da página.
 * - Há uma escolha real de posicionamento aqui: exibir número desde cedo
 *   (transparência, mas pode parecer pouco) vs. só a partir de um piso
 *   (mais seguro, mas some a transparência) vs. sempre falar em movimento
 *   sem número ("lista aberta", "acesso antecipado").
 *
 * Implementação atual (ajuste a gosto):
 *   1. count === null       -> "Lista de lançamento aberta" (sem número)
 *   2. count < MIN_TO_SHOW  -> "Primeiras vagas de acesso antecipado" (início, sem cravar número baixo)
 *   3. count >= MIN_TO_SHOW -> "Junte-se a N.NNN pessoas na lista de espera"
 */
export function formatWaitlistProof(count: number | null): string | null {
  if (count === null) return "Lista de lançamento aberta";
  if (count < WAITLIST_COUNT_MIN_TO_SHOW) {
    return "Primeiras vagas de acesso antecipado";
  }
  return `Junte-se a ${count.toLocaleString("pt-BR")} pessoas na lista de espera`;
}
