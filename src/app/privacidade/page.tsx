import type { Metadata } from "next";
import Link from "next/link";
import { APP_BASE_URL, APP_SIGNUP_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "O site www.nortgo.com é informativo: não tem formulário nem cadastro. Esta página explica os registros técnicos de acesso e para onde vão os dados do cadastro, feito no aplicativo.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
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
        Última atualização: 3 de setembro de 2026
      </p>
      <h1 className="mt-3 font-display text-3xl font-800 uppercase tracking-tight text-ink sm:text-4xl">
        Política de Privacidade
      </h1>

      <div className="mt-8 rounded-xl border border-copper/25 bg-copper-wash p-5 text-[14px] leading-relaxed text-ink-dim">
        <strong className="text-ink">Aviso:</strong> este é um modelo inicial,
        criado para descrever de forma transparente a operação atual do site
        www.nortgo.com. Os trechos marcados em{" "}
        <mark className="rounded border border-copper/30 bg-bg px-1 text-copper-ink">
          destaque
        </mark>{" "}
        precisam ser preenchidos com os dados reais da empresa, e o tratamento
        de dados dentro do aplicativo NortGo ainda será detalhado em documento
        próprio. Recomendamos revisão por um advogado especializado em proteção
        de dados antes de considerar este texto definitivo.
      </div>

      <article className="prose-policy mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-ink-dim">
        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            1. Quem somos
          </h2>
          <p className="mt-2">
            Esta Política de Privacidade se aplica ao site www.nortgo.com
            (&quot;Site&quot;), operado por{" "}
            <mark className="rounded bg-copper-wash px-1 text-copper-ink">
              [razão social da empresa]
            </mark>
            , inscrita no CNPJ sob o nº{" "}
            <mark className="rounded bg-copper-wash px-1 text-copper-ink">
              [CNPJ]
            </mark>
            , doravante denominada &quot;NortGo&quot;, &quot;nós&quot; ou
            &quot;nosso&quot;.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            2. O que este site trata
          </h2>
          <p className="mt-2">
            O www.nortgo.com é uma página <strong className="text-ink">
            informativa</strong>. Você{" "}
            <strong className="text-ink">
              não precisa fornecer nenhum dado
            </strong>{" "}
            para usá-la: não há formulário, cadastro, lista de espera nem campo
            de contato — nada que você preencha ativamente.
          </p>
          <p className="mt-2">
            O único tratamento de dados que ocorre neste Site são os{" "}
            <strong className="text-ink">
              registros técnicos automáticos de acesso
            </strong>{" "}
            (item 3), gerados pelo servidor a cada visita, como em qualquer
            site. Como esses registros incluem o endereço IP — que a LGPD pode
            classificar como dado pessoal — eles são descritos a seguir.
          </p>
          <p className="mt-2">
            Os botões <strong className="text-ink">&quot;Começar&quot;</strong> e{" "}
            <strong className="text-ink">&quot;Já tenho conta&quot;</strong>{" "}
            levam você para o aplicativo NortGo, hospedado em outro endereço
            (
            <a href={APP_SIGNUP_URL} className="text-copper-ink hover:underline">
              {appHost}
            </a>
            ). É lá — e só lá — que dados como e-mail e senha são solicitados,
            no momento em que você cria uma conta (item 4).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            3. Registros técnicos de acesso
          </h2>
          <p className="mt-2">
            A cada visita, o servidor e a rede de entrega (CDN) que servem o
            Site podem registrar automaticamente:{" "}
            <strong className="text-ink">endereço IP</strong>, tipo e versão do
            navegador, sistema operacional, páginas acessadas, data e hora.
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong className="text-ink">Para quê:</strong> manter o site no
              ar, diagnosticar erros e proteger contra ataques e abuso
              (ex.: negação de serviço).
            </li>
            <li>
              <strong className="text-ink">Base legal:</strong> legítimo
              interesse do operador na segurança e no funcionamento do serviço
              (art. 7º, IX, da LGPD).
            </li>
            <li>
              <strong className="text-ink">Quem processa:</strong> o provedor
              de hospedagem/CDN, na condição de operador, conforme a política de
              privacidade dele.{" "}
              <mark className="rounded bg-copper-wash px-1 text-copper-ink">
                [nome do provedor de hospedagem/CDN]
              </mark>
            </li>
            <li>
              <strong className="text-ink">Por quanto tempo:</strong> esses
              registros são mantidos por período curto e{" "}
              <mark className="rounded bg-copper-wash px-1 text-copper-ink">
                [prazo de retenção dos logs]
              </mark>
              , após o qual são descartados ou anonimizados.
            </li>
          </ul>
          <p className="mt-2">
            Esses registros não são usados para traçar seu perfil, para
            publicidade, nem cruzados com dados de outras fontes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            4. Dados tratados dentro do aplicativo NortGo
          </h2>
          <p className="mt-2">
            Quando você cria uma conta e usa o aplicativo, o NortGo passa a
            tratar os dados que você registra nele (por exemplo: e-mail,
            tarefas, notas, compromissos, informações financeiras e de saúde
            que você optar por guardar).
          </p>
          <p className="mt-2">
            O aplicativo funciona sobre a plataforma{" "}
            <strong className="text-ink">Base44</strong>, que atua como nossa
            operadora de tecnologia.{" "}
            <mark className="rounded bg-copper-wash px-1 text-copper-ink">
              [Detalhamento do tratamento no aplicativo — finalidades, base
              legal, retenção, subprocessadores e local de armazenamento —
              será publicado em documento próprio antes do lançamento.]
            </mark>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            5. Cookies
          </h2>
          <p className="mt-2">
            Este site{" "}
            <strong className="text-ink">não utiliza cookies</strong> de
            rastreamento, análise ou publicidade. Caso isso mude no futuro,
            esta política será atualizada e um aviso passará a ser exibido no
            site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            6. Seus direitos
          </h2>
          <p className="mt-2">
            Em relação a qualquer dado seu tratado pelo NortGo — os registros de
            acesso a este site ou os dados do aplicativo — você tem direito, a
            qualquer momento e gratuitamente, a confirmar a existência de
            tratamento, acessar os dados, corrigir dados desatualizados,
            solicitar a exclusão, revogar consentimento (quando o tratamento se
            basear nele) e solicitar a portabilidade.
          </p>
          <p className="mt-2">
            Para exercer qualquer um desses direitos, entre em contato pelo
            e-mail{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            7. Segurança
          </h2>
          <p className="mt-2">
            O site é servido integralmente por conexão criptografada (HTTPS).
            As medidas de segurança aplicadas aos dados dentro do aplicativo
            são descritas no documento citado no item&nbsp;4.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            8. Alterações a esta política
          </h2>
          <p className="mt-2">
            Esta política pode ser atualizada periodicamente. A data da última
            atualização está indicada no topo desta página.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            9. Contato
          </h2>
          <p className="mt-2">
            Dúvidas sobre esta política ou sobre o tratamento dos seus dados
            podem ser enviadas para{" "}
            <a
              href="mailto:contato@nortgo.com"
              className="text-copper-ink hover:underline"
            >
              contato@nortgo.com
            </a>{" "}
            <mark className="rounded bg-copper-wash px-1 text-copper-ink">
              [ou o e-mail do Encarregado de Dados (DPO), se for diferente]
            </mark>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
