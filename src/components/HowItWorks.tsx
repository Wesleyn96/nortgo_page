"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { EASE_CINEMATIC } from "@/lib/motion";
import arrow from "../../public/brand/arrow-right.png";

const steps = [
  {
    n: "01",
    title: "Você joga tudo nele",
    body: "Digita, cola ou dita: compromisso, tarefa, ideia solta. Sem formulário, sem categoria pra escolher.",
  },
  {
    n: "02",
    title: "O NortGo filtra",
    body: "Cruza prazos, rotina e prioridade para decidir o que realmente precisa da sua atenção hoje.",
  },
  {
    n: "03",
    title: "Você vê só o essencial",
    body: "Uma tela por dia, com o que importa agora. O resto fica guardado, fora da sua cabeça.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="section-title mx-auto max-w-lg text-center">
          Do caos ao essencial, em três passos
        </h2>

        {/* Mesmo modelo de grid/cards da seção Features. Gap maior (gap-12)
            pra dar respiro entre os cards e as setas. */}
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-12">
          {steps.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: EASE_CINEMATIC,
              }}
              className="relative flex flex-col gap-3 rounded-2xl border border-line-strong bg-bg-raised p-6 shadow-card transition-colors hover:border-copper/30"
            >
              <span className="eyebrow text-ink-faint">Passo {step.n}</span>
              <h3 className="sub-heading">{step.title}</h3>
              <p className="text-base leading-relaxed text-ink-dim">
                {step.body}
              </p>

              {i < steps.length - 1 && (
                <Image
                  src={arrow}
                  alt=""
                  aria-hidden
                  width={283}
                  height={209}
                  className="absolute left-1/2 top-[calc(100%+1.25rem)] z-10 h-3 w-auto -translate-x-1/2 -translate-y-1/2 rotate-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] sm:left-[calc(100%+1.5rem)] sm:top-1/2 sm:rotate-0"
                />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
