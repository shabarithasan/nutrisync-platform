import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-[28px] backdrop-blur-2xl bg-white/70 dark:bg-ink-900/70 border border-white/60 dark:border-ink-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </div>
);

// Helper to calculate BMR and Target Calories
const calculateTargets = (profile) => {
  if (!profile) return { targetCals: 2000, targetProtein: 150 };

  const { weight = 70, height = 170, age = 30, gender = 'male', activity = 'moderate', goal = 'maintain' } = profile;
  
  // Mifflin-St Jeor
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const multiplier = activityMultipliers[activity] || 1.55;
  let targetCals = bmr * multiplier;

  if (goal === 'lose') targetCals -= 500;
  if (goal === 'gain') targetCals += 500;

  const targetProtein = (targetCals * 0.3) / 4; // 30% of calories from protein

  return { targetCals, targetProtein };
};

const getTodayData = () => {
  try {
    const mealsStr = localStorage.getItem('nts-meals');
    const logStr = localStorage.getItem('nts-log');
    
    let consumedCals = 0;
    let consumedProtein = 0;
    let consumedWater = 0;

    if (mealsStr) {
      const meals = JSON.parse(mealsStr);
      // Assuming today's meals are stored or it's just a general list for the day
      // We sum up the macros if they exist
      if (Array.isArray(meals)) {
        meals.forEach(meal => {
          consumedCals += Number(meal.calories || 0);
          consumedProtein += Number(meal.protein || 0);
        });
      }
    }

    if (logStr) {
      const log = JSON.parse(logStr);
      consumedWater = Number(log.water || 0);
      if (log.calories) consumedCals += Number(log.calories);
      if (log.protein) consumedProtein += Number(log.protein);
    }

    return { consumedCals, consumedProtein, consumedWater };
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return { consumedCals: 0, consumedProtein: 0, consumedWater: 0 };
  }
};

const generateAdvice = (targets, current) => {
  const hour = new Date().getHours();
  const { targetCals, targetProtein } = targets;
  const { consumedCals, consumedProtein, consumedWater } = current;

  // Check if they worked out today
  const workoutsStr = localStorage.getItem('nts-workout-history');
  let hasWorkedOut = false;
  if (workoutsStr) {
    try {
      const workouts = JSON.parse(workoutsStr);
      const todayStr = new Date().toLocaleDateString();
      hasWorkedOut = workouts.some(w => new Date(w.date).toLocaleDateString() === todayStr);
    } catch (e) {}
  }

  const tips = [];

  // Urgent Water nags
  if (consumedWater === 0) tips.push({ text: "You haven't logged ANY water today! Hydration is critical. Go drink a glass right now." });
  else if (consumedWater < 8) tips.push({ text: `You've only had ${consumedWater} glasses of water today. Grab your water bottle and take a big sip!` });

  // Urgent Workout nags
  if (!hasWorkedOut) {
    if (hour < 12) {
      tips.push({ 
        text: "Morning! You haven't done your workout yet. Start your day with a quick 15-min HIIT session!",
        actionLabel: "Watch on YouTube",
        actionUrl: "https://www.youtube.com/results?search_query=15+min+morning+hiit+workout"
      });
    } else if (hour < 18) {
      tips.push({ 
        text: "Afternoon slump? A 10-minute full body stretch will wake you right up!",
        actionLabel: "Find a stretching routine",
        actionUrl: "https://www.youtube.com/results?search_query=10+min+afternoon+stretch+energy"
      });
    } else {
      tips.push({ 
        text: "It's getting late, but it's not too late for some gentle evening yoga to unwind.",
        actionLabel: "Try Evening Yoga",
        actionUrl: "https://www.youtube.com/results?search_query=10+min+evening+yoga+wind+down"
      });
    }
  }

  // Macro nags
  const remainingCals = targetCals - consumedCals;
  const remainingProtein = targetProtein - consumedProtein;
  if (remainingProtein > 20 && remainingCals > 150) tips.push({ text: `You're ${remainingProtein.toFixed(0)}g short on protein today. How about a quick protein shake?` });
  if (remainingCals > 500) tips.push({ text: `You still have ${remainingCals.toFixed(0)} calories to eat today to reach your goals. Grab a healthy snack!` });
  
  if (tips.length > 0) {
    // Return a random tip from the applicable ones
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return { text: "Incredible job today! You hit your water, worked out, and nailed your macros. You are crushing it!" };
};

export function ProactiveCoach({ profile }) {
  const [isVisible, setIsVisible] = useState(false);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    // Show first time after 4 seconds
    const showAdvice = () => {
      const targets = calculateTargets(profile);
      const current = getTodayData();
      const message = generateAdvice(targets, current);
      
      setAdvice(message);
      setIsVisible(true);
    };

    const initialTimer = setTimeout(showAdvice, 4500);

    // Repeatedly show advice every 45 seconds to aggressively motivate user
    const intervalTimer = setInterval(showAdvice, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [profile]);

  useEffect(() => {
    if (isVisible) {
      // Auto-dismiss after 15 seconds
      const dismissTimer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="fixed bottom-24 right-6 z-50 max-w-sm w-full"
        >
          <GlassCard className="p-5 relative group">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 text-ink-400 hover:text-ink-900 dark:text-ink-500 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={16} />
            </button>
            
            <div className="flex gap-4 items-start pr-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 dark:text-white mb-1">AI Coach</h4>
                <p className="text-sm font-medium text-ink-500 dark:text-ink-400 leading-relaxed">
                  {advice?.text || advice}
                </p>
                {advice?.actionUrl && (
                  <a 
                    href={advice.actionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                  >
                    {advice.actionLabel} &rarr;
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
