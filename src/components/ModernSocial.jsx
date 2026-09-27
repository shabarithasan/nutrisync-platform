import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Star, 
  Medal,
  Camera,
  Sunrise,
  Share2
} from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernSocial({ profile }) {
  const [badges, setBadges] = useState([]);
  const userName = profile?.name || 'You';

  useEffect(() => {
    let firstScanUnlocked = false;
    try {
      const meals = JSON.parse(localStorage.getItem('nts-meals') || '[]');
      if (meals.length > 0) firstScanUnlocked = true;
    } catch (e) {
      console.error(e);
    }

    let hydrationUnlocked = false;
    try {
      const today = new Date().toISOString().split('T')[0];
      const log = JSON.parse(localStorage.getItem('nts-log') || '{}');
      const todayLog = log[today] || { water: 0 };
      if (todayLog.water > 4) hydrationUnlocked = true;
    } catch (e) {
      console.error(e);
    }

    let workoutUnlocked = false;
    try {
      const workouts = JSON.parse(localStorage.getItem('nts-workout-history') || '[]');
      if (workouts.length > 0) workoutUnlocked = true;
    } catch (e) {
      console.error(e);
    }

    setBadges([
      { id: 'first-scan', name: 'First Scan', description: 'Log your first meal', icon: Camera, unlocked: firstScanUnlocked, color: 'text-blue-500', bg: 'bg-blue-100', activeBg: 'bg-blue-500' },
      { id: 'hydration', name: 'Hydration Hero', description: 'Drink >4 glasses in a day', icon: Droplet, unlocked: hydrationUnlocked, color: 'text-cyan-500', bg: 'bg-cyan-100', activeBg: 'bg-cyan-500' },
      { id: 'workout', name: 'Workout Warrior', description: 'Complete a workout', icon: Flame, unlocked: workoutUnlocked, color: 'text-orange-500', bg: 'bg-orange-100', activeBg: 'bg-orange-500' },
      { id: 'perfect-week', name: 'Perfect Week', description: 'Hit all goals for 7 days', icon: Star, unlocked: false, color: 'text-amber-500', bg: 'bg-amber-100', activeBg: 'bg-amber-500' },
      { id: 'early-bird', name: 'Early Bird', description: 'Workout before 7 AM', icon: Sunrise, unlocked: false, color: 'text-emerald-500', bg: 'bg-emerald-100', activeBg: 'bg-emerald-500' }
    ]);
  }, []);

  const leaderboard = [
    { name: 'Sarah Chen', steps: 45000, isUser: false },
    { name: userName, steps: 35000, isUser: true },
    { name: 'Marcus Johnson', steps: 32000, isUser: false },
    { name: 'Emma Davis', steps: 28000, isUser: false }
  ].sort((a, b) => b.steps - a.steps);

  const challenges = [
    { id: 1, name: 'Weekend 20k Step Dash', progress: 12500, target: 20000, participants: 42, daysLeft: 2 },
    { id: 2, name: '7 Days No Sugar', progress: 4, target: 7, participants: 18, daysLeft: 3 }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold text-ink-900 tracking-tight">Health Circle & Rewards</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Leaderboard */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <GlassCard className="p-6" delay={0.1}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-ink-900">Weekly Leaderboard</h2>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((person, index) => (
                <motion.div 
                  key={person.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${person.isUser ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white/30 border-transparent'} transition-colors`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 font-bold">
                      {index === 0 ? <Medal className="w-6 h-6 text-amber-400" /> :
                       index === 1 ? <Medal className="w-6 h-6 text-slate-400" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-amber-700" /> :
                       <span className="text-ink-400">{index + 1}</span>}
                    </div>
                    <div>
                      <div className={`font-semibold ${person.isUser ? 'text-emerald-700' : 'text-ink-900'}`}>
                        {person.name} {person.isUser && '(You)'}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-ink-900">
                    {person.steps.toLocaleString()} <span className="text-sm font-medium text-ink-500">steps</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Active Challenges */}
          <GlassCard className="p-6" delay={0.2}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-ink-900">Active Challenges</h2>
            </div>

            <div className="space-y-4">
              {challenges.map((challenge, idx) => {
                const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
                return (
                  <div key={challenge.id} className="p-4 rounded-2xl bg-white/40 border border-white/60 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-ink-900">{challenge.name}</h3>
                        <div className="flex items-center text-sm text-ink-500 mt-1 space-x-3">
                          <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {challenge.participants}</span>
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1 font-medium text-ink-700">
                        <span>{challenge.progress.toLocaleString()}</span>
                        <span>{challenge.target.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-ink-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                          className="h-full bg-orange-500 rounded-full"
                        />
                      </div>
                    </div>

                    <button className="mt-4 w-full py-2 flex items-center justify-center space-x-2 rounded-xl bg-white text-ink-700 font-semibold text-sm border border-ink-200 hover:bg-ink-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Invite Friends</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* My Badges */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-full" delay={0.3}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-ink-900">My Badges</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      badge.unlocked 
                        ? 'bg-white/60 border-white shadow-sm' 
                        : 'bg-ink-50/50 border-ink-100 grayscale-[0.8] opacity-70'
                    }`}
                  >
                    {!badge.unlocked && (
                      <div className="absolute top-3 right-3 text-ink-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    {badge.unlocked && (
                      <div className="absolute top-3 right-3 text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${
                      badge.unlocked ? badge.bg : 'bg-ink-200'
                    }`}>
                      <Icon className={`w-7 h-7 ${badge.unlocked ? badge.color : 'text-ink-400'}`} />
                    </div>

                    <h3 className="font-bold text-ink-900 mb-1">{badge.name}</h3>
                    <p className="text-sm text-ink-500 font-medium leading-snug">
                      {badge.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
