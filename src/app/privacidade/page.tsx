import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import { APP_BASE_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o NortGo — site e aplicativo — coleta, usa, compartilha, guarda e exclui seus dados, incluindo dados sensíveis de saúde e finanças. Seus direitos sob a LGPD e como excluir sua conta.",
  robots: { index: false, follow: false },
};

// Trecho que ainda depende de uma definição do dono (mesma marcação da
// página de Termos).
function Falta({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-copper-wash px-1 text-copper-ink">{children}</mark>
  );
}

export default function PrivacidadePage() {
  const appHost = APP_BASE_URL.replace(/^https?:\/\//, "");
  const deleteUrl = `${APP_BASE_URL}/excluir-conta`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <BackLink />

      <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-faint">
        Última atualização: 7 de setembro de 2026
      </p>
      <h1 className="mt-3 font-display text-3xl font-800 uppercase tracking-tight text-ink sm:text-4xl">
        Política de Privacidade
      </h1>

      <div className="mt-8 rounded-xl border border-copper/25 bg-copper-wash p-5 text-[14px] leading-relaxed text-ink-dim">
        <strong className="text-ink">Aviso:</strong> os trechos em{" "}
        <mark className="rounded border border-copper/30 bg-bg px-1 text-copper-ink">
          destaque
        </mark>{" "}
        dependem de definições da empresa (razão social, CNPJ, endereço). Como o
        NortGo trata <strong className="text-ink">dados sensíveis</strong> (saúde
        e finanças) e cobra do consumidor, é{" "}
        <strong className="text-ink">
          fortemente recomendável a revisão por um advogado de proteção de dados
        </strong>{" "}
        antes de considerar este texto definitivo.
      </div>

      <article className="prose-policy mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-ink-dim">
        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            1. Quem trata seus dados
          </h2>
          <p className="mt-2">
            O NortGo é operado por <Falta>[razão social da empresa]</Falta>,
            inscrita no CNPJ sob o nº <Falta>[CNPJ]</Falta>, com sede em{" "}
            <Falta>[endereço]</Falta> (&quot;NortGo&quot;, &quot;nós&quot;). Para
            fins da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018),
            somos o <strong className="text-ink">controlador</strong> dos dados
            descritos aqui.
          </p>
          <p className="mt-2">
            Contato para assuntos de privacidade e para exercer seus direitos:{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>{" "}
            <Falta>[ou o e-mail do Encarregado/DPO, se for designado]</Falta>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            2. O que esta política cobre
          </h2>
          <p className="mt-2">
            Esta política se aplica ao <strong className="text-ink">site</strong>{" "}
            www.nortgo.com e ao <strong className="text-ink">aplicativo
            NortGo</strong> — a versão web em{" "}
            <a href={APP_BASE_URL} className="text-copper-ink hover:underline">
              {appHost}
            </a>{" "}
            e as versões para celular (Android e iOS). O NortGo é um sistema
            pessoal de organização: reúne agenda, tarefas, rotinas, finanças,
            saúde e notas num só lugar. É uma ferramenta de organização —{" "}
            <strong className="text-ink">não</strong> presta aconselhamento
            médico, financeiro ou jurídico.
          </p>
          <p className="mt-2">
            O <strong className="text-ink">site</strong> www.nortgo.com é apenas
            informativo: não tem formulário nem cadastro. O cadastro, o login e
            todo o uso do produto acontecem no <strong className="text-ink">
            aplicativo</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            3. Dados que coletamos
          </h2>

          <p className="mt-2">
            <strong className="text-ink">a) Dados de cadastro e conta.</strong>{" "}
            E-mail, nome e senha (guardada de forma cifrada — não temos acesso à
            senha em texto).
          </p>

          <p className="mt-3">
            <strong className="text-ink">b) Conteúdo que você cria no app.</strong>{" "}
            Tarefas, notas, compromissos, rotinas e lembretes. Isso inclui, se
            você optar por registrar:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Dados financeiros</strong> — contas,
              gastos, receitas, valores e datas que você anotar;
            </li>
            <li>
              <strong className="text-ink">Dados de saúde</strong> — consultas,
              medicamentos, sintomas e outras anotações de saúde que você fizer.
            </li>
          </ul>
          <p className="mt-2">
            Dados de saúde e financeiros são{" "}
            <strong className="text-ink">dados pessoais sensíveis</strong> sob a
            LGPD. Você não é obrigado a registrá-los; eles só existem no NortGo
            porque e enquanto você escolher guardá-los.
          </p>

          <p className="mt-3">
            <strong className="text-ink">
              c) Dados de pagamento (via Mercado Pago).
            </strong>{" "}
            A assinatura é cobrada pelo <strong className="text-ink">Mercado
            Pago</strong>. Os dados do seu cartão são inseridos e guardados{" "}
            <strong className="text-ink">pelo Mercado Pago</strong>, não pelo
            NortGo — <strong className="text-ink">nunca temos acesso ao número
            do seu cartão</strong>. Do Mercado Pago recebemos apenas: status da
            assinatura (ativa, em atraso, cancelada), identificador da
            transação, e-mail do pagador e datas de cobrança.
          </p>

          <p className="mt-3">
            <strong className="text-ink">
              d) Registros técnicos e de uso.
            </strong>{" "}
            A cada acesso, os servidores registram automaticamente: endereço IP,
            tipo e versão do navegador ou app, sistema operacional e dispositivo,
            páginas/telas acessadas, data e hora, e registros de erro. Usamos
            isso para manter o serviço no ar, diagnosticar problemas e proteger
            contra fraude e abuso.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            4. Para que usamos e com que base legal
          </h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Operar o serviço</strong> (armazenar
              e mostrar o que você registra, sincronizar entre dispositivos):
              execução do contrato (art. 7º, V).
            </li>
            <li>
              <strong className="text-ink">Autenticação e segurança</strong>{" "}
              (login, prevenção de fraude e abuso, registros de acesso):
              legítimo interesse (art. 7º, IX) e cumprimento de obrigação legal
              (Marco Civil da Internet, art. 15).
            </li>
            <li>
              <strong className="text-ink">Cobrança da assinatura</strong>{" "}
              (processar pagamentos, controlar o estado da assinatura, emitir
              documentos fiscais): execução do contrato e obrigação legal.
            </li>
            <li>
              <strong className="text-ink">
                Dados sensíveis (saúde e finanças)
              </strong>
              : tratados exclusivamente para entregar a você a funcionalidade de
              organização que você usa, com base no seu{" "}
              <strong className="text-ink">
                consentimento específico e destacado
              </strong>{" "}
              (art. 11, I), coletado no cadastro. Você pode revogar esse
              consentimento a qualquer momento excluindo esses registros ou a
              conta.
            </li>
            <li>
              <strong className="text-ink">Comunicações da conta</strong>{" "}
              (confirmação de cadastro, avisos de cobrança, mudança de preço ou
              de termos, avisos de segurança): execução do contrato. E-mails de
              novidades ou marketing, se existirem, só com opt-in e com link de
              descadastro.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            5. Com quem compartilhamos
          </h2>
          <p className="mt-2">
            Compartilhamos dados apenas com{" "}
            <strong className="text-ink">operadores</strong> que executam o
            serviço em nosso nome, sob contrato e obrigação de confidencialidade:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Base44</strong> — plataforma sobre a
              qual o aplicativo NortGo funciona (banco de dados, autenticação,
              lógica do app). É onde o conteúdo da sua conta fica armazenado.
            </li>
            <li>
              <strong className="text-ink">Render</strong> e{" "}
              <strong className="text-ink">Cloudflare</strong> — infraestrutura
              de servidores e borda de rede usada pela plataforma Base44.
            </li>
            <li>
              <strong className="text-ink">Mercado Pago</strong> — processamento
              dos pagamentos da assinatura.
            </li>
            <li>
              <strong className="text-ink">Cloudflare</strong> — hospedagem e
              rede de entrega (CDN) do site www.nortgo.com.
            </li>
            <li>
              Provedor de e-mail transacional usado para enviar as mensagens da
              sua conta.
            </li>
            <li>
              <strong className="text-ink">Autoridades públicas</strong>, quando
              houver ordem judicial ou obrigação legal.
            </li>
          </ul>
          <p className="mt-2">
            <strong className="text-ink">
              Não vendemos seus dados. Não os usamos para publicidade. Não os
              compartilhamos com corretores de dados (data brokers) nem para
              perfilamento comercial.
            </strong>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            6. Onde seus dados ficam
          </h2>
          <p className="mt-2">
            A plataforma Base44 e sua infraestrutura (Render) operam a partir de
            servidores nos <strong className="text-ink">Estados Unidos</strong>.
            Ou seja, há <strong className="text-ink">transferência
            internacional</strong> de dados. Ela é feita com base nas garantias
            previstas na LGPD (art. 33), incluindo cláusulas contratuais que
            obrigam os operadores a um nível de proteção compatível com a lei
            brasileira.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            7. Por quanto tempo guardamos
          </h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Enquanto a conta existir:</strong>{" "}
              mantemos os dados da conta e o conteúdo que você registrou, para
              que o serviço funcione.
            </li>
            <li>
              <strong className="text-ink">Após a exclusão da conta:</strong> o
              conteúdo e os dados pessoais são apagados dos nossos sistemas em
              até <strong className="text-ink">30 dias</strong>, salvo o que a
              lei nos obriga a reter.
            </li>
            <li>
              <strong className="text-ink">Registros de acesso</strong> (IP,
              data e hora): guardados pelo prazo legal mínimo de{" "}
              <strong className="text-ink">6 meses</strong> (Marco Civil, art.
              15) e depois descartados.
            </li>
            <li>
              <strong className="text-ink">
                Dados de cobrança e fiscais
              </strong>{" "}
              (valores pagos, notas): retidos pelo prazo exigido pela legislação
              fiscal e para defesa em eventual disputa (até 5 anos).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            8. Como excluir sua conta e seus dados
          </h2>
          <p className="mt-2">Você pode pedir a exclusão de duas formas:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Dentro do aplicativo:</strong> em{" "}
              &quot;Minha conta&quot; → &quot;Excluir conta&quot;.
            </li>
            <li>
              <strong className="text-ink">Pela web, sem precisar logar:</strong>{" "}
              <a
                href={deleteUrl}
                className="break-all text-copper-ink hover:underline"
              >
                {deleteUrl}
              </a>
              . Podemos pedir uma confirmação para ter certeza de que é você.
            </li>
          </ul>
          <p className="mt-2">
            Ao excluir a conta, apagamos seu perfil e todo o conteúdo que você
            registrou (tarefas, notas, compromissos, dados de saúde e finanças).
            Mantemos apenas o mínimo que a lei exige (item 7): registros de
            acesso pelo prazo legal e dados de cobrança/fiscais. A assinatura é
            cancelada e as cobranças futuras cessam.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            9. Seus direitos (LGPD)
          </h2>
          <p className="mt-2">
            A qualquer momento e gratuitamente, você pode:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>confirmar se tratamos dados seus e acessá-los;</li>
            <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>
              solicitar anonimização, bloqueio ou exclusão de dados
              desnecessários ou tratados em desconformidade com a lei;
            </li>
            <li>
              pedir a portabilidade dos seus dados e exportar o conteúdo da sua
              conta;
            </li>
            <li>
              revogar o consentimento (para os dados sensíveis) e saber as
              consequências disso;
            </li>
            <li>
              saber com quais entidades compartilhamos seus dados;
            </li>
            <li>
              opor-se a tratamento feito com base em legítimo interesse.
            </li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer direito, escreva para{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>
            . Respondemos no prazo da LGPD. Se você entender que seus direitos
            não foram atendidos, pode reclamar à{" "}
            <strong className="text-ink">
              Autoridade Nacional de Proteção de Dados (ANPD)
            </strong>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            10. Segurança
          </h2>
          <p className="mt-2">
            Todo o tráfego do site e do aplicativo é criptografado (HTTPS). As
            senhas são guardadas cifradas. O acesso ao banco de dados é
            restrito e controlado pela plataforma Base44. Nenhum sistema é
            100% imune: se ocorrer um incidente de segurança que possa causar
            risco ou dano relevante a você, comunicaremos você e a ANPD conforme
            a LGPD.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            11. Crianças e adolescentes
          </h2>
          <p className="mt-2">
            O NortGo é destinado a maiores de <strong className="text-ink">18
            anos</strong>. Não é direcionado a crianças ou adolescentes e não
            coletamos intencionalmente dados de menores. Se identificarmos uma
            conta criada por menor, ela será encerrada e os dados, excluídos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            12. Cookies e armazenamento
          </h2>
          <p className="mt-2">
            O site www.nortgo.com{" "}
            <strong className="text-ink">não usa cookies</strong> de
            rastreamento, análise ou publicidade. O aplicativo usa
            armazenamento local do navegador/dispositivo apenas para manter você
            logado e guardar preferências de uso — não para rastrear você entre
            sites ou apps.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            13. Permissões do aplicativo
          </h2>
          <p className="mt-2">
            O aplicativo serve para acessar sua conta e seus dados no NortGo.
            Ele não coleta dados do dispositivo além dos registros técnicos do
            item 3 e não acessa contatos, arquivos, câmera, microfone ou
            localização precisa. Se uma versão futura passar a solicitar alguma
            permissão adicional (por exemplo, para enviar notificações), isso
            será informado na instalação e refletido nesta política.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            14. Alterações a esta política
          </h2>
          <p className="mt-2">
            Podemos atualizar esta política. Mudanças relevantes serão
            comunicadas por e-mail ou dentro do aplicativo com antecedência
            razoável. A data da última atualização fica no topo desta página.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            15. Contato
          </h2>
          <p className="mt-2">
            Dúvidas sobre esta política ou sobre o tratamento dos seus dados:{" "}
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
