import type { Metadata } from "next";
import Link from "next/link";
import { APP_BASE_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do NortGo: cadastro, assinatura paga (7 dias de teste grátis, depois R$ 9,90/mês via Mercado Pago), cancelamento, direito de arrependimento e regras de uso.",
  robots: { index: false, follow: false },
};

// Componente de marcação de trecho pendente (mesma linguagem visual da política).
function Falta({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-copper-wash px-1 text-copper-ink">{children}</mark>
  );
}

export default function TermosPage() {
  const appHost = APP_BASE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim hover:text-ink"
      >
        ← Voltar ao início
      </Link>

      <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-faint">
        Última atualização: 7 de setembro de 2026
      </p>
      <h1 className="mt-3 font-display text-3xl font-800 uppercase tracking-tight text-ink sm:text-4xl">
        Termos de Uso
      </h1>

      <div className="mt-8 rounded-xl border border-copper/25 bg-copper-wash p-5 text-[14px] leading-relaxed text-ink-dim">
        <strong className="text-ink">Aviso:</strong> este é um modelo inicial.
        Os trechos em{" "}
        <mark className="rounded border border-copper/30 bg-bg px-1 text-copper-ink">
          destaque
        </mark>{" "}
        precisam ser preenchidos com os dados reais da empresa. Como o NortGo
        cobra do consumidor e trata dados sensíveis (saúde, finanças), é{" "}
        <strong className="text-ink">
          fortemente recomendável a revisão por um advogado
        </strong>{" "}
        (Direito do Consumidor + LGPD) antes de considerar este texto definitivo
        e antes de iniciar qualquer cobrança.
      </div>

      <article className="prose-policy mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-ink-dim">
        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            1. Quem somos e o que são estes Termos
          </h2>
          <p className="mt-2">
            O NortGo é operado por <Falta>[razão social da empresa]</Falta>,
            inscrita no CNPJ sob o nº <Falta>[CNPJ]</Falta>, com sede em{" "}
            <Falta>[endereço]</Falta> (&quot;NortGo&quot;, &quot;nós&quot;).
          </p>
          <p className="mt-2">
            Estes Termos de Uso (&quot;Termos&quot;) regem o uso do aplicativo
            NortGo, disponível em{" "}
            <a
              href={APP_BASE_URL}
              className="text-copper-ink hover:underline"
            >
              {appHost}
            </a>
            , e do site www.nortgo.com. Ao criar uma conta ou usar o serviço,
            você declara que leu, entendeu e concorda com estes Termos e com a{" "}
            <Link href="/privacidade" className="text-copper-ink hover:underline">
              Política de Privacidade
            </Link>
            . Se não concordar, não use o serviço.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            2. O que o NortGo faz
          </h2>
          <p className="mt-2">
            O NortGo é um sistema pessoal de organização da vida: reúne rotina,
            tarefas, notas, agenda, finanças e saúde num só lugar e mostra
            apenas o que merece atenção no momento. É uma ferramenta de
            organização — <strong className="text-ink">não</strong> presta
            aconselhamento financeiro, médico, jurídico ou profissional de
            qualquer natureza, e não substitui esse tipo de orientação.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            3. Cadastro e conta
          </h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Você precisa ter <strong className="text-ink">18 anos ou mais</strong>{" "}
              e capacidade civil para contratar.
            </li>
            <li>
              Os dados do cadastro devem ser verdadeiros e atualizados. A conta é{" "}
              <strong className="text-ink">pessoal e intransferível</strong>.
            </li>
            <li>
              Você é responsável por manter a senha em sigilo e por toda
              atividade feita na sua conta. Avise-nos imediatamente em{" "}
              <a
                href="mailto:contato@nortgo.com"
                className="text-copper-ink hover:underline"
              >
                contato@nortgo.com
              </a>{" "}
              se suspeitar de uso indevido.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            4. Assinatura, teste grátis e cobrança
          </h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              O NortGo é um <strong className="text-ink">serviço pago</strong>.
              Após o período de teste, o acesso ao aplicativo depende de uma
              assinatura ativa.
            </li>
            <li>
              <strong className="text-ink">Teste grátis:</strong> ao criar a
              conta, você tem <strong className="text-ink">7 (sete) dias</strong>{" "}
              de acesso gratuito, sem necessidade de cartão. Ao fim do teste, o
              acesso é bloqueado até você assinar.
            </li>
            <li>
              <strong className="text-ink">Preço:</strong> R$ 9,90 (nove reais e
              noventa centavos) por mês, cobrados de forma{" "}
              <strong className="text-ink">recorrente no cartão de crédito</strong>.
            </li>
            <li>
              <strong className="text-ink">Processador de pagamento:</strong> a
              cobrança é feita pelo <strong className="text-ink">Mercado Pago</strong>.
              Os dados do seu cartão são inseridos e guardados pelo Mercado Pago,
              não pelo NortGo — nós não temos acesso ao número do seu cartão.
            </li>
            <li>
              <strong className="text-ink">Renovação automática:</strong> a
              assinatura se renova automaticamente a cada mês, na data
              correspondente, até que você cancele. A cada renovação, o valor
              vigente é cobrado no cartão cadastrado.
            </li>
            <li>
              <strong className="text-ink">Falha na cobrança:</strong> se o
              pagamento for recusado, novas tentativas serão feitas conforme as
              regras do Mercado Pago. Após tentativas sem sucesso, a assinatura é
              cancelada e o acesso, bloqueado.
            </li>
            <li>
              <strong className="text-ink">Reajuste de preço:</strong> podemos
              alterar o valor da assinatura mediante aviso com pelo menos{" "}
              <strong className="text-ink">30 (trinta) dias</strong> de
              antecedência, por e-mail. O novo valor
              só se aplica às renovações posteriores ao aviso; você pode cancelar
              antes que ele passe a valer.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            5. Cancelamento
          </h2>
          <p className="mt-2">
            Você pode cancelar a assinatura{" "}
            <strong className="text-ink">a qualquer momento</strong>, sem multa,
            pela área &quot;Minha assinatura&quot; dentro do aplicativo. O
            cancelamento interrompe as cobranças futuras; o acesso permanece
            disponível <strong className="text-ink">até o fim do período já
            pago</strong>, sem reembolso proporcional dos dias restantes (salvo
            nos casos do item 6 ou por exigência legal).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            6. Direito de arrependimento
          </h2>
          <p className="mt-2">
            Nos termos do art. 49 do Código de Defesa do Consumidor, se você
            contratou a assinatura fora de estabelecimento físico (pela
            internet), pode se arrepender em até{" "}
            <strong className="text-ink">7 (sete) dias corridos</strong> contados
            da <strong className="text-ink">primeira cobrança paga</strong>. Nesse
            caso, o valor pago é devolvido integralmente. Basta solicitar por{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>{" "}
            dentro do prazo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            7. Seus dados no NortGo
          </h2>
          <p className="mt-2">
            O conteúdo que você registra no NortGo (tarefas, notas, compromissos,
            informações de finanças e de saúde) <strong className="text-ink">é
            seu</strong>. Você nos concede apenas uma licença limitada para
            armazenar e processar esse conteúdo com a finalidade de operar o
            serviço para você. Não reivindicamos propriedade sobre ele, não o
            vendemos e não o usamos para publicidade.
          </p>
          <p className="mt-2">
            O tratamento de dados pessoais — incluindo dados sensíveis, como os
            de saúde e finanças — é descrito na{" "}
            <Link href="/privacidade" className="text-copper-ink hover:underline">
              Política de Privacidade
            </Link>
            . Você pode exportar e excluir seus dados conforme lá indicado.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            8. Uso aceitável
          </h2>
          <p className="mt-2">Você concorda em não:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>usar o serviço para qualquer finalidade ilícita ou que viole direitos de terceiros;</li>
            <li>compartilhar, revender ou dar acesso à sua conta a outras pessoas;</li>
            <li>
              tentar burlar mecanismos de segurança, de cobrança ou de limite de
              uso, acessar áreas ou dados a que não tem direito, ou fazer
              engenharia reversa do serviço;
            </li>
            <li>
              sobrecarregar a infraestrutura (automações abusivas, scraping em
              massa, testes de carga sem autorização);
            </li>
            <li>enviar código malicioso ou conteúdo que viole a lei.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            9. Propriedade intelectual
          </h2>
          <p className="mt-2">
            O aplicativo, a marca &quot;NortGo&quot;, o site, o design, os textos
            e o código são de titularidade da NortGo ou de seus licenciadores e
            estão protegidos por lei. Estes Termos não transferem a você nenhum
            direito sobre esses elementos, além do direito de usar o serviço
            enquanto sua assinatura estiver ativa.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            10. Disponibilidade e mudanças no serviço
          </h2>
          <p className="mt-2">
            Nos esforçamos para manter o NortGo disponível, mas{" "}
            <strong className="text-ink">não garantimos funcionamento
            ininterrupto ou livre de erros</strong>. Pode haver indisponibilidade
            por manutenção, falha técnica ou de terceiros (como a plataforma
            Base44, a hospedagem ou o Mercado Pago). Podemos alterar, adicionar
            ou remover funcionalidades ao longo do tempo; mudanças que reduzam
            de forma relevante o que foi contratado serão comunicadas com
            antecedência.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            11. Limitação de responsabilidade
          </h2>
          <p className="mt-2">
            O serviço é fornecido &quot;no estado em que se encontra&quot;. Na
            máxima extensão permitida pela lei aplicável — e{" "}
            <strong className="text-ink">respeitados os direitos que o Código de
            Defesa do Consumidor assegura</strong> —, a NortGo não responde por
            lucros cessantes, danos indiretos, ou por perda de dados que você
            poderia ter evitado exportando cópias periódicas. Em qualquer
            hipótese, a responsabilidade total da NortGo relativa ao serviço fica
            limitada ao valor que você pagou pela assinatura nos{" "}
            <strong className="text-ink">12 (doze) meses</strong> anteriores ao
            fato.
          </p>
          <p className="mt-2">
            O NortGo é uma ferramenta de organização: decisões financeiras, de
            saúde ou de qualquer outra ordem tomadas com base no que o app exibe
            são de sua responsabilidade.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            12. Suspensão e encerramento
          </h2>
          <p className="mt-2">
            Podemos suspender ou encerrar sua conta, com aviso quando possível,
            se você violar estes Termos, deixar de pagar, ou usar o serviço de
            forma que ponha em risco outros usuários ou a operação. Você pode
            encerrar sua conta a qualquer momento cancelando a assinatura e
            solicitando a exclusão dos dados. Após o encerramento, seus dados são
            tratados conforme a Política de Privacidade.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            13. Alterações destes Termos
          </h2>
          <p className="mt-2">
            Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas
            por e-mail ou dentro do aplicativo com antecedência razoável. O uso
            do serviço após a data de vigência indicada no topo desta página
            significa concordância com a versão atualizada. Se não concordar,
            você pode cancelar a assinatura antes que a mudança passe a valer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            14. Comunicações
          </h2>
          <p className="mt-2">
            As comunicações oficiais (cobrança, mudança de preço, alteração de
            Termos, avisos de segurança) são enviadas para o e-mail cadastrado
            na sua conta. Mantenha-o atualizado.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            15. Lei aplicável e foro
          </h2>
          <p className="mt-2">
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil. Fica eleito o foro do domicílio do consumidor para dirimir
            eventuais controvérsias, sem prejuízo de outros meios de solução
            previstos em lei.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            16. Contato
          </h2>
          <p className="mt-2">
            Dúvidas sobre estes Termos, sobre a assinatura ou sobre a sua conta:{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
