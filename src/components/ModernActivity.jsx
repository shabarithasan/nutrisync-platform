import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, Heart, Timer, MapPin, ChevronRight, Play, X, Plus } from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernActivity() {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('nts-workouts');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Morning Run', loc: 'Central Park', km: 5.2, cal: 320, min: 28, type: 'run' },
      { id: 2, title: 'Vinyasa Yoga', loc: 'Living Room', km: null, cal: 180, min: 45, type: 'yoga' }
    ];
  });
  useEffect(() => localStorage.setItem('nts-workouts', JSON.stringify(workouts)), [workouts]);
  const [form, setForm] = useState({ title: '', cal: '', min: '' });

  const handleAdd = () => {
    if (!form.title || !form.cal || !form.min) return;
    setWorkouts([{ id: Date.now(), title: form.title, loc: 'Home', km: null, cal: parseInt(form.cal), min: parseInt(form.min), type: 'custom' }, ...workouts]);
    setShowModal(false);
    setForm({ title: '', cal: '', min: '' });
  };

  const activityData = [
    { day: 'Mon', cal: 450, avg: 300 },
    { day: 'Tue', cal: 520, avg: 300 },
    { day: 'Wed', cal: 380, avg: 300 },
    { day: 'Thu', cal: 600, avg: 300 },
    { day: 'Fri', cal: 490, avg: 300 },
    { day: 'Sat', cal: 750, avg: 300 },
    { day: 'Sun', cal: 680, avg: 300 },
  ];

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Activity & Workouts</h2>
          <p className="text-ink-500 font-medium mt-1">Track your fitness journey and active calories.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-ink-900 text-white rounded-xl font-bold shadow-lg shadow-ink-900/20 hover:bg-ink-800 transition-all hover:-translate-y-0.5 active:scale-95">
          Log Workout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Chart & Heart Rate */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <GlassCard delay={0.1} className="p-6 flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-ink-900">Active Calories Burned</h3>
                <p className="text-2xl font-bold text-orange-500 mt-1">3,870 <span className="text-sm font-semibold text-ink-400">kcal this week</span></p>
              </div>
              <div className="p-3 bg-orange-100 rounded-2xl">
                 <Flame className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#97a29b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#97a29b', fontWeight: 600 }} />
                    <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="cal" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorCal)" activeDot={{ r: 8, strokeWidth: 0, fill: '#ea580c' }} />
                    <Area type="step" dataKey="avg" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-6 h-[160px]">
             <GlassCard delay={0.2} className="p-6 flex flex-col justify-between group cursor-pointer bg-gradient-to-br from-rose-50/50 to-pink-50/50">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-ink-900">Heart Rate</h3>
                   <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                </div>
                <div>
                   <span className="text-4xl font-bold text-ink-900 tracking-tight">72 <span className="text-sm font-semibold text-ink-500">bpm</span></span>
                   <p className="text-xs font-medium text-rose-600 mt-1">Resting avg: 68 bpm</p>
                </div>
             </GlassCard>
             <GlassCard delay={0.3} className="p-6 flex flex-col justify-between group cursor-pointer bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-ink-900">Active Time</h3>
                   <Timer className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                   <span className="text-4xl font-bold text-ink-900 tracking-tight">4.2 <span className="text-sm font-semibold text-ink-500">hrs</span></span>
                   <p className="text-xs font-medium text-emerald-600 mt-1">+1.1 hrs from last week</p>
                </div>
             </GlassCard>
          </div>
        </div>

        {/* Right Column: Recent Workouts */}
        <GlassCard delay={0.4} className="col-span-1 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-ink-900">Recent Workouts</h3>
            <button className="text-ink-400 hover:text-ink-900"><ChevronRight className="w-5 h-5"/></button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
             {workouts.map(w => (
               <div key={w.id} onClick={() => setSelectedWorkout(w)} className="bg-white/60 p-4 rounded-2xl border border-white/80 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                 <div className="flex gap-4 items-center mb-3">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${w.type === 'run' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                     {w.type === 'run' ? <Activity className="w-6 h-6 text-orange-500" /> : <span className="text-2xl">?????</span>}
                   </div>
                   <div>
                     <h4 className="font-bold text-ink-900">{w.title}</h4>
                     <p className="text-xs font-medium text-ink-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {w.loc}</p>
                   </div>
                 </div>
                 <div className="flex justify-between items-center px-2 py-2 bg-ink-900/5 rounded-xl">
                   <div className="text-center"><span className="block text-sm font-bold text-ink-900">{w.km || '--'}</span><span className="text-[10px] text-ink-500 font-semibold uppercase">km</span></div>
                   <div className="w-px h-6 bg-ink-900/10"></div>
                   <div className="text-center"><span className="block text-sm font-bold text-ink-900">{w.cal}</span><span className="text-[10px] text-ink-500 font-semibold uppercase">kcal</span></div>
                   <div className="w-px h-6 bg-ink-900/10"></div>
                   <div className="text-center"><span className="block text-sm font-bold text-ink-900">{w.min}</span><span className="text-[10px] text-ink-500 font-semibold uppercase">min</span></div>
                 </div>
               </div>
             ))}
             
             {/* Start new */}
             <div className="mt-auto pt-4">
                <button onClick={() => setShowModal(true)} className="w-full py-4 border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4 fill-emerald-600" /> Start New Workout
                </button>
             </div>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white/90 backdrop-blur-2xl border border-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ink-900">Log Workout</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-ink-400 hover:text-ink-900" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-500 uppercase mb-1">Workout Name</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. HIIT Training" className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-500 uppercase mb-1">Calories</label>
                    <input type="number" value={form.cal} onChange={e => setForm({...form, cal: e.target.value})} placeholder="kcal" className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-500 uppercase mb-1">Duration</label>
                    <input type="number" value={form.min} onChange={e => setForm({...form, min: e.target.value})} placeholder="min" className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <button onClick={handleAdd} className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Save Workout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20"></div>
              
              <div className="relative flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedWorkout.type === 'run' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                  {selectedWorkout.type === 'run' ? <Activity className="w-8 h-8 text-orange-500" /> : <span className="text-3xl">?????</span>}
                </div>
                <button onClick={() => setSelectedWorkout(null)} className="p-2 hover:bg-ink-900/5 rounded-full bg-white/50 backdrop-blur-md"><X className="w-5 h-5 text-ink-500" /></button>
              </div>

              <div className="relative mb-8">
                <h2 className="text-3xl font-extrabold text-ink-900 mb-1">{selectedWorkout.title}</h2>
                <p className="text-sm font-medium text-ink-500 flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedWorkout.loc}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-ink-900/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-ink-900">{selectedWorkout.km || '--'}</span>
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">Distance</span>
                </div>
                <div className="bg-orange-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">{selectedWorkout.cal}</span>
                  <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-wider">Calories</span>
                </div>
                <div className="bg-blue-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{selectedWorkout.min}</span>
                  <span className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider">Minutes</span>
                </div>
              </div>
              
              <button onClick={() => setSelectedWorkout(null)} className="w-full py-4 bg-ink-900 text-white font-bold rounded-xl shadow-lg hover:bg-ink-800 transition-colors">
                Close Detail
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
