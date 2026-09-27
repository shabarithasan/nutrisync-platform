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

  const remainingCals = targetCals - consumedCals;
  const remainingProtein = targetProtein - consumedProtein;

  // Urgent: Morning and no water
  if (hour < 10 && consumedWater === 0) {
    return "Good morning! You haven't logged any water yet. Drink a glass right now to kickstart your metabolism.";
  }

  // Urgent: Exceeding calories
  if (consumedCals > targetCals + 100) {
    return "You've hit your calorie limit for today. Focus on water and light activity for the rest of the evening.";
  }

  // Midday and no food
  if (hour >= 12 && hour < 16 && consumedCals < 200) {
    return "It's past noon and you barely logged any meals. Remember to fuel your body for sustained energy!";
  }

  // Late afternoon / evening and low protein
  if (hour >= 16 && remainingProtein > 20 && remainingCals > 150) {
    return `Hey! You're ${remainingProtein.toFixed(0)}g short on protein but have some calories left. A quick Greek yogurt or protein shake would be perfect!`;
  }

  // Night time and everything looks good
  if (hour >= 20 && remainingCals > -200 && remainingCals < 300 && remainingProtein < 15) {
    return "Incredible job today! You're perfectly on track with your macros. Rest up!";
  }

  // General fallback
  if (remainingCals > 500) {
    return `You have ${remainingCals.toFixed(0)} calories left for the day. Make sure you're eating enough to reach your goals.`;
  }

  return "Keep up the great work! You're doing amazing today.";
};

export function ProactiveCoach({ profile }) {
  const [isVisible, setIsVisible] = useState(false);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    // Wait 4-5 seconds before showing
    const timer = setTimeout(() => {
      const targets = calculateTargets(profile);
      const current = getTodayData();
      const message = generateAdvice(targets, current);
      
      setAdvice(message);
      setIsVisible(true);
    }, 4500);

    return () => clearTimeout(timer);
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
                  {advice}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
