"use client";

import { motion } from "motion/react";
import { EASE_CINEMATIC } from "@/lib/motion";
import Waitlist from "@/components/Waitlist";
import WaitlistProof from "@/components/WaitlistProof";
import IpadMockup from "@/components/IpadMockup";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_CINEMATIC },
  },
};

export default function Hero() {
  return (
    <section
      id="produto"
      className="hero-wash relative overflow-hidden"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative mx-auto max-w-4xl px-6 pt-16 text-center md:pt-24"
      >
        <h1 className="display-title pb-3">
          <motion.span variants={rise} className="block">
            Tudo da sua vida.
          </motion.span>
          <motion.span variants={rise} className="text-grad block pb-[0.12em]">
            No mesmo lugar.
          </motion.span>
        </h1>

        <motion.p
          variants={rise}
          className="lead mx-auto mt-6 max-w-xl text-ink-dim"
        >
          Rotina, tarefas, notas, agenda, finanças e saúde, organizados num
          único sistema pessoal que mostra só o que merece sua atenção agora.
        </motion.p>

        <motion.div variants={rise} className="mx-auto mt-8 max-w-md" data-track="hero-primary-cta">
          <Waitlist variant="compact" />
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <WaitlistProof />
          <a
            href="#recursos"
            data-track="hero-secondary-cta"
            className="eyebrow text-ink-dim underline decoration-line-strong decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            Ver como funciona
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: EASE_CINEMATIC }}
        className="relative mx-auto mt-14 max-w-5xl px-6 pb-20 md:mt-20 md:pb-28"
      >
        <div aria-hidden className="mockup-glow" />
        <div className="relative">
          <IpadMockup />
        </div>
      </motion.div>
    </section>
  );
}
