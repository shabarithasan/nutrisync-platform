import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Check,
  Droplets,
  Minus,
  Plus,
  ScanBarcode,
  Calculator,
  MessageCircle,
  Utensils,
  ArrowUpRight,
  Clock,
  Leaf,
  Flame,
  Download,
} from "lucide-react";
import {
  AI_INSIGHTS,
  RECENT_MEALS,
  TODAY,
  type NavId,
} from "../utils/dashboardData";
import { Card, CardHead } from "./Charts";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  AI Health Summary                                                  */
/* ------------------------------------------------------------------ */
export function AIHealthSummary() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const generate = () => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("done"), 1500);
  };

  const toneStyles = {
    positive: "border-leaf-500/25 bg-leaf-500/[0.07]",
    watch: "border-[#D98E3A]/25 bg-[#D98E3A]/[0.07]",
  } as const;

  return (
    <Card className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(31,164,95,0.22), transparent)",
        }}
      />
      <CardHead
        eyebrow="AI insights"
        title="AI Health Summary"
        hint="Instant feedback based on your patterns"
        right={
          <button
            onClick={generate}
            disabled={state !== "idle"}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-300",
              state === "idle" &&
                "bg-forest-900 text-white hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lg hover:shadow-forest-900/20",
              state === "loading" && "cursor-wait bg-forest-800 text-white",
              state === "done" && "bg-leaf-500/15 text-forest-800"
            )}
          >
            {state === "idle" && (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Generate
              </>
            )}
            {state === "loading" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
              </>
            )}
            {state === "done" && (
              <>
                <Check className="h-3.5 w-3.5" /> Up to date
              </>
            )}
          </button>
        }
      />

      {state === "idle" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/12 bg-cream/60 px-6 py-9 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-900/5">
            <Sparkles className="h-5 w-5 text-leaf-600" />
          </span>
          <p className="mt-3 text-sm font-medium text-ink">
            Your weekly summary is ready
          </p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-soft/80">
            We analyzed 21 meals, 7 days of macros and your weight trend.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-ink/[0.06] bg-cream/70 p-4"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <div className="h-3 w-1/3 rounded bg-ink/10" />
              <div className="mt-2.5 h-2.5 w-full rounded bg-ink/[0.07]" />
              <div className="mt-1.5 h-2.5 w-4/5 rounded bg-ink/[0.07]" />
            </div>
          ))}
        </div>
      )}

      {state === "done" && (
        <div className="animate-fade-up space-y-3">
          {AI_INSIGHTS.map((ins) => (
            <div
              key={ins.title}
              className={cn("rounded-xl border p-4", toneStyles[ins.tone])}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    ins.tone === "positive" ? "bg-leaf-500" : "bg-[#D98E3A]"
                  )}
                />
                {ins.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                {ins.body}
              </p>
            </div>
          ))}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-cream py-2.5 text-xs font-semibold text-ink-soft transition-all hover:border-ink/25 hover:text-ink">
            <Download className="h-3.5 w-3.5" /> Download Text Report
          </button>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Water tracker                                                      */
/* ------------------------------------------------------------------ */
export function WaterTracker() {
  const [glasses, setGlasses] = useState(TODAY.waterDrunk);
  const pct = glasses / TODAY.waterGoal;

  return (
    <Card>
      <CardHead
        eyebrow="Hydration"
        title="Water intake"
        right={
          <span className="font-display text-xl font-semibold text-ink">
            {glasses}
            <span className="text-sm font-normal text-ink-soft">
              /{TODAY.waterGoal}
            </span>
          </span>
        }
      />

      <div className="mb-4 flex gap-1.5">
        {Array.from({ length: TODAY.waterGoal }).map((_, i) => (
          <button
            key={i}
            onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
            className="group h-11 flex-1"
            aria-label={`${i + 1} glasses`}
          >
            <div
              className={cn(
                "flex h-full items-end justify-center rounded-lg border transition-all duration-300",
                i < glasses
                  ? "border-leaf-500/40 bg-gradient-to-t from-leaf-500 to-leaf-400/70"
                  : "border-ink/10 bg-cream group-hover:border-leaf-500/30"
              )}
            >
              <Droplets
                className={cn(
                  "mb-1.5 h-3.5 w-3.5 transition-colors",
                  i < glasses ? "text-white" : "text-ink/20"
                )}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setGlasses((g) => Math.max(0, g - 1))}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white text-ink-soft transition-all hover:border-ink/25 hover:text-ink"
          aria-label="Remove glass"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400 transition-all duration-500"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <button
          onClick={() => setGlasses((g) => Math.min(TODAY.waterGoal, g + 1))}
          className="grid h-9 w-9 place-items-center rounded-lg bg-forest-900 text-white transition-all hover:-translate-y-0.5 hover:bg-forest-800"
          aria-label="Add glass"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-soft/75">
        {(glasses * 0.25).toFixed(2)} L of {(TODAY.waterGoal * 0.25).toFixed(2)} L ·{" "}
        {Math.round(pct * 100)}% complete
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent meals                                                       */
/* ------------------------------------------------------------------ */
export function RecentMeals({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  return (
    <Card>
      <CardHead
        eyebrow="Today"
        title="Recent meals"
        right={
          <button
            onClick={() => onNavigate("meals")}
            className="group flex items-center gap-1 text-xs font-semibold text-leaf-600 transition-colors hover:text-forest-800"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        }
      />

      <div className="-mx-1 space-y-1">
        {RECENT_MEALS.map((m) => (
          <button
            key={m.id}
            className="group flex w-full items-center gap-3.5 rounded-xl p-2 text-left transition-colors hover:bg-cream"
          >
            {m.image ? (
              <img
                src={m.image}
                alt={m.name}
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-ink/[0.06]"
              />
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-dark">
                <Utensils className="h-4 w-4 text-ink-soft/60" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-ink-soft/75">
                <span className="font-medium">{m.slot}</span>·
                <Clock className="h-3 w-3" />
                {m.time}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-sm font-semibold text-ink">
                {m.kcal} <span className="text-[0.65rem] font-normal text-ink-soft">kcal</span>
              </p>
              <p className="mt-0.5 text-[0.65rem] font-medium text-leaf-600">
                {m.protein}g protein
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5 text-[0.68rem] leading-relaxed text-ink-soft/80">
        <Sparkles className="mt-px h-3 w-3 shrink-0 text-leaf-600" />
        Nutritional values are AI-estimated and may not be exact.
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick actions                                                      */
/* ------------------------------------------------------------------ */
export function QuickActions({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  const actions = [
    {
      id: "scanner" as NavId,
      label: "Scan Food",
      desc: "Camera or photo",
      icon: ScanBarcode,
      primary: true,
    },
    { id: "calculator" as NavId, label: "Calculator", desc: "Daily calories", icon: Calculator },
    { id: "coach" as NavId, label: "Ask Coach", desc: "AI chat", icon: MessageCircle },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={() => onNavigate(a.id)}
          className={cn(
            "group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1",
            a.primary
              ? "grain relative overflow-hidden border-forest-900/0 bg-forest-950 hover:shadow-xl hover:shadow-forest-900/25"
              : "border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(19,31,25,0.04)] hover:shadow-lg hover:shadow-ink/[0.07]"
          )}
        >
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              a.primary ? "bg-lime-glow/15" : "bg-cream-dark"
            )}
          >
            <a.icon className={cn("h-[18px] w-[18px]", a.primary ? "text-lime-glow" : "text-forest-900")} />
          </span>
          <span>
            <span
              className={cn(
                "block text-sm font-semibold",
                a.primary ? "text-cream" : "text-ink"
              )}
            >
              {a.label}
            </span>
            <span
              className={cn(
                "mt-0.5 block text-[0.68rem]",
                a.primary ? "text-cream/50" : "text-ink-soft/75"
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

/* ------------------------------------------------------------------ */
/*  Nutrient mini-grid (fiber / sugar)                                 */
/* ------------------------------------------------------------------ */
export function NutrientGrid() {
  const items = [
    { label: "Fiber", icon: Leaf, eaten: TODAY.fiberEaten, goal: TODAY.fiberGoal, unit: "g", color: "#1FA45F" },
    { label: "Sugar", icon: Flame, eaten: TODAY.sugarEaten, goal: TODAY.sugarLimit, unit: "g", color: "#D98E3A", invert: true },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((it) => {
        const pct = it.eaten / it.goal;
        return (
          <div
            key={it.label}
            className="rounded-2xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(19,31,25,0.04)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
                <it.icon className="h-3 w-3" /> {it.label}
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                {it.eaten}
                <span className="text-[0.65rem] font-normal text-ink-soft">
                  /{it.goal}
                  {it.unit}
                </span>
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(pct, 1) * 100}%`, background: it.color }}
              />
            </div>
            <p className="mt-2 text-[0.65rem] font-medium text-ink-soft/70">
              {it.invert
                ? `${it.goal - it.eaten}${it.unit} under limit`
                : `${it.goal - it.eaten}${it.unit} to go`}
            </p>
          </div>
        );
      })}
    </div>
  );
}


