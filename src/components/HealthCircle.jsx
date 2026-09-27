import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Utensils, Activity, Flame } from 'lucide-react';

export function HealthCircle({ profile, size = 160 }) {
  const [scores, setScores] = useState({
    nutrition: 0,
    hydration: 0,
    activity: 0,
    total: 0,
    streak: 0
  });

  useEffect(() => {
    const calculateScores = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Nutrition score (target: 3 meals)
        const mealsData = JSON.parse(localStorage.getItem('nts-meals') || '{}');
        const todayMeals = mealsData[today] || [];
        const nutritionScore = Math.min((todayMeals.length / 3) * 100, 100);

        // Hydration score (target based on weight or default 8 glasses)
        const logData = JSON.parse(localStorage.getItem('nts-log') || '{}');
        const todayLog = logData[today] || {};
        const weight = profile?.weight || 70; // default 70kg
        const targetWater = Math.round(weight * 0.033 * 4); // rough estimate: glasses per day
        const waterGlasses = todayLog.water || 0;
        const hydrationScore = Math.min((waterGlasses / Math.max(targetWater, 8)) * 100, 100);

        // Activity score (target: 1 workout)
        const workouts = todayLog.workouts || [];
        const activityScore = workouts.length > 0 ? 100 : 0;

        const totalScore = Math.round((nutritionScore + hydrationScore + activityScore) / 3);

        // Calculate streak
        let streak = 0;
        const sortedDates = Object.keys(logData).sort().reverse();
        let currentDate = new Date();
        
        for (const dateStr of sortedDates) {
          const dateLog = logData[dateStr];
          // Simplified streak: just checking if there was some activity logged that day
          const dayHasActivity = (dateLog.workouts && dateLog.workouts.length > 0) || 
                                 (dateLog.water && dateLog.water >= 4);
          
          if (dayHasActivity) {
            streak++;
          } else {
            // Check if it's not today before breaking
            if (dateStr !== today) {
              break;
            }
          }
        }

        setScores({
          nutrition: Math.round(nutritionScore),
          hydration: Math.round(hydrationScore),
          activity: activityScore,
          total: totalScore,
          streak
        });
      } catch (err) {
        console.error("Failed to calculate health scores", err);
      }
    };

    calculateScores();
    
    // Listen for storage changes
    window.addEventListener('storage', calculateScores);
    return () => window.removeEventListener('storage', calculateScores);
  }, [profile]);

  const getColor = (score) => {
    if (score < 40) return '#ef4444'; // red-500
    if (score < 70) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scores.total / 100) * circumference;
  const color = getColor(scores.total);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-center max-w-sm mx-auto"
    >
      <div className="relative flex justify-center items-center mb-6" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb" // gray-200
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold text-ink-900 leading-none"
            style={{ color }}
          >
            {scores.total}
          </motion.span>
          <span className="text-xs font-semibold text-ink-500 mt-1 uppercase tracking-wider">Wellness</span>
        </div>
      </div>

      {/* Mini Indicators */}
      <div className="w-full flex justify-between items-center px-2 mb-4">
        <div className="flex flex-col items-center">
          <Utensils size={18} className={scores.nutrition >= 70 ? 'text-emerald-500' : scores.nutrition >= 40 ? 'text-amber-500' : 'text-red-500'} />
          <span className="text-xs font-medium text-ink-500 mt-1">{scores.nutrition}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Droplet size={18} className={scores.hydration >= 70 ? 'text-blue-500' : scores.hydration >= 40 ? 'text-amber-500' : 'text-red-500'} />
          <span className="text-xs font-medium text-ink-500 mt-1">{scores.hydration}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Activity size={18} className={scores.activity > 0 ? 'text-emerald-500' : 'text-ink-400'} />
          <span className="text-xs font-medium text-ink-500 mt-1">{scores.activity}%</span>
        </div>
      </div>

      {/* Streak */}
      {scores.streak > 0 && (
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full mt-2">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold">{scores.streak} Day Streak!</span>
        </div>
      )}
    </motion.div>
  );
}
