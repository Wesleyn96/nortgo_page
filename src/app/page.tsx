import Hero from "@/components/Hero";
import Preview from "@/components/Preview";
import Problem from "@/components/Problem";
import SixApps from "@/components/SixApps";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CtaBand from "@/components/CtaBand";
import Platforms from "@/components/Platforms";
// Seção "Planos" desativada por ora — o componente (src/components/Pricing.tsx)
// fica no repo pra reativar no futuro: reimporte, coloque <Pricing /> de volta
// abaixo e restaure o link "Planos" na Nav e no Footer.
// import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <Preview />
      <Problem />
      <SixApps />
      <Features />
      <HowItWorks />
      <CtaBand />
      <Platforms />
      {/* <Pricing /> — seção "Planos" desativada temporariamente */}
      <Faq />
      <CtaFinal />
    </>
  );
}
