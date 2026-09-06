import Entrada from "@/components/Entrada";
import NeonCursor from "@/components/NeonCursor";

// Página pública: só a tela de entrada. As seções da landing longa
// (Hero, Features, Faq, etc.) continuam no repo em src/components/ — pararam
// de ser importadas aqui, mas podem voltar a qualquer momento.
export default function Home() {
  return (
    <>
      <NeonCursor />
      <Entrada />
    </>
  );
}
