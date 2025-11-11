"use client";

export function NeonBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle animated grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(129,140,248,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />
      {/* Cyan glow blob */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/25 blur-3xl animate-pulse-slow" />
      {/* Magenta glow blob */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse-slow [animation-delay:200ms]" />
      {/* Center light cone */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-cyan-200/10 to-fuchsia-200/10 blur-[90px]" />
    </div>
  );
}


