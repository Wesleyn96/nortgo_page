export default function Problem() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="gradient-bg absolute inset-x-0 top-0 h-[560px]"
      />
      {/* fade escuro no fim da seção — a cor do glow "some aos poucos" no preto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-bg/0 to-bg"
      />
      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="section-title">
          Sua cabeça não é lugar para guardar recado, prazo e preocupação ao
          mesmo tempo.
        </p>
        <p className="lead mx-auto mt-6 max-w-xl text-ink-dim">
          A maioria dos apps de produtividade te dá mais uma lista para olhar.
          O NortGo faz o oposto: recebe tudo o que você joga nele (compromisso,
          tarefa, nota solta, decisão adiada) e devolve só o essencial de
          agora, sem exigir que você organize nada.
        </p>
      </div>
    </section>
  );
}
