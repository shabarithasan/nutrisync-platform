import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
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
    const m = localStorage.getItem('nts-meals');
    if(m) setMeals(JSON.parse(m));
    const wk = localStorage.getItem('nts-workouts');
    if(wk) setWorkouts(JSON.parse(wk));
    const p = localStorage.getItem('nutrisync-profile');
    if(p) setProfile(JSON.parse(p));
  }, []);

  const todayMeals = meals; // for prototype, assuming all meals are today
  const consumedCals = todayMeals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
  
  const targetCals = profile?.weight ? Math.round(((10 * profile.weight) + (6.25 * (profile.height || 175)) - (5 * (profile.age || 30)) + (profile.gender === 'Male' ? 5 : -161)) * 1.55) : 2400;

  const macroProtein = todayMeals.reduce((sum, m) => sum + (m.cal * 0.25 / 4), 0) || 124;
  const macroCarbs = todayMeals.reduce((sum, m) => sum + (m.cal * 0.50 / 4), 0) || 210;
  const macroFats = todayMeals.reduce((sum, m) => sum + (m.cal * 0.25 / 9), 0) || 62;
  
  

  const todayStr = new Date().toLocaleDateString('en-US', {weekday: 'short'});
  

  const lineData = [
    { day: '1', p: 120, c: 200, f: 60 },
    { day: '5', p: 130, c: 180, f: 65 },
    { day: '10', p: 125, c: 220, f: 70 },
    { day: '15', p: 140, c: 190, f: 55 },
    { day: '20', p: 150, c: 210, f: 60 },
    { day: '25', p: 145, c: 205, f: 62 },
    { day: '30', p: 135, c: 195, f: 58 },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">AI Insights & Analytics</h2>
          <p className="text-ink-500 font-medium mt-1">Deep dive into your nutritional data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Diet Composition */}
        <GlassCard delay={0.1} className="col-span-1 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-ink-900">Diet Composition</h3>
            <button className="text-ink-400 hover:text-ink-900"><ChevronRight className="w-5 h-5"/></button>
          </div>
          
          <div className="relative h-[200px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" stroke="none">
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
               <span className="block text-4xl font-bold text-ink-900">68%</span>
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
            <button className="text-ink-400 hover:text-ink-900"><ChevronRight className="w-5 h-5"/></button>
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
                <span className="absolute -top-5 right-0 text-[10px] font-bold text-ink-500 bg-white/50 px-2 rounded-full">1,950 kcal target</span>
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
                <strong className="text-ink-900">Sarah, your protein intake is on track!</strong><br/><br/>
                This week, focus on consuming more lean protein (like lentils or chicken) to hit your muscle recovery goal.
              </p>
              <p className="text-sm text-ink-700 leading-relaxed font-medium">
                We noticed a spike in sugar on Wed; try swapping snacks for berries.
              </p>
              <p className="text-sm text-ink-700 leading-relaxed font-medium text-emerald-600">
                Hydration is key - aim for 8 glasses daily!
              </p>
           </div>

           <button className="w-full mt-6 py-3.5 bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 rounded-xl font-bold transition-all">
             Optimize Plan
           </button>
        </GlassCard>

        {/* Macronutrient Trends (Full Width Bottom) */}
        <GlassCard delay={0.4} className="col-span-1 lg:col-span-3 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-ink-900">Macronutrient Trends (30 Days)</h3>
            <div className="flex gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-xs font-semibold text-ink-500">Protein</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"/> <span className="text-xs font-semibold text-ink-500">Carbs</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"/> <span className="text-xs font-semibold text-ink-500">Fats</span></div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#97a29b', fontWeight: 600 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#97a29b', fontWeight: 600 }} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                 <Line type="monotone" dataKey="p" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                 <Line type="monotone" dataKey="c" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
                 <Line type="monotone" dataKey="f" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
