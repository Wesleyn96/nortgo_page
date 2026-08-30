"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import icon from "../../public/brand/nortgo-icon.png";
import wordmark from "../../public/brand/nortgo-wordmark.png";

const links = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  // { href: "#planos", label: "Planos" }, — seção "Planos" desativada por ora
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line-strong bg-bg-raised/90 shadow-card backdrop-blur-md"
          : "border-line bg-bg-raised/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          aria-label="NortGo"
        >
          <Image
            src={icon}
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 object-contain"
            priority
          />
          <Image
            src={wordmark}
            alt="NortGo"
            width={320}
            height={92}
            className="h-[26px] w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#lista-de-espera"
          data-track="nav-cta"
          className="btn-glass-copper px-4 py-2 text-[13px]"
        >
          Entrar na lista
        </a>
      </div>
    </header>
  );
}
