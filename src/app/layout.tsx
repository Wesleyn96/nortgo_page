import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = "https://www.nortgo.com";
const title = "NortGo · Sua vida, organizada num só lugar";
const description =
  "NortGo reúne rotina, tarefas, notas, agenda, finanças e saúde num único sistema pessoal, e mostra apenas o que merece sua atenção agora. Já disponível na Web; em breve na App Store e Google Play.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · NortGo",
  },
  description,
  keywords: [
    "NortGo",
    "organização pessoal",
    "produtividade",
    "rotina",
    "tarefas",
    "agenda",
    "finanças pessoais",
  ],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "NortGo",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// `operatingSystem` omitido de propósito: é um claim estruturado (lido por
// buscadores) de compatibilidade que ainda não pode ser comprovado — o app
// não está publicado em nenhuma loja. Readicionar quando houver versão no ar.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NortGo",
  applicationCategory: "LifestyleApplication",
  description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Site sempre no tema escuro (a tela de entrada tem foto de fundo escura
    // e o logo tem o "Nort" branco). `data-theme="dark"` fixo no <html>.
    <html lang="pt-BR" className="h-full antialiased" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-svh flex flex-col bg-bg text-ink font-display">
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
