"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Concept", href: "#concept" },
  { label: "Événements", href: "#evenements" },
  { label: "Ambiance", href: "#ambiance" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav shadow-[0_20px_48px_rgba(10,6,4,0.22)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#accueil"
            className="logo-chip flex items-center gap-3 rounded-full px-3 py-2"
            aria-label="Pouet Pouet, retour à l'accueil"
          >
            <Image
              src="/brand/logo-light.png"
              alt="Logo Pouet Pouet"
              width={132}
              height={54}
              className="h-8 w-auto"
              priority
            />
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[#fff4e8]/78 transition-colors hover:text-[#ffe4bd]"
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="button-primary px-5 py-3 text-sm">
              Demander un devis
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#fff4e8] md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-[#1b1513]/96 transition md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-7 px-6 text-center">
          <Image
            src="/brand/logo-light.png"
            alt="Logo Pouet Pouet"
            width={198}
            height={80}
            className="h-14 w-auto"
          />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="font-display text-4xl italic text-[#fff4e8]"
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={closeMenu} className="button-primary">
            Demander un devis
          </a>
        </div>
      </div>
    </>
  );
}
