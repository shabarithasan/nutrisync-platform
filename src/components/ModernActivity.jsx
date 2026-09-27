import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, Heart, Timer, MapPin, ChevronRight, Play } from 'lucide-react';

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
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Activity & Workouts</h2>
          <p className="text-ink-500 font-medium mt-1">Track your fitness journey and active calories.</p>
        </div>
        <button className="px-6 py-2.5 bg-ink-900 text-white rounded-xl font-bold shadow-lg shadow-ink-900/20 hover:bg-ink-800 transition-all hover:-translate-y-0.5 active:scale-95">
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
          
          <div className="flex-1 flex flex-col gap-4">
             {/* Workout 1 */}
             <div className="bg-white/60 p-4 rounded-2xl border border-white/80 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
               <div className="flex gap-4 items-center mb-3">
                 <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Activity className="w-6 h-6 text-orange-500" />
                 </div>
                 <div>
                   <h4 className="font-bold text-ink-900">Morning Run</h4>
                   <p className="text-xs font-medium text-ink-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Central Park</p>
                 </div>
               </div>
               <div className="flex justify-between items-center px-2 py-2 bg-ink-900/5 rounded-xl">
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">5.2</span><span className="text-[10px] text-ink-500 font-semibold uppercase">km</span></div>
                 <div className="w-px h-6 bg-ink-900/10"></div>
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">320</span><span className="text-[10px] text-ink-500 font-semibold uppercase">kcal</span></div>
                 <div className="w-px h-6 bg-ink-900/10"></div>
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">28</span><span className="text-[10px] text-ink-500 font-semibold uppercase">min</span></div>
               </div>
             </div>

             {/* Workout 2 */}
             <div className="bg-white/60 p-4 rounded-2xl border border-white/80 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
               <div className="flex gap-4 items-center mb-3">
                 <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <span className="text-2xl">?????</span>
                 </div>
                 <div>
                   <h4 className="font-bold text-ink-900">Vinyasa Yoga</h4>
                   <p className="text-xs font-medium text-ink-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Living Room</p>
                 </div>
               </div>
               <div className="flex justify-between items-center px-2 py-2 bg-ink-900/5 rounded-xl">
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">--</span><span className="text-[10px] text-ink-500 font-semibold uppercase">km</span></div>
                 <div className="w-px h-6 bg-ink-900/10"></div>
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">180</span><span className="text-[10px] text-ink-500 font-semibold uppercase">kcal</span></div>
                 <div className="w-px h-6 bg-ink-900/10"></div>
                 <div className="text-center"><span className="block text-sm font-bold text-ink-900">45</span><span className="text-[10px] text-ink-500 font-semibold uppercase">min</span></div>
               </div>
             </div>
             
             {/* Start new */}
             <div className="mt-auto pt-4">
                <button className="w-full py-4 border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4 fill-emerald-600" /> Start New Workout
                </button>
             </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
