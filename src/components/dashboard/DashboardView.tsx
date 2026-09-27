import { useState } from "react";
import { Flame, Beef, Droplet, Target } from "lucide-react";
import { Sidebar, Topbar, MobileNav } from "./Sidebar";
import {
  Card,
  CardHead,
  CalorieDial,
  WeeklyPulse,
  MonthlyTrends,
  Sparkline,
  Chip,
} from "./Charts";
import {
  AIHealthSummary,
  WaterTracker,
  RecentMeals,
  Micronutrients,
  QuickActions,
} from "./Widgets";
import { ScannerPanel } from "./ScannerPanel";
import { TODAY, KPI_TRENDS, USER, type NavId } from "../../data/dashboardData";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  KPI tile — value, delta, sparkline, progress                       */
/* ------------------------------------------------------------------ */

function KpiTile({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  pct,
  delta,
  deltaGood,
  spark,
  sparkGood,
  accent,
  delay,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  unit: string;
  sub: string;
  pct: number;
  delta: string;
  deltaGood: boolean;
  spark: number[];
  sparkGood: boolean;
  accent: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "elev-1 group rounded-xl border border-ink-900/[0.06] bg-surface p-4 transition-shadow duration-200 hover:elev-2",
        "animate-fade-up",
        delay
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className="grid h-6 w-6 place-items-center rounded-md"
          style={{ background: `${accent}18` }}
        >
          <Icon className="h-3 w-3" style={{ color: accent }} />
        </span>
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {label}
        </span>
      </div>

      {/* Value + sparkline */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="tnum text-[1.65rem] font-semibold leading-none tracking-[-0.03em] text-ink-900">
            {value}
            <span className="ml-1 text-[0.78rem] font-normal text-ink-400">
              {unit}
            </span>
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="tnum text-[0.68rem] font-semibold"
              style={{ color: deltaGood ? accent : "var(--color-signal-amber)" }}
            >
              {delta}
            </span>
            <span className="text-[0.65rem] text-ink-400">{sub}</span>
          </div>
        </div>
        <div className="mb-0.5 shrink-0 opacity-90">
          <Sparkline data={spark} positive={sparkGood} />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-ink-900/[0.07]">
        <div
          className="bar-x h-full rounded-full"
          style={{ width: `${Math.min(pct, 1) * 100}%`, background: accent }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export function DashboardView({ onSignOut }: { onSignOut: () => void }) {
  const [nav, setNav] = useState<NavId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const macros = [
    { label: "Protein", eaten: TODAY.proteinEaten, goal: TODAY.proteinGoal, color: "var(--color-brand-600)" },
    { label: "Carbs", eaten: TODAY.carbsEaten, goal: TODAY.carbsGoal, color: "var(--color-bar-neutral)" },
    { label: "Fat", eaten: TODAY.fatEaten, goal: TODAY.fatGoal, color: "var(--color-signal-amber)" },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex min-h-screen">
        <Sidebar
          active={nav}
          onChange={setNav}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          onSignOut={onSignOut}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar active={nav} />
          <MobileNav active={nav} onChange={setNav} />

          <main className="form-scroll flex-1">
            <div className="mx-auto max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8">
              {/* ---------- Page header ---------- */}
              <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-ink-900/[0.06] pb-5">
                <div>
                  <p className="tnum text-[0.72rem] font-medium text-ink-400">
                    Sunday, 26 September
                  </p>
                  <h1 className="mt-1.5 font-display text-[1.75rem] font-medium leading-none tracking-[-0.015em] text-ink-900 sm:text-[2rem]">
                    Good afternoon,{" "}
                    <span className="italic text-brand-700">{USER.name}</span>
                  </h1>
                  <p className="mt-2.5 text-[0.82rem] text-ink-500">
                    <span className="tnum font-semibold text-ink-900">
                      {TODAY.kcalGoal - TODAY.kcalEaten} kcal
                    </span>{" "}
                    remaining today · all targets on schedule
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Chip tone="positive">
                    <Target className="h-3 w-3" /> {TODAY.streak}-day streak
                  </Chip>
                  <Chip>Goal · {USER.goal}</Chip>
                </div>
              </div>

              {/* ---------- KPI row ---------- */}
              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
                <KpiTile
                  icon={Flame}
                  label="Calories"
                  value={TODAY.kcalEaten.toLocaleString()}
                  unit={`/ ${TODAY.kcalGoal.toLocaleString()}`}
                  sub="vs yesterday"
                  delta="−8.5%"
                  deltaGood
                  pct={TODAY.kcalEaten / TODAY.kcalGoal}
                  spark={KPI_TRENDS.kcal}
                  sparkGood
                  accent="var(--color-brand-600)"
                  delay=""
                />
                <KpiTile
                  icon={Beef}
                  label="Protein"
                  value={String(TODAY.proteinEaten)}
                  unit={`/ ${TODAY.proteinGoal}g`}
                  sub="vs 7-day avg"
                  delta="−3.1%"
                  deltaGood={false}
                  pct={TODAY.proteinEaten / TODAY.proteinGoal}
                  spark={KPI_TRENDS.protein}
                  sparkGood
                  accent="var(--color-brand-500)"
                  delay="d-1"
                />
                <KpiTile
                  icon={Droplet}
                  label="Water"
                  value={String(TODAY.waterDrunk)}
                  unit={`/ ${TODAY.waterGoal} glasses`}
                  sub="vs 7-day avg"
                  delta="+4.2%"
                  deltaGood
                  pct={TODAY.waterDrunk / TODAY.waterGoal}
                  spark={KPI_TRENDS.water}
                  sparkGood={false}
                  accent="var(--color-signal-blue)"
                  delay="d-2"
                />
                <KpiTile
                  icon={Target}
                  label="Adherence"
                  value="88"
                  unit="%"
                  sub="7-day average"
                  delta="+1.4%"
                  deltaGood
                  pct={0.88}
                  spark={KPI_TRENDS.adherence}
                  sparkGood
                  accent="var(--color-signal-amber)"
                  delay="d-3"
                />
              </div>

              {/* ---------- Row 2: nutrition + weekly pulse ---------- */}
              <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
                <Card className="animate-fade-up d-2">
                  <CardHead
                    title="Today"
                    meta="Live"
                    right={
                      <Chip tone={TODAY.kcalEaten / TODAY.kcalGoal > 0.7 ? "positive" : "neutral"}>
                        On track
                      </Chip>
                    }
                  />
                  <div className="px-5 pb-5 pt-5">
                    <CalorieDial />

                    <div className="mt-6 space-y-3.5">
                      {macros.map((m) => {
                        const pct = m.eaten / m.goal;
                        return (
                          <div key={m.label}>
                            <div className="mb-1.5 flex items-baseline justify-between">
                              <span className="text-[0.7rem] font-medium text-ink-500">
                                {m.label}
                              </span>
                              <span className="tnum text-[0.75rem] font-semibold text-ink-900">
                                {m.eaten}
                                <span className="font-normal text-ink-400">
                                  /{m.goal}g
                                </span>
                              </span>
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-ink-900/[0.07]">
                              <div
                                className="bar-x h-full rounded-full"
                                style={{
                                  width: `${pct * 100}%`,
                                  background: m.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 border-t border-ink-900/[0.06] pt-3.5">
                      <Micronutrients />
                    </div>
                  </div>
                </Card>

                <div className="animate-fade-up d-3 xl:col-span-2">
                  <WeeklyPulse />
                </div>
              </div>

              {/* ---------- Row 3: scanner + AI ---------- */}
              <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
                <div className="animate-fade-up d-4 xl:col-span-2">
                  <ScannerPanel />
                </div>
                <div className="animate-fade-up d-5">
                  <AIHealthSummary />
                </div>
              </div>

              {/* ---------- Row 4: trends + hydration/meals ---------- */}
              <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
                <div className="animate-fade-up d-4 xl:col-span-2">
                  <MonthlyTrends />
                </div>
                <div className="animate-fade-up d-5 space-y-3.5">
                  <WaterTracker />
                  <RecentMeals onNavigate={setNav} />
                </div>
              </div>

              {/* ---------- Quick actions ---------- */}
              <div className="animate-fade-up d-6 mt-3.5">
                <QuickActions onNavigate={setNav} />
              </div>

              {/* ---------- Footer ---------- */}
              <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/[0.06] py-5">
                <p className="text-[0.72rem] text-ink-400">
                  NutriSync · Better nutrition, simply
                </p>
                <p className="text-[0.72rem] text-ink-400">
                  Nutritional values are AI-estimated and may not be exact.
                </p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
