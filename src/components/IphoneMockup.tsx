import Image from "next/image";
import screen from "../../public/nortgo-app-mobile.png";

// Mockup de iPhone (linha 16 Pro — ilhas dinâmica, bordas finas de titânio)
// com a captura real do app do NortGo dentro. Usado ao lado de
// "O mesmo NortGo, no bolso.". Componente de servidor: só imagem + CSS.
//
// A tela usa proporção de iPhone (1206×2622 ≈ 0.46). A captura é um pouco
// mais "quadrada" (462×892 ≈ 0.52), então entra com object-contain +
// alinhamento embaixo: a barra "Fale / Escreva" encosta na base e a ilha
// dinâmica fica no respiro escuro no topo, como num app real.

export default function IphoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      {/* corpo — titânio "quente" pra combinar com a paleta do site */}
      <div className="relative rounded-[2.6rem] bg-gradient-to-b from-[#1f1813] via-[#130f0d] to-[#0a0807] p-[1.4%] shadow-float ring-1 ring-black/45">
        {/* botões laterais */}
        <span aria-hidden className="absolute left-[-2px] top-[15%] h-[4%] w-[3px] rounded-l bg-[#140f0d]" />
        <span aria-hidden className="absolute left-[-2px] top-[24%] h-[8%] w-[3px] rounded-l bg-[#140f0d]" />
        <span aria-hidden className="absolute left-[-2px] top-[35%] h-[8%] w-[3px] rounded-l bg-[#140f0d]" />
        <span aria-hidden className="absolute right-[-2px] top-[27%] h-[12%] w-[3px] rounded-r bg-[#140f0d]" />

        {/* tela */}
        <div
          className="relative overflow-hidden rounded-[2.5rem] bg-[#0b0a09] ring-1 ring-white/5"
          style={{ aspectRatio: "1206 / 2622" }}
        >
          <Image
            src={screen}
            alt="Tela inicial do NortGo no celular, mostrando o dia com próximas ações, radar e atalhos"
            fill
            sizes="(max-width: 768px) 70vw, 280px"
            className="object-contain object-bottom"
          />

          {/* ilha dinâmica */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[1.4%] z-10 flex h-[3.3%] w-[30%] -translate-x-1/2 items-center justify-end gap-[6%] rounded-full bg-black pr-[6%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
          >
            <span className="h-1/3 w-auto aspect-square rounded-full bg-[#15161f]" />
          </span>

          {/* reflexo de vidro */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.05]"
          />
        </div>
      </div>
    </div>
  );
}
