import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Dumbbell, 
  Apple, 
  Droplet, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Sliders, 
  Target, 
  Zap, 
  Scale, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/60 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

/* -------------------------------------------------------------
 * 1. CALORIE CALCULATOR (TDEE & ENERGY DEFICIT/SURPLUS ENGINE)
 * ------------------------------------------------------------- */
export function CalorieCalculator({ profile = {}, onCaloriesChange }) {
  // Input states initialized from profile or healthy defaults
  const [gender, setGender] = useState(profile?.gender?.toLowerCase() === 'female' ? 'female' : 'male');
  const [age, setAge] = useState(Number(profile?.age) || 28);
  const [weight, setWeight] = useState(Number(profile?.weight) || 72);
  const [height, setHeight] = useState(Number(profile?.height) || 175);
  const [activity, setActivity] = useState(profile?.activity || 'moderate');
  const [goal, setGoal] = useState(profile?.goal || 'loss');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Activity multipliers (Mifflin-St Jeor)
  const activityMultipliers = {
    sedentary: { mult: 1.2, label: 'Sedentary', desc: 'Little to no exercise / desk job' },
    light: { mult: 1.375, label: 'Light Active', desc: '1-3 days/week light exercise' },
    moderate: { mult: 1.55, label: 'Moderate', desc: '3-5 days/week moderate exercise' },
    active: { mult: 1.725, label: 'Very Active', desc: '6-7 days/week hard exercise' },
    athlete: { mult: 1.9, label: 'Athlete', desc: '2x per day / physical labor' }
  };

  // Goal adjustments
  const goalAdjustments = {
    aggressive_loss: { diff: -750, label: 'Fast Loss', desc: '-0.75 kg/week' },
    loss: { diff: -500, label: 'Weight Loss', desc: '-0.5 kg/week' },
    maintain: { diff: 0, label: 'Maintain', desc: 'Weight stability' },
    gain: { diff: 300, label: 'Lean Gain', desc: '+0.3 kg/week' },
    bulk: { diff: 500, label: 'Muscle Bulk', desc: '+0.5 kg/week' }
  };

  // BMR calculation (Mifflin-St Jeor formula)
  const bmr = Math.round(
    gender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161
  );

  // TDEE calculation
  const tdee = Math.round(bmr * (activityMultipliers[activity]?.mult || 1.55));

  // Final Target Calories
  const goalDiff = goalAdjustments[goal]?.diff || 0;
  const targetCalories = Math.max(1200, tdee + goalDiff);

  // Notify parent if calories change
  useEffect(() => {
    if (onCaloriesChange) {
      onCaloriesChange(targetCalories);
    }
  }, [targetCalories, onCaloriesChange]);

  const handleSaveToProfile = () => {
    try {
      const currentProfile = JSON.parse(localStorage.getItem('nutrisync-profile') || '{}');
      const updated = {
        ...currentProfile,
        age,
        weight,
        height,
        gender,
        activity,
        goal,
        targetCalories
      };
      localStorage.setItem('nutrisync-profile', JSON.stringify(updated));
      localStorage.setItem('nts-target-calories', targetCalories.toString());
      window.dispatchEvent(new Event('storage'));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GlassCard className="p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-ink-900/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center shadow-sm">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink-900">Calorie Calculator</h3>
              <p className="text-xs font-semibold text-ink-400">Scientific TDEE & Metabolic Rate Engine</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
            Mifflin-St Jeor
          </span>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          {/* Gender */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Gender</label>
            <div className="grid grid-cols-2 p-1 bg-ink-900/5 rounded-xl">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  gender === 'male' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  gender === 'female' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Age</label>
            <div className="relative">
              <input
                type="number"
                min="14"
                max="100"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-ink-900/5 border border-transparent font-bold text-ink-900 text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-ink-400 pointer-events-none">yrs</span>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Weight</label>
            <div className="relative">
              <input
                type="number"
                min="35"
                max="250"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-ink-900/5 border border-transparent font-bold text-ink-900 text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-ink-400 pointer-events-none">kg</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Height</label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="240"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-ink-900/5 border border-transparent font-bold text-ink-900 text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-ink-400 pointer-events-none">cm</span>
            </div>
          </div>
        </div>

        {/* Activity Level Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Activity Level</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(activityMultipliers).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivity(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activity === key
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                    : 'border-ink-900/5 bg-ink-900/5 hover:bg-white/60'
                }`}
              >
                <span className={`block text-xs font-bold ${activity === key ? 'text-orange-700' : 'text-ink-900'}`}>
                  {item.label}
                </span>
                <span className="block text-[10px] text-ink-400 font-medium truncate mt-0.5">
                  ×{item.mult}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Primary Goal</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(goalAdjustments).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setGoal(key)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  goal === key
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                    : 'border-ink-900/5 bg-ink-900/5 hover:bg-white/60'
                }`}
              >
                <span className={`block text-xs font-bold ${goal === key ? 'text-emerald-700' : 'text-ink-900'}`}>
                  {item.label}
                </span>
                <span className={`block text-[10px] font-bold mt-0.5 ${item.diff < 0 ? 'text-rose-500' : item.diff > 0 ? 'text-blue-500' : 'text-ink-400'}`}>
                  {item.diff === 0 ? '0 kcal' : `${item.diff > 0 ? '+' : ''}${item.diff} kcal`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Hero Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/20 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90 block mb-1">Recommended Daily Calories</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{targetCalories.toLocaleString()}</span>
                <span className="text-base font-semibold opacity-90">kcal / day</span>
              </div>
              <p className="text-xs opacity-85 mt-2">
                {goalDiff < 0 ? `Target calorie deficit of ${Math.abs(goalDiff)} kcal for fat loss.` : goalDiff > 0 ? `Target surplus of ${goalDiff} kcal for lean muscle building.` : 'Exact maintenance intake to preserve current body weight.'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex sm:flex-col gap-3 shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase opacity-75 block">Basal BMR</span>
                <span className="text-sm font-bold">{bmr.toLocaleString()} kcal</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase opacity-75 block">Total TDEE</span>
                <span className="text-sm font-bold">{tdee.toLocaleString()} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <button
        type="button"
        onClick={handleSaveToProfile}
        className="w-full py-3.5 bg-ink-900 text-white hover:bg-ink-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
      >
        {savedSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" /> Target Saved to Profile!
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-400" /> Apply Target to My NutriSync Plan
          </>
        )}
      </button>
    </GlassCard>
  );
}

/* -------------------------------------------------------------
 * 2. NUTRITION CALCULATOR (MACROS, INGREDIENTS & MEAL SPLIT)
 * ------------------------------------------------------------- */
export function NutritionCalculator({ initialCalories = 2200, weight = 70 }) {
  const [calories, setCalories] = useState(initialCalories);
  const [preset, setPreset] = useState('balanced');
  const [copied, setCopied] = useState(false);

  // Sync when initialCalories changes
  useEffect(() => {
    if (initialCalories) {
      setCalories(initialCalories);
    }
  }, [initialCalories]);

  // Macro distribution presets
  const presets = {
    balanced: { name: 'Balanced', p: 25, c: 50, f: 25, desc: 'Everyday energy & health' },
    high_protein: { name: 'High Protein', p: 35, c: 40, f: 25, desc: 'Muscle building & satiety' },
    low_carb: { name: 'Low Carb', p: 35, c: 20, f: 45, desc: 'Fat burning & blood sugar' },
    keto: { name: 'Keto', p: 25, c: 5, f: 70, desc: 'Deep ketogenic state' }
  };

  const activePreset = presets[preset] || presets.balanced;
  const proteinPct = activePreset.p;
  const carbsPct = activePreset.c;
  const fatsPct = activePreset.f;

  // Gram calculations (Protein: 4cal/g, Carbs: 4cal/g, Fat: 9cal/g)
  const proteinGrams = Math.round((calories * (proteinPct / 100)) / 4);
  const carbsGrams = Math.round((calories * (carbsPct / 100)) / 4);
  const fatsGrams = Math.round((calories * (fatsPct / 100)) / 9);

  // Recommended hydration & fiber
  const fiberGrams = Math.round((calories / 1000) * 14);
  const waterLiters = ((weight * 35) / 1000).toFixed(1);
  const proteinPerKg = (proteinGrams / (weight || 70)).toFixed(1);

  // Meal breakdown (4 meals: Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10%)
  const mealDistribution = [
    { name: 'Breakfast', pct: 0.25, time: '8:00 AM' },
    { name: 'Lunch', pct: 0.35, time: '1:00 PM' },
    { name: 'Dinner', pct: 0.30, time: '7:30 PM' },
    { name: 'Healthy Snack', pct: 0.10, time: '4:30 PM' }
  ];

  return (
    <GlassCard className="p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-ink-900/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-sm">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink-900">Nutrition Calculator</h3>
              <p className="text-xs font-semibold text-ink-400">Target Macronutrient & Fuel Splitter</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
            Macro Precision
          </span>
        </div>

        {/* Interactive Calorie Input for calculation */}
        <div className="my-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-ink-500 uppercase tracking-wider">Base Daily Calories</label>
            <span className="text-sm font-extrabold text-ink-900">{calories.toLocaleString()} kcal</span>
          </div>
          <input
            type="range"
            min="1200"
            max="4500"
            step="50"
            value={calories}
            onChange={e => setCalories(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-ink-900/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Diet Style Presets */}
        <div className="mb-6">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-wider block mb-2">Dietary Strategy</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(presets).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  preset === key
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                    : 'border-ink-900/5 bg-ink-900/5 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${preset === key ? 'text-emerald-700' : 'text-ink-900'}`}>
                    {p.name}
                  </span>
                  {preset === key && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span className="block text-[10px] text-ink-400 font-medium mt-1">
                  P:{p.p}% C:{p.c}% F:{p.f}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Macro Proportional Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-emerald-600">Protein ({proteinPct}%)</span>
            <span className="text-purple-600">Carbs ({carbsPct}%)</span>
            <span className="text-amber-600">Fats ({fatsPct}%)</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner bg-ink-900/5">
            <div style={{ width: `${proteinPct}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
            <div style={{ width: `${carbsPct}%` }} className="bg-purple-500 h-full transition-all duration-300" />
            <div style={{ width: `${fatsPct}%` }} className="bg-amber-500 h-full transition-all duration-300" />
          </div>
        </div>

        {/* Target Macros Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Protein</span>
            <span className="text-2xl font-extrabold text-emerald-600 my-0.5">{proteinGrams}g</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full mt-1">
              {proteinPerKg} g/kg
            </span>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Carbs</span>
            <span className="text-2xl font-extrabold text-purple-600 my-0.5">{carbsGrams}g</span>
            <span className="text-[10px] font-semibold text-purple-700 mt-1">
              {Math.round(carbsGrams * 4)} kcal
            </span>
          </div>

          {/* Fats */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Fats</span>
            <span className="text-2xl font-extrabold text-amber-600 my-0.5">{fatsGrams}g</span>
            <span className="text-[10px] font-semibold text-amber-700 mt-1">
              {Math.round(fatsGrams * 9)} kcal
            </span>
          </div>
        </div>

        {/* Meal Allocation Plan */}
        <div className="bg-ink-900/5 p-4 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-900 uppercase tracking-wider">Recommended Meal Distribution</span>
            <span className="text-[10px] font-bold text-ink-400">4-Meal Split</span>
          </div>
          <div className="space-y-2">
            {mealDistribution.map(meal => (
              <div key={meal.name} className="flex justify-between items-center text-xs py-1.5 border-b border-ink-900/5 last:border-none">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink-900">{meal.name}</span>
                  <span className="text-[10px] text-ink-400 font-medium">{meal.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-ink-900">{Math.round(calories * meal.pct)} kcal</span>
                  <span className="text-[11px] text-emerald-600 font-bold">{Math.round(proteinGrams * meal.pct)}g P</span>
                  <span className="text-[11px] text-purple-600 font-bold">{Math.round(carbsGrams * meal.pct)}g C</span>
                  <span className="text-[11px] text-amber-600 font-bold">{Math.round(fatsGrams * meal.pct)}g F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Health Targets */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-3">
          <Droplet className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-blue-700 block uppercase">Water Intake</span>
            <span className="text-sm font-bold text-ink-900">{waterLiters} Liters / day</span>
          </div>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-3">
          <Apple className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">Fiber Target</span>
            <span className="text-sm font-bold text-ink-900">{fiberGrams}g min / day</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
