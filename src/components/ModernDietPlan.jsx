import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Droplet, 
  Wheat, 
  RefreshCw, 
  Calendar, 
  Info,
  Coffee,
  Sun,
  Moon,
  Apple,
  Check,
  ShoppingCart
} from 'lucide-react';
import { MotivationalQuote } from './MotivationalQuote';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// 40+ Predefined Meals
const MEAL_DATABASE = [
  // Breakfasts
  { id: 'b1', type: 'Breakfast', name: 'Greek Yogurt Parfait', calories: 350, protein: 22, carbs: 45, fat: 10, ingredients: ['Greek yogurt', 'Berries', 'Honey', 'Granola'], tags: ['vegetarian', 'high-protein'], time: '08:00 AM' },
  { id: 'b2', type: 'Breakfast', name: 'Oatmeal with Almonds', calories: 320, protein: 10, carbs: 52, fat: 9, ingredients: ['Oats', 'Almond milk', 'Almonds', 'Chia seeds', 'Banana'], tags: ['vegan', 'vegetarian'], time: '07:30 AM' },
  { id: 'b3', type: 'Breakfast', name: 'Scrambled Eggs & Avocado Toast', calories: 420, protein: 20, carbs: 30, fat: 25, ingredients: ['Eggs', 'Whole wheat bread', 'Avocado', 'Tomato'], tags: ['vegetarian', 'high-protein'], time: '08:00 AM' },
  { id: 'b4', type: 'Breakfast', name: 'Protein Pancakes', calories: 380, protein: 30, carbs: 40, fat: 8, ingredients: ['Protein powder', 'Oats', 'Egg whites', 'Blueberries'], tags: ['vegetarian', 'high-protein'], time: '08:30 AM' },
  { id: 'b5', type: 'Breakfast', name: 'Tofu Scramble', calories: 290, protein: 18, carbs: 15, fat: 16, ingredients: ['Firm tofu', 'Spinach', 'Onion', 'Turmeric'], tags: ['vegan', 'vegetarian', 'low-carb'], time: '07:45 AM' },
  { id: 'b6', type: 'Breakfast', name: 'Peanut Butter Banana Smoothie', calories: 400, protein: 15, carbs: 55, fat: 16, ingredients: ['Banana', 'Peanut butter', 'Milk', 'Spinach'], tags: ['vegetarian'], time: '08:15 AM' },
  { id: 'b7', type: 'Breakfast', name: 'Cottage Cheese & Peaches', calories: 250, protein: 25, carbs: 20, fat: 5, ingredients: ['Cottage cheese', 'Peaches', 'Cinnamon'], tags: ['vegetarian', 'high-protein', 'low-carb'], time: '07:30 AM' },
  { id: 'b8', type: 'Breakfast', name: 'Breakfast Burrito', calories: 450, protein: 22, carbs: 40, fat: 20, ingredients: ['Whole wheat tortilla', 'Eggs', 'Black beans', 'Cheese', 'Salsa'], tags: ['vegetarian'], time: '08:00 AM' },
  { id: 'b9', type: 'Breakfast', name: 'Quinoa Porridge', calories: 330, protein: 12, carbs: 50, fat: 8, ingredients: ['Quinoa', 'Almond milk', 'Walnuts', 'Maple syrup'], tags: ['vegan', 'vegetarian'], time: '08:00 AM' },
  { id: 'b10', type: 'Breakfast', name: 'Smoked Salmon Bagel', calories: 420, protein: 24, carbs: 45, fat: 15, ingredients: ['Whole wheat bagel', 'Smoked salmon', 'Cream cheese', 'Capers'], tags: ['high-protein'], time: '08:30 AM' },

  // Lunches
  { id: 'l1', type: 'Lunch', name: 'Grilled Chicken Salad', calories: 450, protein: 45, carbs: 20, fat: 22, ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Cherry tomatoes', 'Cucumber'], tags: ['high-protein', 'low-carb'], time: '01:00 PM' },
  { id: 'l2', type: 'Lunch', name: 'Quinoa Bowl with Roasted Veggies', calories: 420, protein: 15, carbs: 65, fat: 14, ingredients: ['Quinoa', 'Sweet potato', 'Broccoli', 'Tahini dressing'], tags: ['vegan', 'vegetarian'], time: '12:30 PM' },
  { id: 'l3', type: 'Lunch', name: 'Turkey Wrap', calories: 380, protein: 30, carbs: 35, fat: 12, ingredients: ['Turkey slices', 'Whole wheat wrap', 'Lettuce', 'Hummus'], tags: ['high-protein'], time: '01:00 PM' },
  { id: 'l4', type: 'Lunch', name: 'Lentil Soup & Side Salad', calories: 350, protein: 20, carbs: 50, fat: 8, ingredients: ['Lentils', 'Carrots', 'Celery', 'Mixed greens', 'Balsamic vinegar'], tags: ['vegan', 'vegetarian'], time: '01:30 PM' },
  { id: 'l5', type: 'Lunch', name: 'Tuna Salad Sandwich', calories: 410, protein: 28, carbs: 40, fat: 15, ingredients: ['Canned tuna', 'Greek yogurt', 'Whole wheat bread', 'Celery'], tags: ['high-protein'], time: '12:45 PM' },
  { id: 'l6', type: 'Lunch', name: 'Chickpea Salad Bowl', calories: 390, protein: 16, carbs: 55, fat: 14, ingredients: ['Chickpeas', 'Cucumber', 'Red onion', 'Feta cheese', 'Lemon juice'], tags: ['vegetarian'], time: '01:00 PM' },
  { id: 'l7', type: 'Lunch', name: 'Cauliflower Rice Stir-fry', calories: 320, protein: 25, carbs: 20, fat: 16, ingredients: ['Cauliflower rice', 'Tofu', 'Peas', 'Carrots', 'Soy sauce'], tags: ['vegan', 'vegetarian', 'low-carb'], time: '01:15 PM' },
  { id: 'l8', type: 'Lunch', name: 'Beef & Broccoli', calories: 500, protein: 35, carbs: 30, fat: 25, ingredients: ['Lean beef', 'Broccoli', 'Brown rice', 'Garlic sauce'], tags: ['high-protein'], time: '01:00 PM' },
  { id: 'l9', type: 'Lunch', name: 'Black Bean Quesadilla', calories: 460, protein: 20, carbs: 45, fat: 22, ingredients: ['Whole wheat tortilla', 'Black beans', 'Cheddar cheese', 'Bell peppers'], tags: ['vegetarian'], time: '12:30 PM' },
  { id: 'l10', type: 'Lunch', name: 'Shrimp Avocado Salad', calories: 380, protein: 30, carbs: 15, fat: 22, ingredients: ['Shrimp', 'Avocado', 'Spinach', 'Lime dressing'], tags: ['high-protein', 'low-carb'], time: '01:00 PM' },

  // Dinners
  { id: 'd1', type: 'Dinner', name: 'Baked Salmon with Asparagus', calories: 480, protein: 40, carbs: 15, fat: 28, ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Olive oil'], tags: ['high-protein', 'low-carb'], time: '07:30 PM' },
  { id: 'd2', type: 'Dinner', name: 'Sweet Potato & Black Bean Chili', calories: 400, protein: 18, carbs: 65, fat: 8, ingredients: ['Black beans', 'Sweet potato', 'Tomatoes', 'Chili powder'], tags: ['vegan', 'vegetarian'], time: '07:00 PM' },
  { id: 'd3', type: 'Dinner', name: 'Chicken Fajitas', calories: 520, protein: 42, carbs: 45, fat: 18, ingredients: ['Chicken breast', 'Bell peppers', 'Onion', 'Whole wheat tortillas'], tags: ['high-protein'], time: '08:00 PM' },
  { id: 'd4', type: 'Dinner', name: 'Zucchini Noodles with Pesto', calories: 350, protein: 15, carbs: 20, fat: 25, ingredients: ['Zucchini', 'Basil pesto', 'Cherry tomatoes', 'Pine nuts', 'Parmesan'], tags: ['vegetarian', 'low-carb'], time: '07:30 PM' },
  { id: 'd5', type: 'Dinner', name: 'Tempeh Stir-fry', calories: 420, protein: 22, carbs: 35, fat: 20, ingredients: ['Tempeh', 'Bok choy', 'Mushrooms', 'Brown rice', 'Teriyaki sauce'], tags: ['vegan', 'vegetarian'], time: '07:00 PM' },
  { id: 'd6', type: 'Dinner', name: 'Lean Steak with Green Beans', calories: 550, protein: 45, carbs: 20, fat: 28, ingredients: ['Sirloin steak', 'Green beans', 'Baby potatoes', 'Butter'], tags: ['high-protein'], time: '08:00 PM' },
  { id: 'd7', type: 'Dinner', name: 'Eggplant Parmesan', calories: 460, protein: 20, carbs: 40, fat: 24, ingredients: ['Eggplant', 'Marinara sauce', 'Mozzarella', 'Whole wheat breadcrumbs'], tags: ['vegetarian'], time: '07:30 PM' },
  { id: 'd8', type: 'Dinner', name: 'Turkey Meatballs with Pasta', calories: 500, protein: 38, carbs: 55, fat: 16, ingredients: ['Ground turkey', 'Whole wheat pasta', 'Tomato sauce', 'Spinach'], tags: ['high-protein'], time: '07:45 PM' },
  { id: 'd9', type: 'Dinner', name: 'Stuffed Bell Peppers', calories: 380, protein: 25, carbs: 35, fat: 14, ingredients: ['Bell peppers', 'Ground chicken', 'Quinoa', 'Tomato sauce'], tags: ['high-protein'], time: '07:00 PM' },
  { id: 'd10', type: 'Dinner', name: 'Vegan Buddha Bowl', calories: 430, protein: 15, carbs: 60, fat: 18, ingredients: ['Brown rice', 'Roasted chickpeas', 'Kale', 'Avocado', 'Tahini'], tags: ['vegan', 'vegetarian'], time: '07:30 PM' },

  // Snacks
  { id: 's1', type: 'Snack', name: 'Apple & Almond Butter', calories: 200, protein: 5, carbs: 25, fat: 12, ingredients: ['Apple', 'Almond butter'], tags: ['vegan', 'vegetarian'], time: '04:00 PM' },
  { id: 's2', type: 'Snack', name: 'Hard Boiled Eggs', calories: 140, protein: 12, carbs: 1, fat: 10, ingredients: ['Eggs', 'Salt', 'Pepper'], tags: ['vegetarian', 'high-protein', 'low-carb'], time: '10:30 AM' },
  { id: 's3', type: 'Snack', name: 'Handful of Mixed Nuts', calories: 180, protein: 6, carbs: 8, fat: 16, ingredients: ['Almonds', 'Walnuts', 'Cashews'], tags: ['vegan', 'vegetarian', 'low-carb'], time: '03:30 PM' },
  { id: 's4', type: 'Snack', name: 'String Cheese & Grapes', calories: 150, protein: 8, carbs: 15, fat: 6, ingredients: ['String cheese', 'Grapes'], tags: ['vegetarian'], time: '04:00 PM' },
  { id: 's5', type: 'Snack', name: 'Edamame', calories: 120, protein: 11, carbs: 10, fat: 5, ingredients: ['Edamame pods', 'Sea salt'], tags: ['vegan', 'vegetarian', 'high-protein'], time: '03:00 PM' },
  { id: 's6', type: 'Snack', name: 'Hummus & Carrots', calories: 160, protein: 4, carbs: 18, fat: 8, ingredients: ['Hummus', 'Baby carrots'], tags: ['vegan', 'vegetarian'], time: '10:30 AM' },
  { id: 's7', type: 'Snack', name: 'Cottage Cheese', calories: 110, protein: 14, carbs: 4, fat: 4, ingredients: ['Cottage cheese'], tags: ['vegetarian', 'high-protein', 'low-carb'], time: '04:30 PM' },
  { id: 's8', type: 'Snack', name: 'Rice Cake with Peanut Butter', calories: 140, protein: 4, carbs: 14, fat: 8, ingredients: ['Rice cake', 'Peanut butter'], tags: ['vegan', 'vegetarian'], time: '11:00 AM' },
  { id: 's9', type: 'Snack', name: 'Protein Shake', calories: 180, protein: 25, carbs: 5, fat: 3, ingredients: ['Protein powder', 'Water or almond milk'], tags: ['vegetarian', 'high-protein', 'low-carb'], time: '04:00 PM' },
  { id: 's10', type: 'Snack', name: 'Roasted Chickpeas', calories: 130, protein: 6, carbs: 20, fat: 3, ingredients: ['Chickpeas', 'Olive oil', 'Spices'], tags: ['vegan', 'vegetarian'], time: '03:30 PM' }
];

import { ModernGroceryList } from './ModernGroceryList';

export function ModernDietPlan() {
  const [profile, setProfile] = useState(null);
  const [dailyNeeds, setDailyNeeds] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay()); // 0 = Sunday, 1 = Monday, etc.
  const [isGroceryOpen, setIsGroceryOpen] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('nutrisync-profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        calculateNeeds(parsedProfile);
      }
      
      const storedPlan = localStorage.getItem('nts-diet-plan');
      if (storedPlan) {
        setWeeklyPlan(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    if (profile && dailyNeeds && weeklyPlan.length === 0) {
      generateWeeklyPlan();
    }
  }, [profile, dailyNeeds, weeklyPlan.length]);

  const calculateNeeds = (userProfile) => {
    // Mifflin-St Jeor equation
    let bmr = 0;
    const weight = parseFloat(userProfile.weight) || 70;
    const height = parseFloat(userProfile.height) || 170;
    const age = parseInt(userProfile.age) || 30;

    if (userProfile.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdee = bmr * (multipliers[userProfile.activity] || 1.2);

    // Goal adjustment
    let targetCalories = tdee;
    if (userProfile.goal === 'loss') targetCalories -= 500;
    if (userProfile.goal === 'gain') targetCalories += 500;
    
    // Safety bounds
    if (userProfile.gender === 'female' && targetCalories < 1200) targetCalories = 1200;
    if (userProfile.gender === 'male' && targetCalories < 1500) targetCalories = 1500;

    // Macro split: 30% P, 45% C, 25% F
    const proteinCalories = targetCalories * 0.30;
    const carbsCalories = targetCalories * 0.45;
    const fatCalories = targetCalories * 0.25;

    setDailyNeeds({
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4), // 4 cal/g
      carbs: Math.round(carbsCalories / 4), // 4 cal/g
      fat: Math.round(fatCalories / 9) // 9 cal/g
    });
  };

  const isMealSuitable = (meal, userProfile) => {
    // Check diet preferences
    if (userProfile.diet === 'vegetarian' && !meal.tags.includes('vegetarian') && !meal.tags.includes('vegan')) return false;
    if (userProfile.diet === 'vegan' && !meal.tags.includes('vegan')) return false;
    if (userProfile.diet === 'keto' && !meal.tags.includes('low-carb')) return false;

    // Check allergies/avoids
    const avoidList = [];
    if (userProfile.allergies) {
      avoidList.push(...(typeof userProfile.allergies === 'string' ? userProfile.allergies.split(',').map(s=>s.trim().toLowerCase()) : userProfile.allergies));
    }
    if (userProfile.avoid) {
      avoidList.push(...(typeof userProfile.avoid === 'string' ? userProfile.avoid.split(',').map(s=>s.trim().toLowerCase()) : userProfile.avoid));
    }

    for (const avoidItem of avoidList) {
      if (!avoidItem) continue;
      for (const ingredient of meal.ingredients) {
        if (ingredient.toLowerCase().includes(avoidItem)) {
          return false;
        }
      }
    }
    return true;
  };

  const generateWeeklyPlan = () => {
    if (!profile || !dailyNeeds) return;
    
    const newWeeklyPlan = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Filter meals
    const suitableBreakfasts = MEAL_DATABASE.filter(m => m.type === 'Breakfast' && isMealSuitable(m, profile));
    const suitableLunches = MEAL_DATABASE.filter(m => m.type === 'Lunch' && isMealSuitable(m, profile));
    const suitableDinners = MEAL_DATABASE.filter(m => m.type === 'Dinner' && isMealSuitable(m, profile));
    const suitableSnacks = MEAL_DATABASE.filter(m => m.type === 'Snack' && isMealSuitable(m, profile));

    // Fallbacks if filtering is too strict
    const getBreakfast = () => suitableBreakfasts.length > 0 ? suitableBreakfasts[Math.floor(Math.random() * suitableBreakfasts.length)] : MEAL_DATABASE.find(m => m.type === 'Breakfast');
    const getLunch = () => suitableLunches.length > 0 ? suitableLunches[Math.floor(Math.random() * suitableLunches.length)] : MEAL_DATABASE.find(m => m.type === 'Lunch');
    const getDinner = () => suitableDinners.length > 0 ? suitableDinners[Math.floor(Math.random() * suitableDinners.length)] : MEAL_DATABASE.find(m => m.type === 'Dinner');
    const getSnack = () => suitableSnacks.length > 0 ? suitableSnacks[Math.floor(Math.random() * suitableSnacks.length)] : MEAL_DATABASE.find(m => m.type === 'Snack');

    for (let i = 0; i < 7; i++) {
      const b = getBreakfast();
      const l = getLunch();
      const d = getDinner();
      const s = getSnack();
      
      const dayMeals = [
        { ...b, instanceId: `b-${i}` },
        { ...l, instanceId: `l-${i}` },
        { ...s, instanceId: `s-${i}` },
        { ...d, instanceId: `d-${i}` }
      ];
      
      const dayTotalCals = dayMeals.reduce((sum, m) => sum + m.calories, 0);
      const dayTotalProtein = dayMeals.reduce((sum, m) => sum + m.protein, 0);
      const dayTotalCarbs = dayMeals.reduce((sum, m) => sum + m.carbs, 0);
      const dayTotalFat = dayMeals.reduce((sum, m) => sum + m.fat, 0);

      newWeeklyPlan.push({
        dayName: daysOfWeek[i],
        dayIndex: i,
        meals: dayMeals,
        totals: {
          calories: dayTotalCals,
          protein: dayTotalProtein,
          carbs: dayTotalCarbs,
          fat: dayTotalFat
        }
      });
    }

    setWeeklyPlan(newWeeklyPlan);
    try {
      localStorage.setItem('nts-diet-plan', JSON.stringify(newWeeklyPlan));
    } catch (e) {
      console.error('Failed to save plan', e);
    }
  };

  const handleRegenerate = () => {
    generateWeeklyPlan();
  };

  if (!profile || !dailyNeeds || weeklyPlan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-ink-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
        <p>Loading your AI Diet Plan...</p>
        <p className="text-sm mt-2 opacity-70">Make sure your profile is set up.</p>
      </div>
    );
  }

  const currentDayPlan = weeklyPlan.find(day => day.dayIndex === currentDayIndex) || weeklyPlan[0];

  const getMealIcon = (type) => {
    switch (type) {
      case 'Breakfast': return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'Lunch': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'Dinner': return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'Snack': return <Apple className="w-5 h-5 text-emerald-500" />;
      default: return <Flame className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 text-ink-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
            AI Diet Planner
          </h1>
          <p className="text-ink-500 font-medium">Daily Target: {dailyNeeds.calories} kcal</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsGroceryOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 hover:bg-ink-800 text-white font-semibold shadow-sm transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Grocery List
          </button>
          <button 
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 hover:bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      </div>

      <MotivationalQuote />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Summary */}
        <GlassCard delay={0.1} className="p-6 col-span-1">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-500" />
            Macro Targets
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>Calories</span>
                <span className="text-emerald-600">{currentDayPlan.totals.calories} / {dailyNeeds.calories} kcal</span>
              </div>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (currentDayPlan.totals.calories / dailyNeeds.calories) * 100)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                <div className="text-xs text-ink-500 mb-1 flex items-center gap-1"><Droplet className="w-3 h-3 text-emerald-500"/> Protein</div>
                <div className="font-bold text-lg">{currentDayPlan.totals.protein}g</div>
                <div className="text-[10px] text-ink-400">Target: {dailyNeeds.protein}g</div>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                <div className="text-xs text-ink-500 mb-1 flex items-center gap-1"><Wheat className="w-3 h-3 text-amber-500"/> Carbs</div>
                <div className="font-bold text-lg">{currentDayPlan.totals.carbs}g</div>
                <div className="text-[10px] text-ink-400">Target: {dailyNeeds.carbs}g</div>
              </div>
              <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                <div className="text-xs text-ink-500 mb-1 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/> Fat</div>
                <div className="font-bold text-lg">{currentDayPlan.totals.fat}g</div>
                <div className="text-[10px] text-ink-400">Target: {dailyNeeds.fat}g</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Weekly Nav */}
        <GlassCard delay={0.2} className="p-6 col-span-1 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Weekly Schedule
          </h2>
          <div className="flex overflow-x-auto pb-2 gap-2 snap-x">
            {weeklyPlan.map((day, idx) => (
              <button
                key={day.dayName}
                onClick={() => setCurrentDayIndex(day.dayIndex)}
                className={`snap-center flex-shrink-0 min-w-[80px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                  ${currentDayIndex === day.dayIndex 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-white/40 hover:bg-white/80 text-ink-600 border border-white/60'
                  }`}
              >
                <span className="text-xs font-semibold uppercase opacity-80">{day.dayName.slice(0, 3)}</span>
                <span className="font-bold">{day.totals.calories}</span>
                <span className="text-[10px] opacity-70">kcal</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Meals for Current Day */}
      <div>
        <h2 className="text-xl font-bold mb-4 ml-2">Today's Meals ({currentDayPlan.dayName})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {currentDayPlan.meals.map((meal, index) => (
              <GlassCard key={meal.instanceId} delay={0.1 * index} className="p-0 border-l-4 border-l-emerald-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 rounded-xl">
                        {getMealIcon(meal.type)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-emerald-600 mb-0.5">{meal.type} • {meal.time}</div>
                        <h3 className="font-bold text-lg leading-tight">{meal.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xl">{meal.calories}</span>
                      <span className="text-xs text-ink-500 ml-1">kcal</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 text-sm font-medium">
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      P: {meal.protein}g
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                      C: {meal.carbs}g
                    </span>
                    <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded-md">
                      F: {meal.fat}g
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Key Ingredients</h4>
                    <ul className="grid grid-cols-2 gap-y-1 gap-x-4">
                      {meal.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm flex items-center gap-1.5 text-ink-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Nutrition Tips */}
      <GlassCard delay={0.6} className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/60 rounded-xl shrink-0">
            <Info className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Tips for Success</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-ink-700">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                Drink at least 2-3 liters of water daily.
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-700">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                You can swap meals between days as long as the total daily calories match your goal.
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-700">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                Listen to your body. If you're consistently hungry, consider adding a healthy snack.
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>
      <ModernGroceryList 
        isOpen={isGroceryOpen} 
        onClose={() => setIsGroceryOpen(false)} 
        weeklyPlan={weeklyPlan} 
      />
    </div>
  );
}
