import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, ChevronRight, Sparkles, Calculator, BarChart3, LayoutGrid } from 'lucide-react';
import { CalorieCalculator, NutritionCalculator } from './Calculators';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernReports() {
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    try {
      const m = localStorage.getItem('nts-meals');
      if (m) setMeals(JSON.parse(m));
      const wk = localStorage.getItem('nts-workouts');
      if (wk) setWorkouts(JSON.parse(wk));
      const p = localStorage.getItem('nutrisync-profile');
      if (p) setProfile(JSON.parse(p));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const consumedCals = meals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const age = Number(profile?.age) || 30;
  const isMale = profile?.gender === 'Male';
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
  const targetCals = Math.round(bmr * 1.55) || 2400;

  // Calculate macros breakdown
  const rawProtein = meals.reduce((sum, m) => sum + (m.cal * 0.25 / 4), 0);
  const rawCarbs = meals.reduce((sum, m) => sum + (m.cal * 0.50 / 4), 0);
  const rawFats = meals.reduce((sum, m) => sum + (m.cal * 0.25 / 9), 0);
  const totalMacroGrams = rawProtein + rawCarbs + rawFats;

  let proteinPct = 24;
  let carbsPct = 41;
  let fatsPct = 35;

  if (totalMacroGrams > 0) {
    proteinPct = Math.round((rawProtein / totalMacroGrams) * 100);
    carbsPct = Math.round((rawCarbs / totalMacroGrams) * 100);
    fatsPct = Math.max(0, 100 - proteinPct - carbsPct);
  }

  const pieData = [
    { name: 'Protein', value: proteinPct, color: '#10b981' },
    { name: 'Carbs', value: carbsPct, color: '#8b5cf6' },
    { name: 'Fats', value: fatsPct, color: '#f59e0b' },
  ];

  const completionPct = targetCals > 0 
    ? Math.min(100, Math.round((consumedCals / targetCals) * 100)) 
    : 68;
  const displayCompletion = consumedCals > 0 ? completionPct : 68;

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const defaultKcal = [1820, 1950, 1850, 2100, 1750, 1880, 1870];

  const barData = dayNames.map((day, idx) => {
    const isToday = day === todayStr;
    return {
      day,
      kcal: isToday && consumedCals > 0 ? consumedCals : defaultKcal[idx],
      highlight: isToday,
    };
  });

  const userName = profile?.name ? profile.name.split(' ')[0] : 'Member';
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'calculators', 'analytics'
  const [calcCalories, setCalcCalories] = useState(targetCals);

  // Sync calcCalories if targetCals changes
  useEffect(() => {
    if (targetCals) {
      setCalcCalories(targetCals);
    }
  }, [targetCals]);

  return (
    <div className="h-full w-full flex flex-col pb-16">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">AI Insights & Nutrition Analysis</h2>
          <p className="text-ink-500 font-medium mt-1">Deep dive into your energy expenditure, macro breakdown & daily caloric balance.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Complete View</span>
          </button>

          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calculators'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Calculators</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Charts & Analytics</span>
          </button>
        </div>
      </div>

      {/* 1. Precision Calculators Section */}
      {(activeTab === 'all' || activeTab === 'calculators') && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-lg font-bold text-ink-900">Precision Metabolic & Nutrition Calculators</h3>
            </div>
            <span className="text-xs font-semibold text-ink-400 hidden sm:inline">Energy Balance & Macro Split</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalorieCalculator 
              profile={profile} 
              onCaloriesChange={(c) => setCalcCalories(c)} 
            />
            <NutritionCalculator 
              initialCalories={calcCalories || targetCals} 
              weight={weight} 
            />
          </div>
        </div>
      )}

      {/* 2. Charts & Analytics Section */}
      {(activeTab === 'all' || activeTab === 'analytics') && (
        <div>
          {activeTab === 'all' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-ink-900">Nutrient Composition & Caloric Breakdown</h3>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diet Composition */}
            <GlassCard delay={0.1} className="col-span-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-ink-900">Diet Composition</h3>
                <button className="text-ink-400 hover:text-ink-900" aria-label="Details"><ChevronRight className="w-5 h-5"/></button>
              </div>
              
              <div className="relative h-[200px] w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie 
                       data={pieData} 
                       cx="50%" 
                       cy="100%" 
                       startAngle={180} 
                       endAngle={0} 
                       innerRadius={70} 
                       outerRadius={110} 
                       paddingAngle={3} 
                       dataKey="value" 
                       stroke="none"
                     >
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
                   <span className="block text-4xl font-bold text-ink-900">{displayCompletion}%</span>
                   <span className="text-xs font-semibold text-ink-400">Complete</span>
                 </div>
              </div>
              
              <div className="flex justify-between mt-6 px-4">
                {pieData.map(d => (
                   <div key={d.name} className="text-center">
                     <div className="flex items-center gap-1.5 justify-center mb-1">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                       <span className="text-xs font-semibold text-ink-500">{d.name}</span>
                     </div>
                     <span className="text-sm font-bold text-ink-900">{d.value}%</span>
                   </div>
                ))}
              </div>
            </GlassCard>

            {/* Weekly Caloric Intake */}
            <GlassCard delay={0.2} className="col-span-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-ink-900">Weekly Caloric Intake</h3>
                <button className="text-ink-400 hover:text-ink-900" aria-label="Details"><ChevronRight className="w-5 h-5"/></button>
              </div>
              <div className="h-[220px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#97a29b', fontWeight: 600 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#97a29b', fontWeight: 600 }} domain={[0, 'dataMax + 200']} />
                     <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                     <Bar dataKey="kcal" radius={[6, 6, 6, 6]} barSize={16}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.highlight ? '#8b5cf6' : (index % 2 === 0 ? '#bbf7d0' : '#fed7aa')} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
                 {/* Target Line */}
                 <div className="absolute top-[35%] left-[10%] right-[5%] border-t-2 border-dashed border-ink-900/20 pointer-events-none">
                    <span className="absolute -top-5 right-0 text-[10px] font-bold text-ink-500 bg-white/50 px-2 rounded-full">{targetCals.toLocaleString()} kcal target</span>
                 </div>
              </div>
            </GlassCard>

            {/* AI Health Assistant */}
            <GlassCard delay={0.3} className="col-span-1 p-6 flex flex-col bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                     <Bot className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-ink-900">AI Health Assistant</h3>
               </div>
               
               <div className="flex-1 space-y-4">
                  <p className="text-sm text-ink-700 leading-relaxed font-medium">
                    <strong className="text-ink-900">{userName}, your nutrition is monitored!</strong><br/><br/>
                    {consumedCals > 0 
                      ? `You have logged ${consumedCals.toLocaleString()} kcal today across ${meals.length} meal(s). Your target is ${targetCals.toLocaleString()} kcal.`
                      : "Start logging your meals with the Scanner to receive custom real-time macro suggestions."}
                  </p>
                  <p className="text-sm text-ink-700 leading-relaxed font-medium">
                    Keep up balanced fiber and protein distribution throughout the day for sustained energy.
                  </p>
                  <p className="text-sm text-ink-700 leading-relaxed font-medium text-emerald-600">
                    Hydration is key — track your glasses in the Hydration tab!
                  </p>
               </div>

               <button 
                 onClick={() => setActiveTab('calculators')}
                 className="w-full mt-6 py-3.5 bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
               >
                 <Sparkles className="w-4 h-4 text-emerald-500" /> Open Precision Calculators
               </button>
            </GlassCard>


          </div>
        </div>
      )}
    </div>
  );
}
