"use client";

import { motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { EASE_CINEMATIC } from "@/lib/motion";
import rotinaImg from "../../public/features/rotina.png";
import tarefaImg from "../../public/features/tarefa.png";
import notaImg from "../../public/features/nota.png";
import agendaImg from "../../public/features/agenda.png";
import financaImg from "../../public/features/financa.png";
import saudeImg from "../../public/features/saude.png";

type Feature = {
  name: string;
  benefit: string;
  body: string;
  img: StaticImageData;
};

const features: Feature[] = [
  {
    name: "Rotina",
    benefit: "Construa ritmo. Não pressão.",
    body: "Os hábitos e horários fixos do seu dia, sem precisar reconferir toda manhã se ainda valem.",
    img: rotinaImg,
  },
  {
    name: "Tarefas",
    benefit: "Saiba o próximo passo. Sem carregar tudo na cabeça.",
    body: "O que precisa ser feito, com prazo real, não uma lista que só cresce e nunca esvazia.",
    img: tarefaImg,
  },
  {
    name: "Notas",
    benefit: "Capture antes de esquecer.",
    body: "Aquela ideia, número ou lembrete solto que você anotaria num post-it e esqueceria em seguida.",
    img: notaImg,
  },
  {
    name: "Agenda",
    benefit: "Seu tempo. Com contexto.",
    body: "Reuniões e compromissos cruzados com o resto do seu dia, não isolados numa grade vazia.",
    img: agendaImg,
  },
  {
    name: "Finanças",
    benefit: "Veja seu dinheiro. Sem fugir dos números.",
    body: "O básico das suas contas, visível junto do resto da sua vida, não escondido num app à parte.",
    img: financaImg,
  },
  {
    name: "Saúde",
    benefit: "Cuidar também é acompanhar.",
    body: "Consultas, hábitos e sinais do seu corpo, sem precisar lembrar de tudo sozinho.",
    img: saudeImg,
  },
];

export default function Features() {
  return (
    <section id="recursos">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="section-title">Seis áreas. Um sistema só.</h2>
        </div>

        {/* Grid uniforme 3×2 (2×3 no tablet, 1 coluna no celular) — todos os
            cards com exatamente a mesma largura e altura. Cada card anima
            sozinho ao entrar na viewport (mais confiável que um observer
            único para o grid inteiro, que agora é bem alto). */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.article
              key={feature.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.06,
                ease: EASE_CINEMATIC,
              }}
              className="overflow-hidden rounded-2xl border border-line-strong bg-bg-raised shadow-card transition-colors hover:border-copper/30"
            >
              {/* imagem colada no topo e nas laterais; os cantos de cima
                  arredondam pelo overflow-hidden do card. Altura fixa (não
                  aspect-ratio) porque com fill do next/image precisa de uma
                  altura resolvida — aspect-ratio colapsava para 0 aqui. */}
              <div className="relative h-52 w-full overflow-hidden bg-bg-raised-2 sm:h-56">
                <Image
                  src={feature.img}
                  alt={`Tela de ${feature.name} do NortGo`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover object-top"
                />
                {/* máscara de gradiente: nítida em cima, dissolve na cor do
                    card embaixo. A cor final é um token, então funciona nos
                    dois temas (claro e escuro). */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-raised/0 from-60% to-bg-raised to-98%"
                />
              </div>

              <div className="flex flex-col gap-3 p-6">
                <span className="eyebrow text-ink-faint">{feature.name}</span>
                <h3 className="sub-heading">{feature.benefit}</h3>
                <p className="text-base leading-relaxed text-ink-dim">
                  {feature.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="caption mt-8 max-w-xl text-ink-faint">
          Também existem Espaços: áreas da vida que você organiza do seu
          jeito, para o que não cabe nas categorias acima.
        </p>
      </div>
    </section>
  );
}
