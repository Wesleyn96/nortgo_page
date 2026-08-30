// Mockup de um iPad (landscape) com o vídeo de demonstração rodando dentro
// da tela — a "prova em movimento" do produto no hero. Componente de
// servidor: o <video> é só HTML e a flutuação contínua é CSS puro
// (.ipad-float em globals.css, já com fallback de prefers-reduced-motion).

// Aspecto real do arquivo em public/nortgo-demo.mp4 (1524×980) — a tela usa
// exatamente essa proporção, então o object-cover não corta nada.
const VIDEO_ASPECT = "1524 / 980";

export default function IpadMockup() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* corpo do aparelho — alumínio "bronze escuro" em vez do grafite frio
          da Apple, pra não brigar com a paleta quente do site */}
      <div className="relative rounded-[1.55rem] bg-gradient-to-b from-[#1f1813] via-[#130f0d] to-[#0a0807] p-[0.8%] shadow-[0_0_150px_-6px_rgba(232,123,0,0.38),0_0_55px_-14px_rgba(232,123,0,0.45),0_2px_6px_rgba(0,0,0,0.5),0_30px_60px_-24px_rgba(0,0,0,0.75),0_70px_140px_-40px_rgba(0,0,0,0.9)] ring-1 ring-[#E87B00]/25">
        {/* moldura da tela */}
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black ring-1 ring-white/5">
          {/* câmera frontal, centralizada na borda longa superior */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[1.6%] z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/20 ring-1 ring-black/40"
          />

          <video
            className="block w-full object-cover"
            style={{ aspectRatio: VIDEO_ASPECT }}
            src="/nortgo-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Demonstração do NortGo em funcionamento"
          >
            Seu navegador não reproduz o vídeo de demonstração do NortGo.
          </video>

          {/* reflexo de vidro — diagonal sutil sobre a tela */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.06]"
          />
        </div>
      </div>
    </div>
  );
}
