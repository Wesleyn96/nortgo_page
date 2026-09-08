# Play Store — respostas do formulário "Segurança dos dados" (Data safety)

> Rascunho para preencher no Play Console → *Políticas e programas → Conteúdo do
> app → Segurança dos dados*. **Tem que bater com a Política de Privacidade**
> (`nortgo.com/privacidade`). Revisar com advogado antes de enviar — dado de
> saúde e financeiro têm escrutínio maior.
>
> Contexto: o app da Play Store é **só login** — cadastro e pagamento acontecem
> na web (`nortgo.com.br`). Mesmo assim o app "coleta" (no sentido do Google)
> tudo que o usuário registra depois de logado.

## Toggles gerais

| Pergunta | Resposta |
|---|---|
| O app coleta ou compartilha dados de usuário? | **Sim** |
| Todos os dados coletados são criptografados em trânsito? | **Sim** (HTTPS ponta a ponta) |
| Você oferece uma forma de o usuário pedir exclusão dos dados? | **Sim** |
| URL de exclusão de conta | `https://nortgo.com.br/excluir-conta` |
| Formas de exclusão | Excluir conta no app **e** pela URL acima sem login |

## Tipos de dados

Finalidades possíveis no formulário: *Funcionalidade do app*, *Análises*,
*Comunicações do desenvolvedor*, *Publicidade/marketing*, *Prevenção de
fraude, segurança e conformidade*, *Personalização*, *Gerenciamento da conta*.

| Categoria › Tipo | Coletado | Compartilhado | Obrigatório / opcional | Finalidades |
|---|---|---|---|---|
| **Info pessoal › Nome** | Sim | Não | Obrigatório | Gerenciamento da conta |
| **Info pessoal › E-mail** | Sim | Não | Obrigatório | Gerenciamento da conta; Comunicações do desenvolvedor (avisos da conta) |
| **Info financeira › Histórico de compras** | Sim | Não¹ | Obrigatório (p/ assinantes) | Funcionalidade do app; Prevenção de fraude/segurança |
| **Info financeira › Outras informações financeiras** (contas, gastos, receitas que o usuário anota) | Sim | Não | **Opcional** | Funcionalidade do app |
| **Info de saúde e fitness › Informações de saúde** (consultas, remédios, sintomas que o usuário anota) | Sim | Não | **Opcional** | Funcionalidade do app |
| **Atividade no app › Outro conteúdo gerado pelo usuário** (tarefas, notas, compromissos, rotinas) | Sim | Não | Opcional | Funcionalidade do app |
| **Info e desempenho do app › Registros de erros (crash)** | Sim | Não | Obrigatório | Funcionalidade do app; Análises |
| **Info e desempenho do app › Diagnóstico** | Sim | Não | Obrigatório | Funcionalidade do app; Análises |
| **IDs do dispositivo / IP** | Sim² | Não | Obrigatório | Prevenção de fraude, segurança e conformidade |

**Nenhum** dado é usado para **publicidade/marketing** nem **personalização** de
anúncios. **Nenhum** dado é vendido ou compartilhado com corretores de dados.

¹ **Cartão:** o número do cartão é coletado e guardado **pelo Mercado Pago**, não
pelo app — então **não** declaramos "Informações de pagamento do usuário" como
coletadas por nós. O Mercado Pago atua como **provedor de serviço** (processa a
pagamento sob nossas instruções); pela definição do Google, dados enviados só a
um provedor de serviço não contam como "compartilhados". Confirmar com advogado.

² **IP:** coletado nos registros de acesso para segurança e por obrigação legal
(Marco Civil, art. 15). Declarar na finalidade "Prevenção de fraude, segurança e
conformidade".

## Outras declarações na seção "Conteúdo do app"

| Item | O que responder |
|---|---|
| **Política de Privacidade (URL)** | `https://www.nortgo.com/privacidade` (conferir que abre com HTTP 200, sem redirect) |
| **Anúncios** | O app **não** exibe anúncios |
| **Acesso ao app** | Todo o conteúdo exige login → fornecer **credenciais de teste** de uma conta com assinatura ativa para o revisor |
| **Classificação de conteúdo** | Responder o questionário IARC (app utilitário, sem conteúdo sensível de mídia) |
| **Público-alvo e conteúdo** | Faixa **18+**; não direcionado a crianças |
| **Apps financeiros / recursos financeiros** | O NortGo **não** faz transações, empréstimo, investimento nem gestão de dinheiro de terceiros — é registro pessoal. Declarar como "gestão de finanças pessoais / orçamento", sem recursos regulados |
| **Apps de saúde** | Não é app de saúde clínica; é organizador pessoal onde o usuário pode anotar dados de saúde. Declarar conforme o questionário e **não** marcar funcionalidades de saúde reguladas (telemedicina, pesquisa clínica, etc.) |
| **Governo / notícias / COVID / IA gerativa** | Não se aplica |

## Pendências que travam o envio

- [ ] `nortgo.com/privacidade` e `/termos` com razão social, CNPJ e endereço preenchidos
- [ ] Página/fluxo `nortgo.com.br/excluir-conta` funcionando (sem login)
- [ ] Fluxo "Excluir conta" dentro do app
- [ ] Link para a Política **dentro** do app
- [ ] Checkbox de aceite (Termos + Política) no cadastro web
- [ ] Preço da assinatura visível antes de pagar (`/assinatura`)
- [ ] `contato@nortgo.com` recebendo mensagens
- [ ] Conta de teste com assinatura ativa para o revisor
- [ ] Revisão jurídica (Direito do Consumidor + LGPD)
