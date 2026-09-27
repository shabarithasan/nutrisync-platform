import { useId, useState } from "react";
import { TrendingDown } from "lucide-react";
import { WEEKLY, MONTHLY, TODAY } from "../../data/dashboardData";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "elev-1 rounded-xl border border-ink-900/[0.06] bg-surface transition-shadow duration-200 hover:elev-2",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  meta,
  hint,
  right,
}: {
  title: string;
  meta?: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-900/[0.06] px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate text-[0.9rem] font-semibold tracking-[-0.01em] text-ink-900">
            {title}
          </h3>
          {meta && (
            <span className="tnum shrink-0 text-[0.7rem] font-medium text-ink-400">
              {meta}
            </span>
          )}
        </div>
        {hint && (
          <p className="mt-1 text-[0.75rem] leading-snug text-ink-500">{hint}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/** Segmented range control */
export function Segmented({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-surface-3 p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "tnum rounded-[6px] px-2.5 py-1 text-[0.7rem] font-semibold transition-all duration-150",
            value === o
              ? "bg-surface text-ink-900 shadow-[0_1px_2px_rgba(16,22,19,0.10)]"
              : "text-ink-400 hover:text-ink-700"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Compact stat chip */
export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "attention";
}) {
  const tones = {
    neutral: "bg-surface-3 text-ink-500",
    positive: "bg-brand-100 text-brand-700",
    attention: "bg-signal-amber-bg text-signal-amber",
  };
  return (
    <span
      className={cn(
        "tnum inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkline — KPI trend micro-chart                                  */
/* ------------------------------------------------------------------ */

export function Sparkline({
  data,
  positive = true,
  width = 88,
  height = 30,
}: {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (width - pad * 2),
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));

  const line = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  const stroke = positive ? "var(--color-brand-500)" : "var(--color-signal-amber)";
  const gid = `sp-${uid}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.16" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r="2.5"
        fill={stroke}
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Calorie dial — thin, precise ring                                  */
/* ------------------------------------------------------------------ */

export function CalorieDial() {
  const pct = TODAY.kcalEaten / TODAY.kcalGoal;
  const R = 56;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative mx-auto h-[152px] w-[152px]">
      <svg viewBox="0 0 136 136" className="h-full w-full -rotate-90">
        <circle
          cx="68"
          cy="68"
          r={R}
          fill="none"
          stroke="var(--color-ink-900)"
          strokeOpacity="0.07"
          strokeWidth="8"
        />
        <circle
          cx="68"
          cy="68"
          r={R}
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          className="ring-draw"
          style={{ ["--dash-len" as string]: `${C}` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-[2.35rem] font-semibold leading-none tracking-[-0.03em] text-ink-900">
          {TODAY.kcalEaten.toLocaleString()}
        </span>
        <span className="mt-1.5 text-[0.68rem] font-medium text-ink-400">
          of {TODAY.kcalGoal.toLocaleString()} kcal
        </span>
        <span className="tnum mt-2.5 rounded-md bg-brand-50 px-2 py-0.5 text-[0.68rem] font-semibold text-brand-700">
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Weekly Pulse — bars with y-axis + goal line                        */
/* ------------------------------------------------------------------ */

const RANGES = ["7D", "30D", "90D"] as const;

export function WeeklyPulse() {
  const [range, setRange] = useState<string>("7D");
  const [hover, setHover] = useState<number | null>(null);

  // Scale factor keeps the chart meaningful per range
  const mult = range === "7D" ? 1 : range === "30D" ? 1.04 : 0.97;
  const data = WEEKLY.map((d) => ({ ...d, kcal: Math.round(d.kcal * mult) }));

  const H = 148;
  const max = 3000;
  const goalY = H - (TODAY.kcalGoal / max) * H;
  const avg = Math.round(data.reduce((s, d) => s + d.kcal, 0) / data.length);
  const avgAdh = Math.round(
    (data.reduce((s, d) => s + d.adherence, 0) / data.length) * 100
  );

  return (
    <Card className="flex flex-col">
      <CardHead
        title="Weekly pulse"
        meta="Sep 20 – 26"
        hint="Daily intake against goal, with adherence rate"
        right={<Segmented options={RANGES} value={range} onChange={setRange} />}
      />

      <div className="flex flex-1 px-5 pb-2 pt-5">
        {/* Y axis — exact plot height so labels align with gridlines */}
        <div
          className="mr-3 flex w-8 shrink-0 flex-col justify-between self-start text-right"
          style={{ height: H }}
        >
          {["3.0k", "2.0k", "1.0k"].map((t) => (
            <span
              key={t}
              className="tnum -translate-y-1/2 text-[0.62rem] font-medium text-ink-300 first:translate-y-0"
            >
              {t}
            </span>
          ))}
          <span className="tnum text-[0.62rem] font-medium text-ink-300">0</span>
        </div>

        {/* Plot */}
        <div className="relative min-w-0 flex-1">
          {/* gridlines */}
          <div className="relative" style={{ height: H }}>
            {[0.333, 0.666, 1].map((f) => (
              <div
                key={f}
                className="absolute inset-x-0 border-t border-ink-900/[0.055]"
                style={{ bottom: f * H }}
              />
            ))}

            {/* goal line */}
            <div
              className="absolute inset-x-0 border-t border-dashed border-brand-600/45"
              style={{ bottom: H - goalY }}
            >
              <span className="tnum absolute -top-2 right-0 rounded bg-brand-50 px-1.5 text-[0.6rem] font-semibold text-brand-700">
                goal
              </span>
            </div>

            {/* bars */}
            <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-3">
              {data.map((d, i) => {
                const h = (d.kcal / max) * H;
                const isLatest = i === data.length - 1;
                const over = d.kcal > TODAY.kcalGoal;
                return (
                  <div
                    key={d.day}
                    className="group relative h-full flex-1"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {/* tooltip */}
                    <div
                      className={cn(
                        "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-center shadow-lg transition-all duration-150",
                        hover === i
                          ? "translate-y-0 opacity-100"
                          : "translate-y-1 opacity-0"
                      )}
                    >
                      <p className="tnum text-[0.75rem] font-semibold text-white">
                        {d.kcal.toLocaleString()} kcal
                      </p>
                      <p className="tnum mt-0.5 text-[0.6rem] text-white/55">
                        {Math.round(d.adherence * 100)}% adherence
                      </p>
                    </div>

                    {/* hit area */}
                    <div className="absolute inset-x-0 bottom-0 h-full">
                      <div
                        className="bar-y w-full rounded-t-[4px] transition-colors duration-150"
                        style={{
                          height: h,
                          background: over
                            ? "var(--color-signal-amber)"
                            : isLatest
                              ? "var(--color-brand-600)"
                              : "var(--color-bar-neutral)",
                          animationDelay: `${i * 60}ms`,
                          opacity: hover === null || hover === i ? 1 : 0.55,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* x labels */}
          <div className="mt-2.5 flex gap-1.5 sm:gap-3">
            {data.map((d, i) => (
              <span
                key={d.day}
                className={cn(
                  "tnum flex-1 text-center text-[0.62rem] font-medium uppercase tracking-wide",
                  i === data.length - 1 ? "text-ink-900" : "text-ink-400"
                )}
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-4 flex items-center justify-between border-t border-ink-900/[0.06] px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink-500">
            <span className="h-2 w-2 rounded-[2px] bg-bar-neutral" /> On target
          </span>
          <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink-500">
            <span className="h-2 w-2 rounded-[2px] bg-signal-amber" /> Over goal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="tnum text-[0.72rem] text-ink-500">
            avg <span className="font-semibold text-ink-900">{avg.toLocaleString()}</span>
          </span>
          <span className="h-3 w-px bg-ink-900/10" />
          <Chip tone={avgAdh >= 85 ? "positive" : "attention"}>
            {avgAdh}% adherence
          </Chip>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Monthly Trends — line + area, axis + target                        */
/* ------------------------------------------------------------------ */

export function MonthlyTrends() {
  const W = 560;
  const H = 150;
  const PAD = { t: 10, r: 6, b: 24, l: 6 };

  const values = MONTHLY.map((m) => m.value);
  const min = 68;
  const max = 73;

  const pts = MONTHLY.map((m, i) => ({
    x: PAD.l + (i / (MONTHLY.length - 1)) * (W - PAD.l - PAD.r),
    y: PAD.t + (1 - (m.value - min) / (max - min)) * (H - PAD.t - PAD.b),
    ...m,
  }));

  const line = pts.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD.b} L ${pts[0].x} ${H - PAD.b} Z`;
  const lineLen = 1200;

  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  const target = 68;
  const targetY =
    PAD.t + (1 - (target - min) / (max - min)) * (H - PAD.t - PAD.b);

  return (
    <Card className="flex flex-col">
      <CardHead
        title="Monthly trends"
        meta="8 weeks"
        hint="Weight trajectory and consistency over time"
        right={
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-brand-600" />
            <span className="tnum text-[0.8rem] font-semibold text-brand-700">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg
            </span>
          </div>
        }
      />

      <div className="flex flex-1 px-5 pb-2 pt-5">
        {/* Y axis — sized to the plot area so labels sit on the gridlines */}
        <div
          className="mr-3 flex w-8 shrink-0 flex-col justify-between self-start text-right"
          style={{ height: H - PAD.t - PAD.b, marginTop: PAD.t, marginBottom: PAD.b }}
        >
          {["73", "71", "69"].map((t) => (
            <span
              key={t}
              className="tnum -translate-y-1/2 text-[0.62rem] font-medium text-ink-300 first:translate-y-0 last:translate-y-0"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: H }}
          >
            <defs>
              <linearGradient id="mtArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* gridlines */}
            {[0, 0.5, 1].map((f) => (
              <line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={PAD.t + f * (H - PAD.t - PAD.b)}
                y2={PAD.t + f * (H - PAD.t - PAD.b)}
                stroke="var(--color-ink-900)"
                strokeOpacity="0.055"
              />
            ))}

            {/* target line */}
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={targetY}
              y2={targetY}
              stroke="var(--color-brand-600)"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            />

            <path d={area} fill="url(#mtArea)" />
            <path
              d={line}
              fill="none"
              stroke="var(--color-brand-600)"
              strokeWidth="2"
              strokeLinecap="round"
              className="line-draw"
              style={{
                strokeDasharray: lineLen,
                ["--dash-len" as string]: `${lineLen}`,
              }}
            />

            {/* endpoint marker */}
            <circle
              cx={pts[pts.length - 1].x}
              cy={pts[pts.length - 1].y}
              r="4"
              fill="var(--color-brand-600)"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          <div className="mt-2 flex justify-between">
            {MONTHLY.map((m, i) => (
              <span
                key={m.label}
                className={cn(
                  "tnum text-[0.62rem] font-medium",
                  i === MONTHLY.length - 1 ? "text-ink-900" : "text-ink-400"
                )}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-ink-900/[0.06] border-t border-ink-900/[0.06]">
        {[
          { label: "Current", value: `${last.toFixed(1)} kg` },
          { label: "Target", value: `${target.toFixed(1)} kg` },
          {
            label: "To go",
            value: `${(last - target).toFixed(1)} kg`,
            accent: true,
          },
        ].map((s) => (
          <div key={s.label} className="px-5 py-3">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-ink-400">
              {s.label}
            </p>
            <p
              className={cn(
                "tnum mt-1 text-[1.05rem] font-semibold tracking-[-0.02em]",
                s.accent ? "text-brand-700" : "text-ink-900"
              )}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
