import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, Droplet, Activity, Flame, Sparkles, Zap, 
  ChevronRight, BarChart2, Plus, Check, ArrowRight, ShieldCheck
} from 'lucide-react';

export function HealthCircle({ profile, setPage, className = "", delay = 0.05 }) {
  const [activeTab, setActiveTab] = useState('gauge'); // 'gauge' | 'breakdown'
  const [boostEffect, setBoostEffect] = useState(false);
  const [boostPoints, setBoostPoints] = useState(null);

  const [wellnessData, setWellnessData] = useState({
    nutrition: 0,
    hydration: 0,
    activity: 0,
    total: 0,
    streak: 1,
    details: {
      consumedCals: 0,
      targetCals: 2400,
      mealsCount: 0,
      waterMl: 0,
      targetWaterMl: 2500,
      waterGlasses: 0,
      targetGlasses: 10,
      workoutMins: 0,
      steps: 0,
      workoutCount: 0
    }
  });

  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const age = Number(profile?.age) || 30;
  const isMale = profile?.gender === 'Male';

  // Compute targets
  const targetCals = useMemo(() => {
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
    return Math.round(bmr * 1.55) || 2400;
  }, [weight, height, age, isMale]);

  const targetWaterMl = useMemo(() => {
    return Math.max(2000, Math.round(weight * 35));
  }, [weight]);

  const targetGlasses = useMemo(() => {
    return Math.max(8, Math.round(targetWaterMl / 250));
  }, [targetWaterMl]);

  // Recalculate dynamic scores from all active data sources
  const calculateScores = useCallback(() => {
    try {
      const todayISO = new Date().toISOString().split('T')[0];
      const todayLocale = new Date().toLocaleDateString();

      // 1. NUTRITION
      const savedMeals = localStorage.getItem('nts-meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];
      const consumedCals = meals.reduce((sum, m) => sum + (Number(m.cal) || 0), 0);
      const mealsCount = meals.length;

      let nutritionScore = 0;
      if (mealsCount > 0) {
        const mealCountScore = Math.min(100, Math.round((mealsCount / 3) * 100));
        const calRatio = targetCals > 0 ? (consumedCals / targetCals) : 0;
        let calScore = 0;
        if (calRatio <= 1.0) {
          calScore = Math.round(calRatio * 100);
        } else if (calRatio <= 1.25) {
          calScore = 100; // within healthy surplus margin
        } else {
          // gently taper if significantly exceeding target
          calScore = Math.max(60, Math.round(100 - (calRatio - 1.25) * 60));
        }
        nutritionScore = Math.round((mealCountScore * 0.4) + (calScore * 0.6));
      }

      // 2. HYDRATION
      const savedWater = localStorage.getItem('nts-water-modern');
      let waterMl = savedWater ? parseInt(savedWater, 10) : 0;
      
      // Fallback check in nts-log
      const logData = JSON.parse(localStorage.getItem('nts-log') || '{}');
      const todayLog = logData[todayISO] || {};
      if (!savedWater && todayLog.water) {
        waterMl = todayLog.water * 250;
      }
      const waterGlasses = Math.floor(waterMl / 250);
      const hydrationScore = Math.min(100, Math.round((waterMl / targetWaterMl) * 100));

      // 3. ACTIVITY & WORKOUTS & STEPS
      let workoutHistory = [];
      try {
        const savedHistory = localStorage.getItem('nts-workout-history');
        if (savedHistory) workoutHistory = JSON.parse(savedHistory);
      } catch (e) {
        console.error(e);
      }

      // Workouts today
      const todayWorkouts = workoutHistory.filter(w => {
        if (!w.date) return true; // fallback
        return w.date === todayLocale || w.date === todayISO;
      });

      const workoutMins = todayWorkouts.reduce((acc, w) => acc + (Number(w.duration) || 0), 0);
      const workoutCount = todayWorkouts.length;
      const steps = Number(todayLog.steps) || 0;

      let activityScore = 0;
      const workoutPoints = Math.min(100, Math.round((workoutMins / 30) * 100));
      const stepsPoints = Math.min(100, Math.round((steps / 8000) * 100));

      if (workoutCount > 0 && steps > 0) {
        activityScore = Math.min(100, Math.round((workoutPoints * 0.6) + (stepsPoints * 0.4)));
      } else if (workoutCount > 0) {
        activityScore = Math.min(100, Math.max(workoutPoints, 80));
      } else if (steps > 0) {
        activityScore = stepsPoints;
      }

      // 4. TOTAL WEIGHTED WELLNESS
      const totalScore = Math.round((nutritionScore * 0.35) + (hydrationScore * 0.35) + (activityScore * 0.30));

      // 5. STREAK CALCULATION
      let streak = 1;
      const loggedDays = Object.keys(logData);
      if (workoutHistory.length > 0 || waterMl > 500 || mealsCount > 0) {
        streak = Math.max(1, Math.min(14, loggedDays.length + (workoutCount > 0 ? 1 : 0) + (mealsCount > 0 ? 1 : 0)));
      }

      setWellnessData({
        nutrition: nutritionScore,
        hydration: hydrationScore,
        activity: activityScore,
        total: totalScore,
        streak,
        details: {
          consumedCals,
          targetCals,
          mealsCount,
          waterMl,
          targetWaterMl,
          waterGlasses,
          targetGlasses,
          workoutMins,
          steps,
          workoutCount
        }
      });
    } catch (err) {
      console.error("Wellness score calculation error:", err);
    }
  }, [targetCals, targetWaterMl, targetGlasses]);

  // Synchronize on mount and listen to global events
  useEffect(() => {
    calculateScores();

    const eventNames = [
      'storage',
      'nts-data-updated',
      'nts-water-updated',
      'nts-meals-updated',
      'nts-workouts-updated',
      'nts-log-updated'
    ];

    eventNames.forEach(evt => window.addEventListener(evt, calculateScores));
    return () => {
      eventNames.forEach(evt => window.removeEventListener(evt, calculateScores));
    };
  }, [calculateScores]);

  // Quick Boost Hydration Action (+250ml)
  const handleQuickHydrate = (e) => {
    e.stopPropagation();
    try {
      const current = parseInt(localStorage.getItem('nts-water-modern') || '0', 10);
      const next = current + 250;
      localStorage.setItem('nts-water-modern', next.toString());

      setBoostEffect(true);
      setBoostPoints('+6 pts');

      window.dispatchEvent(new CustomEvent('nts-water-updated', { detail: next }));
      window.dispatchEvent(new Event('nts-data-updated'));

      setTimeout(() => {
        setBoostEffect(false);
        setBoostPoints(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Status Tier Styling & Messaging
  const tier = useMemo(() => {
    const score = wellnessData.total;
    if (score >= 85) {
      return {
        label: "Peak Wellness",
        sub: "All bio-systems optimized",
        badge: "🌟 PEAK",
        color: "#10b981",
        gradientStart: "#10b981",
        gradientEnd: "#06b6d4",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-700",
        ringColor: "#10b981"
      };
    }
    if (score >= 65) {
      return {
        label: "Optimal State",
        sub: "Steady metabolic momentum",
        badge: "⚡ OPTIMAL",
        color: "#059669",
        gradientStart: "#059669",
        gradientEnd: "#10b981",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-700",
        ringColor: "#059669"
      };
    }
    if (score >= 40) {
      return {
        label: "Building Rhythm",
        sub: "Solid daily progress",
        badge: "🚀 ACTIVE",
        color: "#f59e0b",
        gradientStart: "#f59e0b",
        gradientEnd: "#fbbf24",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-700",
        ringColor: "#f59e0b"
      };
    }
    if (score >= 20) {
      return {
        label: "Getting Started",
        sub: "Log habits to level up",
        badge: "🌱 GROWING",
        color: "#f97316",
        gradientStart: "#f97316",
        gradientEnd: "#fb923c",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-700",
        ringColor: "#f97316"
      };
    }
    return {
      label: "Day Initiation",
      sub: "Begin with water or meals",
      badge: "🎯 START",
      color: "#6366f1",
      gradientStart: "#6366f1",
      gradientEnd: "#8b5cf6",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-700",
      ringColor: "#6366f1"
    };
  }, [wellnessData.total]);

  // Dynamic coaching advice based on lowest pillar
  const coachingTip = useMemo(() => {
    const { nutrition, hydration, activity } = wellnessData;
    if (hydration < 50) {
      return {
        icon: Droplet,
        text: "Hydration is low. A glass of water (+250ml) adds +6 pts instantly!",
        action: "+250ml",
        onAction: handleQuickHydrate
      };
    }
    if (nutrition < 50) {
      return {
        icon: Utensils,
        text: "Scan or log a meal to balance your daily macros & energy.",
        action: "Scan Food",
        onAction: () => setPage && setPage('scan')
      };
    }
    if (activity < 50) {
      return {
        icon: Activity,
        text: "Log 15 min workout or a brisk walk to reach Optimal tier!",
        action: "Workouts",
        onAction: () => setPage && setPage('progress')
      };
    }
    return {
      icon: Sparkles,
      text: "Outstanding balance! You're crushing your daily wellness goals.",
      action: "Insights",
      onAction: () => setPage && setPage('reports')
    };
  }, [wellnessData, setPage]);

  // SVG Gauge calculations
  const size = 150;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (wellnessData.total / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)" }}
      className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Background dynamic glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-all duration-1000 opacity-25"
        style={{ backgroundColor: tier.color }}
      />

      {/* Floating score booster badge animation */}
      <AnimatePresence>
        {boostEffect && boostPoints && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -25, scale: 1.1 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{boostPoints}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header with Live Status & Mode Toggle */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="flex h-2.5 w-2.5">
              <span 
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: tier.color }}
              />
              <span 
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: tier.color }}
              />
            </span>
          </div>
          <div>
            <h3 className="font-bold text-ink-900 text-sm tracking-tight flex items-center gap-1.5">
              Live Wellness Index
            </h3>
            <p className="text-[11px] font-medium text-ink-400">{tier.sub}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab(activeTab === 'gauge' ? 'breakdown' : 'gauge')}
            className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-ink-600 hover:text-ink-900 border border-white/80 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Toggle Detailed Breakdown"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">{activeTab === 'gauge' ? 'Breakdown' : 'Dial'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area: Gauge OR Detailed Breakdown */}
      <div className="my-auto py-2 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'gauge' ? (
            /* Gauge View */
            <motion.div
              key="gauge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Animated Circular Gauge */}
              <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="rotate-[-90deg]">
                  <defs>
                    <linearGradient id="dynamicWellnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={tier.gradientStart} />
                      <stop offset="100%" stopColor={tier.gradientEnd} />
                    </linearGradient>
                  </defs>

                  {/* Track Circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={strokeWidth}
                  />

                  {/* Animated Progress Circle */}
                  <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#dynamicWellnessGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>

                {/* Score & Tier Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                  <motion.span 
                    key={wellnessData.total}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-extrabold text-ink-900 tracking-tight leading-none"
                  >
                    {wellnessData.total}
                  </motion.span>
                  <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mt-1">
                    Wellness
                  </span>
                  <span 
                    className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide ${tier.bg} ${tier.text} border ${tier.border}`}
                  >
                    {tier.badge}
                  </span>
                </div>
              </div>

              {/* Mini Interactive Pillars Underneath Dial */}
              <div className="w-full grid grid-cols-3 gap-2 mt-4 px-1">
                {/* Nutrition Pillar */}
                <button
                  onClick={() => setPage && setPage('scan')}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/60 transition-all cursor-pointer group"
                  title="View Nutrition Scanner"
                >
                  <div className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-ink-900">{wellnessData.nutrition}%</span>
                  </div>
                  <span className="text-[9px] font-semibold text-ink-400 mt-0.5">Food</span>
                </button>

                {/* Hydration Pillar */}
                <button
                  onClick={() => setPage && setPage('water')}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/60 transition-all cursor-pointer group"
                  title="View Hydration Tracker"
                >
                  <div className="flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-ink-900">{wellnessData.hydration}%</span>
                  </div>
                  <span className="text-[9px] font-semibold text-ink-400 mt-0.5">Water</span>
                </button>

                {/* Activity Pillar */}
                <button
                  onClick={() => setPage && setPage('progress')}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/60 transition-all cursor-pointer group"
                  title="View Workouts"
                >
                  <div className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-ink-900">{wellnessData.activity}%</span>
                  </div>
                  <span className="text-[9px] font-semibold text-ink-400 mt-0.5">Active</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* Detailed Breakdown View */
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Nutrition Detail */}
              <div 
                onClick={() => setPage && setPage('scan')}
                className="p-2.5 rounded-xl bg-white/60 border border-white/80 hover:bg-white cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-ink-800 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-500" /> Nutrition (35%)
                  </span>
                  <span className="font-bold text-ink-900">{wellnessData.nutrition}%</span>
                </div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${wellnessData.nutrition}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-ink-400 font-medium">
                  <span>{wellnessData.details.consumedCals} / {wellnessData.details.targetCals} kcal</span>
                  <span>{wellnessData.details.mealsCount} meals</span>
                </div>
              </div>

              {/* Hydration Detail */}
              <div 
                onClick={() => setPage && setPage('water')}
                className="p-2.5 rounded-xl bg-white/60 border border-white/80 hover:bg-white cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-ink-800 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" /> Hydration (35%)
                  </span>
                  <span className="font-bold text-ink-900">{wellnessData.hydration}%</span>
                </div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${wellnessData.hydration}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-ink-400 font-medium">
                  <span>{wellnessData.details.waterMl} / {wellnessData.details.targetWaterMl} ml</span>
                  <span>{wellnessData.details.waterGlasses} glasses</span>
                </div>
              </div>

              {/* Activity Detail */}
              <div 
                onClick={() => setPage && setPage('progress')}
                className="p-2.5 rounded-xl bg-white/60 border border-white/80 hover:bg-white cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-ink-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-500" /> Activity (30%)
                  </span>
                  <span className="font-bold text-ink-900">{wellnessData.activity}%</span>
                </div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${wellnessData.activity}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-ink-400 font-medium">
                  <span>{wellnessData.details.workoutMins} min workout</span>
                  <span>{wellnessData.details.steps > 0 ? `${wellnessData.details.steps} steps` : 'No steps'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Dynamic Coaching Advice & Quick-Boost Bar */}
      <div className="mt-3 pt-3 border-t border-ink-100/60 flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <coachingTip.icon className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[11px] font-medium text-ink-600 truncate leading-tight">
            {coachingTip.text}
          </p>
        </div>

        {/* Interactive Action Button */}
        {coachingTip.action === '+250ml' ? (
          <button
            onClick={coachingTip.onAction}
            className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
            title="Log 250ml water now"
          >
            <Plus className="w-3 h-3" />
            <span>+250ml</span>
          </button>
        ) : (
          <button
            onClick={coachingTip.onAction}
            className="px-2.5 py-1 bg-ink-900 hover:bg-ink-800 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
          >
            <span>{coachingTip.action}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Streak Badge in Top Right or Bottom */}
      {wellnessData.streak > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full text-orange-600 text-[10px] font-black z-20 pointer-events-none">
          <Flame className="w-3 h-3 fill-orange-500 text-orange-500 animate-pulse" />
          <span>{wellnessData.streak}d streak</span>
        </div>
      )}
    </motion.div>
  );
}
