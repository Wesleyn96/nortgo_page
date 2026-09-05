@AGENTS.md

# Fluxo de trabalho

## Papéis
- **Claude Code** analisa, planeja, implementa e corrige.
- **Codex** faz a revisão independente do que foi implementado. Roda sozinho ao
  fim de cada tarefa (stop-review gate) e também pode ser chamado com
  `/codex:review` ou `/codex:adversarial-review`.

## Planejar antes de implementar
- Mudança **relevante** (feature, mudança de comportamento, refactor amplo,
  arquitetura, dependência nova): apresentar um plano curto e esperar aprovação
  antes de editar.
- Mudança trivial (texto, typo, correção óbvia de 1 linha): pode ir direto.
- Ler `docs/PROJETO.md` para direção do produto e decisões já tomadas; não
  contrariá-las sem sinalizar.

## Ao implementar
- Menor diff possível. Não reescrever o que não foi pedido.
- Não adicionar dependência sem confirmar.
- Segredos só em `.env.local` (fora do git). Nunca versionar credenciais.
- Comandos destrutivos (`rm -rf`, `git reset --hard`, `git push --force`,
  `git clean`) só com confirmação explícita.

## Antes de concluir
1. Rodar `npm run verify` (lint + typecheck + testes + build) e colar o
   resultado. Código que não passa não está pronto.
2. Tratar os achados **válidos** da revisão do Codex; se discordar de um achado,
   explicar o porquê.
3. Atualizar `docs/PROJETO.md` se a mudança afetar estado, decisão ou roadmap.

## Git
- Commit e push só quando o usuário pedir.
- Nunca commitar direto na `main`: se estiver nela, criar branch antes.
- Mensagem de commit descreve o "porquê", não só o "o quê".
