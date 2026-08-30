"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import icon from "../../public/brand/nortgo-icon.png";
import wordmark from "../../public/brand/nortgo-wordmark.png";

// ─── Efeito "estrela" atrás de cada palavra ───────────────────────────────
// Brilho de nebulosa suave (blur forte + opacity baixa) atrás de cada palavra.
// PARA DESFAZER: `STAR_GLOW = false`.
const STAR_GLOW = true;
const GLOW = "#e6b25c"; // dourado (a cor que estava em "Hábitos")

const apps = [
  { label: "Agenda", fromX: -260, fromY: -120, glow: GLOW },
  { label: "Notas", fromX: 240, fromY: -140, glow: GLOW },
  { label: "Tarefas", fromX: -300, fromY: 40, glow: GLOW },
  { label: "Hábitos", fromX: 300, fromY: 60, glow: GLOW },
  { label: "Finanças", fromX: -180, fromY: 200, glow: GLOW },
  { label: "Saúde", fromX: 190, fromY: 210, glow: GLOW },
];

// A animação acompanha o scroll (não é sticky/travada): a seção rola normal
// com a página e o progresso da animação é a posição dela na viewport.
function ConvergingChip({
  label,
  fromX,
  fromY,
  glow,
  index,
  progress,
}: {
  label: string;
  fromX: number;
  fromY: number;
  glow: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0.24, 0.58], [fromX, 0]);
  const y = useTransform(progress, [0.24, 0.58], [fromY, 0]);
  const opacity = useTransform(
    progress,
    [0.2, 0.32, 0.52, 0.62],
    [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [0.24, 0.58], [1, 0.4]);

  return (
    <motion.span
      style={{ x, y, opacity, scale }}
      className="absolute whitespace-nowrap font-mono text-[24px] tracking-[0.02em] text-ink"
    >
      {STAR_GLOW && (
        <span
          aria-hidden
          className="star-glow"
          style={{
            background: `radial-gradient(closest-side, ${glow}, transparent)`,
            animationDelay: `${index * 0.8}s`,
          }}
        />
      )}
      <span className="relative">{label}</span>
    </motion.span>
  );
}

export default function SixApps() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.16, 0.28], [0, 1]);
  // Revela e fica CRAVADA em 1 (nunca volta a 0): a logo não desbota. Ela
  // só sai de vista rolando junto com a seção, como qualquer conteúdo.
  const markOpacity = useTransform(scrollYProgress, [0.56, 0.7], [0, 1]);
  const markScale = useTransform(scrollYProgress, [0.56, 0.7], [0.8, 1]);

  if (reduceMotion) {
    return (
      <section>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <h2 className="section-title">
            Uma vida não deveria precisar de seis aplicativos.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {apps.map((app) => (
              <span
                key={app.label}
                className="rounded-full border border-line-strong bg-bg-raised px-4 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim"
              >
                {app.label}
              </span>
            ))}
          </div>
          <Image
            src={icon}
            alt="NortGo"
            width={56}
            height={56}
            className="mx-auto mt-10"
          />
        </div>
      </section>
    );
  }

  return (
    // Seção alta (min-h-[130vh]) que rola normal — a animação acompanha o
    // scroll pela posição da seção na tela, sem travar nada.
    <section ref={ref} className="relative overflow-x-clip">
      <div className="mx-auto flex min-h-[130vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.h2
          style={{ opacity: headlineOpacity }}
          className="section-title max-w-2xl text-balance"
        >
          Uma vida não deveria precisar de seis aplicativos.
        </motion.h2>

        <div className="relative mt-16 flex h-[22rem] w-full max-w-xl items-center justify-center sm:mt-20">
          {apps.map((app, i) => (
            <ConvergingChip
              key={app.label}
              {...app}
              index={i}
              progress={scrollYProgress}
            />
          ))}

          <motion.div
            style={{ opacity: markOpacity, scale: markScale }}
            className="flex flex-col items-center gap-6"
          >
            <Image src={icon} alt="" width={288} height={288} />
            <Image
              src={wordmark}
              alt="NortGo"
              width={320}
              height={92}
              className="h-auto w-52"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
