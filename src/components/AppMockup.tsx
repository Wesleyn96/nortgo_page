import Image from "next/image";
import icon from "../../public/brand/nortgo-icon.png";

// A representação da "tela do dia" do NortGo — de propósito o oposto de um
// dashboard: uma coluna calma, "3 coisas, e só". É o argumento da marca em
// forma de imagem, então nada aqui deve parecer um painel de métricas.

const nav = [
  { label: "Hoje", active: true },
  { label: "Rotina", active: false },
  { label: "Tarefas", active: false },
  { label: "Notas", active: false },
  { label: "Agenda", active: false },
  { label: "Finanças", active: false },
  { label: "Saúde", active: false },
];

const later = [
  { time: "17:00", label: "Buscar as crianças na escola" },
  { time: "19:00", label: "Corrida no parque" },
  { time: "—", label: "Responder a proposta da Marina" },
];

const notes = ["Trocar o óleo do carro este mês", "Ideia: presente de aniversário do pai"];

export default function AppMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-bg-raised shadow-float">
      {/* barra de janela */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </div>
        <div className="mx-auto hidden rounded-full border border-line px-4 py-1 font-mono text-[11px] text-ink-faint sm:block">
          nortgo.app/hoje
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[176px_1fr]">
        {/* barra lateral */}
        <aside className="hidden flex-col gap-1 border-r border-line bg-bg-secondary p-4 sm:flex">
          <div className="mb-4 flex items-center gap-2 px-2">
            <Image src={icon} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            <span className="font-display text-[14px] font-bold tracking-tight text-ink">
              NortGo
            </span>
          </div>
          {nav.map((item) => (
            <span
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${
                item.active
                  ? "bg-copper-wash font-600 text-copper-ink"
                  : "text-ink-dim"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  item.active ? "bg-copper" : "bg-line-strong"
                }`}
              />
              {item.label}
            </span>
          ))}
        </aside>

        {/* coluna do dia */}
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                Hoje
              </h3>
              <p className="mt-1 text-[13px] text-ink-faint">
                Quinta-feira, 12 de junho
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-copper-ink">
              3 coisas, e só
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              Agora
            </span>
            <div className="mt-2 flex gap-3 rounded-xl border border-copper/25 bg-copper-wash p-4">
              <span className="mt-0.5 w-0.5 shrink-0 rounded-full bg-copper" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-copper-ink">
                  13:30 · em 40 min
                </p>
                <p className="mt-1 text-[14px] text-ink">
                  Reunião com o time de vendas
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              A seguir
            </span>
            <ul className="mt-2 flex flex-col divide-y divide-line">
              {later.map((item) => (
                <li key={item.label} className="flex items-center gap-3 py-2.5">
                  <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                    {item.time}
                  </span>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                  <span className="text-[13px] text-ink-dim">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              Anotado hoje
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {notes.map((note) => (
                <span
                  key={note}
                  className="rounded-lg border border-line bg-bg-secondary px-2.5 py-1.5 text-[12px] text-ink-dim"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2.5 rounded-full border border-line-strong px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-copper" />
            <span className="font-mono text-[11px] text-ink-faint">
              O que você precisa lembrar?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
