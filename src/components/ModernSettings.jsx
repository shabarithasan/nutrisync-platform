import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Moon, Shield, LogOut, ChevronRight, Save, X, Plus, RotateCcw, Droplets, Flame, Dumbbell, Activity, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MotivationalQuote } from './MotivationalQuote';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const Toggle = ({ active, onToggle }) => (
  <div onClick={onToggle} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${active ? 'bg-emerald-500' : 'bg-ink-900/20'}`}>
    <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-5 h-5 bg-white rounded-full shadow-sm" style={{ x: active ? 20 : 0 }} />
  </div>
);

// Helper for animating numbers
const AnimatedNumber = ({ value }) => {
  return <span>{value}</span>; // Simplification for react state
};

export function ModernSettings({ profile, onUpdateProfile, dark, setDark, onLogout }) {
  const [notif, setNotif] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const [form, setForm] = useState({ 
    name: profile?.name || '', 
    weight: profile?.weight || '', 
    height: profile?.height || '',
    targetWeight: profile?.targetWeight || '',
    gender: profile?.gender || 'male',
    age: profile?.age || 30,
    activityLevel: profile?.activityLevel || 'moderate' // sedentary, light, moderate, active, very_active
  });

  const [weightHistory, setWeightHistory] = useState([]);
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nts-weight-history');
      if (saved) {
        setWeightHistory(JSON.parse(saved));
      } else if (profile?.weight) {
        // Initialize with current weight if no history
        const initial = [{ date: new Date().toISOString(), weight: Number(profile.weight) }];
        setWeightHistory(initial);
        localStorage.setItem('nts-weight-history', JSON.stringify(initial));
      }
    } catch (e) {
      console.error(e);
    }
  }, [profile?.weight]);

  const handleSave = () => {
    onUpdateProfile({ ...profile, ...form });
    setIsEditing(false);
  };

  const handleAddWeight = () => {
    if (!newWeight || isNaN(newWeight)) return;
    const w = Number(newWeight);
    const newEntry = { date: new Date().toISOString(), weight: w };
    const updated = [...weightHistory, newEntry];
    setWeightHistory(updated);
    localStorage.setItem('nts-weight-history', JSON.stringify(updated));
    onUpdateProfile({ ...profile, weight: w });
    setForm(prev => ({ ...prev, weight: w }));
    setNewWeight('');
  };

  const handleUndoWeight = () => {
    if (weightHistory.length <= 1) return;
    const updated = weightHistory.slice(0, -1);
    setWeightHistory(updated);
    localStorage.setItem('nts-weight-history', JSON.stringify(updated));
    const lastWeight = updated[updated.length - 1].weight;
    onUpdateProfile({ ...profile, weight: lastWeight });
    setForm(prev => ({ ...prev, weight: lastWeight }));
  };

  // Profile Completion Score
  const fields = ['name', 'email', 'weight', 'height', 'targetWeight', 'age', 'gender', 'activityLevel'];
  const filledFields = fields.filter(f => profile?.[f]);
  const completionScore = Math.round((filledFields.length / fields.length) * 100);

  // BMI calc
  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 22.5;
  
  // BMI Gauge calc
  const minBmi = 15; const maxBmi = 40;
  const clamped = Math.max(minBmi, Math.min(maxBmi, bmi));
  const pct = (clamped - minBmi) / (maxBmi - minBmi);
  const rotation = -90 + (pct * 180);

  let bmiCategory = "";
  let bmiMessage = "";
  if (bmi < 18.5) { bmiCategory = "Underweight"; bmiMessage = "You're below the healthy range. Focus on nutrient-dense foods."; }
  else if (bmi < 25) { bmiCategory = "Normal"; bmiMessage = "Great! You're in the healthy range. Keep maintaining!"; }
  else if (bmi < 30) { bmiCategory = "Overweight"; bmiMessage = "Slightly above healthy range. Small changes make big differences."; }
  else { bmiCategory = "Obese"; bmiMessage = "Let's work together on this. Every healthy choice counts!"; }

  const idealWeightMin = (18.5 * heightM * heightM).toFixed(1);
  const idealWeightMax = (24.9 * heightM * heightM).toFixed(1);
  
  // Basic Body Fat Estimation (Navy method approximation based on BMI)
  const age = Number(profile?.age) || 30;
  const gender = profile?.gender || 'male';
  let bodyFat = 0;
  if (gender === 'male') {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
  } else {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
  }
  bodyFat = Math.max(5, bodyFat).toFixed(1);

  // Health Analysis
  // BMR (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += (gender === 'male' ? 5 : -161);
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const tdee = bmr * (activityMultipliers[profile?.activityLevel] || 1.55);
  
  const waterIntake = Math.round(weight * 35); // ml
  const isTargetLoss = profile?.targetWeight && Number(profile.targetWeight) < weight;
  const isTargetGain = profile?.targetWeight && Number(profile.targetWeight) > weight;
  
  let recCalories = Math.round(tdee);
  if (isTargetLoss) recCalories -= 500;
  if (isTargetGain) recCalories += 500;

  const proteinMultiplier = (profile?.activityLevel === 'active' || profile?.activityLevel === 'very_active' || isTargetLoss) ? 1.6 : 0.8;
  const recProtein = Math.round(weight * proteinMultiplier);

  // Chart Data
  const chartData = weightHistory.slice(-30).map(entry => ({
    date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: entry.weight
  }));

  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : weight;
  const weightChange = (weight - startWeight).toFixed(1);
  const isLoss = weightChange < 0;
  const daysTracked = new Set(weightHistory.map(h => new Date(h.date).toDateString())).size;

  return (
    <div className="h-full w-full flex flex-col items-center relative pb-20">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Profile & Health Analysis</h2>
          <p className="text-ink-500 font-medium mt-1">Track your progress and get personalized insights.</p>
        </div>
        <div className="w-full md:w-64 bg-white/50 backdrop-blur-xl p-3 rounded-2xl border border-white/60 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-ink-900">Profile Completion</span>
            <span className="font-bold text-emerald-500">{completionScore}%</span>
          </div>
          <div className="w-full h-2 bg-ink-900/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completionScore}%` }} className="h-full bg-emerald-500 rounded-full" />
          </div>
          {completionScore < 100 && (
            <p className="text-[10px] text-ink-500 font-medium">Complete your profile for better insights.</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl mb-8">
        <MotivationalQuote category="wellness" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Profile Card */}
          <GlassCard delay={0.1} className="p-8 relative">
             {!isEditing ? (
               <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-24 h-24 shrink-0 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 text-4xl text-white font-bold">
                   {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-ink-900 truncate">{profile?.name || 'User Name'}</h3>
                   <p className="text-ink-500 font-medium truncate">{profile?.email || 'user@example.com'}</p>
                   <button onClick={() => setIsEditing(true)} className="mt-4 px-6 py-2 bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 text-sm font-bold rounded-full transition-colors inline-flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Edit Profile
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-ink-900">Edit Details</h3>
                   <button onClick={() => setIsEditing(false)}><X className="w-5 h-5 text-ink-400 hover:text-ink-900" /></button>
                 </div>
                 <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                 <div className="grid grid-cols-2 gap-4">
                   <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="Weight (kg)" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                   <input type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} placeholder="Height (cm)" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                   <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Age" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                   <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500">
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                   </select>
                   <input type="number" value={form.targetWeight} onChange={e => setForm({...form, targetWeight: e.target.value})} placeholder="Target (kg)" className="col-span-2 w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                 </div>
                 <button onClick={handleSave} className="w-full py-2 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-2">
                   <Save className="w-4 h-4" /> Save Changes
                 </button>
               </div>
             )}
          </GlassCard>

          {/* Settings & Privacy */}
          <GlassCard delay={0.3} className="p-2">
             <div className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/40 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Bell className="w-5 h-5 text-blue-500" /></div>
                   <span className="font-bold text-ink-900">Notifications</span>
                </div>
                <Toggle active={notif} onToggle={() => setNotif(!notif)} />
             </div>
             <div className="w-full h-px bg-ink-900/5 my-1" />
             <div className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/40 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Moon className="w-5 h-5 text-purple-500" /></div>
                   <span className="font-bold text-ink-900">Dark Mode</span>
                </div>
                <Toggle active={dark} onToggle={() => setDark(!dark)} />
             </div>
             <div className="w-full h-px bg-ink-900/5 my-1" />
             <div onClick={() => setShowPrivacyModal(true)} className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/40 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-500" /></div>
                   <span className="font-bold text-ink-900">Privacy & Data</span>
                </div>
                <ChevronRight className="w-5 h-5 text-ink-400 group-hover:text-ink-900 transition-colors" />
             </div>
             <div className="w-full h-px bg-ink-900/5 my-1" />
             <div onClick={onLogout} className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-red-50/50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><LogOut className="w-5 h-5 text-red-500" /></div>
                   <span className="font-bold text-red-600">Sign Out</span>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* Center & Right Col */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhanced BMI Analysis */}
            <GlassCard delay={0.2} className="p-8 flex flex-col relative overflow-hidden bg-white/70">
               <div className="flex justify-between items-center w-full mb-6">
                 <h3 className="font-bold text-ink-900 text-lg">BMI Analysis</h3>
                 <button onClick={() => setShowBmiModal(true)} className="p-2 bg-white rounded-full shadow-sm hover:bg-ink-900/5 transition-colors"><Activity className="w-4 h-4 text-ink-900" /></button>
               </div>
               
                <div className="relative w-full h-48 flex justify-center mb-2 mt-4">
                 <svg viewBox="0 0 200 100" className="w-full h-full max-w-[320px] drop-shadow-md relative z-10 pointer-events-none">
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#3b82f6" strokeWidth="24" pathLength="100" strokeDasharray="17.5 82.5" strokeDashoffset="0" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#10b981" strokeWidth="24" pathLength="100" strokeDasharray="42.5 57.5" strokeDashoffset="-20" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f59e0b" strokeWidth="24" pathLength="100" strokeDasharray="14.5 85.5" strokeDashoffset="-65" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="24" pathLength="100" strokeDasharray="17.5 82.5" strokeDashoffset="-82.5" />

                   <motion.line 
                     x1="100" y1="100" x2="100" y2="35" 
                     stroke="#0f172a" strokeWidth="4" strokeLinecap="round"
                     initial={{ rotate: -90 }} animate={{ rotate: rotation }} 
                     style={{ originX: 0, originY: 1 }}
                     transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.5 }}
                   />
                   <circle cx="100" cy="100" r="8" fill="#0f172a" />
                 </svg>
                 
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center flex flex-col items-center bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm border border-white z-0">
                   <span className="text-4xl font-extrabold text-ink-900 tracking-tight leading-none">{bmi}</span>
                   <span className={`text-sm font-bold ${bmi < 18.5 ? 'text-blue-500' : bmi < 25 ? 'text-emerald-500' : bmi < 30 ? 'text-orange-500' : 'text-red-500'}`}>
                     {bmiCategory}
                   </span>
                 </div>
               </div>
               
               <p className="text-center text-sm font-medium text-ink-500 mt-2 mb-6 px-4">
                 {bmiMessage}
               </p>

               <div className="grid grid-cols-2 gap-4 mt-auto">
                 <div className="bg-ink-900/5 rounded-2xl p-4 flex flex-col items-center text-center">
                   <span className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">Ideal Weight</span>
                   <span className="text-sm font-bold text-ink-900">{idealWeightMin} - {idealWeightMax} kg</span>
                 </div>
                 <div className="bg-ink-900/5 rounded-2xl p-4 flex flex-col items-center text-center">
                   <span className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">Est. Body Fat</span>
                   <span className="text-sm font-bold text-ink-900">~{bodyFat}%</span>
                 </div>
               </div>
            </GlassCard>

            {/* Health Analysis Card */}
            <GlassCard delay={0.3} className="p-8 flex flex-col">
              <h3 className="font-bold text-ink-900 text-lg mb-6">Daily Recommendations</h3>
              
              <div className="space-y-4 flex-1">
                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-900 text-sm">Calories</h4>
                    <p className="text-2xl font-extrabold text-orange-600">{recCalories} <span className="text-sm font-semibold">kcal</span></p>
                    <p className="text-xs font-medium text-ink-500 mt-0.5">Based on your activity & goals</p>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Droplets className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-900 text-sm">Water</h4>
                    <p className="text-2xl font-extrabold text-blue-600">{(waterIntake / 1000).toFixed(1)} <span className="text-sm font-semibold">L</span></p>
                    <p className="text-xs font-medium text-ink-500 mt-0.5">Daily hydration target</p>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-900 text-sm">Protein</h4>
                    <p className="text-2xl font-extrabold text-emerald-600">{recProtein} <span className="text-sm font-semibold">g</span></p>
                    <p className="text-xs font-medium text-ink-500 mt-0.5">For muscle maintenance</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Weight Tracking Section */}
          <GlassCard delay={0.4} className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="font-bold text-ink-900 text-lg">Weight Tracker</h3>
                <p className="text-ink-500 text-sm font-medium">Log your weight to track progress</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="number" 
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Weight (kg)"
                    className="w-32 px-4 py-2 bg-ink-900/5 rounded-xl text-sm font-bold border border-ink-900/10 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button 
                  onClick={handleAddWeight}
                  disabled={!newWeight}
                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
                {weightHistory.length > 1 && (
                  <button 
                    onClick={handleUndoWeight}
                    className="w-10 h-10 bg-white hover:bg-ink-900/5 text-ink-500 rounded-xl flex items-center justify-center transition-colors border border-ink-900/10 shadow-sm"
                    title="Undo last entry"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-ink-900/5 rounded-2xl">
                <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Current</p>
                <p className="text-2xl font-extrabold text-ink-900">{weight} <span className="text-sm font-semibold text-ink-500">kg</span></p>
              </div>
              <div className="p-4 bg-ink-900/5 rounded-2xl">
                <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Change</p>
                <div className="flex items-center gap-1.5">
                  {Math.abs(weightChange) > 0 ? (
                    isLoss ? <TrendingDown className="w-5 h-5 text-emerald-500" /> : <TrendingUp className="w-5 h-5 text-orange-500" />
                  ) : <Minus className="w-5 h-5 text-ink-400" />}
                  <p className={`text-2xl font-extrabold ${Math.abs(weightChange) > 0 ? (isLoss ? 'text-emerald-500' : 'text-orange-500') : 'text-ink-900'}`}>
                    {Math.abs(weightChange)} <span className="text-sm font-semibold text-ink-500">kg</span>
                  </p>
                </div>
              </div>
              <div className="p-4 bg-ink-900/5 rounded-2xl">
                <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Target</p>
                <div className="flex items-center gap-1.5">
                  <Target className="w-5 h-5 text-blue-500" />
                  <p className="text-2xl font-extrabold text-ink-900">{profile?.targetWeight || '--'} <span className="text-sm font-semibold text-ink-500">kg</span></p>
                </div>
              </div>
              <div className="p-4 bg-ink-900/5 rounded-2xl">
                <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Tracked</p>
                <p className="text-2xl font-extrabold text-ink-900">{daysTracked} <span className="text-sm font-semibold text-ink-500">days</span></p>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="w-full h-64 bg-white/50 rounded-2xl p-4 border border-white/60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    {profile?.targetWeight && (
                      <ReferenceLine y={Number(profile.targetWeight)} stroke="#3b82f6" strokeDasharray="3 3" />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

        </div>
      </div>

      {/* BMI Edit Modal */}
      <AnimatePresence>
        {showBmiModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ink-900">Update Body Metrics</h3>
                <button onClick={() => setShowBmiModal(false)} className="p-2 hover:bg-ink-900/5 rounded-full"><X className="w-5 h-5 text-ink-500" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-ink-700 mb-2">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-ink-900/5 focus:outline-none focus:ring-2 ring-emerald-500/50 text-lg font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-700 mb-2">Height (cm)</label>
                  <input type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-ink-900/5 focus:outline-none focus:ring-2 ring-emerald-500/50 text-lg font-semibold" />
                </div>
                <button onClick={() => { handleSave(); setShowBmiModal(false); }} className="w-full mt-4 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-colors">
                  Calculate BMI
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ink-900">Privacy & Data</h3>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-ink-900/5 rounded-full"><X className="w-5 h-5 text-ink-500" /></button>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-ink-500">Your data is stored locally in your browser. We never share your nutritional data with third parties.</p>
                <div className="p-4 rounded-xl bg-ink-900/5 flex items-center justify-between">
                  <span className="font-bold text-ink-900">Clear all local data</span>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-4 py-2 bg-red-500/10 text-red-600 font-bold text-xs rounded-lg hover:bg-red-500/20 transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
