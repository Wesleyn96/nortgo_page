import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

// Tema escuro é o padrão. Antes da primeira pintura: mantém 'dark' a menos
// que a pessoa tenha escolhido 'light' explicitamente (via ThemeToggle).
const themeScript =
  "try{if(localStorage.getItem('nortgo-theme')==='light'){document.documentElement.removeAttribute('data-theme')}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}";

const siteUrl = "https://nortgo.app";
const title = "NortGo · Sua vida, organizada num só lugar";
const description =
  "NortGo reúne rotina, tarefas, notas, agenda, finanças e saúde num único sistema pessoal, e mostra apenas o que merece sua atenção agora. Em breve na Web, App Store e Google Play.";

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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NortGo",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web, iOS, Android",
  description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o themeScript abaixo escreve data-theme no
    // <html> antes do React hidratar, então esse atributo diverge do SSR
    // de propósito (padrão de anti-flash de tema).
    <html
      lang="pt-BR"
      className="h-full antialiased"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink font-display">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ThemeToggle />
      </body>
    </html>
  );
}
