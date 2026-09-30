import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Apple, Activity, Target, Lightbulb, Users, Settings,
  Search, Bell, MoreHorizontal, ChevronRight, Droplet, Flame, ArrowUpRight,
  Camera, BarChart2, User, Salad, Heart, Watch, X, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MotivationalQuote } from './MotivationalQuote';
import { HealthCircle } from './HealthCircle';
import { ModernSearch } from './ModernSearch';

/* --- Components --- */

const GlassCard = ({ children, className = "", delay = 0, noHover = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={noHover ? {} : { y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const Ring = ({ value, max, color, size, strokeWidth, label, sublabel, trackColor = "rgba(0,0,0,0.05)" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = Math.min(value / max, 1);
  const strokeDashoffset = circumference - pct * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={trackColor} strokeWidth={strokeWidth}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-ink-900 font-bold" style={{ fontSize: size * 0.22 }}>{label}</span>
        {sublabel && <span className="text-ink-400 font-medium" style={{ fontSize: size * 0.12 }}>{sublabel}</span>}
      </div>
    </div>
  );
};

/* --- Main Dashboard --- */

export function ModernDashboard({ profile, page, setPage, children }) {
  const [water, setWater] = useState(0);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [steps, setSteps] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    if (page === 'overview') {
      const loadData = () => {
        const w = parseInt(localStorage.getItem('nts-water-modern')) || 0;
        setWater(w);
        const m = localStorage.getItem('nts-meals');
        if (m) setMeals(JSON.parse(m));
        
        try {
          const wkHistory = localStorage.getItem('nts-workout-history');
          const wkOld = localStorage.getItem('nts-workouts');
          const parsed = wkHistory ? JSON.parse(wkHistory) : (wkOld ? JSON.parse(wkOld) : []);
          setWorkouts(parsed);
        } catch {
          setWorkouts([]);
        }

        try {
          const logs = JSON.parse(localStorage.getItem('nts-log') || '{}');
          const today = new Date().toISOString().split('T')[0];
          setSteps(logs[today]?.steps || 0);
        } catch { setSteps(0); }
      };

      loadData();

      const events = [
        'nts-log-updated',
        'nts-water-updated',
        'nts-meals-updated',
        'nts-workouts-updated',
        'nts-data-updated',
        'storage'
      ];
      events.forEach(evt => window.addEventListener(evt, loadData));
      return () => events.forEach(evt => window.removeEventListener(evt, loadData));
    }
  }, [page]);

  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const age = Number(profile?.age) || 30;
  const isMale = profile?.gender === 'Male';
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
  const targetCals = Math.round(bmr * 1.55) || 2400;
  
  const consumedCals = meals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
  const activeCals = workouts.reduce((sum, wk) => sum + (wk.calories || wk.cal || 0), 0);
  
  const waterGlasses = Math.floor(water / 250);

  const trendData = [
    { day: 'Mon', c: 80, f: 50 },
    { day: 'Tue', c: 180, f: 120 },
    { day: 'Wed', c: 100, f: 70 },
    { day: 'Thu', c: 160, f: 100 },
    { day: 'Fri', c: 170, f: 140 },
    { day: 'Sat', c: 240, f: 110 },
    { day: 'Today', c: Math.max(80, consumedCals/10), f: Math.max(50, activeCals/2) },
  ];

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'overview' },
    { icon: BarChart2, label: 'Analysis', id: 'reports' },
    { icon: Camera, label: 'Scanner', id: 'scan' },
    { icon: Salad, label: 'Diet Plans', id: 'diet' },
    { icon: Activity, label: 'Workouts', id: 'progress' },
    { icon: Droplet, label: 'Hydration', id: 'water' },
    { icon: Users, label: 'Community', id: 'social' },
    { icon: User, label: 'Profile', id: 'calculator' },
  ];

  return (
    <div className="h-[100dvh] w-full bg-[#e8efec] font-sans flex overflow-hidden selection:bg-brand-500/30">
      
      {/* Dynamic Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-200/40 blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 60, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-orange-200/40 blur-[100px]" 
        />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="w-64 h-full relative z-10 p-6 flex flex-col gap-8 border-r border-white/40 bg-white/20 backdrop-blur-3xl overflow-y-auto"
      >
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-ink-900 tracking-tight">NutriSync</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 mt-4">
          {sidebarLinks.map((link, i) => (
            <motion.button
              key={link.label} onClick={() => setPage(link.id)}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                page === link.id 
                  ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-ink-900' 
                  : 'text-ink-500 hover:bg-white/40 hover:text-ink-900'
              }`}
            >
              <link.icon className={`w-4 h-4 ${page === link.id ? 'text-emerald-500' : ''}`} strokeWidth={2.5} />
              {link.label}
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 p-8 lg:p-10">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight mb-2">
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, {profile?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-ink-500 font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-4 relative">
            <button 
              onClick={() => { setIsSearchOpen(true); setIsNotifOpen(false); }}
              className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-white flex items-center justify-center text-ink-900 shadow-sm hover:bg-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsSearchOpen(false); }}
              className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-white flex items-center justify-center text-ink-900 shadow-sm hover:bg-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-16 right-0 w-80 bg-white/90 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-ink-100 flex justify-between items-center bg-white/50">
                    <h3 className="font-bold text-ink-900">Notifications</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">2 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 border-b border-ink-50 hover:bg-emerald-50/50 cursor-pointer transition-colors flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-ink-900">AI Diet Plan Ready</h4>
                        <p className="text-xs text-ink-500 mt-0.5">Your personalized weekly meal plan has been generated successfully.</p>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-orange-50/50 cursor-pointer transition-colors flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Target className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-ink-900">Goal Update</h4>
                        <p className="text-xs text-ink-500 mt-0.5">You're 30% closer to your target weight this month! Keep it up.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </header>

        {/* Search Modal (Global Overlay) */}
        <ModernSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setPage={setPage} />

        {page === 'overview' ? (
          /* Dashboard Grid */
          <div className="space-y-6">
            {/* Motivational Quote Banner */}
            <MotivationalQuote className="w-full" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
            
            {/* Row 0: Live Dynamic Wellness Index & Controls */}
            <HealthCircle 
              profile={profile} 
              setPage={setPage} 
              delay={0.05} 
              className="col-span-1 lg:col-span-4 min-h-[290px]" 
            />

            <GlassCard delay={0.08} className="col-span-1 lg:col-span-4 p-6 flex flex-col justify-between min-h-[290px]">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">Quick Actions</h3>
                    <p className="text-[11px] font-medium text-ink-400">Log habits & routines</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => setPage('scan')} className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-bold text-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Camera className="w-3.5 h-3.5" /> Scan Food
                  </button>
                  <button onClick={() => setPage('diet')} className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-bold text-amber-700 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Salad className="w-3.5 h-3.5" /> Diet Plan
                  </button>
                  <button onClick={() => setPage('progress')} className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-700 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Activity className="w-3.5 h-3.5" /> Workouts
                  </button>
                  <button onClick={() => setPage('water')} className="px-3 py-2.5 bg-cyan-50 hover:bg-cyan-100 rounded-xl text-xs font-bold text-cyan-700 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Droplet className="w-3.5 h-3.5" /> Hydrate
                  </button>
                </div>
              </div>
              <div className="pt-3 border-t border-ink-100/60 flex items-center justify-between text-[11px] text-ink-500 font-medium">
                <span>Instant habit updates</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">Live Sync <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /></span>
              </div>
            </GlassCard>

            <GlassCard delay={0.1} className="col-span-1 lg:col-span-4 p-6 flex flex-col justify-between min-h-[290px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">Daily Targets</h3>
                  <p className="text-[10px] text-ink-500 font-medium">Based on your profile</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs"><span className="font-semibold text-ink-700">Calories</span><span className="font-bold text-ink-900">{targetCals} kcal</span></div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{width: `${Math.min(100, (consumedCals/targetCals)*100)}%`}} /></div>
                <div className="flex justify-between items-center text-xs"><span className="font-semibold text-ink-700">Water</span><span className="font-bold text-ink-900">{waterGlasses} / {Math.max(6, Math.round(weight * 35 / 250))} glasses</span></div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{width: `${Math.min(100, (waterGlasses/Math.max(6, Math.round(weight * 35 / 250)))*100)}%`}} /></div>
                <div className="flex justify-between items-center text-xs"><span className="font-semibold text-ink-700">Meals Logged</span><span className="font-bold text-ink-900">{meals.length} today</span></div>
              </div>
            </GlassCard>
            
            {/* Row 1: Macros & Water */}
            <GlassCard delay={0.15} className="col-span-1 lg:col-span-7 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-ink-900 text-base">Today's Macros</h3>
                  <p className="text-xs text-ink-400 font-medium">Daily macronutrient consumption</p>
                </div>
                <span className="text-xs font-semibold text-ink-400">{consumedCals > 0 ? 'From logged meals' : 'No meals logged yet'}</span>
              </div>
              <div className="flex justify-around items-center px-4">
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.p||0), 0)} max={Math.round(targetCals*0.3/4)} color="#10b981" size={88} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.p||0), 0)}g`} sublabel={`${Math.round(targetCals*0.3/4)}g`} />
                  <span className="text-xs font-bold text-ink-900">Protein</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.c||0), 0)} max={Math.round(targetCals*0.45/4)} color="#f59e0b" size={88} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.c||0), 0)}g`} sublabel={`${Math.round(targetCals*0.45/4)}g`} />
                  <span className="text-xs font-bold text-ink-900">Carbs</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.f||0), 0)} max={Math.round(targetCals*0.25/9)} color="#f97316" size={88} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.f||0), 0)}g`} sublabel={`${Math.round(targetCals*0.25/9)}g`} />
                  <span className="text-xs font-bold text-ink-900">Fats</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.2} className="col-span-1 lg:col-span-5 p-6 flex flex-col justify-between group">
               <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-ink-900 text-base">Water Tracker</h3>
                    <p className="text-xs text-ink-400 font-medium">Daily Hydration Intake</p>
                  </div>
                  <ChevronRight onClick={() => setPage('water')} className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors cursor-pointer" />
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <span className="text-3xl font-extrabold text-ink-900">{waterGlasses}<span className="text-sm font-semibold text-ink-400">/{Math.max(6, Math.round(weight * 35 / 250))}</span></span>
                    <p className="text-xs font-medium text-ink-500 mt-1">{waterGlasses * 250}/{Math.max(6, Math.round(weight * 35 / 250)) * 250}ml</p>
                  </div>
                  <div className="w-12 h-16 bg-blue-100 rounded-b-xl rounded-t-sm border-2 border-blue-200 relative overflow-hidden">
                    <motion.div 
                      initial={{ height: "0%" }} animate={{ height: `${Math.min(100, (waterGlasses/Math.max(6, Math.round(weight * 35 / 250)))*100)}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-400"
                    />
                  </div>
                </div>
                <div className="h-2 w-full bg-ink-900/5 rounded-full mt-4 overflow-hidden">
                   <motion.div initial={{ width: "0%" }} animate={{ width: `${Math.min(100, (waterGlasses/Math.max(6, Math.round(weight * 35 / 250)))*100)}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-blue-400 rounded-full" />
                </div>
            </GlassCard>

            {/* Row 2: Meal Tracker & Health Goals */}
            <GlassCard delay={0.25} className="col-span-1 lg:col-span-7 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-ink-900 text-base">Meal Tracker</h3>
                  <p className="text-xs text-ink-400 font-medium">Logged fuel & meals</p>
                </div>
                <button 
                  onClick={() => setPage('scan')}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan Meal</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                 {/* Mini Pie */}
                 <div className="w-28 shrink-0 flex flex-col items-center">
                    <Ring value={consumedCals} max={targetCals} color="#f59e0b" trackColor="#10b981" size={88} strokeWidth={8} label={consumedCals.toString()} sublabel="kcal" />
                    <div className="mt-3 flex gap-3 text-[10px] font-bold text-ink-500">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Protein</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> Carbs</div>
                    </div>
                 </div>
                 
                 {/* List */}
                 <div className="flex-1 w-full flex flex-col justify-center gap-2.5">
                    {meals.length === 0 ? (
                      <div 
                        onClick={() => setPage('scan')}
                        className="text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 py-6 cursor-pointer hover:underline flex flex-col items-center gap-2 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200/80 p-4 transition-all hover:bg-emerald-50"
                      >
                        <Camera className="w-5 h-5 text-emerald-500" />
                        <span>No meals logged yet. Click to open Scanner!</span>
                      </div>
                    ) : meals.slice(0, 3).map(meal => (
                      <div key={meal.id} className="flex items-center p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shadow-inner mr-3 group-hover:scale-110 transition-transform">🥗</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-ink-900 truncate">{meal.title}</p>
                          <p className="text-[10px] font-semibold text-ink-400">{meal.time || 'Today'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-ink-900">{meal.cal} kcal</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.3} className="col-span-1 lg:col-span-5 p-6 flex flex-col justify-between group">
               <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-ink-900 text-base">Health Goals</h3>
                    <p className="text-xs text-ink-400 font-medium">Activity & Workout Progress</p>
                  </div>
                  <ChevronRight onClick={() => setPage('progress')} className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors cursor-pointer" />
               </div>
               <div className="space-y-4 my-auto">
                 <div>
                   <div className="flex justify-between text-xs mb-1.5 font-semibold"><span className="text-ink-900 font-bold">Workouts Completed</span><span className="text-ink-500 font-bold">{workouts.length} / 4</span></div>
                   <div className="h-2 bg-ink-900/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (workouts.length / 4) * 100)}%` }}/></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs mb-1.5 font-semibold"><span className="text-ink-900 font-bold">Active Calories</span><span className="text-ink-500 font-bold">{activeCals} / 500 kcal</span></div>
                   <div className="h-2 bg-ink-900/5 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (activeCals / 500) * 100)}%` }}/></div>
                 </div>
               </div>
               <div className="mt-4 pt-3 border-t border-ink-900/5 flex justify-between items-center text-xs font-semibold text-ink-500">
                 <span>Weekly Activity Target</span>
                 <span className="text-emerald-600 font-bold">{workouts.length >= 4 ? 'Goal Achieved! 🎉' : `${4 - workouts.length} sessions left`}</span>
               </div>
            </GlassCard>

          </div>
        </div>
      ) : (
        <GlassCard className="p-8 min-h-[600px] relative z-10 bg-white/70">
          {children}
        </GlassCard>
      )}
    </main>
  </div>
);
}
