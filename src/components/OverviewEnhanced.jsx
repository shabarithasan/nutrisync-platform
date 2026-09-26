import React from 'react';
import { Flame, Beef, Droplets, Trophy } from 'lucide-react';
import { StatTile } from './StatTile';
import { Card, CardHead, CalorieDial, AiBadge } from './Charts';
import { AIHealthSummary, RecentMeals, QuickActions } from './Widgets';
import { cn } from '../utils/cn';
import { useLog, todayKey } from '../main';

export function OverviewEnhanced({ profile, setPage }) {
  const { m, upd } = useLog();
  const tk = todayKey();
  const today = m[tk] || {};

  const macros = [
    { label: "Protein", eaten: today.protein || 0, goal: profile.targetProtein || 120, color: "#1FA45F" },
    { label: "Carbs", eaten: today.carbs || 0, goal: profile.targetCarbs || 250, color: "#C9F169" },
    { label: "Fat", eaten: today.fat || 0, goal: profile.targetFat || 60, color: "#9DB8A6" },
  ];
  const kcalGoal = profile.targetKcal || 2000;
  const kcalEaten = today.kcal || 0;
  const waterGoal = 8;
  const waterDrunk = today.water || 0;

  return (
    <div className="form-scroll flex-1 px-5 py-7 sm:px-7 lg:px-9 mx-auto max-w-[1700px] w-full">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-leaf-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="mt-2 font-display text-[2rem] font-medium leading-none tracking-tight text-ink sm:text-[2.4rem]">
            Good afternoon, <span className="font-light italic text-leaf-600">{profile.name.split(' ')[0]}</span>
          </h1>
          <p className="mt-2.5 text-sm text-ink-soft">
            You're <span className="font-semibold text-forest-800">{Math.max(0, kcalGoal - kcalEaten)} kcal</span> under goal — nicely on track today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl border border-ink/[0.07] bg-white px-4 py-2.5 shadow-sm">
          <Trophy className="h-4 w-4 text-leaf-600" />
          <span className="text-xs text-ink-soft">
            <span className="font-display text-base font-semibold text-ink">5</span> day streak
          </span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        <StatTile
          icon={Flame}
          label="Calories"
          value={kcalEaten.toLocaleString()}
          unit={`/ ${kcalGoal.toLocaleString()}`}
          sub={`${Math.max(0, kcalGoal - kcalEaten)} kcal remaining`}
          pct={kcalEaten / kcalGoal || 0}
          accent="#1FA45F"
          delay=""
        />
        <StatTile
          icon={Beef}
          label="Protein"
          value={String(today.protein || 0)}
          unit={`/ ${profile.targetProtein || 120}g`}
          sub={`${Math.max(0, (profile.targetProtein || 120) - (today.protein || 0))}g to target`}
          pct={(today.protein || 0) / (profile.targetProtein || 120) || 0}
          accent="#C9F169"
          delay="delay-100"
        />
        <StatTile
          icon={Droplets}
          label="Water"
          value={String(today.water || 0)}
          unit={`/ ${waterGoal} glasses`}
          sub={`${(waterDrunk * 0.25).toFixed(2)} L hydrated`}
          pct={waterDrunk / waterGoal || 0}
          accent="#4A9FD8"
          delay="delay-200"
        />
        <StatTile
          icon={Trophy}
          label="Adherence"
          value="88"
          unit="%"
          sub="7-day weekly average"
          pct={0.88}
          accent="#D98E3A"
          delay="delay-300"
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
        <Card className="animate-fade-up delay-100 xl:col-span-1">
          <CardHead eyebrow="Today" title="Nutrition summary" />
          <div className="flex flex-col items-center">
            <div className="relative grid h-48 w-48 place-items-center">
              <div className="absolute inset-0 rounded-full border-[12px] border-ink/[0.04]" />
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#1fa45f" strokeWidth="12" strokeDasharray={`${(Math.min(kcalEaten/kcalGoal,1)||0) * 276.46} 276.46`} strokeLinecap="round" className="ring-anim" />
              </svg>
              <div className="flex flex-col items-center text-center">
                <Flame className="mb-1 h-5 w-5 text-forest-800" />
                <span className="font-display text-3xl font-semibold leading-none tracking-tight text-ink">{kcalEaten}</span>
                <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink-soft/70">Kcal eaten</span>
              </div>
            </div>
            <div className="mt-6 w-full space-y-3.5">
              {macros.map((m) => {
                const pct = m.eaten / m.goal || 0;
                return (
                  <div key={m.label}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
                        {m.label}
                      </span>
                      <span className="text-xs font-semibold text-ink">
                        {m.eaten}
                        <span className="font-normal text-ink-soft/70">/{m.goal}g</span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                      <div className="bar-anim h-full rounded-full" style={{ width: `${Math.min(pct, 1) * 100}%`, background: m.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="animate-fade-up delay-300 xl:col-span-1">
          <AIHealthSummary />
        </div>

        <div className="animate-fade-up delay-300 xl:col-span-1 space-y-3.5">
          <RecentMeals onNavigate={() => setPage('scan')} />
          <QuickActions onNavigate={() => setPage('scan')} />
        </div>
      </div>
    </div>
  );
}
