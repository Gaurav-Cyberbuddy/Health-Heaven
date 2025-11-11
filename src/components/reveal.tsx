"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
};

export default function Reveal({ children, delayMs = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delayMs);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={
        `${visible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'} ${className ?? ''}`
      }
    >
      {children}
    </div>
  );
}






