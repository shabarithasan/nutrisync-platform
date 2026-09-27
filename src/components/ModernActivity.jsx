import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Dumbbell, Heart, Flame, Minimize, Waves, Bike, Coffee, 
  Play, Check, X, Calendar, Edit3, Clock, ChevronRight, Activity
} from 'lucide-react';
import { MotivationalQuote } from './MotivationalQuote';

const GlassCard = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={onClick ? { y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" } : {}}
    onClick={onClick}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </motion.div>
);

const WORKOUT_TYPES = {
  Cardio: { color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200', icon: Zap, calPerMin: 8 },
  Strength: { color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200', icon: Dumbbell, calPerMin: 6 },
  Yoga: { color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200', icon: Heart, calPerMin: 4 },
  HIIT: { color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200', icon: Flame, calPerMin: 10 },
  Stretching: { color: 'text-teal-500', bg: 'bg-teal-100', border: 'border-teal-200', icon: Minimize, calPerMin: 3 },
  Swimming: { color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200', icon: Waves, calPerMin: 9 },
  Cycling: { color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200', icon: Bike, calPerMin: 7 },
  'Rest Day': { color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200', icon: Coffee, calPerMin: 0 }
};

const TIME_SLOTS = ['Morning (6-9am)', 'Midday (11am-1pm)', 'Afternoon (3-5pm)', 'Evening (6-9pm)'];
const DURATIONS = [15, 30, 45, 60, 90];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ModernActivity() {
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('nts-gym-schedule');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length > 0) return parsed;
      }
      return {
        Monday: { type: 'Cardio', time: 'Morning (6-9am)', duration: 30, notes: 'Morning jog' },
        Tuesday: { type: 'Strength', time: 'Evening (6-9pm)', duration: 45, notes: 'Upper body' },
        Wednesday: { type: 'Rest Day', time: '', duration: 0, notes: 'Active recovery' },
        Thursday: { type: 'HIIT', time: 'Morning (6-9am)', duration: 30, notes: 'Full body intervals' },
        Friday: { type: 'Strength', time: 'Evening (6-9pm)', duration: 45, notes: 'Lower body' },
        Saturday: { type: 'Cycling', time: 'Morning (6-9am)', duration: 60, notes: 'Long ride' },
        Sunday: { type: 'Rest Day', time: '', duration: 0, notes: 'Relax and stretch' }
      };
    } catch {
      return {};
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nts-workout-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nts-gym-schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('nts-workout-history', JSON.stringify(history));
  }, [history]);

  const todayIndex = new Date().getDay(); // 0 is Sunday
  const todayName = todayIndex === 0 ? 'Sunday' : DAYS[todayIndex - 1];
  const todayWorkout = schedule[todayName] || { type: 'Rest Day', duration: 0, time: '', notes: '' };

  const [activeWorkout, setActiveWorkout] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editForm, setEditForm] = useState({ type: 'Cardio', time: TIME_SLOTS[0], duration: 30, notes: '' });

  useEffect(() => {
    let interval;
    if (activeWorkout) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const openModal = (day) => {
    setEditingDay(day);
    if (schedule[day]) {
      setEditForm(schedule[day]);
    } else {
      setEditForm({ type: 'Cardio', time: TIME_SLOTS[0], duration: 30, notes: '' });
    }
    setModalOpen(true);
  };

  const saveSchedule = () => {
    setSchedule({ ...schedule, [editingDay]: editForm });
    setModalOpen(false);
  };

  const handleStartComplete = () => {
    if (!activeWorkout) {
      setActiveWorkout(true);
      setTimerSeconds(0);
    } else {
      setActiveWorkout(false);
      const minutes = Math.ceil(timerSeconds / 60);
      const calBurned = (WORKOUT_TYPES[todayWorkout.type]?.calPerMin || 0) * minutes;
      
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        type: todayWorkout.type,
        duration: minutes,
        calories: calBurned
      };
      
      setHistory([newEntry, ...history]);
      setTimerSeconds(0);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklySummary = history.reduce((acc, curr) => {
    acc.workouts += 1;
    acc.minutes += curr.duration;
    acc.calories += curr.calories;
    return acc;
  }, { workouts: 0, minutes: 0, calories: 0 });

  return (
    <div className="h-full w-full flex flex-col relative overflow-y-auto pb-10">
      <div className="mb-6">
        <MotivationalQuote category="fitness" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Gym Time & Workouts</h2>
          <p className="text-ink-500 font-medium mt-1">Plan your week, track your progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* Hero Section: Today's Workout */}
          <GlassCard delay={0.1} className="p-8 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_12px_40px_rgba(16,185,129,0.3)]">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              {React.createElement(WORKOUT_TYPES[todayWorkout.type]?.icon || Coffee, { size: 120 })}
            </div>
            
            <div className="relative z-10">
              <h3 className="text-emerald-100 font-bold uppercase tracking-wider text-sm mb-2">Today's Plan • {todayName}</h3>
              <h2 className="text-4xl font-bold mb-4">{todayWorkout.type}</h2>
              
              {todayWorkout.type === 'Rest Day' ? (
                <div>
                  <p className="text-emerald-50 text-lg mb-6">Take it easy today. Your muscles need time to recover and grow stronger.</p>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
                    <Coffee className="w-5 h-5 text-emerald-100" />
                    <span className="font-semibold text-white">Recovery Day</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-200" />
                      <span className="font-medium text-emerald-50">{todayWorkout.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-200" />
                      <span className="font-medium text-emerald-50">{todayWorkout.duration} mins planned</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={handleStartComplete}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-3 ${activeWorkout ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-ink-900 text-white hover:bg-ink-800'}`}
                    >
                      {activeWorkout ? (
                        <>
                          <Check className="w-6 h-6" /> Mark Complete
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 fill-current" /> Start Workout
                        </>
                      )}
                    </button>
                    
                    {activeWorkout && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                        <span className="text-3xl font-bold tabular-nums">{formatTime(timerSeconds)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </GlassCard>

          {/* Weekly Schedule Planner */}
          <h3 className="font-bold text-ink-900 text-xl mt-2">Weekly Schedule</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DAYS.map((day, idx) => {
              const info = schedule[day];
              const isToday = day === todayName;
              const isRest = info?.type === 'Rest Day' || !info;
              const style = info ? WORKOUT_TYPES[info.type] : WORKOUT_TYPES['Rest Day'];
              
              return (
                <GlassCard 
                  key={day} 
                  delay={0.2 + idx * 0.05} 
                  onClick={() => openModal(day)}
                  className={`p-4 transition-colors ${isToday ? 'ring-2 ring-emerald-500 ring-offset-2' : ''} ${isRest ? 'bg-gray-50/50 opacity-80' : 'bg-white/80'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-ink-900">{day.substring(0,3)}</span>
                    <div className={`p-2 rounded-xl ${style.bg}`}>
                      {React.createElement(style.icon, { className: `w-4 h-4 ${style.color}` })}
                    </div>
                  </div>
                  
                  {info ? (
                    <div>
                      <h4 className={`font-bold text-sm ${style.color}`}>{info.type}</h4>
                      {info.type !== 'Rest Day' && (
                        <p className="text-xs font-medium text-ink-500 mt-1">{info.duration} min • {info.time.split(' ')[0]}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-sm text-gray-500">Rest Day</h4>
                      <p className="text-xs font-medium text-ink-400 mt-1">Tap to schedule</p>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right Column: History & Stats */}
        <div className="col-span-1 flex flex-col gap-6">
          <GlassCard delay={0.4} className="p-6">
            <h3 className="font-bold text-ink-900 mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 text-center">
                <span className="block text-2xl font-bold text-orange-600">{weeklySummary.calories}</span>
                <span className="text-xs font-bold text-orange-500/70 uppercase">kcal Burned</span>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <span className="block text-2xl font-bold text-blue-600">{weeklySummary.minutes}</span>
                <span className="text-xs font-bold text-blue-500/70 uppercase">Minutes</span>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard delay={0.5} className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-ink-900">Workout History</h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">
              {history.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-ink-400 font-medium">No workouts completed yet.</p>
                </div>
              ) : (
                history.map(w => {
                  const style = WORKOUT_TYPES[w.type] || WORKOUT_TYPES.Cardio;
                  return (
                    <div key={w.id} className="bg-white/60 p-4 rounded-2xl border border-white/80 hover:bg-white transition-all">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}>
                          {React.createElement(style.icon, { className: `w-6 h-6 ${style.color}` })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-ink-900">{w.type}</h4>
                          <p className="text-xs font-medium text-ink-500">{w.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ink-900">{w.calories} <span className="text-[10px] text-ink-500 uppercase">kcal</span></div>
                          <div className="font-bold text-ink-900">{w.duration} <span className="text-[10px] text-ink-500 uppercase">min</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white/95 backdrop-blur-2xl border border-white p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ink-900">Schedule {editingDay}</h3>
                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-ink-400 hover:text-ink-900" /></button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-ink-500 uppercase mb-2">Workout Type</label>
                  <select 
                    value={editForm.type} 
                    onChange={e => setEditForm({...editForm, type: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500 font-medium text-ink-900"
                  >
                    {Object.keys(WORKOUT_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                {editForm.type !== 'Rest Day' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-ink-500 uppercase mb-2">Time Slot</label>
                      <select 
                        value={editForm.time} 
                        onChange={e => setEditForm({...editForm, time: e.target.value})} 
                        className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500 font-medium text-ink-900"
                      >
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-ink-500 uppercase mb-2">Duration</label>
                      <div className="flex gap-2 flex-wrap">
                        {DURATIONS.map(d => (
                          <button
                            key={d}
                            onClick={() => setEditForm({...editForm, duration: d})}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${editForm.duration === d ? 'bg-emerald-500 text-white' : 'bg-ink-900/5 text-ink-600 hover:bg-ink-900/10'}`}
                          >
                            {d} min
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-ink-500 uppercase mb-2">Notes</label>
                  <input 
                    type="text" 
                    value={editForm.notes} 
                    onChange={e => setEditForm({...editForm, notes: e.target.value})} 
                    placeholder="e.g. Focus on core, bring towel" 
                    className="w-full px-4 py-3 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
                
                <button onClick={saveSchedule} className="w-full mt-2 py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" /> Save to Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
