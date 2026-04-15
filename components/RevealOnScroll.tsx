"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function RevealOnScroll({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isAlreadyVisible) {
      // Element is already in the viewport on initial paint — show immediately
      return;
    }

    // Element is below the fold — hide it and animate in on scroll
    el.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("reveal-hidden");
          el.classList.add("active");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
