import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Moon, Shield, LogOut, ChevronRight, Save, X } from 'lucide-react';

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

export function ModernSettings({ profile, onUpdateProfile, dark, setDark, onLogout }) {
  const [notif, setNotif] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: profile?.name || '', weight: profile?.weight || '', height: profile?.height || '' });
  
  // BMI calc
  const weight = Number(profile?.weight) || 70;
  const height = Number(profile?.height) || 175;
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 22.5;
  
  // Gauge calc
  const min = 15; const max = 40;
  const clamped = Math.max(min, Math.min(max, bmi));
  const pct = (clamped - min) / (max - min);
  const rotation = -90 + (pct * 180);

  const handleSave = () => {
    onUpdateProfile({ ...profile, ...form });
    setIsEditing(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center relative">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Profile & Settings</h2>
          <p className="text-ink-500 font-medium mt-1">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Profile & BMI */}
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <GlassCard delay={0.1} className="p-8 relative">
             {!isEditing ? (
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 text-3xl text-white font-bold">
                   {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                 </div>
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold text-ink-900 truncate">{profile?.name || 'User Name'}</h3>
                   <p className="text-ink-500 font-medium truncate">{profile?.email || 'user@example.com'}</p>
                   <button onClick={() => setIsEditing(true)} className="mt-3 px-4 py-1.5 bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 text-xs font-bold rounded-full transition-colors">
                     Edit Profile
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
                 <div className="flex gap-4">
                   <input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="Weight (kg)" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                   <input type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} placeholder="Height (cm)" className="w-full px-4 py-2 rounded-xl border border-ink-900/10 bg-white/50 focus:outline-none focus:border-emerald-500" />
                 </div>
                 <button onClick={handleSave} className="w-full py-2 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                   <Save className="w-4 h-4" /> Save Changes
                 </button>
               </div>
             )}
          </GlassCard>

          {/* BMI Calculator Widget matching user design */}
            <GlassCard delay={0.2} className="p-8 flex flex-col relative overflow-hidden bg-white/70">
               <div className="flex justify-between items-center w-full mb-10">
                 <h3 className="font-bold text-ink-900">BMI Calculator</h3>
                 <ChevronRight className="w-5 h-5 text-ink-900" />
               </div>
               
               <div className="relative w-full h-40 flex justify-center mb-6">
                 {/* Segmented Semi-Circle Donut */}
                 <svg viewBox="0 0 200 100" className="w-full h-full max-w-[280px] drop-shadow-md">
                   {/* We draw overlapping arcs using strokeDasharray to create perfect gaps */}
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#3b82f6" strokeWidth="28" pathLength="100" strokeDasharray="17.5 82.5" strokeDashoffset="0" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#10b981" strokeWidth="28" pathLength="100" strokeDasharray="42.5 57.5" strokeDashoffset="-20" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f59e0b" strokeWidth="28" pathLength="100" strokeDasharray="14.5 85.5" strokeDashoffset="-65" />
                   <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="28" pathLength="100" strokeDasharray="17.5 82.5" strokeDashoffset="-82.5" />

                   {/* Animated Needle */}
                   <motion.line 
                     x1="100" y1="100" x2="100" y2="35" 
                     stroke="#0f172a" strokeWidth="4" strokeLinecap="round"
                     initial={{ rotate: -90, transformOrigin: '100px 100px' }} 
                     animate={{ rotate: rotation, transformOrigin: '100px 100px' }} 
                     transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.5 }}
                   />
                   <circle cx="100" cy="100" r="6" fill="#0f172a" />
                 </svg>
                 
                 {/* Center Text */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
                   <span className="text-4xl font-extrabold text-ink-900 tracking-tight leading-none mb-1">{bmi}</span>
                   <span className="text-xs font-bold text-ink-400">
                     {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                   </span>
                 </div>
               </div>
               
               {/* Legend (like the image) */}
               <div className="w-full flex justify-between px-2 mt-4">
                 <div className="text-center flex flex-col items-center">
                   <div className="flex items-center gap-1.5 mb-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-ink-500">Under</span></div>
                   <span className="text-xs font-bold text-ink-900">&lt; 18.5</span>
                 </div>
                 <div className="text-center flex flex-col items-center">
                   <div className="flex items-center gap-1.5 mb-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-ink-500">Normal</span></div>
                   <span className="text-xs font-bold text-ink-900">18.5 - 24.9</span>
                 </div>
                 <div className="text-center flex flex-col items-center">
                   <div className="flex items-center gap-1.5 mb-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div><span className="text-[10px] font-bold text-ink-500">Over</span></div>
                   <span className="text-xs font-bold text-ink-900">25 - 29.9</span>
                 </div>
                 <div className="text-center flex flex-col items-center">
                   <div className="flex items-center gap-1.5 mb-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-[10px] font-bold text-ink-500">Obese</span></div>
                   <span className="text-xs font-bold text-ink-900">30+</span>
                 </div>
               </div>

            </GlassCard>
        </div>

        {/* Right Col: Preferences */}
        <div className="flex flex-col gap-6">
           <GlassCard delay={0.3} className="p-2">
              <div className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/40 rounded-2xl transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Bell className="w-5 h-5 text-blue-500" /></div>
                    <span className="font-bold text-ink-900">Push Notifications</span>
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
           </GlassCard>
           
           <GlassCard delay={0.4} className="p-2">
              <div className="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/40 rounded-2xl transition-colors">
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

      </div>
    </div>
  );
}
