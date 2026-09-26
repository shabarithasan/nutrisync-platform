import { useState } from "react";
import { TrendingDown, Info } from "lucide-react";
import { WEEKLY, MONTHLY, TODAY } from "../utils/dashboardData";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Card shell                                                         */
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
        "rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(19,31,25,0.04),0_8px_24px_-12px_rgba(19,31,25,0.10)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(19,31,25,0.05),0_16px_40px_-16px_rgba(19,31,25,0.16)]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHead({
  eyebrow,
  title,
  hint,
  right,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-leaf-600">
          {eyebrow}
        </p>
        <h3 className="mt-1 font-display text-[1.15rem] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {hint && <p className="mt-1 text-xs leading-relaxed text-ink-soft/80">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Weekly Pulse — 7-day bars vs goal                                  */
/* ------------------------------------------------------------------ */
export function WeeklyPulse() {
  const [hover, setHover] = useState<number | null>(null);
  const max = 3000;
  const avgAdh = Math.round(
    (WEEKLY.reduce((s, d) => s + d.adherence, 0) / WEEKLY.length) * 100
  );

  return (
    <Card>
      <CardHead
        eyebrow="Weekly pulse"
        title="7-day intake & adherence"
        hint="Calories logged each day against your goal"
        right={
          <div className="text-right">
            <p className="font-display text-2xl font-semibold leading-none text-ink">
              {avgAdh}%
            </p>
            <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
              adherence
            </p>
          </div>
        }
      />

      {/* Bar area — goal line lives inside it so the math is exact */}
      <div className="relative h-[136px]">
        {/* Goal line */}
        <div
          className="absolute inset-x-0 z-10 border-t border-dashed border-leaf-500/60"
          style={{ bottom: `${(TODAY.kcalGoal / max) * 100}%` }}
        >
          <span className="absolute -top-2.5 right-0 rounded-full bg-leaf-500/12 px-2 py-0.5 text-[0.6rem] font-bold text-leaf-600">
            goal {TODAY.kcalGoal.toLocaleString()}
          </span>
        </div>

        <div className="flex h-full items-end gap-2 sm:gap-3">
          {WEEKLY.map((d, i) => {
            const h = (d.kcal / max) * 100;
            const isToday = i === WEEKLY.length - 1;
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
                    "pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto w-max -translate-y-full rounded-lg bg-forest-950 px-2.5 py-1.5 text-center shadow-lg transition-all duration-200",
                    hover === i ? "opacity-100" : "translate-y-[-40%] opacity-0"
                  )}
                >
                  <p className="font-display text-sm font-semibold text-cream">
                    {d.kcal.toLocaleString()}
                  </p>
                  <p className="text-[0.58rem] uppercase tracking-wider text-cream/50">
                    {Math.round(d.adherence * 100)}% adher.
                  </p>
                </div>

                {/* bar */}
                <div className="absolute inset-x-0 bottom-0">
                  <div
                    className="w-full rounded-t-lg"
                    style={{ height: `${h * 1.36}px` }}
                  >
                    <div
                      className="bar-anim h-full w-full rounded-t-lg transition-all duration-200 group-hover:brightness-110"
                      style={{
                        background: over
                          ? "linear-gradient(180deg,#F0B366,#D98E3A)"
                          : isToday
                            ? "linear-gradient(180deg,#C9F169,#1FA45F)"
                            : "linear-gradient(180deg,#CFE3D4,#9DB8A6)",
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day labels */}
      <div className="mt-2.5 flex gap-2 sm:gap-3">
        {WEEKLY.map((d, i) => (
          <span
            key={d.day}
            className={cn(
              "flex-1 text-center text-[0.65rem] font-semibold uppercase tracking-wider",
              i === WEEKLY.length - 1 ? "text-forest-900" : "text-ink-soft/55"
            )}
          >
            {d.day}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-5 border-t border-ink/[0.07] pt-4">
        <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink-soft">
          <span className="h-2 w-2 rounded-sm bg-leaf-500" /> On target
        </span>
        <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink-soft">
          <span className="h-2 w-2 rounded-sm bg-[#D98E3A]" /> Over goal
        </span>
        <span className="ml-auto font-display text-sm text-ink-soft">
          avg{" "}
          <span className="font-semibold text-ink">
            {Math.round(WEEKLY.reduce((s, d) => s + d.kcal, 0) / 7).toLocaleString()}
          </span>{" "}
          kcal
        </span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Monthly Trends — smooth area + line                                */
/* ------------------------------------------------------------------ */
export function MonthlyTrends() {
  const W = 520;
  const H = 168;
  const PAD = { t: 14, r: 8, b: 26, l: 8 };
  const values = MONTHLY.map((m) => m.value);
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;

  const pts = MONTHLY.map((m, i) => ({
    x:
      PAD.l +
      (i / (MONTHLY.length - 1)) * (W - PAD.l - PAD.r),
    y:
      PAD.t +
      (1 - (m.value - min) / (max - min)) * (H - PAD.t - PAD.b),
    ...m,
  }));

  // Smooth path via cubic bezier
  const line = pts.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD.b} L ${pts[0].x} ${H - PAD.b} Z`;

  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;

  return (
    <Card>
      <CardHead
        eyebrow="Monthly trends"
        title="Weight change"
        hint="Long-term progress and consistency"
        right={
          <div className="flex items-center gap-1.5 rounded-full bg-leaf-500/10 px-3 py-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-leaf-600" />
            <span className="text-sm font-bold text-forest-800">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg
            </span>
          </div>
        }
      />

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1FA45F" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#1FA45F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9DB8A6" />
              <stop offset="100%" stopColor="#1FA45F" />
            </linearGradient>
          </defs>

          {/* grid */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={PAD.t + f * (H - PAD.t - PAD.b)}
              y2={PAD.t + f * (H - PAD.t - PAD.b)}
              stroke="#131F19"
              strokeOpacity="0.05"
              strokeDasharray="3 5"
            />
          ))}

          <path d={area} fill="url(#areaGrad)" />
          <path
            d={line}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {pts.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === pts.length - 1 ? 5 : 3.5}
                fill="#fff"
                stroke={i === pts.length - 1 ? "#1FA45F" : "#9DB8A6"}
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={H - 8}
                textAnchor="middle"
                className="fill-ink-soft/55"
                style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4 }}
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/[0.07] pt-4">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
            Current
          </p>
          <p className="font-display text-lg font-semibold text-ink">
            {last.toFixed(1)}{" "}
            <span className="text-xs font-normal text-ink-soft">kg</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
            Target
          </p>
          <p className="font-display text-lg font-semibold text-ink">
            68.0 <span className="text-xs font-normal text-ink-soft">kg</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Calorie ring (dashboard variant)                                   */
/* ------------------------------------------------------------------ */
export function CalorieDial() {
  const pct = TODAY.kcalEaten / TODAY.kcalGoal;
  const C = 2 * Math.PI * 54;
  return (
    <div className="relative h-[152px] w-[152px]">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="#131F19"
          strokeOpacity="0.07"
          strokeWidth="11"
        />
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="url(#dialGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          className="ring-anim"
        />
        <defs>
          <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1FA45F" />
            <stop offset="100%" stopColor="#C9F169" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[2.1rem] font-semibold leading-none tracking-tight text-ink">
          {(TODAY.kcalGoal - TODAY.kcalEaten).toLocaleString()}
        </span>
        <span className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
          kcal left
        </span>
      </div>
    </div>
  );
}

export function AiBadge() {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-cream-dark px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
      <Info className="h-3 w-3" /> AI-estimated
    </span>
  );
}
