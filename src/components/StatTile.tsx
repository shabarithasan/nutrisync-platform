import React from 'react';
import { cn } from '../utils/cn';

export function StatTile({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  pct,
  accent,
  delay,
}) {
  return (
    <div
      className={cn(
        "animate-fade-up group relative overflow-hidden rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(19,31,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-14px_rgba(19,31,25,0.20)]",
        delay
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(closest-side, ${accent}33, transparent)` }}
      />
      <div className="flex items-start justify-between">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accent}18` }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: accent }} />
        </span>
        <span
          className="font-display text-sm font-semibold"
          style={{ color: accent }}
        >
          {Math.round(pct * 100)}%
        </span>
      </div>
      <p className="mt-4 font-display text-[1.75rem] font-semibold leading-none tracking-tight text-ink">
        {value}
        <span className="ml-1 text-sm font-normal text-ink-soft">{unit}</span>
      </p>
      <p className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
        {label}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
        <div
          className="bar-anim h-full rounded-full"
          style={{ width: `${Math.min(pct, 1) * 100}%`, background: accent }}
        />
      </div>
      <p className="mt-2 text-[0.65rem] font-medium text-ink-soft/70">{sub}</p>
    </div>
  );
}