"use client";

import { useEffect, useRef } from "react";

// Brilho quente ("neon" na cor da marca) que segue o cursor com leve atraso,
// dando um rastro. Puramente decorativo: pointer-events none, aria-hidden.
// Só ativa em ponteiro fino (desktop) e respeita prefers-reduced-motion.
//
// O loop de animação NÃO roda o tempo todo: ele só é agendado enquanto o
// brilho ainda está "alcançando" o cursor. Quando chega (ou o cursor sai da
// janela, ou a aba fica oculta) o loop para; o próximo movimento o reinicia.
export default function NeonCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0; // 0 = loop parado

    const render = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      render();
      // Parou de valer a pena animar? Encosta no alvo e encerra o loop.
      if (Math.abs(targetX - x) < 0.4 && Math.abs(targetY - y) < 0.4) {
        x = targetX;
        y = targetY;
        render();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = "1";
      start();
    };
    const onLeave = () => {
      el.style.opacity = "0";
      stop();
    };
    const onVisibility = () => {
      if (document.hidden) stop();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="neon-cursor" />;
}
