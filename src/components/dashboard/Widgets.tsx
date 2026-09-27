import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Check,
  Minus,
  Plus,
  ScanBarcode,
  Calculator,
  MessageSquare,
  Utensils,
  ArrowUpRight,
  Leaf,
  Droplet,
  Download,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import {
  AI_INSIGHTS,
  RECENT_MEALS,
  TODAY,
  type NavId,
  type Insight,
} from "../../data/dashboardData";
import { Card, CardHead } from "./Charts";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  AI Health Summary                                                  */
/* ------------------------------------------------------------------ */

const LEVEL: Record<
  Insight["level"],
  { icon: typeof Check; chip: string; dot: string; label: string }
> = {
  strong: {
    icon: TrendingUp,
    chip: "bg-brand-100 text-brand-700",
    dot: "bg-brand-500",
    label: "On track",
  },
  attention: {
    icon: AlertTriangle,
    chip: "bg-signal-amber-bg text-signal-amber",
    dot: "bg-signal-amber",
    label: "Attention",
  },
  opportunity: {
    icon: Lightbulb,
    chip: "bg-signal-blue-bg text-signal-blue",
    dot: "bg-signal-blue",
    label: "Opportunity",
  },
};

export function AIHealthSummary() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const generate = () => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("done"), 1400);
  };

  return (
    <Card className="flex flex-col">
      <CardHead
        title="AI health summary"
        meta="21 meals analyzed"
        right={
          <button
            onClick={generate}
            disabled={state !== "idle"}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-semibold transition-all duration-150",
              state === "idle" &&
                "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]",
              state === "loading" && "bg-brand-700 text-white",
              state === "done" && "bg-brand-100 text-brand-700"
            )}
          >
            {state === "idle" && (
              <>
                <Sparkles className="h-3 w-3" /> Generate
              </>
            )}
            {state === "loading" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Analyzing
              </>
            )}
            {state === "done" && (
              <>
                <Check className="h-3 w-3" /> Ready
              </>
            )}
          </button>
        }
      />

      {state === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-3">
            <Sparkles className="h-5 w-5 text-brand-600" />
          </span>
          <p className="mt-3.5 text-[0.85rem] font-semibold text-ink-900">
            Weekly summary available
          </p>
          <p className="mt-1.5 max-w-[240px] text-[0.75rem] leading-relaxed text-ink-500">
            7 days of macros, 21 meals and your weight trend are ready to review.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="space-y-3 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border border-ink-900/[0.05] p-3.5">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-2.5 w-full rounded" />
              <div className="skeleton h-2.5 w-4/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {state === "done" && (
        <>
          <div className="animate-fade-up divide-y divide-ink-900/[0.05]">
            {AI_INSIGHTS.map((ins) => {
              const L = LEVEL[ins.level];
              return (
                <div key={ins.title} className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.06em]",
                        L.chip
                      )}
                    >
                      <L.icon className="h-2.5 w-2.5" />
                      {L.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.82rem] font-semibold leading-snug text-ink-900">
                    {ins.title}
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-500">
                    {ins.body}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-auto border-t border-ink-900/[0.06] p-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[0.75rem] font-semibold text-ink-500 transition-colors hover:bg-surface-3 hover:text-ink-900">
              <Download className="h-3.5 w-3.5" />
              Download text report
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Water — precise segmented meter                                    */
/* ------------------------------------------------------------------ */

export function WaterTracker() {
  const [glasses, setGlasses] = useState(TODAY.waterDrunk);
  const pct = glasses / TODAY.waterGoal;

  return (
    <Card>
      <CardHead
        title="Hydration"
        hint="Tap a segment to log glasses"
        right={
          <span className="tnum text-[1.15rem] font-semibold tracking-[-0.02em] text-ink-900">
            {(glasses * 0.25).toFixed(2)}
            <span className="text-[0.75rem] font-normal text-ink-400"> L</span>
          </span>
        }
      />

      <div className="px-5 pb-5 pt-4">
        <div className="flex gap-1">
          {Array.from({ length: TODAY.waterGoal }).map((_, i) => {
            const filled = i < glasses;
            return (
              <button
                key={i}
                onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
                aria-label={`${i + 1} glasses`}
                className="group h-10 flex-1"
              >
                <span
                  className={cn(
                    "block h-full rounded-[3px] border transition-all duration-200",
                    filled
                      ? "border-signal-blue/30 bg-signal-blue/85"
                      : "border-ink-900/[0.09] bg-surface-3 group-hover:border-signal-blue/40"
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setGlasses((g) => Math.max(0, g - 1))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-ink-900/[0.09] bg-surface text-ink-500 transition-colors hover:border-ink-900/20 hover:text-ink-900"
            aria-label="Remove a glass"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-900/[0.07]">
            <div
              className="h-full rounded-full bg-signal-blue transition-all duration-300"
              style={{ width: `${pct * 100}%` }}
            />
          </div>
          <button
            onClick={() => setGlasses((g) => Math.min(TODAY.waterGoal, g + 1))}
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700"
            aria-label="Add a glass"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between">
          <span className="tnum text-[0.75rem] text-ink-500">
            <span className="font-semibold text-ink-900">{glasses}</span> of{" "}
            {TODAY.waterGoal} glasses
          </span>
          <span className="tnum text-[0.7rem] font-semibold text-signal-blue">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent meals — data list                                           */
/* ------------------------------------------------------------------ */

export function RecentMeals({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  return (
    <Card className="flex flex-col">
      <CardHead
        title="Recent meals"
        meta="Today"
        right={
          <button
            onClick={() => onNavigate("meals")}
            className="group flex items-center gap-1 text-[0.72rem] font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            All meals
            <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px" />
          </button>
        }
      />

      <div className="divide-y divide-ink-900/[0.05]">
        {RECENT_MEALS.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-5 py-3">
            {m.image ? (
              <img
                src={m.image}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-ink-900/[0.06]"
              />
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-3">
                <Utensils className="h-3.5 w-3.5 text-ink-400" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.82rem] font-medium text-ink-900">
                {m.name}
              </p>
              <p className="tnum mt-0.5 text-[0.68rem] text-ink-400">
                {m.slot} · {m.time}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="tnum text-[0.82rem] font-semibold text-ink-900">
                {m.kcal}
              </p>
              <p className="tnum text-[0.65rem] text-ink-400">
                {m.protein}g prot
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-ink-900/[0.06] px-5 py-2.5">
        <span className="tnum text-[0.68rem] text-ink-500">
          Total logged{" "}
          <span className="font-semibold text-ink-900">
            {RECENT_MEALS.slice(0, 2).reduce((s, m) => s + m.kcal, 0)} kcal
          </span>
        </span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Micronutrients — fiber / sugar                                     */
/* ------------------------------------------------------------------ */

export function Micronutrients() {
  const items = [
    {
      label: "Fiber",
      icon: Leaf,
      eaten: TODAY.fiberEaten,
      goal: TODAY.fiberGoal,
      color: "var(--color-brand-600)",
      note: "below goal",
      tone: "attention" as const,
    },
    {
      label: "Sugar",
      icon: Droplet,
      eaten: TODAY.sugarEaten,
      goal: TODAY.sugarLimit,
      color: "var(--color-signal-amber)",
      note: "under limit",
      tone: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((it) => {
        const pct = it.eaten / it.goal;
        return (
          <div key={it.label} className="rounded-lg bg-surface-2 p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.65rem] font-medium text-ink-500">
                <it.icon className="h-3 w-3" />
                {it.label}
              </span>
              <span className="tnum text-[0.65rem] font-semibold text-ink-900">
                {Math.round(pct * 100)}%
              </span>
            </div>

            <p className="tnum mt-2.5 text-[1.25rem] font-semibold leading-none tracking-[-0.02em] text-ink-900">
              {it.eaten}
              <span className="text-[0.75rem] font-normal text-ink-400">
                /{it.goal}g
              </span>
            </p>

            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink-900/[0.07]">
              <div
                className="bar-x h-full rounded-full"
                style={{ width: `${Math.min(pct, 1) * 100}%`, background: it.color }}
              />
            </div>
            <p className="tnum mt-2 text-[0.62rem] text-ink-400">
              {Math.abs(it.goal - it.eaten)}g {it.note}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick actions                                                      */
/* ------------------------------------------------------------------ */

export function QuickActions({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  const actions: {
    id: NavId;
    label: string;
    desc: string;
    icon: typeof ScanBarcode;
    primary?: boolean;
  }[] = [
    {
      id: "scanner",
      label: "Scan food",
      desc: "Camera or upload",
      icon: ScanBarcode,
      primary: true,
    },
    { id: "calculator", label: "Calculator", desc: "Daily targets", icon: Calculator },
    { id: "coach", label: "Ask coach", desc: "AI chat", icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={() => onNavigate(a.id)}
          className={cn(
            "group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200",
            a.primary
              ? "grain relative overflow-hidden border-transparent bg-nav-950 hover:elev-3"
              : "elev-1 border-ink-900/[0.06] bg-surface hover:elev-2"
          )}
        >
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105",
              a.primary ? "bg-white/10" : "bg-surface-3"
            )}
          >
            <a.icon
              className={cn(
                "h-4 w-4",
                a.primary ? "text-brand-500" : "text-brand-600"
              )}
            />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate text-[0.85rem] font-semibold",
                a.primary ? "text-white" : "text-ink-900"
              )}
            >
              {a.label}
            </span>
            <span
              className={cn(
                "mt-0.5 block truncate text-[0.68rem]",
                a.primary ? "text-white/50" : "text-ink-400"
              )}
            >
              {a.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
