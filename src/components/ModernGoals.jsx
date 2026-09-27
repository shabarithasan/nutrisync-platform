import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Target, Award, Calendar, Flame } from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernGoals() {
  const [water, setWater] = useState(1500);
  const target = 2500;
  const pct = Math.min((water / target) * 100, 100);
  
  const addWater = (amount) => setWater(w => Math.min(w + amount, target + 1000));

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Hydration & Goals</h2>
          <p className="text-ink-500 font-medium mt-1">Stay hydrated to unlock your full potential.</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Interactive Water Glass */}
        <div className="flex flex-col items-center justify-center relative py-10">
           {/* Glow behind glass */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none" />
           
           <div className="relative w-48 h-72">
             {/* Glass Outline */}
             <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-b-[40px] rounded-t-sm border-[4px] border-white/80 shadow-[inset_0_-20px_40px_rgba(255,255,255,0.5),0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden z-10 pointer-events-none" />
             
             {/* Liquid Fill */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-b-[36px] transition-all duration-1000 ease-out overflow-hidden" style={{ height: `${pct}%` }}>
                {/* Surface Wave Animation */}
                <motion.div 
                  animate={{ x: ['-25%', '0%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute top-0 left-0 w-[200%] h-[10px] bg-white/20 rounded-full blur-[2px]"
                />
                {/* Bubbles */}
                <motion.div animate={{ y: [0, -100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0 }} className="absolute bottom-4 left-6 w-2 h-2 bg-white/40 rounded-full" />
                <motion.div animate={{ y: [0, -150], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} className="absolute bottom-2 left-20 w-3 h-3 bg-white/30 rounded-full" />
                <motion.div animate={{ y: [0, -80], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute bottom-8 right-10 w-1.5 h-1.5 bg-white/50 rounded-full" />
             </div>
           </div>

           <div className="mt-8 text-center z-10">
             <span className="block text-5xl font-bold text-ink-900 tracking-tighter mb-1">{water} <span className="text-xl text-ink-400">ml</span></span>
             <span className="text-sm font-semibold text-blue-500">Daily Target: {target} ml</span>
           </div>

           {/* Quick Add Buttons */}
           <div className="flex gap-4 mt-8 z-10">
             <button onClick={() => addWater(250)} className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-lg hover:bg-white transition-all active:scale-95 group">
               <Droplet className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
               <span className="font-bold text-ink-900">+250ml</span>
             </button>
             <button onClick={() => addWater(500)} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 group">
               <Droplet className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
               <span className="font-bold">+500ml</span>
             </button>
           </div>
        </div>

        {/* Right: Goals & Streak */}
        <div className="flex flex-col gap-6">
           <GlassCard delay={0.2} className="p-6">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center"><Flame className="w-6 h-6 text-orange-500"/></div>
                <div>
                  <h3 className="text-xl font-bold text-ink-900">14 Day Streak!</h3>
                  <p className="text-sm font-medium text-ink-500">You've hit your hydration goal 14 days in a row.</p>
                </div>
             </div>
             <div className="flex justify-between items-center bg-white/50 border border-white rounded-xl p-2 mt-4">
               {['M','T','W','T','F','S','S'].map((d, i) => (
                 <div key={i} className={`w-8 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-cyan-500 text-white shadow-sm' : 'bg-transparent text-ink-400'}`}>
                   {d}
                 </div>
               ))}
             </div>
           </GlassCard>

           <GlassCard delay={0.3} className="p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
              <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-500" /> Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center"><CheckIcon /></div>
                    <span className="font-semibold text-ink-900 text-sm">Morning Hydration</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+50 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ink-900/5 flex items-center justify-center"><LockIcon /></div>
                    <span className="font-semibold text-ink-500 text-sm">Afternoon Refill</span>
                  </div>
                  <span className="text-xs font-bold text-ink-400">Pending</span>
                </div>
              </div>
           </GlassCard>
        </div>

      </div>
    </div>
  );
}

const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-700" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-ink-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
