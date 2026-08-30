"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_CINEMATIC } from "@/lib/motion";
import IphoneMockup from "@/components/IphoneMockup";

export default function Preview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <h2 className="section-title">
            <span className="text-grad">O mesmo NortGo</span>, no bolso.
          </h2>
          <p className="lead mt-6 max-w-md text-ink-dim">
            Nada de painéis cheios de gráficos ou listas que nunca acabam. No
            celular, o NortGo abre direto no que importa agora. O resto fica a
            um toque de distância, não na sua frente o tempo todo.
          </p>
          <p className="caption mt-6 max-w-md text-ink-faint">
            A tela ao lado é uma representação do conceito em desenvolvimento.
            O produto final pode mudar até o lançamento.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
            className="w-full max-w-[280px]"
          >
            <IphoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
