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
  
  useEffect(() => {
    if (page === 'overview') {
      const w = parseInt(localStorage.getItem('nts-water-modern')) || 0;
      setWater(w);
      const m = localStorage.getItem('nts-meals');
      if(m) setMeals(JSON.parse(m));
      const wk = localStorage.getItem('nts-workouts');
      if(wk) setWorkouts(JSON.parse(wk));
      
      const loadSteps = () => {
        try {
          const logs = JSON.parse(localStorage.getItem('nts-log') || '{}');
          const today = new Date().toISOString().split('T')[0];
          setSteps(logs[today]?.steps || 0);
        } catch { setSteps(0); }
      };
      
      loadSteps();
      window.addEventListener('nts-log-updated', loadSteps);
      return () => window.removeEventListener('nts-log-updated', loadSteps);
    }
  }, [page]);

  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const age = Number(profile?.age) || 30;
  const isMale = profile?.gender === 'Male';
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
  const targetCals = Math.round(bmr * 1.55) || 2400;
  
  const consumedCals = meals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
  const activeCals = workouts.reduce((sum, wk) => sum + (wk.cal || 0), 0);
  
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
    { icon: Camera, label: 'Scanner', id: 'scan' },
    { icon: Salad, label: 'Diet Plans', id: 'diet' },
    { icon: Activity, label: 'Workouts', id: 'progress' },
    { icon: Droplet, label: 'Hydration', id: 'water' },
    { icon: Watch, label: 'Devices', id: 'integrations' },
    { icon: Users, label: 'Community', id: 'social' },
    { icon: BarChart2, label: 'Analytics', id: 'reports' },
    { icon: User, label: 'Profile', id: 'calculator' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#e8efec] font-sans flex overflow-hidden selection:bg-brand-500/30">
      
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
        className="w-64 h-full relative z-10 p-6 flex flex-col gap-8 border-r border-white/40 bg-white/20 backdrop-blur-3xl"
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
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-ink-900/20 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="w-full max-w-2xl bg-white/90 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center px-6 py-4 border-b border-ink-100 bg-white/50">
                  <Search className="w-5 h-5 text-ink-400 mr-3" />
                  <input 
                    type="text" autoFocus
                    placeholder="Search meals, workouts, diet plans, features..."
                    className="flex-1 bg-transparent border-none outline-none text-ink-900 placeholder:text-ink-300 text-lg font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-full hover:bg-ink-100 text-ink-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  {searchQuery.trim() === '' ? (
                    <div className="p-8 text-center text-ink-400">
                      <p className="font-medium mb-1">Quick Navigation</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {sidebarLinks.filter(l => l.id !== 'overview').map(link => (
                          <button key={link.id} onClick={() => { setPage(link.id); setIsSearchOpen(false); }} className="px-3 py-1.5 bg-ink-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 text-ink-600">
                            <link.icon className="w-4 h-4" /> {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      {sidebarLinks.filter(l => l.label.toLowerCase().includes(searchQuery.toLowerCase())).map(link => (
                        <div key={link.id} onClick={() => { setPage(link.id); setIsSearchOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><link.icon className="w-4 h-4" /></div>
                          <div className="flex-1 font-semibold text-ink-900 group-hover:text-emerald-700">{link.label}</div>
                          <ChevronRight className="w-4 h-4 text-emerald-400" />
                        </div>
                      ))}
                      {/* Note: In a real app we would map over meals/workouts here */}
                      <div className="px-4 py-8 text-center">
                        <p className="text-ink-400 font-medium">Press Enter to search entire database for "{searchQuery}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {page === 'overview' ? (
          /* Dashboard Grid */
          <div className="space-y-6">
            {/* Motivational Quote Banner */}
            <MotivationalQuote className="w-full" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
            
            {/* Row 0: Health Circle */}
            <GlassCard delay={0.05} className="col-span-1 lg:col-span-4 p-6 flex flex-col items-center justify-center">
              <HealthCircle profile={profile} size={140} />
            </GlassCard>

            <GlassCard delay={0.08} className="col-span-1 lg:col-span-4 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-ink-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
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
            </GlassCard>

            <GlassCard delay={0.1} className="col-span-1 lg:col-span-4 p-6 flex flex-col justify-between">
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
                
                <div className="flex justify-between items-center text-xs mt-2"><span className="font-semibold text-ink-700">Steps</span><span className="font-bold text-ink-900">{steps.toLocaleString()} / 10,000</span></div>
                <div className="h-1.5 bg-ink-900/5 rounded-full overflow-hidden"><div className="h-full bg-blue-400 rounded-full transition-all duration-700" style={{width: `${Math.min(100, (steps/10000)*100)}%`}} /></div>
              </div>
            </GlassCard>
            
            {/* Row 1: 4 Cards */}
            <GlassCard delay={0.15} className="col-span-1 lg:col-span-5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-ink-900">Today's Macros</h3>
                <span className="text-xs font-semibold text-ink-400">{consumedCals > 0 ? 'From logged meals' : 'No meals logged yet'}</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.p||0), 0)} max={Math.round(targetCals*0.3/4)} color="#10b981" size={80} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.p||0), 0)}g`} sublabel={`${Math.round(targetCals*0.3/4)}g`} />
                  <span className="text-xs font-semibold text-ink-900">Protein</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.c||0), 0)} max={Math.round(targetCals*0.45/4)} color="#f59e0b" size={80} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.c||0), 0)}g`} sublabel={`${Math.round(targetCals*0.45/4)}g`} />
                  <span className="text-xs font-semibold text-ink-900">Carbs</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Ring value={meals.reduce((s,m) => s+(m.f||0), 0)} max={Math.round(targetCals*0.25/9)} color="#f97316" size={80} strokeWidth={8} label={`${meals.reduce((s,m) => s+(m.f||0), 0)}g`} sublabel={`${Math.round(targetCals*0.25/9)}g`} />
                  <span className="text-xs font-semibold text-ink-900">Fats</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.2} className="col-span-1 lg:col-span-3 p-6 flex flex-col justify-between relative group">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-ink-900">Calorie Balance</h3>
                  <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-ink-900 tracking-tight">1,650</span>
                  <span className="text-sm font-semibold text-ink-400">/ 2,100 kcal</span>
                </div>
              </div>
              {/* Sparkline Mock */}
              <div className="h-16 mt-4 w-full flex items-end">
                <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-ratio-none overflow-visible">
                  <path d="M0,25 Q10,10 20,20 T40,15 T60,25 T80,5 T100,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0,30 Q15,20 25,30 T50,20 T75,30 T100,15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>
              <p className="text-xs font-medium text-ink-500 mt-2">Remaining: <strong className="text-ink-900">450 kcal</strong></p>
            </GlassCard>

            <GlassCard delay={0.3} className="col-span-1 lg:col-span-2 p-6 flex flex-col justify-between group">
               <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-ink-900">Water</h3>
                    <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Glasses</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors" />
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <span className="text-2xl font-bold text-ink-900">{waterGlasses}<span className="text-sm text-ink-400">/10</span></span>
                    <p className="text-[10px] font-medium text-ink-500 mt-1">1500/2000ml</p>
                  </div>
                  <div className="w-10 h-14 bg-blue-100 rounded-b-lg rounded-t-sm border-2 border-blue-200 relative overflow-hidden">
                    <motion.div 
                      initial={{ height: "0%" }} animate={{ height: "75%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-400"
                    />
                  </div>
                </div>
                <div className="h-1.5 w-full bg-ink-900/5 rounded-full mt-4 overflow-hidden">
                   <motion.div initial={{ width: "0%" }} animate={{ width: "75%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-blue-400 rounded-full" />
                </div>
            </GlassCard>

            <GlassCard delay={0.4} className="col-span-1 lg:col-span-2 p-6 flex flex-col items-center justify-center relative group">
               <ChevronRight className="absolute top-6 right-6 w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors" />
               <h3 className="font-bold text-ink-900 absolute top-6 left-6">Steps</h3>
               <div className="mt-6">
                 <Ring value={8742} max={10000} color="#10b981" size={110} strokeWidth={10} label="8,742" sublabel="10,000" />
               </div>
            </GlassCard>

            {/* Row 2: Main Chart & Side Widgets */}
            <GlassCard delay={0.5} className="col-span-1 lg:col-span-7 p-6 min-h-[380px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-ink-900">Nutrition Trends (This Week)</h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-xs font-semibold text-ink-500">P</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"/> <span className="text-xs font-semibold text-ink-500">C</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"/> <span className="text-xs font-semibold text-ink-500">F</span></div>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorF" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7871', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7871', fontWeight: 600 }} />
                      <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="c" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorC)" />
                      <Area type="monotone" dataKey="f" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorF)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="col-span-1 lg:col-span-5 grid grid-rows-[auto_1fr] gap-6">
              
              {/* Meal Tracker */}
              <GlassCard delay={0.6} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-ink-900">Meal Tracker</h3>
                  <button 
                    onClick={() => setPage('scan')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan Meal</span>
                  </button>
                </div>
                <div className="flex gap-6">
                   {/* Mini Pie */}
                   <div className="w-24 shrink-0 flex flex-col items-center">
                      <Ring value={consumedCals} max={targetCals} color="#f59e0b" trackColor="#10b981" size={80} strokeWidth={8} label={consumedCals.toString()} sublabel="kcal" />
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-[10px] font-bold text-ink-500">P/C</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"/> <span className="text-[10px] font-bold text-ink-500">F/F</span></div>
                      </div>
                   </div>
                   
                   {/* List */}
                   
                   <div className="flex-1 flex flex-col justify-center gap-3">
                      {meals.length === 0 ? (
                        <div 
                          onClick={() => setPage('scan')}
                          className="text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 py-4 cursor-pointer hover:underline flex flex-col items-center gap-1.5 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200/80 p-3 transition-all hover:bg-emerald-50"
                        >
                          <Camera className="w-4 h-4 text-emerald-500" />
                          <span>No meals logged yet. Click to open Scanner!</span>
                        </div>
                      ) : meals.slice(0, 3).map(meal => (
                        <div key={meal.id} className="flex items-center p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors cursor-pointer group">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-inner mr-3 group-hover:scale-110 transition-transform">??</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-ink-900">{meal.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-ink-900">{meal.cal} kcal</p>
                            <p className="text-[10px] font-semibold text-ink-400">{meal.time}</p>
                          </div>
                        </div>
                      ))}
                   </div>
</div></GlassCard>

              {/* Bottom 2 mini cards */}
              <div className="grid grid-cols-2 gap-6 h-full">
                <GlassCard delay={0.7} className="p-5 flex flex-col justify-between group cursor-pointer">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-ink-900 text-sm">Health Goals</h3>
                      <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors" />
                   </div>
                   <div className="space-y-3">
                     <div>
                       <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-ink-900">Sleep</span><span className="text-ink-500">{Math.round(activeCals / 100 + 5)} hrs</span></div>
                       <div className="h-1.5 bg-ink-900/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[85%] rounded-full"/></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-ink-900">Cardio</span><span className="text-ink-500">{Math.round(activeCals / 10)} min</span></div>
                       <div className="h-1.5 bg-ink-900/10 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[60%] rounded-full"/></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-ink-900">Fiber</span><span className="text-ink-500">{Math.round(consumedCals / 50)}g</span></div>
                       <div className="h-1.5 bg-ink-900/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[95%] rounded-full"/></div>
                     </div>
                   </div>
                </GlassCard>
                
                <GlassCard delay={0.8} className="p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                   <div className="flex justify-between items-center z-10 relative">
                      <h3 className="font-bold text-ink-900 text-sm">Weight</h3>
                      <MoreHorizontal className="w-4 h-4 text-ink-400" />
                   </div>
                   <div className="z-10 relative mt-2">
                      <span className="text-2xl font-bold text-ink-900 block">{profile?.weight || "--"} kg</span>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                         <ArrowUpRight className="w-3 h-3 rotate-90" />
                         -0.8 kg this week
                      </span>
                   </div>
                   {/* Absolute Sparkline */}
                   <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 40" className="w-full h-full preserve-aspect-ratio-none">
                         <path d="M0,10 Q20,5 30,15 T60,10 T80,25 T100,20 L100,40 L0,40 Z" fill="url(#colorF)" />
                         <path d="M0,10 Q20,5 30,15 T60,10 T80,25 T100,20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                   </div>
                </GlassCard>
              </div>
            </div>
            
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
