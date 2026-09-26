import React from 'react';
import { Card, CardHead, AiBadge } from './Charts';
import { WeeklyPulse } from './Charts';
import { MonthlyTrends } from './Charts';
import { WaterTracker, NutrientGrid } from './Widgets';
import { Droplets } from 'lucide-react';

export function ReportsEnhanced() {
  return (
    <div className="form-scroll flex-1 px-5 py-7 sm:px-7 lg:px-9 mx-auto max-w-[1700px] w-full">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="mt-2 font-display text-[2rem] font-medium leading-none tracking-tight text-ink sm:text-[2.4rem]">
            Your Insights
          </h1>
          <p className="mt-2.5 text-sm text-ink-soft">
            Deep dive into your nutritional trends and habits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        {/* Weekly pulse */}
        <div className="animate-fade-up delay-200 xl:col-span-2">
          <WeeklyPulse />
        </div>

        {/* Monthly trends */}
        <div className="animate-fade-up delay-100 xl:col-span-2">
          <MonthlyTrends />
        </div>

        {/* Hydration + nutrients */}
        <div className="animate-fade-up delay-200 xl:col-span-1">
          <WaterTracker />
        </div>
        
        <div className="animate-fade-up delay-300 xl:col-span-1">
          <NutrientGrid />
        </div>
      </div>
    </div>
  );
}
