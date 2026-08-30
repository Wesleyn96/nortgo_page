import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o NortGo coleta, usa e protege os dados pessoais informados neste site.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim hover:text-ink"
      >
        ← Voltar ao início
      </Link>

      <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-faint">
        Última atualização: 24 de agosto de 2026
      </p>
      <h1 className="mt-3 font-display text-3xl font-800 uppercase tracking-tight text-ink sm:text-4xl">
        Política de Privacidade
      </h1>

      <div className="mt-8 rounded-xl border border-copper/25 bg-copper-wash p-5 text-[14px] leading-relaxed text-ink-dim">
        <strong className="text-ink">Aviso:</strong> este é um modelo inicial
        de política de privacidade, criado para cumprir os requisitos
        básicos da LGPD (Lei nº 13.709/2018) na coleta de e-mails desta
        página. Os trechos marcados em{" "}
        <mark className="rounded bg-copper-wash px-1 text-copper-ink">
          destaque
        </mark>{" "}
        precisam ser preenchidos com os dados reais da empresa antes da
        publicação oficial. Recomendamos revisão por um advogado
        especializado em proteção de dados antes de considerar este texto
        definitivo.
      </div>

      <article className="prose-policy mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-ink-dim">
        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            1. Quem somos
          </h2>
          <p className="mt-2">
            Esta Política de Privacidade se aplica ao site nortgo.app
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
            2. Quais dados coletamos
          </h2>
          <p className="mt-2">
            Quando você se cadastra na nossa lista de espera, coletamos o
            seu <strong className="text-ink">endereço de e-mail</strong> e o
            registro de que você marcou a caixa de consentimento deste
            aviso. Não solicitamos senha, dados de pagamento, documentos ou
            qualquer outra informação sensível neste formulário.
          </p>
          <p className="mt-2">
            O processador de formulários que utilizamos (Formspree) também
            pode registrar automaticamente o endereço IP e informações
            técnicas do navegador no momento do envio, como parte do
            funcionamento normal do serviço.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            3. Para que usamos seu e-mail
          </h2>
          <p className="mt-2">Usamos o e-mail informado exclusivamente para:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Avisar você sobre o lançamento do NortGo na Web, App Store e
              Google Play;
            </li>
            <li>
              Enviar comunicações relacionadas ao produto antes do
              lançamento oficial.
            </li>
          </ul>
          <p className="mt-2">
            Não vendemos, alugamos ou compartilhamos seu e-mail com
            terceiros para fins de marketing de outras empresas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            4. Base legal
          </h2>
          <p className="mt-2">
            O tratamento do seu e-mail é baseado no seu{" "}
            <strong className="text-ink">consentimento</strong>, conforme o
            art. 7º, inciso I, da Lei Geral de Proteção de Dados (Lei nº
            13.709/2018), fornecido de forma livre, informada e inequívoca
            ao marcar a caixa de aceite no formulário de cadastro.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            5. Compartilhamento com terceiros
          </h2>
          <p className="mt-2">
            Utilizamos a plataforma <strong className="text-ink">Formspree</strong>{" "}
            (Formspree, Inc., sediada nos Estados Unidos) para processar o
            envio do formulário de cadastro, o que implica em uma
            transferência internacional do seu dado. A Formspree atua como
            nossa operadora e trata as informações de acordo com sua própria
            política de privacidade, disponível em{" "}
            <a
              href="https://formspree.io/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper-ink hover:underline"
            >
              formspree.io/legal/privacy-policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            6. Por quanto tempo guardamos seu e-mail
          </h2>
          <p className="mt-2">
            Mantemos seu e-mail armazenado até o lançamento oficial do
            NortGo ou até que você solicite a exclusão, o que ocorrer
            primeiro.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            7. Seus direitos
          </h2>
          <p className="mt-2">
            Como titular dos dados, você tem direito, a qualquer momento e
            gratuitamente, a:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar os dados que temos sobre você;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a exclusão dos seus dados;</li>
            <li>Revogar o consentimento dado, a qualquer momento;</li>
            <li>Solicitar a portabilidade dos seus dados a outro fornecedor.</li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer um desses direitos, entre em contato pelo
            e-mail{" "}
            <a href="mailto:nortgo@nortgo.com" className="text-copper-ink hover:underline">
              nortgo@nortgo.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            8. Cookies
          </h2>
          <p className="mt-2">
            Este site, na sua versão atual,{" "}
            <strong className="text-ink">não utiliza cookies</strong> de
            rastreamento, análise ou publicidade. Caso isso mude no futuro
            (por exemplo, com a adição de ferramentas de analytics), esta
            política será atualizada e um aviso de cookies passará a ser
            exibido no site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            9. Segurança
          </h2>
          <p className="mt-2">
            Adotamos medidas técnicas razoáveis para proteger o e-mail
            coletado contra acessos não autorizados, incluindo o uso de
            conexão criptografada (HTTPS) em todo o site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            10. Alterações a esta política
          </h2>
          <p className="mt-2">
            Esta política pode ser atualizada periodicamente. A data da
            última atualização está indicada no topo desta página.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-700 text-ink">
            11. Contato
          </h2>
          <p className="mt-2">
            Dúvidas sobre esta política ou sobre o tratamento dos seus
            dados podem ser enviadas para{" "}
            <a href="mailto:nortgo@nortgo.com" className="text-copper-ink hover:underline">
              nortgo@nortgo.com
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
